const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  coverPhoto: String, // URL
  locations: [{
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    note: String // User's note about this location
  }],
  isPublic: {
    type: Boolean,
    default: true,
    index: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  stats: {
    followerCount: {
      type: Number,
      default: 0
    },
    locationCount: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
collectionSchema.index({ userId: 1, createdAt: -1 });
collectionSchema.index({ isPublic: 1, createdAt: -1 });
collectionSchema.index({ tags: 1 });

// Update stats before save
collectionSchema.pre('save', function(next) {
  this.stats.locationCount = this.locations.length;
  this.stats.followerCount = this.followers.length;
  next();
});

module.exports = mongoose.model('Collection', collectionSchema);

