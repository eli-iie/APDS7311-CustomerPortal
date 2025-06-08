// APDS7311 - Database State Check Script
// This script checks the current state of employees and customers in the database

const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const User = require('../models/User');
require('dotenv').config();

const checkDatabaseState = async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('📍 MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for state check');

    // Check employees
    console.log('👥 Checking employees...');
    const employeeCount = await Employee.countDocuments();
    console.log(`\n👥 Current Employees in Database: ${employeeCount}`);
    
    if (employeeCount > 0) {
      console.log('\n📋 Existing Employees:');
      const employees = await Employee.find({}, 'username fullName role department').lean();
      employees.forEach(emp => {
        console.log(`  • ${emp.fullName} (${emp.username}) - ${emp.role} - ${emp.department}`);
      });
    }

    // Check customers
    console.log('🏢 Checking customers...');
    const customerCount = await User.countDocuments();
    console.log(`\n🏢 Current Customers in Database: ${customerCount}`);
    
    if (customerCount > 0) {
      console.log('\n📋 Existing Customers:');
      const customers = await User.find({}, 'username fullName accountNumber').lean();
      customers.forEach(cust => {
        console.log(`  • ${cust.fullName} (${cust.username}) - Account: ${cust.accountNumber}`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 SUMMARY:`);
    console.log(`   Employees: ${employeeCount}`);
    console.log(`   Customers: ${customerCount}`);
    console.log(`   Total Users: ${employeeCount + customerCount}`);
    
    if (employeeCount === 0 && customerCount === 0) {
      console.log('\n💡 Database is empty - ready for seeding!');
    } else {
      console.log('\n⚠️  Database contains existing data');
      console.log('   Consider backing up or clearing before seeding new realistic data');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('📋 Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run check
console.log('🔍 Checking current database state...');
checkDatabaseState();
