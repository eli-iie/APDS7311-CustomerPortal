// Test script to verify all modules can be loaded without errors
require('dotenv').config();

console.log('🔍 Testing module imports...');

try {
  // Test database connection
  console.log('✅ Testing database connection...');
  require('./config/db');
  
  // Test security config
  console.log('✅ Testing security configuration...');
  require('./config/security');
  
  // Test models
  console.log('✅ Testing models...');
  require('./models/User');
  require('./models/Employee');
  require('./models/Payment');
  require('./models/AuditTrail');
  
  // Test routes
  console.log('✅ Testing routes...');
  require('./routes/authRoutes');
  require('./routes/payment');
  require('./routes/employeeRoutes');
  
  // Test controllers
  console.log('✅ Testing controllers...');
  require('./controllers/authController');
  
  console.log('🎉 All modules loaded successfully!');
  console.log('✅ No critical import errors found');
  
} catch (error) {
  console.error('❌ Module loading error:', error.message);
  console.error('📍 Stack trace:', error.stack);
  process.exit(1);
}
