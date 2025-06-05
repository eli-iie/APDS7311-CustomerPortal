require("dotenv").config();
const mongoose = require('mongoose');

console.log('Testing database connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Database connected successfully');
  
  // Test if Employee collection exists
  const Employee = require('./models/Employee');
  return Employee.findOne({ username: 'admin.user' });
})
.then((employee) => {
  if (employee) {
    console.log('✅ Found admin.user employee:', employee.username, 'Role:', employee.role);
  } else {
    console.log('❌ admin.user employee not found in database');
  }
  process.exit(0);
})
.catch(err => {
  console.log('❌ Database connection failed:', err.message);
  process.exit(1);
});
