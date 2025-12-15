const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  preferences: [{
    type: String,
    enum: ['wine', 'khachapuri', 'village_food', 'traditional_dishes', 'desserts', 'tandoori_bread']
  }],
  discoveryType: {
    type: String,
    enum: ['food', 'gastronomic', 'community', 'architectural'], // Include 'gastronomic' for backward compatibility
    default: 'food' // Default for backward compatibility
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 4
  },
  xp: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  avatar: {
    type: String // URL
  },
  badges: [{
    type: String
  }],
  achievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status & Privacy
  currentStatus: {
    text: String, // "Now in Tbilisi", "Traveling...", "Hiking..."
    location: {
      coordinates: [Number], // [lng, lat]
      name: String
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    updatedAt: Date
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  statusVisibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  
  // Social
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Preferences
  interests: [String], // ['hiking', 'food', 'architecture', etc.]
  travelPreferences: {
    budget: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$']
    },
    travelStyle: [String] // ['solo', 'group', 'family', 'backpacking']
  },
  
  // Stats
  stats: {
    totalCheckIns: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    countriesVisited: [String],
    citiesVisited: [String]
  },
  
  lastLogin: {
    type: Date
  },
  
  // Taste Memory™ Profile (kept for backward compatibility)
  tasteProfile: {
    flavorPreferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    favoriteDishes: [{
      dishName: String,
      venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue'
      },
      rating: Number,
      orderCount: Number
    }],
    dietaryRestrictions: [String],
    dietaryPreferences: [String],
    allergies: [String],
    lastUpdated: Date
  }
}, {
  timestamps: true
});

// Set default discoveryType if not provided and migrate old values
userSchema.pre('save', function(next) {
  if (!this.discoveryType) {
    this.discoveryType = 'food';
  }
  // Migrate old 'gastronomic' value to 'food'
  if (this.discoveryType === 'gastronomic') {
    this.discoveryType = 'food';
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get user level name
userSchema.virtual('levelName').get(function() {
  const levels = {
    1: 'Explorer',
    2: 'Wanderer',
    3: 'Adventurer',
    4: 'Master Traveler'
  };
  return levels[this.level] || 'Explorer';
});

// Indexes
userSchema.index({ 'currentStatus.location.coordinates': '2dsphere' });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

module.exports = mongoose.model('User', userSchema);

