const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please create a .env file in the backend directory.');
  console.error('   You can copy .env.example and update the values.\n');
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/stamps', require('./routes/stamps'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/partner', require('./routes/partner'));
app.use('/api/taste', require('./routes/taste'));

// New traveler community routes
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/social', require('./routes/social'));
app.use('/api/users', require('./routes/users'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/comments', require('./routes/comments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : {}
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpass';
const isAtlas = mongoURI.includes('mongodb+srv') || mongoURI.includes('atlas');

console.log(`🔌 Connecting to MongoDB${isAtlas ? ' Atlas' : ' (local)'}...`);
if (isAtlas) {
  // Mask credentials in log
  const maskedURI = mongoURI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@');
  console.log(`   URI: ${maskedURI}`);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 3050;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.code === 8000 || err.codeName === 'AtlasError') {
      console.error('\n💡 Authentication failed. Possible issues:');
      console.error('   1. Check your MongoDB Atlas username and password');
      console.error('   2. Verify your IP is whitelisted in Atlas Network Access');
      console.error('   3. Check if the database user exists and has correct permissions');
      console.error('   4. To use local MongoDB, remove MONGODB_URI from your .env file');
      console.error('\n   To use local MongoDB instead, set:');
      console.error('   MONGODB_URI=mongodb://localhost:27017/travelpass');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Connection refused. Make sure MongoDB is running:');
      console.error('   - Local: Start MongoDB service');
      console.error('   - Docker: docker run -d -p 27017:27017 mongo');
    }
    process.exit(1);
  });

module.exports = app;

