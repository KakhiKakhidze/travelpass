const mongoose = require('mongoose');
require('dotenv').config();

const Venue = require('../models/Venue');
const User = require('../models/User');

const updateVenues = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpass');
    console.log('✅ Connected to MongoDB');

    const partnerUser = await User.findOne({ email: 'partner@travelpass.com' });
    if (!partnerUser) {
      console.error('Partner user not found');
      process.exit(1);
    }

    // Helper function to add venue info
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

    const venueUpdates = {
      'GP-GE-WINE-001': {
        contact: { phone: '+995 32 2 55 55 55', email: 'info@mukhrani.ge', website: 'https://www.mukhrani.ge' },
        openingHours: { monday: '10:00 - 18:00', tuesday: '10:00 - 18:00', wednesday: '10:00 - 18:00', thursday: '10:00 - 18:00', friday: '10:00 - 18:00', saturday: '10:00 - 18:00', sunday: '10:00 - 18:00' },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$$',
        capacity: 50,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Historic castle', 'Qvevri wine production', 'Wine museum', 'Scenic views'],
        socialMedia: { facebook: 'https://facebook.com/mukhrani', instagram: '@mukhrani_wine' }
      },
      'GP-GE-WINE-002': {
        contact: { phone: '+995 351 2 22 33 44', email: 'info@telaviwine.ge', website: 'https://www.telaviwine.ge' },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'credit_cards', 'english_menu'],
        priceRange: '$$',
        capacity: 40,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Qvevri wine making', 'Traditional marani', 'Wine education tours'],
        socialMedia: { instagram: '@telavi_wine_cellar' }
      },
      'GP-GE-WINE-003': {
        contact: { phone: '+995 351 5 55 66 77', email: 'kindzmarauli@wine.ge' },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 35,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Kindzmarauli wine production', 'Traditional Qvevri', 'Vineyard tours'],
        socialMedia: { facebook: 'https://facebook.com/kindzmarauli' }
      },
      'GP-GE-KHACH-001': {
        contact: { phone: '+995 32 2 99 88 77', email: 'info@cafelittera.ge', website: 'https://www.cafelittera.ge' },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 60,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Adjarian Khachapuri specialty', 'Traditional Georgian cuisine', 'Cozy atmosphere'],
        socialMedia: { facebook: 'https://facebook.com/cafelittera', instagram: '@cafe_littera' }
      },
      'GP-GE-KHACH-002': {
        contact: { phone: '+995 32 2 99 11 22', email: 'reservations@barbarestan.ge', website: 'https://www.barbarestan.ge' },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'credit_cards', 'english_menu', 'russian_menu', 'wheelchair_accessible'],
        priceRange: '$$$',
        capacity: 80,
        languages: ['georgian', 'english', 'russian', 'french'],
        specialFeatures: ['Award-winning cuisine', 'Historic recipes', 'Fine dining', 'Wine pairing'],
        socialMedia: { facebook: 'https://facebook.com/barbarestan', instagram: '@barbarestan', tripadvisor: 'https://tripadvisor.com/barbarestan' }
      },
      'GP-GE-KHACH-003': {
        contact: { phone: '+995 32 2 11 22 33', email: 'info@pasanauri.ge' },
        services: ['wifi', 'indoor_seating', 'credit_cards', 'cash_only', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 45,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Megrelian Khachapuri', 'Local favorite', 'Authentic recipes'],
        socialMedia: { instagram: '@pasanauri_tbilisi' }
      },
      'GP-GE-VILLAGE-001': {
        contact: { phone: '+995 351 7 77 88 99', email: 'sighnaghi@guesthouse.ge' },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'cash_only', 'english_menu'],
        priceRange: '$$',
        capacity: 25,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Guesthouse accommodation', 'Traditional cooking', 'Mountain views', 'Family atmosphere'],
        socialMedia: { facebook: 'https://facebook.com/sighnaghiguesthouse' }
      },
      'GP-GE-VILLAGE-002': {
        contact: { phone: '+995 32 3 33 44 55', email: 'info@mtskhetafamily.ge' },
        services: ['wifi', 'parking', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 35,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Family recipes', 'Home-style cooking', 'Near historic sites'],
        socialMedia: { instagram: '@mtskheta_family' }
      },
      'GP-GE-VILLAGE-003': {
        contact: { phone: '+995 32 4 44 55 66', email: 'kazbegi@mountain.ge' },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'heating', 'credit_cards', 'cash_only', 'english_menu'],
        priceRange: '$$',
        capacity: 30,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Mountain cuisine', 'Guesthouse', 'Hiking base', 'Mountain views'],
        socialMedia: { instagram: '@kazbegi_mountain_kitchen' }
      },
      'GP-GE-VILLAGE-004': {
        contact: { phone: '+995 370 2 11 33 44', email: 'info@goritradhouse.ge' },
        services: ['wifi', 'indoor_seating', 'credit_cards', 'cash_only', 'english_menu', 'russian_menu'],
        priceRange: '$',
        capacity: 40,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Traditional house setting', 'Lobio specialty', 'Home cooking'],
        socialMedia: { facebook: 'https://facebook.com/goritradhouse' }
      },
      'GP-GE-WINE-004': {
        contact: { phone: '+995 422 2 77 88 99', email: 'info@batumiwine.ge', website: 'https://www.batumiwine.ge' },
        openingHours: { monday: '11:00 - 20:00', tuesday: '11:00 - 20:00', wednesday: '11:00 - 20:00', thursday: '11:00 - 20:00', friday: '11:00 - 22:00', saturday: '11:00 - 22:00', sunday: '11:00 - 20:00' },
        services: ['wine_tasting', 'tours', 'parking', 'wifi', 'reservations', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 45,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Sea views', 'Adjarian wines', 'Coastal location', 'Sunset views'],
        socialMedia: { facebook: 'https://facebook.com/batumiwine', instagram: '@batumi_wine_house' }
      },
      'GP-GE-KHACH-004': {
        contact: { phone: '+995 422 2 11 22 33', email: 'info@adjariankhachapuri.ge' },
        services: ['wifi', 'parking', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 50,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Adjarian Khachapuri specialty', 'Traditional preparation', 'Local favorite'],
        socialMedia: { instagram: '@adjarian_khachapuri_house', tripadvisor: 'https://tripadvisor.com/adjariankhachapuri' }
      },
      'GP-GE-VILLAGE-005': {
        contact: { phone: '+995 422 3 33 44 55', email: 'seafood@batumi.ge' },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu'],
        priceRange: '$$',
        capacity: 55,
        languages: ['georgian', 'english', 'russian'],
        specialFeatures: ['Fresh seafood', 'Black Sea cuisine', 'Traditional recipes', 'Old Batumi location'],
        socialMedia: { facebook: 'https://facebook.com/batumiseafood', instagram: '@batumi_seafood' }
      },
      'GP-GE-KHACH-005': {
        contact: { phone: '+995 422 4 44 55 66', email: 'boulevard@batumi.ge', website: 'https://www.batumiboulevard.ge' },
        openingHours: { monday: '09:00 - 23:00', tuesday: '09:00 - 23:00', wednesday: '09:00 - 23:00', thursday: '09:00 - 23:00', friday: '09:00 - 00:00', saturday: '09:00 - 00:00', sunday: '09:00 - 23:00' },
        services: ['wifi', 'parking', 'reservations', 'indoor_seating', 'outdoor_seating', 'credit_cards', 'english_menu', 'russian_menu', 'air_conditioning'],
        priceRange: '$$',
        capacity: 70,
        languages: ['georgian', 'english', 'russian', 'german'],
        specialFeatures: ['Seaside location', 'Sea views', 'Boulevard setting', 'Breakfast menu'],
        socialMedia: { facebook: 'https://facebook.com/batumiboulevard', instagram: '@batumi_boulevard', tripadvisor: 'https://tripadvisor.com/batumiboulevard' }
      }
    };

    console.log('\n📝 Updating venues with additional information...');
    for (const [qrCode, updateData] of Object.entries(venueUpdates)) {
      const venue = await Venue.findOne({ qrCode });
      if (venue) {
        await Venue.updateOne({ qrCode }, { $set: updateData });
        console.log(`✅ Updated: ${venue.name}`);
      } else {
        console.log(`⏭️  Venue not found: ${qrCode}`);
      }
    }

    console.log('\n✅ Venue updates completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Update error:', error);
    process.exit(1);
  }
};

updateVenues();

