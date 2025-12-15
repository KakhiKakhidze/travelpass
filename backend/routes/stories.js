const express = require('express');
const Story = require('../models/Story');
const StoryHighlight = require('../models/StoryHighlight');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const createStorySchema = Joi.object({
  photos: Joi.array().items(Joi.string().uri()).min(1).max(10).required(),
  caption: Joi.string().max(500),
  locationTag: Joi.object({
    locationId: Joi.string(),
    name: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2)
  }),
  tags: Joi.array().items(Joi.string()).max(10)
});

// Create story
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = createStorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const story = new Story({
      userId: req.user._id,
      ...value
    });

    await story.save();
    await story.populate('userId', 'name avatar level');

    res.status(201).json({
      success: true,
      data: {
        story: {
          id: story._id,
          userId: story.userId,
          photos: story.photos,
          caption: story.caption,
          locationTag: story.locationTag,
          tags: story.tags,
          views: story.views.length,
          reactions: story.reactions.length,
          expiresAt: story.expiresAt,
          createdAt: story.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get user's stories
router.get('/user/:userId', async (req, res, next) => {
  try {
    const stories = await Story.find({
      userId: req.params.userId,
      expiresAt: { $gt: new Date() }
    })
      .populate('userId', 'name avatar level')
      .populate('locationTag.locationId', 'name location')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        stories: stories.map(s => ({
          id: s._id,
          userId: s.userId,
          photos: s.photos,
          caption: s.caption,
          locationTag: s.locationTag,
          tags: s.tags,
          views: s.views.length,
          reactions: s.reactions.length,
          expiresAt: s.expiresAt,
          createdAt: s.createdAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get feed stories (from followed users)
router.get('/feed', authMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get user's following list
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const followingIds = user.following || [];

    const stories = await Story.find({
      userId: { $in: [...followingIds, req.user._id] }, // Include own stories
      expiresAt: { $gt: new Date() }
    })
      .populate('userId', 'name avatar level')
      .populate('locationTag.locationId', 'name location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Story.countDocuments({
      userId: { $in: [...followingIds, req.user._id] },
      expiresAt: { $gt: new Date() }
    });

    res.json({
      success: true,
      data: {
        stories: stories.map(s => ({
          id: s._id,
          userId: s.userId,
          photos: s.photos,
          caption: s.caption,
          locationTag: s.locationTag,
          tags: s.tags,
          views: s.views.length,
          reactions: s.reactions.length,
          hasReacted: s.reactions.some(r => r.userId.toString() === req.user._id.toString()),
          hasViewed: s.views.some(v => v.userId.toString() === req.user._id.toString()),
          expiresAt: s.expiresAt,
          createdAt: s.createdAt
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

// View story
router.post('/:id/view', authMiddleware, async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Story not found'
        }
      });
    }

    // Check if already viewed
    const alreadyViewed = story.views.some(
      v => v.userId.toString() === req.user._id.toString()
    );

    if (!alreadyViewed) {
      story.views.push({
        userId: req.user._id,
        viewedAt: new Date()
      });
      await story.save();
    }

    res.json({
      success: true,
      data: {
        views: story.views.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// React to story
router.post('/:id/react', authMiddleware, async (req, res, next) => {
  try {
    const { type = 'like' } = req.body;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Story not found'
        }
      });
    }

    // Remove existing reaction from this user
    story.reactions = story.reactions.filter(
      r => r.userId.toString() !== req.user._id.toString()
    );

    // Add new reaction
    story.reactions.push({
      userId: req.user._id,
      type,
      createdAt: new Date()
    });

    await story.save();

    res.json({
      success: true,
      data: {
        reactions: story.reactions.length,
        hasReacted: true,
        reactionType: type
      }
    });
  } catch (err) {
    next(err);
  }
});

// Remove reaction
router.delete('/:id/react', authMiddleware, async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Story not found'
        }
      });
    }

    story.reactions = story.reactions.filter(
      r => r.userId.toString() !== req.user._id.toString()
    );

    await story.save();

    res.json({
      success: true,
      data: {
        reactions: story.reactions.length,
        hasReacted: false
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get story highlights
router.get('/highlights/:userId', async (req, res, next) => {
  try {
    const highlights = await StoryHighlight.find({
      userId: req.params.userId
    })
      .populate('stories')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        highlights: highlights.map(h => ({
          id: h._id,
          name: h.name,
          coverPhoto: h.coverPhoto,
          storyCount: h.stories.length,
          createdAt: h.createdAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

// Add story to highlight
router.post('/highlights/:highlightId/stories/:storyId', authMiddleware, async (req, res, next) => {
  try {
    const highlight = await StoryHighlight.findById(req.params.highlightId);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Highlight not found'
        }
      });
    }

    if (highlight.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized'
        }
      });
    }

    if (!highlight.stories.includes(req.params.storyId)) {
      highlight.stories.push(req.params.storyId);
      await highlight.save();
    }

    res.json({
      success: true,
      data: {
        message: 'Story added to highlight'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

