const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const createCommentSchema = Joi.object({
  targetType: Joi.string().valid('review', 'checkin', 'post', 'story').required(),
  targetId: Joi.string().required(),
  text: Joi.string().min(1).max(1000).required(),
  parentCommentId: Joi.string().allow(null)
});

// Create comment
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const comment = new Comment({
      userId: req.user._id,
      ...value
    });

    await comment.save();
    await comment.populate('userId', 'name avatar level');

    res.status(201).json({
      success: true,
      data: {
        comment: {
          id: comment._id,
          userId: comment.userId,
          text: comment.text,
          likes: comment.likes.length,
          replies: comment.replies.length,
          createdAt: comment.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get comments for a target
router.get('/', async (req, res, next) => {
  try {
    const { targetType, targetId, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!targetType || !targetId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'targetType and targetId are required'
        }
      });
    }

    const comments = await Comment.find({
      targetType,
      targetId,
      deletedAt: null,
      parentCommentId: null // Only top-level comments
    })
      .populate('userId', 'name avatar level')
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'name avatar level'
        },
        options: { limit: 3 }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Comment.countDocuments({
      targetType,
      targetId,
      deletedAt: null,
      parentCommentId: null
    });

    // Check if user has liked (if authenticated)
    let likedMap = {};
    if (req.user) {
      comments.forEach(c => {
        likedMap[c._id.toString()] = c.likes.some(
          l => l.toString() === req.user._id.toString()
        );
      });
    }

    res.json({
      success: true,
      data: {
        comments: comments.map(c => ({
          id: c._id,
          userId: c.userId,
          text: c.text,
          likes: c.likes.length,
          replies: c.replies.map(r => ({
            id: r._id,
            userId: r.userId,
            text: r.text,
            likes: r.likes.length,
            createdAt: r.createdAt
          })),
          hasLiked: likedMap[c._id.toString()] || false,
          createdAt: c.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Like comment
router.post('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Comment not found'
        }
      });
    }

    if (comment.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Already liked this comment'
        }
      });
    }

    comment.likes.push(req.user._id);
    await comment.save();

    res.json({
      success: true,
      data: {
        likes: comment.likes.length,
        hasLiked: true
      }
    });
  } catch (err) {
    next(err);
  }
});

// Unlike comment
router.delete('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Comment not found'
        }
      });
    }

    comment.likes = comment.likes.filter(
      l => l.toString() !== req.user._id.toString()
    );
    await comment.save();

    res.json({
      success: true,
      data: {
        likes: comment.likes.length,
        hasLiked: false
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete comment
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Comment not found'
        }
      });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this comment'
        }
      });
    }

    comment.deletedAt = new Date();
    await comment.save();

    res.json({
      success: true,
      data: {
        message: 'Comment deleted'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

