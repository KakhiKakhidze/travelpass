const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['restaurant', 'landmark', 'viewpoint', 'hiking_trail', 'museum', 'park', 'winery', 'guesthouse', 'cooking_studio', 'other'],
    index: true
  },
  category: [{
    type: String // More flexible than enum - can include any tags
  }],
  
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    },
    region: String,
    country: String
  },
  
  // Optional QR for verified check-ins
  qrCode: {
    type: String,
    unique: true,
    sparse: true, // Allow null values
    index: true
  },
  
  // Content
  description: String,
  photos: [String], // URLs
  
  // Aggregated Stats
  stats: {
    totalCheckIns: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    helpfulVotes: {
      type: Number,
      default: 0
    }
  },
  
  // Tags (aggregated from reviews)
  popularTags: [String],
  
  // Contact (optional)
  contact: {
    phone: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String
    }
  },
  
  // Legacy fields for backward compatibility
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  openingHours: {
    monday: { type: String, default: 'Closed' },
    tuesday: { type: String, default: 'Closed' },
    wednesday: { type: String, default: 'Closed' },
    thursday: { type: String, default: 'Closed' },
    friday: { type: String, default: 'Closed' },
    saturday: { type: String, default: 'Closed' },
    sunday: { type: String, default: 'Closed' }
  },
  services: [String],
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
locationSchema.index({ 'location.coordinates': '2dsphere' });
locationSchema.index({ type: 1 });
locationSchema.index({ isActive: 1 });

module.exports = mongoose.model('Location', locationSchema);

