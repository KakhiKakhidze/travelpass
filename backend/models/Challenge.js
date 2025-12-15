const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['khachapuri_trail', 'wine_challenge', 'regional', 'custom', 'combo'],
    index: true
  },
  requirements: {
    venueTypes: [{
      type: String,
      enum: ['restaurant', 'winery', 'guesthouse', 'cooking_studio']
    }],
    minStamps: {
      type: Number,
      required: function() {
        return this.type !== 'combo';
      },
      min: 1
    },
    categories: [{
      type: String,
      enum: ['wine', 'khachapuri', 'village_food', 'traditional_dishes', 'desserts', 'tandoori_bread']
    }],
    regions: [{
      type: String
    }],
    // For combo challenges: IDs of challenges that must be completed
    requiredChallenges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    }],
    // For venue-specific challenges: IDs of specific venues that must be visited
    requiredVenues: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue'
    }],
    // For menu combo challenges: specific menu items that must be ordered together
    menuCombo: {
      items: [{
        type: String // e.g., ['khachapuri', 'wine', 'salad']
      }],
      requiredCount: {
        type: Number,
        min: 2
      }
    }
  },
  reward: {
    type: {
      type: String,
      enum: ['badge', 'discount', 'free_tasting', 'souvenir'],
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  xpReward: {
    type: Number,
    default: 50,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isSpecial: {
    type: Boolean,
    default: false,
    index: true
  },
  eventType: {
    type: String,
    enum: ['halloween', 'new_year', 'christmas', 'easter', 'summer', 'winter', 'spring', 'autumn', null],
    default: null
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);

