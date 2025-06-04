const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('./models/Employee');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for employee fix');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const fixEmployeePasswords = async () => {
  try {
    await connectDB();
    
    console.log('🔧 Fixing employee passwords...');
    
    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employees');

    // Pre-registered employees with proper password hashing
    const employeesData = [
      {
        employeeId: 'EMP001',
        username: 'john.smith',
        fullName: 'John Smith',
        password: 'SecurePass123!',
        department: 'International Payments',
        role: 'employee'
      },
      {
        employeeId: 'EMP002',
        username: 'sarah.jones',
        fullName: 'Sarah Jones',
        password: 'SecurePass123!',
        department: 'International Payments', 
        role: 'employee'
      },
      {
        employeeId: 'EMP003',
        username: 'admin.user',
        fullName: 'Admin User',
        password: 'AdminPass123!',
        department: 'IT Security',
        role: 'admin'
      },
      {
        employeeId: 'MGR001',
        username: 'manager.swift',
        fullName: 'SWIFT Manager',
        password: 'ManagerPass123!',
        department: 'International Payments',
        role: 'manager'
      }
    ];

    // Create employees one by one to trigger pre-save middleware
    const createdEmployees = [];
    for (const empData of employeesData) {
      const employee = new Employee(empData);
      await employee.save(); // This will trigger the pre-save middleware
      createdEmployees.push(employee);
      console.log(`✅ Created and hashed password for: ${employee.username}`);
    }

    console.log(`\n✅ Successfully created ${createdEmployees.length} employees with hashed passwords`);
    
    // Verify passwords are hashed
    console.log('\n🔍 Verifying password hashing...');
    for (const emp of createdEmployees) {
      const isHashed = emp.password.startsWith('$2');
      console.log(`- ${emp.username}: ${isHashed ? '✅ Hashed' : '❌ Not hashed'} (${emp.password.substring(0, 10)}...)`);
    }
    
    await mongoose.disconnect();
    console.log('\n🎉 Employee password fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing employee passwords:', error);
    process.exit(1);
  }
};

fixEmployeePasswords();
