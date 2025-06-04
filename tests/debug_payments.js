const mongoose = require('mongoose');
require('dotenv').config();

async function debugPendingPayments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Payment = require('./server/models/Payment');
    const User = require('./server/models/User');
    
    console.log('\n🔍 DEBUGGING PENDING PAYMENTS');
    
    // 1. Check all payments
    console.log('\n1. All payments in database:');
    const allPayments = await Payment.find({});
    console.log(`Found ${allPayments.length} total payments`);
    
    allPayments.forEach((payment, index) => {
      console.log(`${index + 1}. ID: ${payment._id}`);
      console.log(`   Status: ${payment.status}`);
      console.log(`   Amount: ${payment.amount} ${payment.currency}`);
      console.log(`   Customer ID: ${payment.customerId}`);
      console.log('');
    });
    
    // 2. Check pending payments specifically
    console.log('\n2. Pending payments query:');
    const pendingPayments = await Payment.find({ status: 'pending' });
    console.log(`Found ${pendingPayments.length} pending payments`);
    
    // 3. Try the exact query from employee routes
    console.log('\n3. Employee route query with populate:');
    try {
      const employeeQueryResult = await Payment.find({ status: 'pending' })
        .populate('customerId', 'fullName accountNumber')
        .sort({ createdAt: -1 })
        .select('-__v');
      
      console.log(`✅ Employee query successful: ${employeeQueryResult.length} payments`);
      employeeQueryResult.forEach((payment, index) => {
        console.log(`${index + 1}. Payment ID: ${payment._id}`);
        console.log(`   Customer: ${payment.customerId?.fullName || 'NO CUSTOMER'}`);
        console.log(`   Account: ${payment.customerId?.accountNumber || 'NO ACCOUNT'}`);
        console.log(`   Amount: ${payment.amount} ${payment.currency}`);
      });
      
    } catch (error) {
      console.log('❌ Employee query failed:', error.message);
      console.log('Error details:', error);
    }
    
    // 4. Check users in database
    console.log('\n4. Users in database:');
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Name: ${user.fullName}`);
      console.log(`   Account: ${user.accountNumber}`);
    });
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

debugPendingPayments();
