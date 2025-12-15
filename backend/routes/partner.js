const express = require('express');
const Venue = require('../models/Venue');
const Stamp = require('../models/Stamp');
const authMiddleware = require('../middleware/auth');
const qrcode = require('qrcode');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get analytics for partner's venues
router.get('/analytics', async (req, res, next) => {
  try {
    const { venueId, startDate, endDate } = req.query;

    const query = {};
    if (venueId) {
      query.venueId = venueId;
    } else {
      // Get all venues owned by user
      const userVenues = await Venue.find({ ownerId: req.user._id }).select('_id');
      query.venueId = { $in: userVenues.map(v => v._id) };
    }

    if (startDate || endDate) {
      query.scannedAt = {};
      if (startDate) query.scannedAt.$gte = new Date(startDate);
      if (endDate) query.scannedAt.$lte = new Date(endDate);
    }

    const stamps = await Stamp.find(query)
      .populate('venueId', 'name')
      .lean();

    // Calculate statistics
    const totalScans = stamps.length;
    const uniqueUsers = new Set(stamps.map(s => s.userId.toString())).size;

    // Scans by date
    const scansByDate = {};
    stamps.forEach(stamp => {
      const date = stamp.scannedAt.toISOString().split('T')[0];
      scansByDate[date] = (scansByDate[date] || 0) + 1;
    });

    // Top dishes (using dishName from stamps)
    const dishCounts = {};
    stamps.forEach(stamp => {
      const dish = stamp.dishName || 'Unknown';
      dishCounts[dish] = (dishCounts[dish] || 0) + 1;
    });

    const topDishes = Object.entries(dishCounts)
      .map(([name, count]) => ({ name, scans: count }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalScans,
        uniqueUsers,
        scansByDate: Object.entries(scansByDate).map(([date, count]) => ({ date, count })),
        topDishes
      }
    });
  } catch (err) {
    next(err);
  }
});

// Generate QR code for venue
router.post('/qr/generate', async (req, res, next) => {
  try {
    const { venueId } = req.body;

    const venue = await Venue.findOne({
      _id: venueId,
      ownerId: req.user._id
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Venue not found or you do not have permission'
        }
      });
    }

    // Generate QR code image
    const qrCodeDataURL = await qrcode.toDataURL(venue.qrCode, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300
    });

    res.json({
      success: true,
      data: {
        qrCode: venue.qrCode,
        qrCodeImage: qrCodeDataURL,
        venue: {
          id: venue._id,
          name: venue.name
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get partner statistics
router.get('/stats', async (req, res, next) => {
  try {
    const userVenues = await Venue.find({ ownerId: req.user._id }).select('_id name');
    const venueIds = userVenues.map(v => v._id);

    const totalStamps = await Stamp.countDocuments({ venueId: { $in: venueIds } });
    const uniqueUsers = await Stamp.distinct('userId', { venueId: { $in: venueIds } });

    res.json({
      success: true,
      data: {
        totalVenues: userVenues.length,
        totalStamps,
        uniqueUsers: uniqueUsers.length,
        venues: userVenues.map(v => ({
          id: v._id,
          name: v.name
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

