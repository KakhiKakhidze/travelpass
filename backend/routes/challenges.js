const express = require('express');
const Challenge = require('../models/Challenge');
const Stamp = require('../models/Stamp');
const Reward = require('../models/Reward');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// List active challenges with user progress
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).lean();
    const userStamps = await Stamp.find({ userId: req.user._id }).populate('venueId').lean();

    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        let progress;

        // Handle combo challenges differently
        if (challenge.type === 'combo') {
          // For combo challenges, check how many required challenges are completed
          const requiredChallengeIds = challenge.requirements.requiredChallenges || [];
          const completedRewards = await Reward.find({
            userId: req.user._id,
            challengeId: { $in: requiredChallengeIds }
          }).lean();

          const completedCount = completedRewards.length;
          const requiredCount = requiredChallengeIds.length;

          progress = {
            current: completedCount,
            required: requiredCount,
            percentage: requiredCount > 0 ? Math.min(100, Math.round((completedCount / requiredCount) * 100)) : 0
          };
        } else {
          // Calculate progress for regular challenges based on stamps
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

          progress = {
            current: matchingStamps.length,
            required: challenge.requirements.minStamps,
            percentage: Math.min(100, Math.round((matchingStamps.length / challenge.requirements.minStamps) * 100))
          };
        }

        // Populate required challenges for combo challenges and required venues for venue-specific challenges
        let populatedRequirements = challenge.requirements;
        if (challenge.type === 'combo' && challenge.requirements.requiredChallenges) {
          const requiredChallenges = await Challenge.find({
            _id: { $in: challenge.requirements.requiredChallenges }
          }).select('name description').lean();
          populatedRequirements = {
            ...challenge.requirements,
            requiredChallenges: requiredChallenges
          };
        }
        if (challenge.requirements.requiredVenues && challenge.requirements.requiredVenues.length > 0) {
          const Venue = require('../models/Venue');
          const requiredVenues = await Venue.find({
            _id: { $in: challenge.requirements.requiredVenues }
          }).select('name description location').lean();
          populatedRequirements = {
            ...populatedRequirements,
            requiredVenues: requiredVenues
          };
        }

        return {
          id: challenge._id,
          name: challenge.name,
          description: challenge.description,
          type: challenge.type,
          requirements: populatedRequirements,
          reward: challenge.reward,
          xpReward: challenge.xpReward,
          progress
        };
      })
    );

    res.json({
      success: true,
      data: {
        challenges: challengesWithProgress
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get challenge details
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).lean();

    if (!challenge || !challenge.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Challenge not found'
        }
      });
    }

    // Calculate user progress
    let progress;

    if (challenge.type === 'combo') {
      // For combo challenges, check how many required challenges are completed
      const requiredChallengeIds = challenge.requirements.requiredChallenges || [];
      const completedRewards = await Reward.find({
        userId: req.user._id,
        challengeId: { $in: requiredChallengeIds }
      }).lean();

      const completedCount = completedRewards.length;
      const requiredCount = requiredChallengeIds.length;

      progress = {
        current: completedCount,
        required: requiredCount,
        percentage: requiredCount > 0 ? Math.min(100, Math.round((completedCount / requiredCount) * 100)) : 0
      };

      // Populate required challenges
      const requiredChallenges = await Challenge.find({
        _id: { $in: requiredChallengeIds }
      }).select('name description').lean();
      challenge.requirements.requiredChallenges = requiredChallenges;
    } else if (challenge.requirements.requiredVenues && challenge.requirements.requiredVenues.length > 0) {
      // Populate required venues for venue-specific challenges
      const Venue = require('../models/Venue');
      const requiredVenues = await Venue.find({
        _id: { $in: challenge.requirements.requiredVenues }
      }).select('name description location').lean();
      challenge.requirements.requiredVenues = requiredVenues;
    } else {
      // Calculate progress for regular challenges based on stamps
      const userStamps = await Stamp.find({ userId: req.user._id }).populate('venueId').lean();
      const matchingStamps = userStamps.filter(stamp => {
        const venue = stamp.venueId;
        if (!venue) return false;

        // Check if challenge requires specific venues
        if (challenge.requirements.requiredVenues && challenge.requirements.requiredVenues.length > 0) {
          return challenge.requirements.requiredVenues.some(venueId => 
            venueId.toString() === venue._id.toString()
          );
        }

        if (challenge.requirements.venueTypes.length > 0 &&
            !challenge.requirements.venueTypes.includes(venue.type)) {
          return false;
        }

        if (challenge.requirements.categories.length > 0) {
          const hasMatchingCategory = challenge.requirements.categories.some(cat =>
            venue.category.includes(cat)
          );
          if (!hasMatchingCategory) return false;
        }

        if (challenge.requirements.regions.length > 0 &&
            !challenge.requirements.regions.includes(venue.location.region)) {
          return false;
        }

        return true;
      });

      progress = {
        current: matchingStamps.length,
        required: challenge.requirements.minStamps,
        percentage: Math.min(100, Math.round((matchingStamps.length / challenge.requirements.minStamps) * 100))
      };
    }

    res.json({
      success: true,
      data: {
        challenge: {
          ...challenge,
          progress
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

