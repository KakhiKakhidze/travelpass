const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['restaurant', 'winery', 'guesthouse', 'cooking_studio'],
    index: true
  },
  category: [{
    type: String,
    enum: ['wine', 'khachapuri', 'village_food', 'traditional_dishes', 'desserts', 'tandoori_bread']
  }],
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    },
    region: {
      type: String,
      required: true,
      index: true
    }
  },
  qrCode: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photos: [{
    type: String // URLs
  }],
  description: {
    type: String,
    trim: true
  },
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    }
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
  services: [{
    type: String,
    enum: ['wifi', 'parking', 'reservations', 'outdoor_seating', 'indoor_seating', 'wine_tasting', 'tours', 'cooking_classes', 'live_music', 'pet_friendly', 'wheelchair_accessible', 'air_conditioning', 'heating', 'credit_cards', 'cash_only', 'english_menu', 'russian_menu', 'georgian_menu']
  }],
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  capacity: {
    type: Number,
    min: 0
  },
  languages: [{
    type: String,
    enum: ['georgian', 'english', 'russian', 'german', 'french', 'italian']
  }],
  specialFeatures: [{
    type: String
  }],
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    tripadvisor: { type: String }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
venueSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Venue', venueSchema);

