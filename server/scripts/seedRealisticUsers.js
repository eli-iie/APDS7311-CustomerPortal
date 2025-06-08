// APDS7311 - Realistic Database Seeding Script
// This script creates realistic employee and customer accounts for demonstration

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
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

    // Create realistic employee accounts
    const employees = [
      {
        username: 'sarah.chen',
        password: 'SecureManager2025!',
        fullName: 'Sarah Chen',
        role: 'manager',
        department: 'International Payments',
        employeeId: 'MGR001',
        email: 'sarah.chen@securebank.com'
      },
      {
        username: 'michael.rodriguez',
        password: 'AdminSecure2025!',
        fullName: 'Michael Rodriguez',
        role: 'admin',
        department: 'System Administration',
        employeeId: 'ADM001',
        email: 'michael.rodriguez@securebank.com'
      },
      {
        username: 'emily.watson',
        password: 'OfficerPass2025!',
        fullName: 'Emily Watson',
        role: 'employee',
        department: 'Payment Processing',
        employeeId: 'EMP001',
        email: 'emily.watson@securebank.com'
      },
      {
        username: 'david.kim',
        password: 'ClerkSecure2025!',
        fullName: 'David Kim',
        role: 'employee',
        department: 'Payment Verification',
        employeeId: 'EMP002',
        email: 'david.kim@securebank.com'
      },
      {
        username: 'rachel.thompson',
        password: 'AnalystPass2025!',
        fullName: 'Rachel Thompson',
        role: 'employee',
        department: 'Risk Analysis',
        employeeId: 'EMP003',
        email: 'rachel.thompson@securebank.com'
      },
      {
        username: 'james.anderson',
        password: 'SupervisorSecure2025!',
        fullName: 'James Anderson',
        role: 'manager',
        department: 'Compliance',
        employeeId: 'MGR002',
        email: 'james.anderson@securebank.com'
      },
      {
        username: 'lisa.patel',
        password: 'LeadSecure2025!',
        fullName: 'Lisa Patel',
        role: 'employee',
        department: 'SWIFT Operations',
        employeeId: 'EMP004',
        email: 'lisa.patel@securebank.com'
      },
      {
        username: 'robert.johnson',
        password: 'SpecialistPass2025!',
        fullName: 'Robert Johnson',
        role: 'employee',
        department: 'Anti-Money Laundering',
        employeeId: 'EMP005',
        email: 'robert.johnson@securebank.com'
      }
    ];    // Create realistic customer accounts
    const customers = [
      {
        fullName: 'Alexandra Mitchell',
        idNumber: '8501015800080',
        accountNumber: '4001234567',
        username: 'alexandra.mitchell',
        password: 'CustomerSecure2025!'
      },
      {
        fullName: 'Benjamin Carter',
        idNumber: '9003128900081',
        accountNumber: '4009876543',
        username: 'benjamin.carter',
        password: 'BusinessPass2025!'
      },
      {
        fullName: 'Catherine Williams',
        idNumber: '7809205600082',
        accountNumber: '4005555666',
        username: 'catherine.williams',
        password: 'TradeSecure2025!'
      },
      {
        fullName: 'Daniel Thompson',
        idNumber: '8712094800083',
        accountNumber: '4007777888',
        username: 'daniel.thompson',
        password: 'PremiumPass2025!'
      },
      {
        fullName: 'Emma Rodriguez',
        idNumber: '9204156700084',
        accountNumber: '4003333444',
        username: 'emma.rodriguez',
        password: 'CorporateSecure2025!'
      },
      {
        fullName: 'Franklin Davis',
        idNumber: '8506089500085',
        accountNumber: '4008888999',
        username: 'franklin.davis',
        password: 'ImporterPass2025!'
      },
      {
        fullName: 'Grace Chen',
        idNumber: '9105127800086',
        accountNumber: '4006666777',
        username: 'grace.chen',
        password: 'ExporterSecure2025!'
      },
      {
        fullName: 'Henry Wilson',
        idNumber: '8408203400087',
        accountNumber: '4004444555',
        username: 'henry.wilson',
        password: 'TechSecure2025!'
      },
      {
        fullName: 'Isabella Garcia',
        idNumber: '9007144200088',
        accountNumber: '4002222333',
        username: 'isabella.garcia',
        password: 'RetailPass2025!'
      },
      {
        fullName: 'Jackson Brown',
        idNumber: '8711078600089',
        accountNumber: '4001111222',
        username: 'jackson.brown',
        password: 'ManufacturerSecure2025!'
      }
    ];    // Seed employees
    console.log('\n👥 Creating employee accounts...');
    for (const empData of employees) {
      // Create employee (password will be hashed by the model's pre-save middleware)
      const employee = new Employee({
        ...empData
      });

      await employee.save();
      console.log(`👤 Created employee: ${empData.fullName} (${empData.username}) - ${empData.role}`);
    }    // Seed customers
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
