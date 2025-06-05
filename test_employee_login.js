const axios = require('axios');

async function testEmployeeLogin() {
    console.log('🔐 Testing Employee Login...\n');
    
    try {        // Test employee login with the admin_user account
        console.log('Testing admin_user login...');
        const response = await axios.post('http://localhost:5001/api/employee/login', {
            username: 'admin_user',
            password: 'AdminPass123!'
        }, {
            timeout: 5000
        });
        
        console.log('✅ Login successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('❌ Login failed');
        if (error.code === 'ECONNREFUSED') {
            console.log('   Backend server not running on port 5001');
        } else if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Message:', error.response.data?.message || error.response.data);
        } else {
            console.log('   Error:', error.message);
        }
    }
}

testEmployeeLogin();
