const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    index: true
  },
  checkInId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CheckIn'
  },
  
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: String,
  photos: [String], // URLs
  tags: [String], // ['authentic', 'scenic', 'crowded', etc.]
  
  // Engagement
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  helpfulVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  // Metadata
  visitDate: Date,
  isVerified: {
    type: Boolean,
    default: false // true if linked to GPS-verified check-in
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: Date // Soft delete
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ locationId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ isVerified: 1 });

module.exports = mongoose.model('Review', reviewSchema);

