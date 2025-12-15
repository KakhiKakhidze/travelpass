const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Discover users (for Tinder-like swiping)
router.get('/discover', authMiddleware, async (req, res, next) => {
  try {
    const { lat, lng, radius = 50000, limit = 20 } = req.query;
    const currentUser = await User.findById(req.user._id);

    // Build query to exclude:
    // - Current user
    // - Already followed users
    // - Blocked users
    const excludeIds = [
      req.user._id,
      ...currentUser.following.map(id => id.toString()),
      ...currentUser.blockedUsers.map(id => id.toString())
    ];

    let query = {
      _id: { $nin: excludeIds },
      profileVisibility: { $in: ['public', 'friends'] } // Only show public profiles
    };

    // If location provided, find users nearby
    if (lat && lng) {
      query['currentStatus.location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const users = await User.find(query)
      .select('name bio avatar currentStatus stats interests discoveryType')
      .limit(parseInt(limit))
      .lean();

    // Shuffle results for variety
    const shuffled = users.sort(() => Math.random() - 0.5);

    res.json({
      success: true,
      data: {
        users: shuffled.map(user => ({
          id: user._id,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          currentStatus: user.currentStatus,
          stats: user.stats,
          interests: user.interests,
          discoveryType: user.discoveryType
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get user profile (public view)
router.get('/:userId', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name bio avatar currentStatus stats interests discoveryType level xp badges profileVisibility');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check privacy settings
    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(user._id);
    const isMutualFollow = isFollowing && user.followers.includes(currentUser._id);

    if (user.profileVisibility === 'private' && !isMutualFollow) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'This profile is private'
        }
      });
    }

    if (user.profileVisibility === 'friends' && !isMutualFollow) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'This profile is only visible to friends'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          currentStatus: user.currentStatus,
          stats: user.stats,
          interests: user.interests,
          discoveryType: user.discoveryType,
          level: user.level,
          xp: user.xp,
          badges: user.badges
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

