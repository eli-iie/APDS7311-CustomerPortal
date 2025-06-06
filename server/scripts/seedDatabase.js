const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
const AuditTrail = require('../models/AuditTrail');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    await AuditTrail.deleteMany({});

    console.log('📝 Cleared existing data');

    // Create customer accounts
    const customers = [
      {
        fullName: 'Demo User',
        idNumber: '8505050000005',
        accountNumber: '0987654321',
        username: 'demo_user',
        password: await bcrypt.hash('DemoPass123!', 12),
        role: 'customer',
        isActive: true,
        createdAt: new Date()
      },
      {
        fullName: 'Test Customer',
        idNumber: '9001010000001',
        accountNumber: '1234567890',
        username: 'test_customer',
        password: await bcrypt.hash('TestPass123!', 12),
        role: 'customer',
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Create employee accounts
    const employees = [
      {
        fullName: 'John Smith',
        idNumber: '8001010000001',
        username: 'john.smith',
        password: await bcrypt.hash('SecurePass123!', 12),
        employeeId: 'EMP001',
        department: 'International Payments',
        role: 'employee',
        isActive: true,
        createdAt: new Date()
      },
      {
        fullName: 'Sarah Jones',
        idNumber: '8502020000002',
        username: 'sarah.jones',
        password: await bcrypt.hash('SecurePass123!', 12),
        employeeId: 'EMP002',
        department: 'International Payments',
        role: 'employee',
        isActive: true,
        createdAt: new Date()
      },
      {
        fullName: 'Admin User',
        idNumber: '8003030000003',
        username: 'admin.user',
        password: await bcrypt.hash('AdminPass123!', 12),
        employeeId: 'EMP003',
        department: 'IT Security',
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      },
      {
        fullName: 'SWIFT Manager',
        idNumber: '8004040000004',
        username: 'manager.swift',
        password: await bcrypt.hash('ManagerPass123!', 12),
        employeeId: 'MGR001',
        department: 'International Payments',
        role: 'manager',
        isActive: true,
        createdAt: new Date()
      }
    ];

    // Insert customer accounts
    const insertedCustomers = await User.insertMany(customers);
    console.log(`✅ Created ${insertedCustomers.length} customer accounts`);

    // Insert employee accounts
    const insertedEmployees = await Employee.insertMany(employees);
    console.log(`✅ Created ${insertedEmployees.length} employee accounts`);

    // Create audit trail entries for account creation
    const auditEntries = [
      ...insertedCustomers.map(customer => ({
        userId: customer._id,
        userType: 'customer',
        action: 'account_created',
        details: `Customer account created for ${customer.fullName}`,
        ipAddress: '127.0.0.1',
        userAgent: 'System Seeding Script',
        createdAt: new Date()
      })),
      ...insertedEmployees.map(employee => ({
        userId: employee._id,
        userType: 'employee',
        action: 'account_created',
        details: `Employee account created for ${employee.fullName}`,
        ipAddress: '127.0.0.1',
        userAgent: 'System Seeding Script',
        createdAt: new Date()
      }))
    ];

    await AuditTrail.insertMany(auditEntries);
    console.log(`✅ Created ${auditEntries.length} audit trail entries`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Seeded Accounts Summary:');
    console.log('==========================');
    console.log('\n👥 Customer Accounts:');
    customers.forEach(customer => {
      console.log(`   - ${customer.fullName} (${customer.username})`);
    });
    console.log('\n👔 Employee Accounts:');
    employees.forEach(employee => {
      console.log(`   - ${employee.fullName} (${employee.username}) - ${employee.role}`);
    });

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();