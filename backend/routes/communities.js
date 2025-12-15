const express = require('express');
const Community = require('../models/Community');
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const createCommunitySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000),
  type: Joi.string().valid('city', 'interest', 'custom').required(),
  category: Joi.string().required(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2),
    name: Joi.string()
  }),
  isPublic: Joi.boolean().default(true),
  joinApproval: Joi.boolean().default(false)
});

// List communities
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, category, lat, lng, radius = 50000 } = req.query;
    const skip = (page - 1) * limit;

    const query = { isPublic: true };
    if (type) query.type = type;
    if (category) query.category = category;

    // Location-based search
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const communities = await Community.find(query)
      .populate('creatorId', 'name avatar')
      .sort({ 'stats.memberCount': -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Community.countDocuments(query);

    res.json({
      success: true,
      data: {
        communities: communities.map(c => ({
          id: c._id,
          name: c.name,
          description: c.description,
          avatar: c.avatar,
          coverPhoto: c.coverPhoto,
          type: c.type,
          category: c.category,
          location: c.location,
          stats: c.stats,
          isPublic: c.isPublic,
          creator: c.creatorId,
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

// Get community details
router.get('/:id', async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creatorId', 'name avatar')
      .populate('members', 'name avatar bio stats currentStatus level')
      .populate('moderators', 'name avatar')
      .populate('admins', 'name avatar');

    if (!community) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Community not found'
        }
      });
    }

    // Check if user is member (if authenticated)
    let isMember = false;
    let isCreator = false;
    if (req.user) {
      isMember = community.members.some(m => m._id.toString() === req.user._id.toString());
      isCreator = community.creatorId._id.toString() === req.user._id.toString();
    }

    // Add member status to each member
    const membersWithStatus = community.members.map(member => {
      const memberId = member._id.toString();
      let role = 'Member';
      if (community.admins.some(a => a._id.toString() === memberId)) {
        role = 'Admin';
      } else if (community.moderators.some(m => m._id.toString() === memberId)) {
        role = 'Moderator';
      }
      return {
        ...member.toObject(),
        role,
        level: member.level || 1
      };
    });

    res.json({
      success: true,
      data: {
        community: {
          id: community._id,
          name: community.name,
          description: community.description,
          avatar: community.avatar,
          coverPhoto: community.coverPhoto,
          type: community.type,
          category: community.category,
          location: community.location,
          stats: community.stats,
          isPublic: community.isPublic,
          joinApproval: community.joinApproval,
          creator: community.creatorId,
          moderators: community.moderators,
          admins: community.admins,
          members: membersWithStatus,
          rules: community.rules,
          isMember,
          isCreator,
          createdAt: community.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Create community
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = createCommunitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { name, description, type, category, location, isPublic, joinApproval } = value;

    // Check if community with same name exists
    const existing = await Community.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Community with this name already exists'
        }
      });
    }

    const community = new Community({
      name,
      description,
      type,
      category,
      location,
      isPublic,
      joinApproval,
      creatorId: req.user._id,
      members: [req.user._id], // Creator is automatically a member
      admins: [req.user._id], // Creator is automatically an admin
      stats: {
        memberCount: 1,
        postCount: 0
      }
    });

    await community.save();

    res.status(201).json({
      success: true,
      data: {
        community: {
          id: community._id,
          name: community.name,
          description: community.description,
          type: community.type,
          category: community.category,
          stats: community.stats,
          isMember: true
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Join community
router.post('/:id/join', authMiddleware, async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Community not found'
        }
      });
    }

    if (community.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Already a member of this community'
        }
      });
    }

    if (community.joinApproval) {
      // In future: create join request instead
      return res.status(400).json({
        success: false,
        error: {
          code: 'APPROVAL_REQUIRED',
          message: 'This community requires approval to join'
        }
      });
    }

    community.members.push(req.user._id);
    community.stats.memberCount += 1;
    await community.save();

    res.json({
      success: true,
      data: {
        message: 'Joined community successfully',
        isMember: true
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete community (creator only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Community not found'
        }
      });
    }

    // Check if user is the creator
    if (community.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only the creator can delete this community'
        }
      });
    }

    // Delete the community
    await Community.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {
        message: 'Community deleted successfully'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Leave community
router.delete('/:id/leave', authMiddleware, async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Community not found'
        }
      });
    }

    if (!community.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NOT_MEMBER',
          message: 'Not a member of this community'
        }
      });
    }

    // Remove from members, moderators, admins
    community.members = community.members.filter(id => id.toString() !== req.user._id.toString());
    community.moderators = community.moderators.filter(id => id.toString() !== req.user._id.toString());
    community.admins = community.admins.filter(id => id.toString() !== req.user._id.toString());
    community.stats.memberCount = Math.max(0, community.stats.memberCount - 1);
    await community.save();

    res.json({
      success: true,
      data: {
        message: 'Left community successfully'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get community members
router.get('/:id/members', async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const community = await Community.findById(req.params.id)
      .populate({
        path: 'members',
        select: 'name avatar bio stats currentStatus level',
        options: { limit: parseInt(limit), skip }
      })
      .populate('moderators', '_id')
      .populate('admins', '_id');

    if (!community) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Community not found'
        }
      });
    }

    const adminIds = community.admins.map(a => a._id.toString());
    const moderatorIds = community.moderators.map(m => m._id.toString());

    res.json({
      success: true,
      data: {
        members: community.members.map(m => {
          const memberId = m._id.toString();
          let role = 'Member';
          if (adminIds.includes(memberId)) {
            role = 'Admin';
          } else if (moderatorIds.includes(memberId)) {
            role = 'Moderator';
          }
          return {
            id: m._id,
            name: m.name,
            avatar: m.avatar,
            bio: m.bio,
            stats: m.stats,
            currentStatus: m.currentStatus,
            level: m.level || 1,
            role
          };
        }),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: community.members.length,
          pages: Math.ceil(community.members.length / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get community posts
router.get('/:id/posts', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ communityId: req.params.id, deletedAt: null })
      .populate('userId', 'name avatar')
      .populate('locationTag.locationId', 'name location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Post.countDocuments({ communityId: req.params.id, deletedAt: null });

    res.json({
      success: true,
      data: {
        posts: posts.map(p => ({
          id: p._id,
          user: p.userId,
          content: p.content,
          photos: p.photos,
          locationTag: p.locationTag,
          tags: p.tags,
          likes: p.likes.length,
          comments: p.comments.length,
          createdAt: p.createdAt
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

module.exports = router;

