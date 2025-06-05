const axios = require('axios');
const assert = require('assert');

// Test configuration
const BASE_URL = 'http://localhost:3000';

async function testWorkflow() {
  try {
    console.log('Starting comprehensive workflow test...');

    // Step 1: Test employee login
    const loginResponse = await axios.post(`${BASE_URL}/api/employee/login`, {
      username: 'test_employee',
      password: 'Test@1234'
    });
    assert.strictEqual(loginResponse.status, 200, 'Employee login failed');
    console.log('Employee login successful');

    // Step 2: Test payment creation
    const paymentResponse = await axios.post(`${BASE_URL}/api/payment/create`, {
      amount: '100.50',
      currency: 'USD',
      provider: 'Bank of America',
      payeeAccountNumber: 'US12345678901234567890',
      swiftCode: 'BOFAUS3N',
      payeeName: 'John Doe'
    }, {
      headers: { Authorization: `Bearer ${loginResponse.data.token}` }
    });
    assert.strictEqual(paymentResponse.status, 201, 'Payment creation failed');
    console.log('Payment creation successful');

    // Step 3: Test payment retrieval
    const paymentsResponse = await axios.get(`${BASE_URL}/api/payment`, {
      headers: { Authorization: `Bearer ${loginResponse.data.token}` }
    });
    assert.strictEqual(paymentsResponse.status, 200, 'Payment retrieval failed');
    assert(paymentsResponse.data.length > 0, 'No payments found');
    console.log('Payment retrieval successful');

    console.log('Comprehensive workflow test completed successfully');
  } catch (error) {
    console.error('Comprehensive workflow test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testWorkflow();
