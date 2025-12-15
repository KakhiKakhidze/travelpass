const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Venue = require('../models/Venue');
const Challenge = require('../models/Challenge');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpass');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Venue.deleteMany({});
    // await Challenge.deleteMany({});

    // Create or get partner user for venues
    let partnerUser = await User.findOne({ email: 'partner@travelpass.com' });
    if (!partnerUser) {
      partnerUser = new User({
        email: 'partner@travelpass.com',
        password: 'partner123',
        name: 'TravelPass Partner',
        preferences: ['wine', 'khachapuri', 'village_food']
      });
      await partnerUser.save();
      console.log('✅ Created partner user');
    } else {
      console.log('✅ Using existing partner user');
    }

    // Create challenges (Level 1-10 progression)
    const challenges = [
      // Level 1 - Beginner
      {
        name: 'First Taste',
        description: 'Collect your first 3 stamps from any venues',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 3,
          categories: []
        },
        reward: {
          type: 'badge',
          value: 'First Steps'
        },
        xpReward: 30,
        isActive: true
      },
      // Level 2
      {
        name: 'Khachapuri Explorer',
        description: 'Try khachapuri at 3 different restaurants',
        type: 'khachapuri_trail',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 3,
          categories: ['khachapuri']
        },
        reward: {
          type: 'badge',
          value: 'Khachapuri Beginner'
        },
        xpReward: 50,
        isActive: true
      },
      // Level 3
      {
        name: 'Wine Taster',
        description: 'Visit 3 wineries and collect wine stamps',
        type: 'wine_challenge',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 3,
          categories: ['wine']
        },
        reward: {
          type: 'badge',
          value: 'Wine Novice'
        },
        xpReward: 75,
        isActive: true
      },
      // Level 4
      {
        name: 'Try 5 Types of Khachapuri',
        description: 'Collect stamps from 5 different khachapuri locations',
        type: 'khachapuri_trail',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 5,
          categories: ['khachapuri']
        },
        reward: {
          type: 'badge',
          value: 'Khachapuri Hunter'
        },
        xpReward: 100,
        isActive: true
      },
      // Level 5
      {
        name: 'Village Food Adventure',
        description: 'Experience authentic village cuisine at 5 locations',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant', 'guesthouse'],
          minStamps: 5,
          categories: ['village_food']
        },
        reward: {
          type: 'badge',
          value: 'Village Explorer'
        },
        xpReward: 125,
        isActive: true
      },
      // Level 6
      {
        name: 'Kakheti Wine Trail',
        description: 'Explore 5 wineries in the Kakheti region',
        type: 'regional',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 5,
          regions: ['Kakheti']
        },
        reward: {
          type: 'badge',
          value: 'Kakheti Explorer'
        },
        xpReward: 150,
        isActive: true
      },
      // Level 7
      {
        name: 'Taste 7 Qvevri Wines',
        description: 'Visit 7 wineries and collect stamps for Qvevri wines',
        type: 'wine_challenge',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 7,
          categories: ['wine']
        },
        reward: {
          type: 'badge',
          value: 'Wine Wanderer'
        },
        xpReward: 200,
        isActive: true
      },
      // Level 8
      {
        name: 'Coastal & Mountain Journey',
        description: 'Visit venues in both Batumi (Adjara) and mountain regions',
        type: 'regional',
        requirements: {
          venueTypes: [],
          minStamps: 8,
          regions: ['Adjara', 'Mtskheta-Mtianeti']
        },
        reward: {
          type: 'badge',
          value: 'Georgia Explorer'
        },
        xpReward: 250,
        isActive: true
      },
      // Level 9
      {
        name: 'Master Collector',
        description: 'Collect stamps from 10 different venues across all categories',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 10,
          categories: ['wine', 'khachapuri', 'village_food']
        },
        reward: {
          type: 'badge',
          value: 'Master Collector'
        },
        xpReward: 300,
        isActive: true
      },
      // Level 10 - Ultimate Challenge
      {
        name: 'Georgian Culinary Master',
        description: 'Complete the ultimate challenge: 15 stamps including wine, khachapuri, and village food',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 15,
          categories: ['wine', 'khachapuri', 'village_food']
        },
        reward: {
          type: 'badge',
          value: 'Georgian Culinary Master'
        },
        xpReward: 500,
        isActive: true
      }
    ];

    // First, create regular challenges and collect their IDs
    const challengeMap = new Map();
    
    for (const challengeData of challenges) {
      let challenge = await Challenge.findOne({ name: challengeData.name });
      if (!challenge) {
        challenge = new Challenge(challengeData);
        await challenge.save();
        console.log(`✅ Created challenge: ${challenge.name}`);
      } else {
        console.log(`⏭️  Challenge already exists: ${challengeData.name}`);
      }
      challengeMap.set(challengeData.name, challenge._id);
    }

    // Now create combo challenges that require completing multiple other challenges
    const comboChallenges = [
      {
        name: 'Khachapuri & Wine Explorer',
        description: 'Complete both the Khachapuri Explorer and Wine Taster challenges',
        type: 'combo',
        requirements: {
          requiredChallenges: [
            challengeMap.get('Khachapuri Explorer'),
            challengeMap.get('Wine Taster')
          ]
        },
        reward: {
          type: 'badge',
          value: 'Dual Explorer'
        },
        xpReward: 150,
        isActive: true
      },
      {
        name: 'Regional Master',
        description: 'Complete Kakheti Wine Trail and Coastal & Mountain Journey challenges',
        type: 'combo',
        requirements: {
          requiredChallenges: [
            challengeMap.get('Kakheti Wine Trail'),
            challengeMap.get('Coastal & Mountain Journey')
          ]
        },
        reward: {
          type: 'badge',
          value: 'Regional Master'
        },
        xpReward: 400,
        isActive: true
      },
      {
        name: 'Complete Culinary Journey',
        description: 'Complete Khachapuri Explorer, Wine Taster, and Village Food Adventure',
        type: 'combo',
        requirements: {
          requiredChallenges: [
            challengeMap.get('Khachapuri Explorer'),
            challengeMap.get('Wine Taster'),
            challengeMap.get('Village Food Adventure')
          ]
        },
        reward: {
          type: 'badge',
          value: 'Complete Explorer'
        },
        xpReward: 300,
        isActive: true
      },
      {
        name: 'Ultimate Georgian Experience',
        description: 'Complete all major challenges: Khachapuri Explorer, Wine Taster, Village Food Adventure, and Kakheti Wine Trail',
        type: 'combo',
        requirements: {
          requiredChallenges: [
            challengeMap.get('Khachapuri Explorer'),
            challengeMap.get('Wine Taster'),
            challengeMap.get('Village Food Adventure'),
            challengeMap.get('Kakheti Wine Trail')
          ]
        },
        reward: {
          type: 'badge',
          value: 'Ultimate Explorer'
        },
        xpReward: 600,
        isActive: true
      }
    ];

    for (const comboData of comboChallenges) {
      // Filter out undefined challenge IDs (in case some challenges don't exist)
      comboData.requirements.requiredChallenges = comboData.requirements.requiredChallenges.filter(id => id);
      
      if (comboData.requirements.requiredChallenges.length > 0) {
        const existingCombo = await Challenge.findOne({ name: comboData.name });
        if (!existingCombo) {
          const comboChallenge = new Challenge(comboData);
          await comboChallenge.save();
          console.log(`✅ Created combo challenge: ${comboChallenge.name}`);
        } else {
          console.log(`⏭️  Combo challenge already exists: ${comboData.name}`);
        }
      }
    }

    // Helper function to add common venue info
    const addVenueInfo = (venue, info) => {
      return {
        ...venue,
        contact: info.contact || {},
        openingHours: info.openingHours || {
          monday: '10:00 - 22:00',
          tuesday: '10:00 - 22:00',
          wednesday: '10:00 - 22:00',
          thursday: '10:00 - 22:00',
          friday: '10:00 - 23:00',
          saturday: '10:00 - 23:00',
          sunday: '10:00 - 22:00'
        },
        services: info.services || ['wifi', 'credit_cards'],
        priceRange: info.priceRange || '$$',
        capacity: info.capacity || 30,
        languages: info.languages || ['georgian', 'english'],
        specialFeatures: info.specialFeatures || [],
        socialMedia: info.socialMedia || {}
      };
    };

    // Create sample venues
    const venues = [
      // Wine venues (Wineries in Kakheti)
      addVenueInfo({
        name: 'Château Mukhrani',
        type: 'winery',
        category: ['wine'],
        location: {
          address: 'Mukhrani, Mtskheta Municipality, Georgia',
          coordinates: [44.5833, 41.9167],
          region: 'Mtskheta-Mtianeti'
        },
        qrCode: 'GP-GE-WINE-001',
        ownerId: partnerUser._id,
        description: 'Historic winery producing traditional Georgian wines using Qvevri method. Experience wine tasting in a beautiful castle setting.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 2 55 55 55',
          email: 'info@mukhrani.ge',
          website: 'https://www.mukhrani.ge'
        },
        openingHours: {
          monday: '10:00 - 18:00',
          tuesday: '10:00 - 18:00',
          wednesday: '10:00 - 18:00',
          thursday: '10:00 - 18:00',
          friday: '10:00 - 18:00',
          saturday: '10:00 - 18:00',
          sunday: '10:00 - 18:00'
        },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$$',
        capacity: 50,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Historic castle', 'Qvevri wine production', 'Wine museum', 'Scenic views'],
        socialMedia: {
          facebook: 'https://facebook.com/mukhrani',
          instagram: '@mukhrani_wine'
        }
      }),
      addVenueInfo({
        name: 'Telavi Wine Cellar',
        type: 'winery',
        category: ['wine'],
        location: {
          address: 'Telavi, Kakheti, Georgia',
          coordinates: [45.0319, 41.9167],
          region: 'Kakheti'
        },
        qrCode: 'GP-GE-WINE-002',
        ownerId: partnerUser._id,
        description: 'Traditional Kakhetian winery offering Qvevri wine tastings and tours. Learn about ancient Georgian winemaking traditions.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 351 2 22 33 44',
          email: 'info@telaviwine.ge',
          website: 'https://www.telaviwine.ge'
        },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'credit_cards', 'english_menu'],
        priceRange: '$$',
        capacity: 40,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Qvevri wine making', 'Traditional marani', 'Wine education tours'],
        socialMedia: {
          instagram: '@telavi_wine_cellar'
        }
      }),
      addVenueInfo({
        name: 'Kindzmarauli Marani',
        type: 'winery',
        category: ['wine'],
        location: {
          address: 'Kindzmarauli, Kakheti, Georgia',
          coordinates: [45.5667, 41.6000],
          region: 'Kakheti'
        },
        qrCode: 'GP-GE-WINE-003',
        ownerId: partnerUser._id,
        description: 'Famous for producing the legendary Kindzmarauli semi-sweet wine. Experience authentic Georgian wine culture.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 351 5 55 66 77',
          email: 'kindzmarauli@wine.ge'
        },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 35,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Kindzmarauli wine production', 'Traditional Qvevri', 'Vineyard tours'],
        socialMedia: {
          facebook: 'https://facebook.com/kindzmarauli'
        }
      }),
      // Khachapuri venues (Restaurants in Tbilisi)
      addVenueInfo({
        name: 'Café Littera',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes'],
        location: {
          address: 'Machabeli St 13, Tbilisi, Georgia',
          coordinates: [44.7975, 41.6942],
          region: 'Tbilisi'
        },
        qrCode: 'GP-GE-KHACH-001',
        ownerId: partnerUser._id,
        description: 'Traditional Georgian restaurant serving authentic Adjarian Khachapuri with melted cheese and egg. A must-try in Tbilisi!',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 2 99 88 77',
          email: 'info@cafelittera.ge',
          website: 'https://www.cafelittera.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 60,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Adjarian Khachapuri specialty', 'Traditional Georgian cuisine', 'Cozy atmosphere'],
        socialMedia: {
          facebook: 'https://facebook.com/cafelittera',
          instagram: '@cafe_littera'
        }
      }),
      addVenueInfo({
        name: 'Barbarestan',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes'],
        location: {
          address: '132 Agmashenebeli Ave, Tbilisi, Georgia',
          coordinates: [44.8125, 41.7156],
          region: 'Tbilisi'
        },
        qrCode: 'GP-GE-KHACH-002',
        ownerId: partnerUser._id,
        description: 'Award-winning restaurant featuring Imeretian Khachapuri and other regional Georgian specialties. Recipes from 19th-century cookbook.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 2 99 11 22',
          email: 'reservations@barbarestan.ge',
          website: 'https://www.barbarestan.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'credit_cards', 'english_menu', 'russian_menu', 'wheelchair_accessible'],
        priceRange: '$$$',
        capacity: 80,
        languages: ['georgian', 'english', 'russian', 'french'],
        specialFeatures: ['Award-winning cuisine', 'Historic recipes', 'Fine dining', 'Wine pairing'],
        socialMedia: {
          facebook: 'https://facebook.com/barbarestan',
          instagram: '@barbarestan',
          tripadvisor: 'https://tripadvisor.com/barbarestan'
        }
      }),
      addVenueInfo({
        name: 'Pasanauri',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes'],
        location: {
          address: 'Rustaveli Ave 37, Tbilisi, Georgia',
          coordinates: [44.7997, 41.6972],
          region: 'Tbilisi'
        },
        qrCode: 'GP-GE-KHACH-003',
        ownerId: partnerUser._id,
        description: 'Popular local spot for Megrelian Khachapuri with extra cheese. Experience the authentic taste of Samegrelo region.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 2 11 22 33',
          email: 'info@pasanauri.ge'
        },
        services: ['wifi', 'indoor_seating', 'credit_cards', 'cash_only', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 45,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Megrelian Khachapuri', 'Local favorite', 'Authentic recipes'],
        socialMedia: {
          instagram: '@pasanauri_tbilisi'
        }
      }),
      // Village food venues (Guesthouses and traditional restaurants)
      addVenueInfo({
        name: 'Sighnaghi Guesthouse & Kitchen',
        type: 'guesthouse',
        category: ['village_food', 'traditional_dishes'],
        location: {
          address: 'Sighnaghi, Kakheti, Georgia',
          coordinates: [45.9214, 41.6181],
          region: 'Kakheti'
        },
        qrCode: 'GP-GE-VILLAGE-001',
        ownerId: partnerUser._id,
        description: 'Traditional guesthouse serving authentic village-style Georgian cuisine. Try khinkali, mtsvadi, and seasonal local dishes.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 351 7 77 88 99',
          email: 'sighnaghi@guesthouse.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'cash_only', 'english_menu'],
        priceRange: '$$',
        capacity: 25,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Guesthouse accommodation', 'Traditional cooking', 'Mountain views', 'Family atmosphere'],
        socialMedia: {
          facebook: 'https://facebook.com/sighnaghiguesthouse'
        }
      }),
      addVenueInfo({
        name: 'Mtskheta Family Restaurant',
        type: 'restaurant',
        category: ['village_food', 'traditional_dishes'],
        location: {
          address: 'Mtskheta, Mtskheta-Mtianeti, Georgia',
          coordinates: [44.7181, 41.8456],
          region: 'Mtskheta-Mtianeti'
        },
        qrCode: 'GP-GE-VILLAGE-002',
        ownerId: partnerUser._id,
        description: 'Family-run restaurant offering home-style Georgian cooking. Experience traditional village recipes passed down through generations.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 3 33 44 55',
          email: 'info@mtskhetafamily.ge'
        },
        services: ['wifi', 'parking', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 35,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Family recipes', 'Home-style cooking', 'Near historic sites'],
        socialMedia: {
          instagram: '@mtskheta_family'
        }
      }),
      addVenueInfo({
        name: 'Kazbegi Mountain Kitchen',
        type: 'guesthouse',
        category: ['village_food', 'traditional_dishes'],
        location: {
          address: 'Stepantsminda, Mtskheta-Mtianeti, Georgia',
          coordinates: [44.6431, 42.6578],
          region: 'Mtskheta-Mtianeti'
        },
        qrCode: 'GP-GE-VILLAGE-003',
        ownerId: partnerUser._id,
        description: 'Mountain guesthouse serving hearty Georgian mountain cuisine. Perfect after hiking to Gergeti Trinity Church.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 4 44 55 66',
          email: 'kazbegi@mountain.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'heating', 'credit_cards', 'cash_only', 'english_menu'],
        priceRange: '$$',
        capacity: 30,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Mountain cuisine', 'Guesthouse', 'Hiking base', 'Mountain views'],
        socialMedia: {
          instagram: '@kazbegi_mountain_kitchen'
        }
      }),
      addVenueInfo({
        name: 'Gori Traditional House',
        type: 'restaurant',
        category: ['village_food', 'khachapuri'],
        location: {
          address: 'Gori, Shida Kartli, Georgia',
          coordinates: [44.1106, 41.9814],
          region: 'Shida Kartli'
        },
        qrCode: 'GP-GE-VILLAGE-004',
        ownerId: partnerUser._id,
        description: 'Authentic Georgian home cooking in a traditional house setting. Try lobio (bean stew) and fresh khachapuri.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 370 2 11 33 44',
          email: 'info@goritradhouse.ge'
        },
        services: ['wifi', 'indoor_seating', 'credit_cards', 'cash_only', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 40,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Traditional house setting', 'Lobio specialty', 'Home cooking'],
        socialMedia: {
          facebook: 'https://facebook.com/goritradhouse'
        }
      }),
      // Restaurant Tavaduri
      addVenueInfo({
        name: 'Restaurant Tavaduri',
        type: 'restaurant',
        category: ['traditional_dishes', 'khachapuri', 'village_food'],
        location: {
          address: 'Tbilisi, Georgia',
          coordinates: [44.7975, 41.6942],
          region: 'Tbilisi'
        },
        qrCode: 'GP-GE-TAVADURI-001',
        ownerId: partnerUser._id,
        description: 'Authentic Georgian restaurant serving traditional Tavaduri-style cuisine. Experience classic Georgian dishes in a warm, welcoming atmosphere.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 32 2 55 66 77',
          email: 'info@tavaduri.ge',
          website: 'https://www.tavaduri.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 70,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Traditional Tavaduri cuisine', 'Authentic Georgian recipes', 'Family atmosphere', 'Live music'],
        socialMedia: {
          facebook: 'https://facebook.com/tavaduri',
          instagram: '@restaurant_tavaduri'
        }
      }),
      // Batumi venues
      addVenueInfo({
        name: 'Batumi Wine House',
        type: 'winery',
        category: ['wine'],
        location: {
          address: 'Batumi Boulevard, Batumi, Adjara, Georgia',
          coordinates: [41.6514, 41.6168],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-WINE-004',
        ownerId: partnerUser._id,
        description: 'Coastal winery in Batumi offering Adjarian wines with sea views. Perfect for wine tasting by the Black Sea.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 2 77 88 99',
          email: 'info@batumiwine.ge',
          website: 'https://www.batumiwine.ge'
        },
        openingHours: {
          monday: '11:00 - 20:00',
          tuesday: '11:00 - 20:00',
          wednesday: '11:00 - 20:00',
          thursday: '11:00 - 20:00',
          friday: '11:00 - 22:00',
          saturday: '11:00 - 22:00',
          sunday: '11:00 - 20:00'
        },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 45,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Sea views', 'Adjarian wines', 'Coastal location', 'Sunset views'],
        socialMedia: {
          facebook: 'https://facebook.com/batumiwine',
          instagram: '@batumi_wine_house'
        }
      }),
      addVenueInfo({
        name: 'Adjarian Khachapuri House',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes'],
        location: {
          address: 'Rustaveli Ave, Batumi, Adjara, Georgia',
          coordinates: [41.6506, 41.6175],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-KHACH-004',
        ownerId: partnerUser._id,
        description: 'Famous for authentic Adjarian Khachapuri - the boat-shaped bread with cheese and egg. A Batumi must-try!',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 2 11 22 33',
          email: 'info@adjariankhachapuri.ge'
        },
        services: ['wifi', 'parking', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 50,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Adjarian Khachapuri specialty', 'Traditional preparation', 'Local favorite'],
        socialMedia: {
          instagram: '@adjarian_khachapuri_house',
          tripadvisor: 'https://tripadvisor.com/adjariankhachapuri'
        }
      }),
      addVenueInfo({
        name: 'Batumi Seafood & Village Cuisine',
        type: 'restaurant',
        category: ['village_food', 'traditional_dishes'],
        location: {
          address: 'Old Batumi, Adjara, Georgia',
          coordinates: [41.6531, 41.6197],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-VILLAGE-005',
        ownerId: partnerUser._id,
        description: 'Traditional Adjarian cuisine combining fresh Black Sea seafood with village-style Georgian dishes.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 3 33 44 55',
          email: 'seafood@batumi.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 55,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Fresh seafood', 'Black Sea cuisine', 'Traditional recipes', 'Old Batumi location'],
        socialMedia: {
          facebook: 'https://facebook.com/batumiseafood',
          instagram: '@batumi_seafood'
        }
      }),
      addVenueInfo({
        name: 'Batumi Boulevard Restaurant',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes'],
        location: {
          address: 'Batumi Boulevard 1, Batumi, Adjara, Georgia',
          coordinates: [41.6522, 41.6161],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-KHACH-005',
        ownerId: partnerUser._id,
        description: 'Seaside restaurant on Batumi Boulevard serving traditional Georgian dishes with beautiful sea views.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 4 44 55 66',
          email: 'boulevard@batumi.ge',
          website: 'https://www.batumiboulevard.ge'
        },
        openingHours: {
          monday: '09:00 - 23:00',
          tuesday: '09:00 - 23:00',
          wednesday: '09:00 - 23:00',
          thursday: '09:00 - 23:00',
          friday: '09:00 - 00:00',
          saturday: '09:00 - 00:00',
          sunday: '09:00 - 23:00'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu', 'air_conditioning'],
        priceRange: '$$',
        capacity: 70,
        languages: ['georgian', 'english', 'russian', 'german'],
        specialFeatures: ['Seaside location', 'Sea views', 'Boulevard setting', 'Breakfast menu'],
        socialMedia: {
          facebook: 'https://facebook.com/batumiboulevard',
          instagram: '@batumi_boulevard',
          tripadvisor: 'https://tripadvisor.com/batumiboulevard'
        }
      }),
      // More Batumi venues for better visibility
      addVenueInfo({
        name: 'Batumi Central Market Restaurant',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes', 'village_food'],
        location: {
          address: 'Central Market, Batumi, Adjara, Georgia',
          coordinates: [41.6525, 41.6180],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-BATUMI-001',
        ownerId: partnerUser._id,
        description: 'Traditional Georgian restaurant in Batumi Central Market. Experience authentic Adjarian cuisine with fresh local ingredients.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 5 55 66 77',
          email: 'info@batumimarket.ge'
        },
        services: ['wifi', 'indoor_seating', 'credit_cards', 'cash_only', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 40,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Market location', 'Fresh ingredients', 'Local favorite', 'Authentic Adjarian Khachapuri'],
        socialMedia: {
          instagram: '@batumi_market_restaurant'
        }
      }),
      addVenueInfo({
        name: 'Batumi Seaside Winery',
        type: 'winery',
        category: ['wine'],
        location: {
          address: 'Seaside Park, Batumi, Adjara, Georgia',
          coordinates: [41.6540, 41.6170],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-BATUMI-002',
        ownerId: partnerUser._id,
        description: 'Modern winery by the Black Sea offering Adjarian wine tastings with stunning coastal views.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 6 66 77 88',
          email: 'info@batumiseasidewine.ge',
          website: 'https://www.batumiseasidewine.ge'
        },
        openingHours: {
          monday: '12:00 - 21:00',
          tuesday: '12:00 - 21:00',
          wednesday: '12:00 - 21:00',
          thursday: '12:00 - 21:00',
          friday: '12:00 - 23:00',
          saturday: '12:00 - 23:00',
          sunday: '12:00 - 21:00'
        },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 60,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Seaside location', 'Sunset views', 'Modern winery', 'Wine education'],
        socialMedia: {
          facebook: 'https://facebook.com/batumiseasidewine',
          instagram: '@batumi_seaside_winery'
        }
      }),
      addVenueInfo({
        name: 'Batumi Old Town Khachapuri',
        type: 'restaurant',
        category: ['khachapuri', 'traditional_dishes'],
        location: {
          address: 'Old Town, Batumi, Adjara, Georgia',
          coordinates: [41.6510, 41.6185],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-BATUMI-003',
        ownerId: partnerUser._id,
        description: 'Charming restaurant in Batumi Old Town specializing in traditional Adjarian Khachapuri and Georgian classics.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 7 77 88 99',
          email: 'info@batumioldtown.ge'
        },
        services: ['wifi', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 45,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Old Town location', 'Traditional recipes', 'Cozy atmosphere', 'Historic building'],
        socialMedia: {
          instagram: '@batumi_old_town_khachapuri'
        }
      }),
      addVenueInfo({
        name: 'Batumi Beach Restaurant',
        type: 'restaurant',
        category: ['village_food', 'traditional_dishes'],
        location: {
          address: 'Batumi Beach, Batumi, Adjara, Georgia',
          coordinates: [41.6550, 41.6165],
          region: 'Adjara'
        },
        qrCode: 'GP-GE-BATUMI-004',
        ownerId: partnerUser._id,
        description: 'Beachfront restaurant serving fresh seafood and traditional Georgian dishes with direct beach access.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 8 88 99 00',
          email: 'beach@batumi.ge',
          website: 'https://www.batumibeach.ge'
        },
        openingHours: {
          monday: '10:00 - 23:00',
          tuesday: '10:00 - 23:00',
          wednesday: '10:00 - 23:00',
          thursday: '10:00 - 23:00',
          friday: '10:00 - 00:00',
          saturday: '10:00 - 00:00',
          sunday: '10:00 - 23:00'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 80,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Beachfront location', 'Fresh seafood', 'Sea views', 'Beach access'],
        socialMedia: {
          facebook: 'https://facebook.com/batumibeach',
          instagram: '@batumi_beach_restaurant'
        }
      }),
      // Restaurant Kakhi
      addVenueInfo({
        name: 'Restaurant Kakhi',
        type: 'restaurant',
        category: ['traditional_dishes', 'khachapuri', 'village_food'],
        location: {
          address: 'Batumi, Adjara, Georgia',
          coordinates: [41.594038, 41.616767], // GeoJSON format: [longitude, latitude]
          region: 'Adjara'
        },
        qrCode: 'GP-GE-KAKHI-001',
        ownerId: partnerUser._id,
        description: 'Authentic Georgian restaurant serving traditional dishes. Experience the flavors of Adjara region.',
        photos: [],
        isActive: true
      }, {
        contact: {
          phone: '+995 422 9 99 00 11',
          email: 'info@kakhi.ge'
        },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 50,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Traditional Georgian cuisine', 'Adjarian specialties', 'Local favorite'],
        socialMedia: {
          instagram: '@restaurant_kakhi'
        }
      })
    ];

    console.log('\n📍 Creating venues...');
    const venueMap = new Map();
    for (const venueData of venues) {
      const existingVenue = await Venue.findOne({ qrCode: venueData.qrCode });
      if (!existingVenue) {
        const venue = new Venue(venueData);
        await venue.save();
        console.log(`✅ Created venue: ${venue.name} (${venue.category.join(', ')})`);
        venueMap.set(venue.name, venue._id);
      } else {
        console.log(`⏭️  Venue already exists: ${venueData.name}`);
        venueMap.set(existingVenue.name, existingVenue._id);
      }
    }

    // Get venue IDs for restaurant challenges
    const tavaduriVenueId = venueMap.get('Restaurant Tavaduri');
    const kakhiVenueId = venueMap.get('Restaurant Kakhi');
    const batumiCentralMarketVenueId = venueMap.get('Batumi Central Market Restaurant');
    const batumiSeasideWineryVenueId = venueMap.get('Batumi Seaside Winery');
    const batumiOldTownKhachapuriVenueId = venueMap.get('Batumi Old Town Khachapuri');
    const batumiBeachRestaurantVenueId = venueMap.get('Batumi Beach Restaurant');
    const chateauMukhraniVenueId = venueMap.get('Château Mukhrani');
    const adjarianKhachapuriHouseVenueId = venueMap.get('Adjarian Khachapuri House');

    // Create Menu Combo Challenges (different XP for different combos)
    const menuComboChallenges = [
      {
        name: 'Classic Combo: Khachapuri & Wine',
        description: 'Order khachapuri and wine together at any restaurant. Experience the perfect pairing of Georgian bread and wine.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'wine'],
          menuCombo: {
            items: ['khachapuri', 'wine'],
            requiredCount: 2
          }
        },
        reward: {
          type: 'badge',
          value: 'Classic Combo Master'
        },
        xpReward: 100,
        isActive: true
      },
      {
        name: 'Deluxe Combo: Khachapuri, Wine & Salad',
        description: 'Order khachapuri, wine, and a traditional Georgian salad together. A complete Georgian meal experience.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'wine', 'traditional_dishes'],
          menuCombo: {
            items: ['khachapuri', 'wine', 'salad'],
            requiredCount: 3
          }
        },
        reward: {
          type: 'badge',
          value: 'Deluxe Combo Expert'
        },
        xpReward: 150,
        isActive: true
      },
      {
        name: 'Supra Combo: Full Georgian Feast',
        description: 'Order khachapuri, wine, salad, khinkali, and dessert together. Experience a complete Georgian Supra feast.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'wine', 'traditional_dishes', 'desserts'],
          menuCombo: {
            items: ['khachapuri', 'wine', 'salad', 'khinkali', 'dessert'],
            requiredCount: 5
          }
        },
        reward: {
          type: 'badge',
          value: 'Supra Master'
        },
        xpReward: 250,
        isActive: true
      },
      {
        name: 'Wine & Cheese Combo',
        description: 'Order wine and cheese together at any venue. Perfect for wine enthusiasts.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant', 'winery'],
          minStamps: 1,
          categories: ['wine'],
          menuCombo: {
            items: ['wine', 'cheese'],
            requiredCount: 2
          }
        },
        reward: {
          type: 'badge',
          value: 'Wine & Cheese Connoisseur'
        },
        xpReward: 120,
        isActive: true
      },
      {
        name: 'Sweet Combo: Khachapuri & Dessert',
        description: 'Order khachapuri and a traditional Georgian dessert together. End your meal the Georgian way.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'desserts'],
          menuCombo: {
            items: ['khachapuri', 'dessert'],
            requiredCount: 2
          }
        },
        reward: {
          type: 'badge',
          value: 'Sweet Tooth Explorer'
        },
        xpReward: 80,
        isActive: true
      },
      {
        name: 'Premium Combo: Wine Tasting Set',
        description: 'Order a wine tasting set with 3+ wines and cheese platter. For serious wine lovers.',
        type: 'custom',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 1,
          categories: ['wine'],
          menuCombo: {
            items: ['wine_tasting', 'cheese_platter'],
            requiredCount: 2
          }
        },
        reward: {
          type: 'badge',
          value: 'Premium Wine Taster'
        },
        xpReward: 180,
        isActive: true
      }
    ];

    for (const comboData of menuComboChallenges) {
      const existingCombo = await Challenge.findOne({ name: comboData.name });
      if (!existingCombo) {
        const comboChallenge = new Challenge(comboData);
        await comboChallenge.save();
        console.log(`✅ Created menu combo challenge: ${comboChallenge.name} (${comboChallenge.xpReward} XP)`);
      } else {
        console.log(`⏭️  Menu combo challenge already exists: ${comboData.name}`);
      }
    }

    // Create Restaurant-Specific Challenges (different XP for different restaurants)
    const restaurantChallenges = [
      {
        name: 'Restaurant Tavaduri Visit',
        description: 'Visit Restaurant Tavaduri and experience authentic Georgian Tavaduri-style cuisine',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: [],
          requiredVenues: [tavaduriVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Tavaduri Explorer'
        },
        xpReward: 75,
        isActive: true
      },
      {
        name: 'Restaurant Kakhi Experience',
        description: 'Visit Restaurant Kakhi in Batumi and try their famous khachapuri',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['khachapuri'],
          requiredVenues: [kakhiVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Kakhi Explorer'
        },
        xpReward: 90,
        isActive: true
      },
      {
        name: 'Batumi Central Market Discovery',
        description: 'Visit Batumi Central Market Restaurant and explore local flavors',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['traditional_dishes'],
          requiredVenues: [batumiCentralMarketVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Market Explorer'
        },
        xpReward: 85,
        isActive: true
      },
      {
        name: 'Batumi Seaside Winery Visit',
        description: 'Experience wine tasting at Batumi Seaside Winery with beautiful sea views',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['wine'],
          requiredVenues: [batumiSeasideWineryVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Seaside Wine Explorer'
        },
        xpReward: 110,
        isActive: true
      },
      {
        name: 'Batumi Old Town Khachapuri',
        description: 'Try authentic Adjarian Khachapuri at Batumi Old Town Khachapuri restaurant',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['khachapuri'],
          requiredVenues: [batumiOldTownKhachapuriVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Old Town Explorer'
        },
        xpReward: 95,
        isActive: true
      },
      {
        name: 'Batumi Beach Restaurant Experience',
        description: 'Dine at Batumi Beach Restaurant and enjoy Georgian cuisine by the sea',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['traditional_dishes'],
          requiredVenues: [batumiBeachRestaurantVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Beach Explorer'
        },
        xpReward: 100,
        isActive: true
      },
      {
        name: 'Château Mukhrani Wine Experience',
        description: 'Visit the historic Château Mukhrani and experience premium wine tasting',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['wine'],
          requiredVenues: [chateauMukhraniVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Château Explorer'
        },
        xpReward: 150,
        isActive: true
      },
      {
        name: 'Adjarian Khachapuri House Special',
        description: 'Visit Adjarian Khachapuri House and try the famous boat-shaped khachapuri',
        type: 'custom',
        requirements: {
          venueTypes: [],
          minStamps: 1,
          categories: ['khachapuri'],
          requiredVenues: [adjarianKhachapuriHouseVenueId]
        },
        reward: {
          type: 'badge',
          value: 'Adjarian Master'
        },
        xpReward: 105,
        isActive: true
      }
    ];

    for (const restaurantChallenge of restaurantChallenges) {
      // Set the correct venue ID based on challenge name
      let venueId = null;
      if (restaurantChallenge.name.includes('Tavaduri')) {
        venueId = tavaduriVenueId;
      } else if (restaurantChallenge.name.includes('Kakhi')) {
        venueId = kakhiVenueId;
      } else if (restaurantChallenge.name.includes('Central Market')) {
        venueId = batumiCentralMarketVenueId;
      } else if (restaurantChallenge.name.includes('Seaside Winery')) {
        venueId = batumiSeasideWineryVenueId;
      } else if (restaurantChallenge.name.includes('Old Town Khachapuri')) {
        venueId = batumiOldTownKhachapuriVenueId;
      } else if (restaurantChallenge.name.includes('Beach Restaurant')) {
        venueId = batumiBeachRestaurantVenueId;
      } else if (restaurantChallenge.name.includes('Château Mukhrani')) {
        venueId = chateauMukhraniVenueId;
      } else if (restaurantChallenge.name.includes('Adjarian Khachapuri House')) {
        venueId = adjarianKhachapuriHouseVenueId;
      }

      if (venueId) {
        restaurantChallenge.requirements.requiredVenues = [venueId];
        const existingChallenge = await Challenge.findOne({ name: restaurantChallenge.name });
        if (!existingChallenge) {
          const challenge = new Challenge(restaurantChallenge);
          await challenge.save();
          console.log(`✅ Created restaurant challenge: ${challenge.name} (${challenge.xpReward} XP)`);
        } else {
          console.log(`⏭️  Restaurant challenge already exists: ${restaurantChallenge.name}`);
        }
      }
    }

    // Create Special Challenges (Halloween, New Year, etc.)
    const specialChallenges = [
      {
        name: 'Halloween Spooky Feast',
        description: 'Visit any restaurant during Halloween season and order a special spooky-themed Georgian meal. Collect stamps from 3 different venues between October 25 - November 2.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 3,
          categories: ['traditional_dishes']
        },
        reward: {
          type: 'badge',
          value: 'Halloween Explorer'
        },
        xpReward: 200,
        isActive: true,
        isSpecial: true,
        eventType: 'halloween',
        startDate: new Date(new Date().getFullYear(), 9, 25), // October 25
        endDate: new Date(new Date().getFullYear(), 10, 2) // November 2
      },
      {
        name: 'New Year Celebration Challenge',
        description: 'Celebrate the New Year by visiting restaurants and wineries during the holiday season. Collect stamps from 5 venues between December 20 - January 10.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant', 'winery'],
          minStamps: 5,
          categories: ['wine', 'traditional_dishes', 'desserts']
        },
        reward: {
          type: 'badge',
          value: 'New Year Celebrator'
        },
        xpReward: 300,
        isActive: true,
        isSpecial: true,
        eventType: 'new_year',
        startDate: new Date(new Date().getFullYear(), 11, 20), // December 20
        endDate: new Date(new Date().getFullYear() + 1, 0, 10) // January 10
      },
      {
        name: 'Halloween Wine & Dine',
        description: 'Experience a spooky wine tasting during Halloween. Visit 2 wineries and order special Halloween-themed wine pairings.',
        type: 'wine_challenge',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 2,
          categories: ['wine']
        },
        reward: {
          type: 'badge',
          value: 'Halloween Wine Master'
        },
        xpReward: 180,
        isActive: true,
        isSpecial: true,
        eventType: 'halloween',
        startDate: new Date(new Date().getFullYear(), 9, 25),
        endDate: new Date(new Date().getFullYear(), 10, 2)
      },
      {
        name: 'New Year Supra Feast',
        description: 'Complete a full Georgian Supra (feast) during New Year celebrations. Order khachapuri, wine, khinkali, and dessert at any restaurant.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'wine', 'traditional_dishes', 'desserts'],
          menuCombo: {
            items: ['khachapuri', 'wine', 'khinkali', 'dessert'],
            requiredCount: 4
          }
        },
        reward: {
          type: 'badge',
          value: 'New Year Supra Master'
        },
        xpReward: 250,
        isActive: true,
        isSpecial: true,
        eventType: 'new_year',
        startDate: new Date(new Date().getFullYear(), 11, 20),
        endDate: new Date(new Date().getFullYear() + 1, 0, 10)
      }
    ];

    for (const specialData of specialChallenges) {
      const existingSpecial = await Challenge.findOne({ name: specialData.name });
      if (!existingSpecial) {
        const specialChallenge = new Challenge(specialData);
        await specialChallenge.save();
        console.log(`✅ Created special challenge: ${specialChallenge.name} (${specialChallenge.xpReward} XP) - ${specialChallenge.eventType}`);
      } else {
        console.log(`⏭️  Special challenge already exists: ${specialData.name}`);
      }
    }

    // Create Tavaduri Special Menu Combo Challenge
    if (tavaduriVenueId) {
      const tavaduriSpecialMenuChallenge = {
        name: 'Tavaduri Special Menu Combo',
        description: 'Experience Restaurant Tavaduri\'s special menu combo: Order their signature Tavaduri-style khachapuri, traditional wine, and Georgian salad together. A complete authentic Georgian dining experience.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'wine', 'traditional_dishes'],
          requiredVenues: [tavaduriVenueId],
          menuCombo: {
            items: ['tavaduri_khachapuri', 'georgian_wine', 'georgian_salad'],
            requiredCount: 3
          }
        },
        reward: {
          type: 'badge',
          value: 'Tavaduri Special Menu Master'
        },
        xpReward: 200,
        isActive: true,
        isSpecial: false
      };

      const existingTavaduriSpecial = await Challenge.findOne({ name: tavaduriSpecialMenuChallenge.name });
      if (!existingTavaduriSpecial) {
        const challenge = new Challenge(tavaduriSpecialMenuChallenge);
        await challenge.save();
        console.log(`✅ Created Tavaduri special menu combo challenge: ${challenge.name} (${challenge.xpReward} XP)`);
      } else {
        console.log(`⏭️  Tavaduri special menu combo challenge already exists`);
      }
    }

    // Create more venue-specific combo challenges
    const venueComboChallenges = [
      {
        name: 'Château Mukhrani Premium Experience',
        description: 'Visit Château Mukhrani and order their premium wine tasting combo: Premium wine selection with cheese platter and traditional Georgian appetizers.',
        type: 'custom',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 1,
          categories: ['wine'],
          requiredVenues: [chateauMukhraniVenueId],
          menuCombo: {
            items: ['premium_wine_tasting', 'cheese_platter', 'georgian_appetizers'],
            requiredCount: 3
          }
        },
        reward: {
          type: 'badge',
          value: 'Château Premium Explorer'
        },
        xpReward: 250,
        isActive: true,
        isSpecial: false
      },
      {
        name: 'Adjarian Khachapuri House Special',
        description: 'Visit Adjarian Khachapuri House and order their special combo: Authentic Adjarian Khachapuri with local wine and Adjarian salad.',
        type: 'custom',
        requirements: {
          venueTypes: ['restaurant'],
          minStamps: 1,
          categories: ['khachapuri', 'wine', 'traditional_dishes'],
          requiredVenues: [adjarianKhachapuriHouseVenueId],
          menuCombo: {
            items: ['adjarian_khachapuri', 'local_wine', 'adjarian_salad'],
            requiredCount: 3
          }
        },
        reward: {
          type: 'badge',
          value: 'Adjarian Special Master'
        },
        xpReward: 180,
        isActive: true,
        isSpecial: false
      },
      {
        name: 'Batumi Seaside Winery Sunset Combo',
        description: 'Experience a sunset wine tasting at Batumi Seaside Winery. Order wine tasting, seafood appetizers, and enjoy the beautiful sea views.',
        type: 'custom',
        requirements: {
          venueTypes: ['winery'],
          minStamps: 1,
          categories: ['wine'],
          requiredVenues: [batumiSeasideWineryVenueId],
          menuCombo: {
            items: ['wine_tasting', 'seafood_appetizers', 'sunset_experience'],
            requiredCount: 3
          }
        },
        reward: {
          type: 'badge',
          value: 'Seaside Sunset Explorer'
        },
        xpReward: 220,
        isActive: true,
        isSpecial: false
      }
    ];

    for (const venueComboData of venueComboChallenges) {
      // Set the correct venue ID based on challenge name
      let venueId = null;
      if (venueComboData.name.includes('Château Mukhrani')) {
        venueId = chateauMukhraniVenueId;
      } else if (venueComboData.name.includes('Adjarian Khachapuri House')) {
        venueId = adjarianKhachapuriHouseVenueId;
      } else if (venueComboData.name.includes('Batumi Seaside Winery')) {
        venueId = batumiSeasideWineryVenueId;
      }

      if (venueId) {
        venueComboData.requirements.requiredVenues = [venueId];
        const existingVenueCombo = await Challenge.findOne({ name: venueComboData.name });
        if (!existingVenueCombo) {
          const challenge = new Challenge(venueComboData);
          await challenge.save();
          console.log(`✅ Created venue combo challenge: ${challenge.name} (${challenge.xpReward} XP)`);
        } else {
          console.log(`⏭️  Venue combo challenge already exists: ${venueComboData.name}`);
        }
      }
    }

    console.log('\n✅ Seeding completed!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Challenges: ${await Challenge.countDocuments()}`);
    console.log(`   - Venues: ${await Venue.countDocuments()}`);
    console.log(`   - Users: ${await User.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();

