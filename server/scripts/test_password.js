const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Employee = require('./models/Employee');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const testPasswordHash = async () => {
  try {
    await connectDB();
    
    const adminUser = await Employee.findOne({ username: 'admin.user' });
    if (adminUser) {
      console.log('Testing password for admin.user...');
      console.log('Stored password:', adminUser.password);
      console.log('Is hashed?', adminUser.password.startsWith('$2'));
      
      const testPassword = 'AdminPass123!';
      console.log('Testing with password:', testPassword);
      
      // Test password comparison
      const isMatch = await adminUser.comparePassword(testPassword);
      console.log('Password match result:', isMatch);
      
      // Test direct bcrypt comparison
      const directMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Direct bcrypt match:', directMatch);
      
      // If password is not hashed, let's hash it manually
      if (!adminUser.password.startsWith('$2')) {
        console.log('\nPassword is not hashed! Re-hashing...');
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        console.log('New hash:', hashedPassword.substring(0, 20) + '...');
        
        // Update the password
        adminUser.password = hashedPassword;
        await adminUser.save();
        console.log('✅ Password updated and hashed');
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

testPasswordHash();
