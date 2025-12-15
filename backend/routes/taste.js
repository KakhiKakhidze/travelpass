const express = require('express');
const User = require('../models/User');
const Stamp = require('../models/Stamp');
const Venue = require('../models/Venue');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const feedbackSchema = Joi.object({
  stampId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  flavorNotes: Joi.array().items(Joi.string()).min(1).required(),
  wouldOrderAgain: Joi.boolean().required()
});

const setupSchema = Joi.object({
  flavorPreferences: Joi.array().items(Joi.string()).min(1).required(),
  dietaryRestrictions: Joi.array().items(Joi.string()).optional(),
  dietaryPreferences: Joi.array().items(Joi.string()).optional(),
  allergies: Joi.array().items(Joi.string()).optional()
});

// Get user's taste profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Build taste profile from user data
    const flavorPreferences = user.tasteProfile?.flavorPreferences || {};

    const tasteProfile = {
      flavorPreferences,
      favoriteDishes: user.tasteProfile?.favoriteDishes || [],
      dietaryProfile: {
        restrictions: user.tasteProfile?.dietaryRestrictions || [],
        preferences: user.tasteProfile?.dietaryPreferences || [],
        allergies: user.tasteProfile?.allergies || []
      }
    };

    res.json({
      success: true,
      data: tasteProfile
    });
  } catch (error) {
    next(error);
  }
});

// Set up taste profile
router.post('/profile/setup', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = setupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { flavorPreferences, dietaryRestrictions, dietaryPreferences, allergies } = value;

    // Get user and update taste profile
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Initialize tasteProfile if it doesn't exist
    if (!user.tasteProfile) {
      user.tasteProfile = {};
    }

    // Convert flavor preferences array to object with scores
    const flavorPreferencesObj = {};
    flavorPreferences.forEach(flavor => {
      flavorPreferencesObj[flavor] = 0.5; // Initial score
    });

    // Update user's taste profile
    user.tasteProfile.flavorPreferences = flavorPreferencesObj;
    user.tasteProfile.dietaryRestrictions = dietaryRestrictions || [];
    user.tasteProfile.dietaryPreferences = dietaryPreferences || [];
    user.tasteProfile.allergies = allergies || [];
    user.tasteProfile.lastUpdated = new Date();

    await user.save();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Taste profile set up successfully',
        tasteProfile: user.tasteProfile
      }
    });
  } catch (error) {
    next(error);
  }
});

// Submit taste feedback
router.post('/feedback', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = feedbackSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { stampId, rating, flavorNotes, wouldOrderAgain } = value;

    // Find the stamp
    const stamp = await Stamp.findById(stampId);
    if (!stamp) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'STAMP_NOT_FOUND',
          message: 'Stamp not found'
        }
      });
    }

    // Verify stamp belongs to user
    if (stamp.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You can only provide feedback for your own stamps'
        }
      });
    }

    // Update stamp with taste feedback
    stamp.tasteFeedback = {
      rating,
      flavorNotes,
      wouldOrderAgain
    };
    await stamp.save();

    // Update user's taste profile
    const user = await User.findById(req.user._id);
    if (!user.tasteProfile) {
      user.tasteProfile = {};
    }
    if (!user.tasteProfile.flavorPreferences) {
      user.tasteProfile.flavorPreferences = {};
    }

    // Update flavor preferences based on feedback

    flavorNotes.forEach(flavor => {
      if (!user.tasteProfile.flavorPreferences[flavor]) {
        user.tasteProfile.flavorPreferences[flavor] = 0;
      }
      // Increase preference score based on rating (0.1 to 0.2 per feedback)
      const increment = (rating / 5) * 0.2;
      user.tasteProfile.flavorPreferences[flavor] = Math.min(
        1,
        user.tasteProfile.flavorPreferences[flavor] + increment
      );
    });

    // Update favorite dishes
    if (!user.tasteProfile.favoriteDishes) {
      user.tasteProfile.favoriteDishes = [];
    }

    if (wouldOrderAgain && rating >= 4) {
      const existingDish = user.tasteProfile.favoriteDishes.find(
        d => d.dishName === stamp.dishName
      );

      if (existingDish) {
        existingDish.orderCount = (existingDish.orderCount || 0) + 1;
        existingDish.rating = ((existingDish.rating || 0) + rating) / 2;
      } else {
        user.tasteProfile.favoriteDishes.push({
          dishName: stamp.dishName,
          venueId: stamp.venueId,
          rating,
          orderCount: 1
        });
      }
    }

    user.tasteProfile.lastUpdated = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Taste feedback saved successfully',
        tasteProfile: user.tasteProfile
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get taste history
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    const stamps = await Stamp.find({
      userId: req.user._id,
      'tasteFeedback.rating': { $exists: true }
    })
      .populate('venueId', 'name')
      .sort({ scannedAt: -1 })
      .limit(50);

    const history = stamps.map(stamp => ({
      stampId: stamp._id,
      dishName: stamp.dishName,
      venueName: stamp.venueId?.name,
      rating: stamp.tasteFeedback?.rating,
      flavorNotes: stamp.tasteFeedback?.flavorNotes || [],
      timestamp: stamp.scannedAt
    }));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
});

// Get recommendations based on taste profile
router.get('/recommendations', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.tasteProfile || !user.tasteProfile.flavorPreferences) {
      return res.json({
        success: true,
        data: []
      });
    }

    const flavorPreferences = user.tasteProfile.flavorPreferences || {};

    const topFlavors = Object.entries(flavorPreferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([flavor]) => flavor);

    // Get venues that match user preferences
    const venues = await Venue.find({
      isActive: true,
      $or: [
        { category: { $in: topFlavors } },
        { description: { $regex: topFlavors.join('|'), $options: 'i' } }
      ]
    })
      .limit(10);

    // Get user's favorite dishes to avoid recommending them again
    const favoriteDishNames = (user.tasteProfile.favoriteDishes || [])
      .map(d => d.dishName);

    const recommendations = venues
      .filter(venue => {
        // Don't recommend dishes user already tried and liked
        return !favoriteDishNames.some(name => 
          venue.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(venue.name.toLowerCase())
        );
      })
      .slice(0, 6)
      .map(venue => ({
        dishName: venue.name,
        venueName: venue.name,
        reason: `Based on your preference for ${topFlavors[0] || 'flavorful'} dishes`,
        icon: venue.category?.includes('wine') ? '🍷' : 
              venue.category?.includes('khachapuri') ? '🧀' : '🍽️'
      }));

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

