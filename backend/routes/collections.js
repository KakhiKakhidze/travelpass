const express = require('express');
const Collection = require('../models/Collection');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const createCollectionSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500),
  coverPhoto: Joi.string().uri(),
  isPublic: Joi.boolean().default(true),
  tags: Joi.array().items(Joi.string()).max(10)
});

// Create collection
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = createCollectionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const collection = new Collection({
      userId: req.user._id,
      ...value,
      stats: {
        followerCount: 0,
        locationCount: 0
      }
    });

    await collection.save();
    await collection.populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      data: {
        collection: {
          id: collection._id,
          userId: collection.userId,
          name: collection.name,
          description: collection.description,
          coverPhoto: collection.coverPhoto,
          isPublic: collection.isPublic,
          tags: collection.tags,
          stats: collection.stats,
          createdAt: collection.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get collections (public or user's own)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, userId, tags } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (userId) {
      query.userId = userId;
    } else {
      query.isPublic = true;
    }
    if (tags) {
      query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }

    const collections = await Collection.find(query)
      .populate('userId', 'name avatar level')
      .populate('locations.locationId', 'name location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Collection.countDocuments(query);

    // Check if user is following (if authenticated)
    let followingMap = {};
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      collections.forEach(c => {
        followingMap[c._id.toString()] = c.followers.some(
          f => f.toString() === req.user._id.toString()
        );
      });
    }

    res.json({
      success: true,
      data: {
        collections: collections.map(c => ({
          id: c._id,
          userId: c.userId,
          name: c.name,
          description: c.description,
          coverPhoto: c.coverPhoto,
          isPublic: c.isPublic,
          tags: c.tags,
          stats: c.stats,
          locations: c.locations.map(l => ({
            locationId: l.locationId,
            addedAt: l.addedAt,
            note: l.note
          })),
          isFollowing: followingMap[c._id.toString()] || false,
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

// Get collection details
router.get('/:id', async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('userId', 'name avatar level')
      .populate('locations.locationId', 'name location photos');

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Collection not found'
        }
      });
    }

    // Check if user is following
    let isFollowing = false;
    if (req.user) {
      isFollowing = collection.followers.some(
        f => f.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      data: {
        collection: {
          id: collection._id,
          userId: collection.userId,
          name: collection.name,
          description: collection.description,
          coverPhoto: collection.coverPhoto,
          isPublic: collection.isPublic,
          tags: collection.tags,
          stats: collection.stats,
          locations: collection.locations,
          isFollowing,
          createdAt: collection.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Add location to collection
router.post('/:id/locations', authMiddleware, async (req, res, next) => {
  try {
    const { locationId, note } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Collection not found'
        }
      });
    }

    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only the creator can add locations'
        }
      });
    }

    // Check if location already exists
    const exists = collection.locations.some(
      l => l.locationId.toString() === locationId
    );

    if (!exists) {
      collection.locations.push({
        locationId,
        note,
        addedAt: new Date()
      });
      await collection.save();
    }

    res.json({
      success: true,
      data: {
        message: 'Location added to collection',
        locationCount: collection.locations.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// Remove location from collection
router.delete('/:id/locations/:locationId', authMiddleware, async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Collection not found'
        }
      });
    }

    if (collection.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only the creator can remove locations'
        }
      });
    }

    collection.locations = collection.locations.filter(
      l => l.locationId.toString() !== req.params.locationId
    );
    await collection.save();

    res.json({
      success: true,
      data: {
        message: 'Location removed from collection',
        locationCount: collection.locations.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// Follow collection
router.post('/:id/follow', authMiddleware, async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Collection not found'
        }
      });
    }

    if (collection.followers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Already following this collection'
        }
      });
    }

    collection.followers.push(req.user._id);
    await collection.save();

    res.json({
      success: true,
      data: {
        message: 'Collection followed',
        followerCount: collection.followers.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// Unfollow collection
router.delete('/:id/follow', authMiddleware, async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Collection not found'
        }
      });
    }

    collection.followers = collection.followers.filter(
      f => f.toString() !== req.user._id.toString()
    );
    await collection.save();

    res.json({
      success: true,
      data: {
        message: 'Collection unfollowed',
        followerCount: collection.followers.length
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

