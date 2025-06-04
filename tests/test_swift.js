const axios = require('axios');

async function testSwiftWorkflow() {
  try {
    console.log('🧪 Testing SWIFT Workflow...\n');

    // 1. Employee Login
    console.log('1. Employee Login');
    const loginResponse = await axios.post('http://localhost:5001/api/employee/login', {
      username: 'admin.user',
      password: 'AdminPass123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Employee login successful');
    console.log('Employee:', loginResponse.data.employee.fullName);
    console.log('Role:', loginResponse.data.employee.role);
    
    // 2. Get verified payments
    console.log('\n2. Get Verified Payments');
    try {
      const verifiedResponse = await axios.get('http://localhost:5001/api/employee/payments/verified', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Verified payments endpoint works');
      console.log('Found verified payments:', verifiedResponse.data.length);
      
      if (verifiedResponse.data.length > 0) {
        console.log('Verified payments:', verifiedResponse.data.map(p => ({
          id: p._id,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          customer: p.customerId?.fullName
        })));
        
        // 3. Try SWIFT submission
        console.log('\n3. SWIFT Submission');
        const paymentIds = verifiedResponse.data.map(p => p._id);
        
        try {
          const submitResponse = await axios.post('http://localhost:5001/api/employee/payments/submit-to-swift', {
            paymentIds
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ SWIFT submission successful');
          console.log('Result:', submitResponse.data);
        } catch (submitError) {
          console.log('❌ SWIFT submission failed');
          console.log('Error:', submitError.response?.data || submitError.message);
        }
      } else {
        console.log('No verified payments available for SWIFT submission');
      }
      
    } catch (error) {
      console.log('❌ Get verified payments failed');
      console.log('Error:', error.response?.data || error.message);
      console.log('Status:', error.response?.status);
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testSwiftWorkflow();
