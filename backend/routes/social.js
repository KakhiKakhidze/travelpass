const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Follow = require('../models/Follow');

const router = express.Router();

// Follow user
router.post('/follow/:userId', authMiddleware, async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Cannot follow yourself'
        }
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check if already following
    if (req.user.following.includes(targetUserId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Already following this user'
        }
      });
    }

    // Add to following/followers
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: targetUserId }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: req.user._id }
    });

    res.json({
      success: true,
      data: {
        message: 'User followed'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Unfollow user
router.delete('/follow/:userId', authMiddleware, async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: targetUserId }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: req.user._id }
    });

    res.json({
      success: true,
      data: {
        message: 'User unfollowed'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get followers
router.get('/followers/:userId', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.userId)
      .populate({
        path: 'followers',
        select: 'name avatar bio stats',
        options: { limit: parseInt(limit), skip }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        followers: user.followers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: user.followers.length,
          pages: Math.ceil(user.followers.length / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get following
router.get('/following/:userId', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.userId)
      .populate({
        path: 'following',
        select: 'name avatar bio stats',
        options: { limit: parseInt(limit), skip }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        following: user.following,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: user.following.length,
          pages: Math.ceil(user.following.length / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Block user
router.post('/block/:userId', authMiddleware, async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Cannot block yourself'
        }
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { blockedUsers: targetUserId },
      $pull: { following: targetUserId, followers: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { following: req.user._id, followers: req.user._id }
    });

    res.json({
      success: true,
      data: {
        message: 'User blocked'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Unblock user
router.delete('/block/:userId', authMiddleware, async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { blockedUsers: targetUserId }
    });

    res.json({
      success: true,
      data: {
        message: 'User unblocked'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get activity feed
router.get('/feed', authMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const user = await User.findById(req.user._id);
    const followingIds = user.following.map(id => id.toString());

    // Get check-ins, reviews, achievements from followed users
    const CheckIn = require('../models/CheckIn');
    const Review = require('../models/Review');

    let feedItems = [];

    if (type === 'all' || type === 'checkins') {
      const checkIns = await CheckIn.find({
        userId: { $in: followingIds },
        visibility: { $in: ['public', 'friends'] }
      })
        .populate('locationId', 'name location photos')
        .populate('userId', 'name avatar level')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      feedItems.push(...checkIns.map(ci => ({
        type: 'checkin',
        id: ci._id,
        data: {
          ...ci.toObject(),
          likes: ci.likes?.length || 0,
          liked: ci.likes?.some(l => l.toString() === req.user._id.toString()) || false,
          comments: ci.comments?.length || 0
        },
        createdAt: ci.createdAt
      })));
    }

    if (type === 'all' || type === 'reviews') {
      const reviews = await Review.find({
        userId: { $in: followingIds },
        deletedAt: null
      })
        .populate('locationId', 'name location photos')
        .populate('userId', 'name avatar level')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      feedItems.push(...reviews.map(r => ({
        type: 'review',
        id: r._id,
        data: {
          ...r.toObject(),
          likes: r.likes?.length || 0,
          liked: r.likes?.some(l => l.toString() === req.user._id.toString()) || false,
          comments: r.comments?.length || 0
        },
        createdAt: r.createdAt
      })));
    }

    // Sort by date and limit
    feedItems.sort((a, b) => b.createdAt - a.createdAt);
    feedItems = feedItems.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        feed: feedItems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: feedItems.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

