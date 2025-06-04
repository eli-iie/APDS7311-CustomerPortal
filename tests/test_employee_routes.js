const axios = require('axios');

async function testEmployeeRoutes() {
  try {
    console.log('🧪 Testing Employee Routes...\n');    // 1. Employee Login
    console.log('1. Employee Login');    const loginResponse = await axios.post('http://localhost:5001/api/employee/login', {
      username: 'admin.user',
      password: 'AdminPass123!'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Employee login successful');
    console.log('Employee:', loginResponse.data.employee.fullName);
    console.log('Role:', loginResponse.data.employee.role);
    
    // 2. Test pending payments endpoint
    console.log('\n2. Testing Pending Payments');
    try {      const pendingResponse = await axios.get('http://localhost:5001/api/employee/payments/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Pending payments endpoint works');
      console.log('Found payments:', pendingResponse.data.length);
      console.log('Payments:', pendingResponse.data);
    } catch (error) {
      console.log('❌ Pending payments failed');
      console.log('Error:', error.response?.data || error.message);
      console.log('Status:', error.response?.status);
    }
    
    // 3. Test server connectivity
    console.log('\n3. Testing Server Connectivity');
    try {
      const healthResponse = await axios.get('http://localhost:5001/api/auth/test-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Server responds to authenticated requests');
    } catch (error) {
      console.log('Server response status:', error.response?.status);
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testEmployeeRoutes();
