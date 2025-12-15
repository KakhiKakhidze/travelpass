const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  photos: [{
    type: String, // URL
    required: true
  }],
  caption: {
    type: String,
    maxlength: 500
  },
  locationTag: {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    name: String,
    coordinates: [Number] // [lng, lat]
  },
  tags: [String],
  views: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'love', 'wow', 'helpful'],
      default: 'like'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: function() {
      // 24 hours from creation
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    },
    index: { expireAfterSeconds: 0 }
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  highlightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoryHighlight'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
storySchema.index({ userId: 1, createdAt: -1 });
storySchema.index({ expiresAt: 1 });
storySchema.index({ 'locationTag.coordinates': '2dsphere' });

module.exports = mongoose.model('Story', storySchema);

