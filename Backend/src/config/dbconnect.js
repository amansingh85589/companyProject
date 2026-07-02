const mongoose = require('mongoose');

// ---------------------------------------------
// DB CONNECT
// Establishes the Mongoose connection using MONGODB from .env.
// Called once from index.js on server startup.
// ---------------------------------------------
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); 
  }
};

module.exports = dbConnect;