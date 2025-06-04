const mongoose = require('mongoose');
require('dotenv').config();

async function checkPayments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Payment = require('./server/models/Payment');
    const User = require('./server/models/User');
    
    // Check all payments
    const payments = await Payment.find({}).populate('customerId');
    console.log(`\nFound ${payments.length} payments:`);
    
    payments.forEach((p, index) => {
      console.log(`${index + 1}. Payment ID: ${p._id}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Amount: ${p.amount} ${p.currency}`);
      console.log(`   Reference: ${p.referenceNumber}`);
      console.log(`   Customer: ${p.customerId?.fullName || 'NO CUSTOMER'}`);
      console.log(`   Created: ${p.createdAt}`);
      console.log('');
    });
    
    // Check pending payments specifically
    const pendingPayments = await Payment.find({ status: 'pending' }).populate('customerId');
    console.log(`\nPending payments: ${pendingPayments.length}`);
    
    // Check all users
    const users = await User.find({});
    console.log(`\nFound ${users.length} users:`);
    users.forEach((u, index) => {
      console.log(`${index + 1}. User: ${u.fullName} (${u.username})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkPayments();
