const mongoose = require('mongoose');

const stampSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true,
    index: true
  },
  dishName: {
    type: String,
    trim: true
  },
  dishDescription: {
    type: String,
    trim: true
  },
  photo: {
    type: String // URL
  },
  scannedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  // Taste Memory™ Feedback
  tasteFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    flavorNotes: [String],
    wouldOrderAgain: Boolean
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate scans within 24 hours
stampSchema.index({ userId: 1, venueId: 1, scannedAt: 1 });

// Index for user's stamp collection queries
stampSchema.index({ userId: 1, scannedAt: -1 });

module.exports = mongoose.model('Stamp', stampSchema);

