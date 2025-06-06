const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/customer-portal', {
      // Remove deprecated options as they are now defaults in Mongoose 6+
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('📤 MongoDB disconnected');
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('📤 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

module.exports = connectDB;
