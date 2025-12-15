const express = require('express');
const Stamp = require('../models/Stamp');
const Venue = require('../models/Venue');
const User = require('../models/User');
const Reward = require('../models/Reward');
const Challenge = require('../models/Challenge');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for QR scans (10 per hour)
const scanRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many scan attempts. Please try again later.'
    }
  }
});

// Validation schema
const scanSchema = Joi.object({
  qrCode: Joi.string().required(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required()
});

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Scan QR code
router.post('/scan', authMiddleware, scanRateLimiter, async (req, res, next) => {
  try {
    const { error, value } = scanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { qrCode, location } = value;
    const [userLng, userLat] = location.coordinates;

    // Find venue by QR code
    const venue = await Venue.findOne({ qrCode, isActive: true });
    if (!venue) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'QR_INVALID',
          message: 'Invalid QR code'
        }
      });
    }

    // Check if already scanned in last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingStamp = await Stamp.findOne({
      userId: req.user._id,
      venueId: venue._id,
      scannedAt: { $gte: twentyFourHoursAgo }
    });

    if (existingStamp) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'QR_ALREADY_SCANNED',
          message: 'You have already scanned this venue in the last 24 hours'
        }
      });
    }

    // Validate GPS location (within 50 meters)
    const [venueLng, venueLat] = venue.location.coordinates;
    const distance = calculateDistance(userLat, userLng, venueLat, venueLng);

    if (distance > 50) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'GPS_TOO_FAR',
          message: `You are too far from the venue (${Math.round(distance)}m away). Please be within 50 meters.`
        }
      });
    }

    // Create stamp
    const stamp = new Stamp({
      userId: req.user._id,
      venueId: venue._id,
      dishName: venue.name, // Can be customized later
      dishDescription: venue.description,
      location: {
        coordinates: [userLng, userLat]
      }
    });

    await stamp.save();

    // Award XP
    const xpGained = 10;
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: xpGained }
    });

    // Check challenge completion
    const challengesCompleted = [];
    const rewardsUnlocked = [];

    const activeChallenges = await Challenge.find({ isActive: true });
    const userStamps = await Stamp.find({ userId: req.user._id }).populate('venueId');

    for (const challenge of activeChallenges) {
      let isCompleted = false;

      // Handle combo challenges differently
      if (challenge.type === 'combo') {
        // Check if all required challenges are completed
        const requiredChallengeIds = challenge.requirements.requiredChallenges || [];
        if (requiredChallengeIds.length > 0) {
          const completedRewards = await Reward.find({
            userId: req.user._id,
            challengeId: { $in: requiredChallengeIds }
          });

          isCompleted = completedRewards.length >= requiredChallengeIds.length;
        }
      } else {
        // Check if challenge requirements are met for regular challenges
        const matchingStamps = userStamps.filter(stamp => {
          const venue = stamp.venueId;
          if (!venue) return false;

          // Check if challenge requires specific venues
          if (challenge.requirements.requiredVenues && challenge.requirements.requiredVenues.length > 0) {
            return challenge.requirements.requiredVenues.some(venueId => 
              venueId.toString() === venue._id.toString()
            );
          }

          // Check venue type
          if (challenge.requirements.venueTypes.length > 0 &&
              !challenge.requirements.venueTypes.includes(venue.type)) {
            return false;
          }

          // Check category
          if (challenge.requirements.categories.length > 0) {
            const hasMatchingCategory = challenge.requirements.categories.some(cat =>
              venue.category.includes(cat)
            );
            if (!hasMatchingCategory) return false;
          }

          // Check region
          if (challenge.requirements.regions.length > 0 &&
              !challenge.requirements.regions.includes(venue.location.region)) {
            return false;
          }

          return true;
        });

        isCompleted = matchingStamps.length >= challenge.requirements.minStamps;
      }

      if (isCompleted) {
        // Check if user already has reward for this challenge
        const existingReward = await Reward.findOne({
          userId: req.user._id,
          challengeId: challenge._id
        });

        if (!existingReward) {
          // Create reward
          const reward = new Reward({
            userId: req.user._id,
            type: challenge.reward.type,
            value: challenge.reward.value,
            challengeId: challenge._id
          });
          await reward.save();

          // Add badge if reward is a badge
          if (challenge.reward.type === 'badge') {
            await User.findByIdAndUpdate(req.user._id, {
              $addToSet: { badges: challenge.reward.value },
              $inc: { xp: challenge.xpReward }
            });
          } else {
            await User.findByIdAndUpdate(req.user._id, {
              $inc: { xp: challenge.xpReward }
            });
          }

          challengesCompleted.push(challenge.name);
          rewardsUnlocked.push({
            type: challenge.reward.type,
            value: challenge.reward.value
          });
        }
      }
    }

    // Populate venue details for response
    await stamp.populate('venueId', 'name type category location photos description');

    res.json({
      success: true,
      data: {
        stamp: {
          id: stamp._id,
          venue: {
            id: stamp.venueId._id,
            name: stamp.venueId.name,
            type: stamp.venueId.type
          },
          dishName: stamp.dishName,
          dishDescription: stamp.dishDescription,
          scannedAt: stamp.scannedAt
        },
        challengesCompleted,
        rewardsUnlocked,
        xpGained
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get user's stamps
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [stamps, total] = await Promise.all([
      Stamp.find({ userId: req.user._id })
        .populate('venueId', 'name type category location photos')
        .sort({ scannedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Stamp.countDocuments({ userId: req.user._id })
    ]);

    res.json({
      success: true,
      data: {
        stamps: stamps.map(stamp => ({
          id: stamp._id,
          venue: {
            id: stamp.venueId._id,
            name: stamp.venueId.name,
            type: stamp.venueId.type,
            category: stamp.venueId.category,
            location: stamp.venueId.location
          },
          dishName: stamp.dishName,
          dishDescription: stamp.dishDescription,
          photo: stamp.photo,
          scannedAt: stamp.scannedAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get stamp details
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const stamp = await Stamp.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('venueId')
      .lean();

    if (!stamp) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Stamp not found'
        }
      });
    }

    res.json({
      success: true,
      data: { stamp }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

