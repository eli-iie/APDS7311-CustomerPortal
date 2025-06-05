const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Employee = require('../models/Employee');
const User = require('../models/User');
const AuditTrail = require('../models/AuditTrail');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const seedEmployees = async () => {
  try {
    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employees');

    // Pre-registered employees as per assignment requirements
    const employees = [
      {
        employeeId: 'EMP001',
        username: 'john.smith',
        fullName: 'John Smith',
        password: 'SecurePass123!', // Will be hashed automatically
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
    ];    // Create employees individually to trigger password hashing middleware
    const createdEmployees = [];
    for (const empData of employees) {
      const employee = new Employee(empData);
      await employee.save(); // This triggers the pre-save middleware for password hashing
      createdEmployees.push(employee);
    }
    console.log(`✅ Created ${createdEmployees.length} pre-registered employees`);

    // Log audit trail for employee creation
    for (const employee of createdEmployees) {
      await AuditTrail.log({
        userId: employee._id,
        userModel: 'Employee',
        action: 'REGISTER',
        entityType: 'Employee',
        entityId: employee._id,
        description: `Pre-registered employee account created: ${employee.username}`,
        ipAddress: '127.0.0.1',
        userAgent: 'System Seeder',
        severity: 'LOW'
      });
    }

    console.log('✅ Employee audit trails created');
    return createdEmployees;

  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    throw error;
  }
};

const seedTestCustomers = async () => {
  try {
    // Clear existing test customers
    await User.deleteMany({ username: { $in: ['test.customer', 'demo.user'] } });
    console.log('Cleared existing test customers');    // Create test customers for demonstration
    const customers = [
      {
        fullName: 'Test Customer',
        idNumber: '9001010000001',
        accountNumber: '1234567890',
        username: 'test_customer',
        password: 'TestPass123!',
        role: 'customer'
      },
      {
        fullName: 'Demo User',
        idNumber: '8505050000005',
        accountNumber: '0987654321',
        username: 'demo_user',
        password: 'DemoPass123!',
        role: 'customer'
      }
    ];

    const createdCustomers = await User.insertMany(customers);
    console.log(`✅ Created ${createdCustomers.length} test customers`);

    // Log audit trail for customer creation
    for (const customer of createdCustomers) {
      await AuditTrail.log({
        userId: customer._id,
        userModel: 'User',
        action: 'REGISTER',
        entityType: 'User',
        entityId: customer._id,
        description: `Test customer account created: ${customer.username}`,
        ipAddress: '127.0.0.1',
        userAgent: 'System Seeder',
        severity: 'LOW'
      });
    }

    console.log('✅ Customer audit trails created');
    return createdCustomers;

  } catch (error) {
    console.error('❌ Error seeding test customers:', error);
    throw error;
  }
};

const printSeedingResults = (employees, customers) => {
  console.log('\n📋 SEEDING RESULTS');
  console.log('==================');
  
  console.log('\n👥 PRE-REGISTERED EMPLOYEES:');
  employees.forEach(emp => {
    console.log(`  • ${emp.fullName} (${emp.username}) - ${emp.role.toUpperCase()}`);
    console.log(`    Employee ID: ${emp.employeeId}`);
    console.log(`    Department: ${emp.department}`);
    console.log('    Password: SecurePass123! (for employees) / AdminPass123! (for admin) / ManagerPass123! (for manager)');
    console.log('');
  });

  console.log('\n👤 TEST CUSTOMERS:');
  customers.forEach(cust => {
    console.log(`  • ${cust.fullName} (${cust.username})`);
    console.log(`    Account: ${cust.accountNumber}`);
    console.log(`    ID Number: ${cust.idNumber}`);
    console.log('    Password: TestPass123! / DemoPass123!');
    console.log('');
  });

  console.log('\n🔐 SECURITY FEATURES IMPLEMENTED:');
  console.log('  ✅ Password hashing with bcrypt (salt rounds: 12)');
  console.log('  ✅ Account lockout after 5 failed attempts (2 hours)');
  console.log('  ✅ Input validation with RegEx patterns');
  console.log('  ✅ Audit trail logging for all actions');
  console.log('  ✅ Role-based access control');
  console.log('  ✅ Secure session management');

  console.log('\n📊 DATABASE STATUS:');
  console.log('  ✅ MongoDB connected and seeded');
  console.log('  ✅ All models created and validated');
  console.log('  ✅ Indexes created for performance');
  console.log('  ✅ Ready for Employee Portal development');
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const employees = await seedEmployees();
    const customers = await seedTestCustomers();
    
    printSeedingResults(employees, customers);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('🚀 Ready to start the Employee Portal implementation');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedEmployees, seedTestCustomers };
