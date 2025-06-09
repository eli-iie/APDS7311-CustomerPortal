// APDS7311 - Realistic Database Seeding Script
// This script creates realistic employee and customer accounts for demonstration

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { employees, customers } = require('../tests/seed-data');
require('dotenv').config();

const seedRealisticUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for realistic data seeding');

    // Clear existing data (for development only)
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing employees and customers');

    // Seed employees
    console.log('\n👥 Creating employee accounts...');
    for (const empData of employees) {
      // Create employee (password will be hashed by the model's pre-save middleware)
      const employee = new Employee({
        ...empData
      });

      await employee.save();
      console.log(`👤 Created employee: ${empData.fullName} (${empData.username}) - ${empData.role}`);
    }

    // Seed customers
    console.log('\n🏢 Creating customer accounts...');
    for (const custData of customers) {
      // Create customer (password will be hashed by the model's pre-save middleware)
      const customer = new User({
        ...custData
      });

      await customer.save();
      console.log(`🏢 Created customer: ${custData.fullName} (${custData.username})`);
    }

    console.log('\n🎉 Realistic database seeding completed successfully!');
    console.log('\n📋 Employee Login Credentials:');
    console.log('=====================================');
    employees.forEach(emp => {
      console.log(`${emp.role.toUpperCase().padEnd(8)} | ${emp.fullName.padEnd(20)} | ${emp.username.padEnd(20)} | ${emp.password}`);
    });
    
    console.log('\n🏢 Customer Login Credentials:');
    console.log('=====================================');
    customers.forEach(cust => {
      console.log(`CUSTOMER | ${cust.fullName.padEnd(20)} | ${cust.username.padEnd(20)} | ${cust.password}`);
    });
    console.log('=====================================\n');

    console.log('✨ Ready for testing with realistic user accounts!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run seeding
console.log('🌱 Starting realistic database seeding...');
console.log('📊 This will create 8 employees and 10 customers with realistic names');
seedRealisticUsers();
