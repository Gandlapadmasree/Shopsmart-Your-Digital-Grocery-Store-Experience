// shopsmart-backend/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv'); // <-- ADD THIS LINE

// Use Node DNS and set fallback public DNS servers for SRV lookups if system DNS refuses
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Custom DNS servers set for SRV resolution:', dns.getServers());
} catch (e) {
  console.warn('Could not set custom DNS servers:', e && e.message);
}

// Load env vars (this must be done before using process.env)
// It will look for .env in the root of your backend project
dotenv.config({ path: './.env' }); // <-- ADD THIS LINE

// Now, get the MONGO_URI from process.env
const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    console.log('--- DB CONNECTION STARTUP ENV CHECK ---');
    console.log('Attempting to connect with MONGO_URI:', db ? db.replace(/:(.*)@/, ':*****@') : db);
    console.log('--------------------------------');

    await mongoose.connect(db, {
      // Let Mongoose use its defaults (Mongoose 6+ sets the proper parser/topology)
      // Add timeouts and force IPv4 where needed to avoid DNS/network edge cases
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message);
    if (err && err.stack) console.error(err.stack);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;