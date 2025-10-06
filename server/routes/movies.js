const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware for movie data
const validateMovie = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description must be 1-2000 characters'),
  body('year').isInt({ min: 1900, max: 2030 }).withMessage('Year must be between 1900-2030'),
  body('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0-10'),
  body('director').trim().isLength({ min: 1, max: 100 }).withMessage('Director name must be 1-100 characters'),
  body('image').trim().isURL().withMessage('Image must be a valid URL'),
  body('genre').isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('category').isIn(['movie', 'trending', 'tv-show']).withMessage('Invalid category'),
  body('duration').optional().trim(),
  body('seasons').optional().isInt({ min: 1 }).withMessage('Seasons must be at least 1')
];

// @route   GET /api/movies
// @desc    Get all movies with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, genre, year, page = 1, limit = 20 } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let movies;
    let total;
    
    if (search) {
      // Text search
      movies = await Movie.find(
        { 
          ...query,
          $text: { $search: search }
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
      
      total = await Movie.countDocuments({
        ...query,
        $text: { $search: search }
      });
    } else {
      // Regular query with sorting
      movies = await Movie.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
      
      total = await Movie.countDocuments(query);
    }
    
    res.json({
      success: true,
      data: movies,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movies'
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movie'
    });
  }
});

// @route   POST /api/movies
// @desc    Create new movie
// @access  Private (Admin only)
router.post('/', auth, auth.requireAdmin, validateMovie, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
        details: errors.array()
      });
    }

    const {
      title,
      description,
      year,
      rating,
      duration,
      director,
      image,
      genre,
      category,
      seasons
    } = req.body;

    // Validate category-specific requirements
    if (category === 'tv-show') {
      if (!seasons || seasons < 1) {
        return res.status(400).json({
          success: false,
          error: 'TV shows must have at least 1 season'
        });
      }
    } else {
      if (!duration) {
        return res.status(400).json({
          success: false,
          error: 'Duration is required for movies'
        });
      }
    }

    // Check if movie with same title and year already exists
    const existingMovie = await Movie.findOne({ title, year });
    if (existingMovie) {
      return res.status(400).json({
        success: false,
        error: 'A movie with this title and year already exists'
      });
    }

    const movieData = {
      title,
      description,
      year: parseInt(year),
      rating: parseFloat(rating),
      director,
      image,
      genre,
      category,
      createdBy: req.user._id
    };

    if (category === 'tv-show') {
      movieData.seasons = parseInt(seasons);
    } else {
      movieData.duration = duration;
    }

    const movie = new Movie(movieData);
    await movie.save();

    // Populate the created movie before sending response
    await movie.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: movie,
      message: 'Movie created successfully'
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors[0]
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create movie'
    });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie
// @access  Private (Admin only)
router.put('/:id', auth, auth.requireAdmin, validateMovie, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
        details: errors.array()
      });
    }

    const {
      title,
      description,
      year,
      rating,
      duration,
      director,
      image,
      genre,
      category,
      seasons
    } = req.body;

    // Find the movie
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Validate category-specific requirements
    if (category === 'tv-show') {
      if (!seasons || seasons < 1) {
        return res.status(400).json({
          success: false,
          error: 'TV shows must have at least 1 season'
        });
      }
    } else {
      if (!duration) {
        return res.status(400).json({
          success: false,
          error: 'Duration is required for movies'
        });
      }
    }

    // Check if another movie with same title and year exists (excluding current movie)
    const existingMovie = await Movie.findOne({ 
      title, 
      year,
      _id: { $ne: movie._id }
    });
    if (existingMovie) {
      return res.status(400).json({
        success: false,
        error: 'A movie with this title and year already exists'
      });
    }

    // Update movie data
    const updateData = {
      title,
      description,
      year: parseInt(year),
      rating: parseFloat(rating),
      director,
      image,
      genre,
      category,
      updatedBy: req.user._id
    };

    if (category === 'tv-show') {
      updateData.seasons = parseInt(seasons);
      updateData.duration = undefined; // Remove duration for TV shows
    } else {
      updateData.duration = duration;
      updateData.seasons = undefined; // Remove seasons for movies
    }

    // Update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    )
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: updatedMovie,
      message: 'Movie updated successfully'
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors[0]
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update movie'
    });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie
// @access  Private (Admin only)
router.delete('/:id', auth, auth.requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Movie deleted successfully',
      data: { id: req.params.id, title: movie.title }
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete movie'
    });
  }
});

// @route   GET /api/movies/category/:category
// @desc    Get movies by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    if (!['movie', 'trending', 'tv-show'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const movies = await Movie.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    const total = await Movie.countDocuments({ category });

    res.json({
      success: true,
      data: movies,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch movies'
    });
  }
});

module.exports = router;