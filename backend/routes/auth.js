const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  preferences: Joi.array().items(
    Joi.string().valid('wine', 'khachapuri', 'village_food', 'traditional_dishes', 'desserts', 'tandoori_bread')
  ).optional(),
  discoveryType: Joi.string().valid('food', 'gastronomic', 'community', 'architectural').default('food')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { email, password, name, preferences, discoveryType } = value;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      preferences: preferences || [],
      discoveryType: discoveryType || 'food' // Default if not provided
    });
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          preferences: user.preferences,
          discoveryType: user.discoveryType,
          level: user.level,
          xp: user.xp,
          badges: user.badges,
          currentStatus: user.currentStatus,
          profileVisibility: user.profileVisibility,
          stats: user.stats
        },
        tokens
      }
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_INVALID',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_INVALID',
          message: 'Invalid email or password'
        }
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokens(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          preferences: user.preferences,
          discoveryType: user.discoveryType,
          level: user.level,
          xp: user.xp,
          badges: user.badges,
          currentStatus: user.currentStatus,
          profileVisibility: user.profileVisibility,
          stats: user.stats
        },
        tokens
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          preferences: req.user.preferences,
          discoveryType: req.user.discoveryType,
          level: req.user.level,
          levelName: req.user.levelName,
          xp: req.user.xp,
          badges: req.user.badges,
          lastLogin: req.user.lastLogin
        }
    }
  });
});

module.exports = router;

