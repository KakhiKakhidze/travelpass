const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  avatar: String, // URL
  coverPhoto: String, // URL
  
  type: {
    type: String,
    enum: ['city', 'interest', 'custom'],
    required: true,
    index: true
  },
  category: String, // 'Tbilisi', 'Hiking', 'Food', etc.
  location: {
    coordinates: [Number], // [lng, lat] for city-based
    name: String
  },
  
  // Membership
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Settings
  isPublic: {
    type: Boolean,
    default: true,
    index: true
  },
  joinApproval: {
    type: Boolean,
    default: false // require approval to join
  },
  
  // Stats
  stats: {
    memberCount: {
      type: Number,
      default: 0
    },
    postCount: {
      type: Number,
      default: 0
    }
  },
  
  rules: [String], // community guidelines
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
communitySchema.index({ type: 1 });
communitySchema.index({ isPublic: 1 });
if (communitySchema.path('location.coordinates')) {
  communitySchema.index({ 'location.coordinates': '2dsphere' });
}

module.exports = mongoose.model('Community', communitySchema);

