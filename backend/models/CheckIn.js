const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
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
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ['gps', 'qr', 'manual'],
    default: 'manual'
  },
  verifiedLocation: {
    coordinates: [Number], // [lng, lat]
    accuracy: Number // meters
  },
  qrCode: String, // If verified via QR
  
  // Status
  status: String, // "Checked in", "Traveling to...", "Hiking..."
  note: String,
  photos: [String], // URLs
  
  // Privacy
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  
  // Engagement
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for cooldown checks
checkInSchema.index({ userId: 1, locationId: 1, createdAt: -1 });
checkInSchema.index({ userId: 1, createdAt: -1 });
checkInSchema.index({ locationId: 1, createdAt: -1 });
checkInSchema.index({ isVerified: 1 });

module.exports = mongoose.model('CheckIn', checkInSchema);

