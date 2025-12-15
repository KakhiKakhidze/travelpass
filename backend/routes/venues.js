const express = require('express');
const Venue = require('../models/Venue');
const authMiddleware = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const createVenueSchema = Joi.object({
  name: Joi.string().min(2).required(),
  type: Joi.string().valid('restaurant', 'winery', 'guesthouse', 'cooking_studio').required(),
  category: Joi.array().items(
    Joi.string().valid('wine', 'khachapuri', 'village_food', 'traditional_dishes', 'desserts', 'tandoori_bread')
  ).optional(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    region: Joi.string().required()
  }).required(),
  description: Joi.string().optional(),
  photos: Joi.array().items(Joi.string().uri()).optional()
});

// List venues with filters
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      region,
      type,
      lat,
      lng,
      radius = 5000,
      page = 1,
      limit = 20
    } = req.query;

    const query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = { $in: Array.isArray(category) ? category : [category] };
    }

    // Filter by region
    if (region) {
      query['location.region'] = region;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Geospatial query
    let geoQuery = null;
    if (lat && lng) {
      geoQuery = {
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(radius)
          }
        }
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let venuesQuery = Venue.find(query);
    
    if (geoQuery) {
      venuesQuery = Venue.find({ ...query, ...geoQuery });
    }

    const [venues, total] = await Promise.all([
      venuesQuery
        .select('-ownerId')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Venue.countDocuments(query)
    ]);

      res.json({
        success: true,
        data: {
          venues: venues.map(venue => ({
            id: venue._id,
            name: venue.name,
            type: venue.type,
            category: venue.category,
            location: venue.location,
            photos: venue.photos,
            description: venue.description,
            qrCode: venue.qrCode,
            contact: venue.contact,
            openingHours: venue.openingHours,
            services: venue.services,
            priceRange: venue.priceRange,
            capacity: venue.capacity,
            languages: venue.languages,
            specialFeatures: venue.specialFeatures,
            socialMedia: venue.socialMedia
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

// Get venue details
router.get('/:id', async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate('ownerId', 'name email')
      .lean();

    if (!venue || !venue.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Venue not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        venue: {
          id: venue._id,
          name: venue.name,
          type: venue.type,
          category: venue.category,
          location: venue.location,
          photos: venue.photos,
          description: venue.description,
          qrCode: venue.qrCode,
          contact: venue.contact,
          openingHours: venue.openingHours,
          services: venue.services,
          priceRange: venue.priceRange,
          capacity: venue.capacity,
          languages: venue.languages,
          specialFeatures: venue.specialFeatures,
          socialMedia: venue.socialMedia,
          owner: {
            name: venue.ownerId?.name,
            email: venue.ownerId?.email
          }
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Create venue (partner only)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = createVenueSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.details[0].message
        }
      });
    }

    // Generate QR code
    const qrCode = `${process.env.QR_CODE_PREFIX || 'GP-GE'}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const venue = new Venue({
      ...value,
      ownerId: req.user._id,
      qrCode
    });

    await venue.save();

    res.status(201).json({
      success: true,
      data: {
        venue: {
          id: venue._id,
          name: venue.name,
          type: venue.type,
          category: venue.category,
          location: venue.location,
          qrCode: venue.qrCode
        }
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: 'QR code already exists'
        }
      });
    }
    next(err);
  }
});

module.exports = router;

