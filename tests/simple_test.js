const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test employee login
const testEmployee = {
  username: 'admin.user',
  password: 'AdminPass123!'
};

console.log('Testing employee login...');
console.log('Test data:', testEmployee);
console.log('URL:', `${BASE_URL}/employee/login`);

async function testEmployeeLogin() {
  try {
    console.log('Making request...');
    const response = await axios.post(`${BASE_URL}/employee/login`, testEmployee);
    console.log('✅ Employee login successful:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Employee login failed');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
    return false;
  }
}

testEmployeeLogin().then(() => {
  console.log('Test completed');
}).catch(err => {
  console.log('Test error:', err);
});
