const https = require('https');

// Create HTTPS agent that ignores certificate errors
const agent = new https.Agent({
    rejectUnauthorized: false
});

function testEmployeeLogin(username, password) {
    return new Promise((resolve, reject) => {
        console.log(`🔐 Testing employee login for: ${username}`);
        
        const postData = JSON.stringify({
            username: username,
            password: password
        });

        const options = {
            hostname: 'localhost',
            port: 5001,
            path: '/api/employee/login',
            method: 'POST',
            agent: agent,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                console.log(`   Response: ${data}`);
                
                try {
                    const response = JSON.parse(data);
                    if (res.statusCode === 200 && response.token) {
                        console.log(`   ✅ Login successful!`);
                        console.log(`   Token: ${response.token.substring(0, 20)}...`);
                        resolve(true);
                    } else {
                        console.log(`   ❌ Login failed: ${response.message || 'Unknown error'}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log(`   ❌ Response parsing error: ${error.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ Request error: ${error.message}`);
            reject(error);
        });

        req.setTimeout(10000, () => {
            console.log('   ❌ Request timeout');
            req.destroy();
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function runLoginTests() {
    console.log('🧪 EMPLOYEE LOGIN TEST');
    console.log('======================\n');
    
    const testCases = [
        { username: 'sarah.chen', password: 'SecureManager2025!' },
        { username: 'emily.watson', password: 'OfficerPass2025!' },
        { username: 'michael.rodriguez', password: 'AdminSecure2025!' },
        { username: 'wrong.user', password: 'WrongPassword!' }
    ];
    
    for (const testCase of testCases) {
        try {
            await testEmployeeLogin(testCase.username, testCase.password);
            console.log('');
        } catch (error) {
            console.log(`❌ Test failed: ${error.message}\n`);
        }
    }
    
    console.log('🏁 Login tests completed!');
}

runLoginTests();
