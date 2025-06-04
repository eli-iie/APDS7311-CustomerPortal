require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

async function testPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const employee = await Employee.findOne({ username: 'admin.user' });
    if (!employee) {
      console.log('Employee not found');
      return;
    }
    
    console.log('Employee found:', employee.username);
    console.log('Password hash:', employee.password.substring(0, 20) + '...');
    
    // Test password comparison
    const passwords = ['AdminPass2024!', 'admin123', 'password123'];
    
    for (const pwd of passwords) {
      try {
        const isMatch = await employee.comparePassword(pwd);
        console.log(`Password "${pwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
      } catch (error) {
        console.log(`Password "${pwd}": ERROR -`, error.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testPassword();
