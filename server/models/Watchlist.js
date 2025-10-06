const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie is required']
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  watched: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot exceed 10']
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

// Compound index to ensure user can't add same movie twice
watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

// Index for efficient queries
watchlistSchema.index({ user: 1, addedAt: -1 });
watchlistSchema.index({ user: 1, watched: 1 });

// Static methods
watchlistSchema.statics.getUserWatchlist = function(userId, options = {}) {
  const { watched = false, limit = 50, skip = 0, sort = { addedAt: -1 } } = options;
  
  return this.find({ user: userId, watched })
    .populate('movie')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

watchlistSchema.statics.isInWatchlist = async function(userId, movieId) {
  const item = await this.findOne({ user: userId, movie: movieId });
  return !!item;
};

watchlistSchema.statics.addToWatchlist = async function(userId, movieId, options = {}) {
  const { notes, priority = 'medium' } = options;
  
  try {
    const watchlistItem = new this({
      user: userId,
      movie: movieId,
      notes,
      priority
    });
    
    await watchlistItem.save();
    return await watchlistItem.populate('movie');
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Movie is already in your watchlist');
    }
    throw error;
  }
};

watchlistSchema.statics.removeFromWatchlist = async function(userId, movieId) {
  const result = await this.findOneAndDelete({ user: userId, movie: movieId });
  return result;
};

watchlistSchema.statics.markAsWatched = async function(userId, movieId, rating = null) {
  const updateData = { watched: true };
  if (rating !== null) {
    updateData.rating = rating;
  }
  
  const result = await this.findOneAndUpdate(
    { user: userId, movie: movieId },
    updateData,
    { new: true }
  ).populate('movie');
  
  return result;
};

// Instance methods
watchlistSchema.methods.toggleWatched = function() {
  this.watched = !this.watched;
  return this.save();
};

watchlistSchema.methods.updateRating = function(rating) {
  this.rating = rating;
  this.watched = true; // Automatically mark as watched when rating
  return this.save();
};

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;