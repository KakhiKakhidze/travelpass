const express = require('express');
const CheckIn = require('../models/CheckIn');
const Location = require('../models/Location');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for check-ins (10 per hour)
const checkInLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'Too many check-ins. Please try again later.'
    }
  }
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

// Validation schema
const checkInSchema = Joi.object({
  locationId: Joi.string().required(),
  isVerified: Joi.boolean().default(false),
  verificationMethod: Joi.string().valid('gps', 'qr', 'manual').default('manual'),
  verifiedLocation: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2),
    accuracy: Joi.number()
  }).when('isVerified', {
    is: true,
    then: Joi.required()
  }),
  qrCode: Joi.string(),
  status: Joi.string(),
  note: Joi.string(),
  photos: Joi.array().items(Joi.string()),
  visibility: Joi.string().valid('public', 'friends', 'private').default('public')
});

// Create check-in
router.post('/', authMiddleware, checkInLimiter, async (req, res, next) => {
  try {
    const { error, value } = checkInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { locationId, isVerified, verificationMethod, verifiedLocation, qrCode, status, note, photos, visibility } = value;

    // Find location
    const location = await Location.findById(locationId);
    if (!location || !location.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Location not found'
        }
      });
    }

    // If verified, validate GPS proximity
    if (isVerified && verificationMethod === 'gps' && verifiedLocation) {
      const [userLng, userLat] = verifiedLocation.coordinates;
      const [locLng, locLat] = location.location.coordinates;
      const distance = calculateDistance(userLat, userLng, locLat, locLng);

      if (distance > 50) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'GPS_TOO_FAR',
            message: `You are too far from the location (${Math.round(distance)}m away). Please be within 50 meters.`
          }
        });
      }
    }

    // If verified via QR, validate QR code
    if (isVerified && verificationMethod === 'qr' && qrCode) {
      if (location.qrCode !== qrCode) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'QR_INVALID',
            message: 'Invalid QR code'
          }
        });
      }
    }

    // Check cooldown (24 hours for verified check-ins)
    if (isVerified) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existingCheckIn = await CheckIn.findOne({
        userId: req.user._id,
        locationId: location._id,
        isVerified: true,
        createdAt: { $gte: twentyFourHoursAgo }
      });

      if (existingCheckIn) {
        const cooldownEnds = new Date(existingCheckIn.createdAt.getTime() + 24 * 60 * 60 * 1000);
        const remainingMinutes = Math.ceil((cooldownEnds - Date.now()) / (60 * 1000));
        return res.status(403).json({
          success: false,
          error: {
            code: 'COOLDOWN_ACTIVE',
            message: `Cooldown active. Try again in ${remainingMinutes} minutes.`
          }
        });
      }
    }

    // Create check-in
    const checkIn = new CheckIn({
      userId: req.user._id,
      locationId: location._id,
      isVerified,
      verificationMethod,
      verifiedLocation: isVerified ? verifiedLocation : undefined,
      qrCode: verificationMethod === 'qr' ? qrCode : undefined,
      status: status || 'Checked in',
      note,
      photos: photos || [],
      visibility
    });

    await checkIn.save();

    // Update location stats
    location.stats.totalCheckIns += 1;
    await location.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalCheckIns': 1 }
    });

    res.status(201).json({
      success: true,
      data: {
        checkIn: {
          id: checkIn._id,
          locationId: checkIn.locationId,
          isVerified: checkIn.isVerified,
          status: checkIn.status,
          createdAt: checkIn.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get user's check-ins
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, locationId, userId } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: userId || req.user._id };
    if (locationId) query.locationId = locationId;

    const checkIns = await CheckIn.find(query)
      .populate('locationId', 'name location photos')
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await CheckIn.countDocuments(query);

    res.json({
      success: true,
      data: {
        checkIns: checkIns.map(ci => ({
          id: ci._id,
          location: ci.locationId,
          user: ci.userId,
          isVerified: ci.isVerified,
          status: ci.status,
          note: ci.note,
          photos: ci.photos,
          visibility: ci.visibility,
          createdAt: ci.createdAt
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

// Get check-in details
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id)
      .populate('locationId')
      .populate('userId', 'name avatar');

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Check-in not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        checkIn: {
          id: checkIn._id,
          location: checkIn.locationId,
          user: checkIn.userId,
          isVerified: checkIn.isVerified,
          verificationMethod: checkIn.verificationMethod,
          status: checkIn.status,
          note: checkIn.note,
          photos: checkIn.photos,
          visibility: checkIn.visibility,
          createdAt: checkIn.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Like check-in
router.post('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Check-in not found'
        }
      });
    }

    if (checkIn.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Already liked this check-in'
        }
      });
    }

    checkIn.likes.push(req.user._id);
    await checkIn.save();

    res.json({
      success: true,
      data: {
        likes: checkIn.likes.length,
        hasLiked: true
      }
    });
  } catch (err) {
    next(err);
  }
});

// Unlike check-in
router.delete('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Check-in not found'
        }
      });
    }

    checkIn.likes = checkIn.likes.filter(
      l => l.toString() !== req.user._id.toString()
    );
    await checkIn.save();

    res.json({
      success: true,
      data: {
        likes: checkIn.likes.length,
        hasLiked: false
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete check-in
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Check-in not found'
        }
      });
    }

    if (checkIn.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only delete your own check-ins'
        }
      });
    }

    await checkIn.deleteOne();

    // Update location stats
    await Location.findByIdAndUpdate(checkIn.locationId, {
      $inc: { 'stats.totalCheckIns': -1 }
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalCheckIns': -1 }
    });

    res.json({
      success: true,
      data: {
        message: 'Check-in deleted'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

