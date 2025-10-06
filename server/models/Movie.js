const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1900, 'Year must be 1900 or later'],
    max: [2030, 'Year cannot exceed 2030']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot exceed 10']
  },
  duration: {
    type: String,
    required: function() {
      return this.category !== 'tv-show';
    },
    trim: true
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
    trim: true,
    maxlength: [100, 'Director name cannot exceed 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Movie image URL is required'],
    trim: true
  },
  genre: [{
    type: String,
    required: [true, 'At least one genre is required'],
    enum: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
      'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 
      'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
    ]
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['movie', 'trending', 'tv-show'],
    default: 'movie'
  },
  seasons: {
    type: Number,
    required: function() {
      return this.category === 'tv-show';
    },
    min: [1, 'Number of seasons must be at least 1']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' }); // Text search
movieSchema.index({ category: 1, createdAt: -1 }); // Category filtering with sorting
movieSchema.index({ genre: 1 }); // Genre filtering
movieSchema.index({ year: -1 }); // Year filtering
movieSchema.index({ rating: -1 }); // Rating sorting

// Virtual for formatted duration
movieSchema.virtual('formattedDuration').get(function() {
  if (this.category === 'tv-show') {
    return `${this.seasons} Season${this.seasons > 1 ? 's' : ''}`;
  }
  return this.duration;
});

// Static method to get movies by category
movieSchema.statics.getByCategory = function(category) {
  return this.find({ category }).sort({ createdAt: -1 });
};

// Static method to search movies
movieSchema.statics.searchMovies = function(query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
