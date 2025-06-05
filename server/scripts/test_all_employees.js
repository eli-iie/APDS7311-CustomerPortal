require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

async function testAllEmployees() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const employees = await Employee.find({});
    console.log(`\nFound ${employees.length} employees in database:\n`);
    
    for (const employee of employees) {
      console.log(`=== Testing Employee: ${employee.username} ===`);
      console.log(`Full Name: ${employee.fullName}`);
      console.log(`Role: ${employee.role}`);
      console.log(`Department: ${employee.department}`);
      console.log(`Password hash: ${employee.password.substring(0, 20)}...`);
      
      // Test all possible passwords based on the seeding script
      const testPasswords = [
        'SecurePass123!',  // Standard employee password
        'AdminPass123!',   // Admin password  
        'ManagerPass123!'  // Manager password
      ];
      
      console.log('Testing passwords:');
      for (const pwd of testPasswords) {
        try {
          const isMatch = await employee.comparePassword(pwd);
          console.log(`  "${pwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        } catch (error) {
          console.log(`  "${pwd}": ERROR - ${error.message}`);
        }
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testAllEmployees();
