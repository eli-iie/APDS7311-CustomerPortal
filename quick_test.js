const axios = require('axios');

async function testApplication() {
    console.log('🔧 Testing Customer Payment Portal...\n');
    
    try {
        // Test backend health
        console.log('Testing backend server...');
        try {
            const healthResponse = await axios.get('http://localhost:5001/api/health', {
                timeout: 5000
            });
            console.log('✅ Backend server is running');
        } catch (error) {
            console.log('❌ Backend server not responding:', error.message);
            return;
        }        // Test customer login
        console.log('\nTesting customer login...');
        try {
            const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
                accountNumber: '0987654321',
                password: 'DemoPass123!'
            });
            console.log('✅ Customer login successful');
            console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
        } catch (error) {
            console.log('❌ Customer login failed:', error.response?.data?.message || error.message);
        }

        // Test employee login
        console.log('\nTesting employee login...');
        try {            const empLoginResponse = await axios.post('http://localhost:5001/api/employee/login', {
                username: 'admin.user',
                password: 'AdminPass123!'
            });
            console.log('✅ Employee login successful');
            console.log('   Role:', empLoginResponse.data.employee?.role || 'Unknown');
        } catch (error) {
            console.log('❌ Employee login failed:', error.response?.data?.message || error.message);
        }        // Test payment creation
        console.log('\nTesting payment creation...');
        try {
            // First login to get token
            const customerLogin = await axios.post('http://localhost:5001/api/auth/login', {
                accountNumber: '0987654321',
                password: 'DemoPass123!'
            });
            
            const token = customerLogin.data.token;
            
            // Create a payment
            const paymentResponse = await axios.post('http://localhost:5001/api/payment/create', {
                amount: 500.50,
                currency: 'USD',
                provider: 'SWIFT',
                payeeAccountNumber: 'GB29NWBK60161331926819',
                swiftCode: 'NWBKGB2L',
                payeeName: 'Jane Smith'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('✅ Payment creation successful');
            console.log('   Payment ID:', paymentResponse.data._id);
            console.log('   Status:', paymentResponse.data.status);
            
        } catch (error) {
            console.log('❌ Payment creation failed:', error.response?.data?.message || error.message);
        }
        
        // Test registration endpoint (should not exist)
        console.log('\nTesting registration removal...');
        try {
            await axios.post('http://localhost:5001/api/auth/register', {
                username: 'test_user',
                password: 'TestPass123!'
            });
            console.log('❌ Registration endpoint still exists (should be removed)');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Registration endpoint properly removed');
            } else {
                console.log('⚠️ Registration endpoint responded with:', error.response?.status || error.message);
            }
        }

        console.log('\n🎉 Application test completed!');

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

testApplication();
