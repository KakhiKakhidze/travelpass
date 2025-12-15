const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  photos: [String], // URLs
  
  // Optional location sharing
  sharedLocation: {
    coordinates: [Number], // [lng, lat]
    name: String
  },
  
  // Optional trip invite
  tripInvite: {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    date: Date,
    note: String
  },
  
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  readAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);

