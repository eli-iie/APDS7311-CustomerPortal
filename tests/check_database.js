const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Payment = require('./server/models/Payment');
    const User = require('./server/models/User');
    
    // Check all payments
    console.log('\n=== PAYMENTS CHECK ===');
    const payments = await Payment.find({});
    console.log(`Total payments: ${payments.length}`);
    
    payments.forEach((p, index) => {
      console.log(`${index + 1}. ID: ${p._id}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Amount: ${p.amount} ${p.currency}`);
      console.log(`   Reference: ${p.referenceNumber}`);
      console.log(`   Customer ID: ${p.customerId}`);
      console.log(`   Created: ${p.createdAt}`);
    });
    
    // Check pending payments specifically
    console.log('\n=== PENDING PAYMENTS ===');
    const pendingPayments = await Payment.find({ status: 'pending' });
    console.log(`Pending payments: ${pendingPayments.length}`);
    
    // Check all users
    console.log('\n=== USERS CHECK ===');
    const users = await User.find({});
    console.log(`Total users: ${users.length}`);
    
    users.forEach((u, index) => {
      console.log(`${index + 1}. ID: ${u._id}`);
      console.log(`   Name: ${u.fullName}`);
      console.log(`   Username: ${u.username}`);
      console.log(`   Account: ${u.accountNumber}`);
    });
    
  } catch (error) {
    console.error('Database check error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  }
}

checkDatabase();
