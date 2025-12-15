const express = require('express');
const Review = require('../models/Review');
const Location = require('../models/Location');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const reviewSchema = Joi.object({
  locationId: Joi.string().required(),
  checkInId: Joi.string(),
  rating: Joi.number().min(1).max(5).required(),
  text: Joi.string().max(5000),
  photos: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  visitDate: Joi.date()
});

// Create review
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    const { locationId, checkInId, rating, text, photos, tags, visitDate } = value;

    // Find location
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Location not found'
        }
      });
    }

    // Check if user already reviewed this location
    const existingReview = await Review.findOne({
      userId: req.user._id,
      locationId: location._id,
      deletedAt: null
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'You have already reviewed this location'
        }
      });
    }

    // Check if check-in exists and belongs to user
    let isVerified = false;
    if (checkInId) {
      const CheckIn = require('../models/CheckIn');
      const checkIn = await CheckIn.findById(checkInId);
      if (checkIn && checkIn.userId.toString() === req.user._id.toString() && checkIn.isVerified) {
        isVerified = true;
      }
    }

    // Create review
    const review = new Review({
      userId: req.user._id,
      locationId: location._id,
      checkInId: checkInId || undefined,
      rating,
      text: text || '',
      photos: photos || [],
      tags: tags || [],
      visitDate: visitDate || new Date(),
      isVerified
    });

    await review.save();

    // Update location stats
    const reviews = await Review.find({ locationId: location._id, deletedAt: null });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    location.stats.totalReviews = reviews.length;
    location.stats.averageRating = Math.round(avgRating * 10) / 10;
    
    // Update popular tags
    const tagCounts = {};
    reviews.forEach(r => {
      r.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    location.popularTags = Object.keys(tagCounts)
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 10);
    
    await location.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalReviews': 1 }
    });

    // Award XP for first review
    if (req.user.stats.totalReviews === 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { xp: 10 }
      });
    }

    res.status(201).json({
      success: true,
      data: {
        review: {
          id: review._id,
          locationId: review.locationId,
          rating: review.rating,
          text: review.text,
          photos: review.photos,
          tags: review.tags,
          isVerified: review.isVerified,
          createdAt: review.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get reviews
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, locationId, userId, sort = 'recent' } = req.query;
    const skip = (page - 1) * limit;

    const query = { deletedAt: null };
    if (locationId) query.locationId = locationId;
    if (userId) query.userId = userId;

    let sortOption = { createdAt: -1 };
    if (sort === 'helpful') {
      sortOption = { 'helpfulVotes.length': -1, createdAt: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('locationId', 'name location photos')
      .populate('userId', 'name avatar')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews: reviews.map(r => ({
          id: r._id,
          location: r.locationId,
          user: r.userId,
          rating: r.rating,
          text: r.text,
          photos: r.photos,
          tags: r.tags,
          likes: r.likes.length,
          helpfulVotes: r.helpfulVotes.length,
          isVerified: r.isVerified,
          createdAt: r.createdAt
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

// Get review details
router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('locationId')
      .populate('userId', 'name avatar')
      .populate('comments');

    if (!review || review.deletedAt) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        review: {
          id: review._id,
          location: review.locationId,
          user: review.userId,
          rating: review.rating,
          text: review.text,
          photos: review.photos,
          tags: review.tags,
          likes: review.likes,
          helpfulVotes: review.helpfulVotes,
          comments: review.comments,
          isVerified: review.isVerified,
          visitDate: review.visitDate,
          createdAt: review.createdAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Update review
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.deletedAt) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only update your own reviews'
        }
      });
    }

    const { rating, text, photos, tags, visitDate } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    if (photos !== undefined) review.photos = photos;
    if (tags !== undefined) review.tags = tags;
    if (visitDate !== undefined) review.visitDate = visitDate;
    review.updatedAt = new Date();

    await review.save();

    // Update location stats
    const reviews = await Review.find({ locationId: review.locationId, deletedAt: null });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Location.findByIdAndUpdate(review.locationId, {
      'stats.averageRating': Math.round(avgRating * 10) / 10
    });

    res.json({
      success: true,
      data: {
        review: {
          id: review._id,
          rating: review.rating,
          text: review.text,
          photos: review.photos,
          tags: review.tags,
          updatedAt: review.updatedAt
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete review
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.deletedAt) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only delete your own reviews'
        }
      });
    }

    // Soft delete
    review.deletedAt = new Date();
    await review.save();

    // Update location stats
    const reviews = await Review.find({ locationId: review.locationId, deletedAt: null });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    await Location.findByIdAndUpdate(review.locationId, {
      'stats.totalReviews': reviews.length,
      'stats.averageRating': Math.round(avgRating * 10) / 10
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalReviews': -1 }
    });

    res.json({
      success: true,
      data: {
        message: 'Review deleted'
      }
    });
  } catch (err) {
    next(err);
  }
});

// Like/unlike review
router.post('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.deletedAt) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    const userId = req.user._id.toString();
    const isLiked = review.likes.some(id => id.toString() === userId);

    if (isLiked) {
      review.likes = review.likes.filter(id => id.toString() !== userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    res.json({
      success: true,
      data: {
        liked: !isLiked,
        likesCount: review.likes.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// Mark review as helpful
router.post('/:id/helpful', authMiddleware, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.deletedAt) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found'
        }
      });
    }

    const userId = req.user._id.toString();
    const isHelpful = review.helpfulVotes.some(id => id.toString() === userId);

    if (isHelpful) {
      review.helpfulVotes = review.helpfulVotes.filter(id => id.toString() !== userId);
    } else {
      review.helpfulVotes.push(userId);
    }

    await review.save();

    // Update location stats
    await Location.findByIdAndUpdate(review.locationId, {
      $inc: { 'stats.helpfulVotes': isHelpful ? -1 : 1 }
    });

    res.json({
      success: true,
      data: {
        helpful: !isHelpful,
        helpfulCount: review.helpfulVotes.length
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

