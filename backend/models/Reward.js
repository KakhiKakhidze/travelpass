const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['discount', 'badge', 'free_tasting', 'souvenir'],
    index: true
  },
  value: {
    type: String,
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  redeemed: {
    type: Boolean,
    default: false,
    index: true
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for user's unredeemed rewards
rewardSchema.index({ userId: 1, redeemed: 1, expiresAt: 1 });

module.exports = mongoose.model('Reward', rewardSchema);

