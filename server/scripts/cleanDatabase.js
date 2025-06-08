// APDS7311 - Database Cleanup Script
// This script clears all existing data before seeding fresh accounts

const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Payment = require('../models/Payment');
const AuditTrail = require('../models/AuditTrail');
require('dotenv').config();

const cleanDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for cleanup');

    console.log('🧹 Starting database cleanup...');

    // Clear all collections
    await Employee.deleteMany({});
    console.log('✅ Cleared all employees');

    await User.deleteMany({});
    console.log('✅ Cleared all customers');

    await Payment.deleteMany({});
    console.log('✅ Cleared all payments');

    await AuditTrail.deleteMany({});
    console.log('✅ Cleared all audit trails');

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('📋 Database is now clean and ready for fresh seeding.');

  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run cleanup
console.log('🗑️  Starting database cleanup...');
cleanDatabase();
