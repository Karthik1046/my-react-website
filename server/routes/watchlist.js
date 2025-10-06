const express = require('express');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { watched = false, limit = 50, skip = 0, sort = 'addedAt' } = req.query;
    
    const sortOptions = {};
    sortOptions[sort] = -1; // Default to descending order
    
    const watchlist = await Watchlist.getUserWatchlist(req.user._id, {
      watched: watched === 'true',
      limit: parseInt(limit),
      skip: parseInt(skip),
      sort: sortOptions
    });

    res.json({
      success: true,
      data: watchlist,
      count: watchlist.length
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch watchlist'
    });
  }
});

// @route   POST /api/watchlist/:movieId
// @desc    Add movie to watchlist
// @access  Private
router.post('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { notes, priority = 'medium' } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    // Check if already in watchlist
    const existingItem = await Watchlist.isInWatchlist(req.user._id, movieId);
    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Movie is already in your watchlist'
      });
    }

    // Add to watchlist
    const watchlistItem = await Watchlist.addToWatchlist(req.user._id, movieId, {
      notes,
      priority
    });

    res.status(201).json({
      success: true,
      data: watchlistItem,
      message: 'Movie added to watchlist successfully'
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    
    if (error.message === 'Movie is already in your watchlist') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to add movie to watchlist'
    });
  }
});

// @route   DELETE /api/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;

    const removedItem = await Watchlist.removeFromWatchlist(req.user._id, movieId);
    
    if (!removedItem) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found in your watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Movie removed from watchlist successfully',
      data: { movieId }
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove movie from watchlist'
    });
  }
});

// @route   PUT /api/watchlist/:movieId/watched
// @desc    Mark movie as watched
// @access  Private
router.put('/:movieId/watched', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating } = req.body;

    const updatedItem = await Watchlist.markAsWatched(req.user._id, movieId, rating);
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found in your watchlist'
      });
    }

    res.json({
      success: true,
      data: updatedItem,
      message: 'Movie marked as watched successfully'
    });
  } catch (error) {
    console.error('Error marking as watched:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark movie as watched'
    });
  }
});

// @route   GET /api/watchlist/check/:movieId
// @desc    Check if movie is in user's watchlist
// @access  Private
router.get('/check/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const isInWatchlist = await Watchlist.isInWatchlist(req.user._id, movieId);
    
    res.json({
      success: true,
      inWatchlist: isInWatchlist
    });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check watchlist status'
    });
  }
});

// @route   PUT /api/watchlist/:movieId
// @desc    Update watchlist item (notes, priority, etc.)
// @access  Private
router.put('/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { notes, priority, rating } = req.body;
    
    const updateData = {};
    if (notes !== undefined) updateData.notes = notes;
    if (priority !== undefined) updateData.priority = priority;
    if (rating !== undefined) {
      updateData.rating = rating;
      updateData.watched = true; // Auto-mark as watched when rating
    }

    const updatedItem = await Watchlist.findOneAndUpdate(
      { user: req.user._id, movie: movieId },
      updateData,
      { new: true, runValidators: true }
    ).populate('movie');

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found in your watchlist'
      });
    }

    res.json({
      success: true,
      data: updatedItem,
      message: 'Watchlist item updated successfully'
    });
  } catch (error) {
    console.error('Error updating watchlist item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update watchlist item'
    });
  }
});

module.exports = router;