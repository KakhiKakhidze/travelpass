const express = require('express');
const Reward = require('../models/Reward');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user's rewards
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { redeemed } = req.query;
    const query = { userId: req.user._id };

    if (redeemed !== undefined) {
      query.redeemed = redeemed === 'true';
    }

    // Filter out expired rewards
    query.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ];

    const rewards = await Reward.find(query)
      .populate('challengeId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        rewards: rewards.map(reward => ({
          id: reward._id,
          type: reward.type,
          value: reward.value,
          challenge: reward.challengeId ? {
            id: reward.challengeId._id,
            name: reward.challengeId.name
          } : null,
          redeemed: reward.redeemed,
          expiresAt: reward.expiresAt,
          createdAt: reward.createdAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Redeem reward
router.post('/:id/redeem', authMiddleware, async (req, res, next) => {
  try {
    const reward = await Reward.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reward) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Reward not found'
        }
      });
    }

    if (reward.redeemed) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_REDEEMED',
          message: 'This reward has already been redeemed'
        }
      });
    }

    if (reward.expiresAt && reward.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'REWARD_EXPIRED',
          message: 'This reward has expired'
        }
      });
    }

    reward.redeemed = true;
    await reward.save();

    res.json({
      success: true,
      data: {
        reward: {
          id: reward._id,
          type: reward.type,
          value: reward.value,
          redeemed: reward.redeemed
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

