const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 30000,  // Sets the connection timeout to 30 seconds
      socketTimeoutMS: 30000,   // Sets the socket timeout to 30 seconds
      serverSelectionTimeoutMS: 60000,// Optional: Timeout for server selection
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
