const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('../models/Employee');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const testEmployees = async () => {
  try {
    console.log('Starting employee check...');
    await connectDB();
    
    console.log('Checking employees in database...');
    const employees = await Employee.find({});
    console.log(`Found ${employees.length} employees:`);
    
    employees.forEach(emp => {
      console.log(`- ${emp.username} (${emp.fullName}) - Role: ${emp.role} - Active: ${emp.isActive}`);
    });
    
    // Check specific employee
    const adminUser = await Employee.findOne({ username: 'admin.user' });
    if (adminUser) {
      console.log('\nFound admin.user:');
      console.log('- Username:', adminUser.username);
      console.log('- Full Name:', adminUser.fullName);
      console.log('- Role:', adminUser.role);
      console.log('- Active:', adminUser.isActive);
      console.log('- Password hash:', adminUser.password.substring(0, 20) + '...');
    } else {
      console.log('\n❌ admin.user not found!');
    }
    
    await mongoose.disconnect();
    console.log('Check completed');
  } catch (error) {
    console.error('Error:', error);
  }
};

testEmployees();
