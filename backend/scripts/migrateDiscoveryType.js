const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function migrateDiscoveryType() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpass', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Update all users with 'gastronomic' to 'food'
    const result = await User.updateMany(
      { discoveryType: 'gastronomic' },
      { $set: { discoveryType: 'food' } }
    );

    console.log(`✅ Migrated ${result.modifiedCount} users from 'gastronomic' to 'food'`);

    // Also set default for users without discoveryType
    const defaultResult = await User.updateMany(
      { discoveryType: { $exists: false } },
      { $set: { discoveryType: 'food' } }
    );

    console.log(`✅ Set default 'food' for ${defaultResult.modifiedCount} users without discoveryType`);

    await mongoose.disconnect();
    console.log('✅ Migration completed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateDiscoveryType();

