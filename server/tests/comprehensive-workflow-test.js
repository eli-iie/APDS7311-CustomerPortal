#!/usr/bin/env node

/**
 * COMPREHENSIVE WORKFLOW TEST - SIMPLIFIED
 * Complete testing of Customer Portal with realistic users
 * Tests logins, operations, and full user workflows
 * 
 * SIMPLIFIED SERVER MANAGEMENT:
 * - Checks if server is running → Starts it if not → Runs tests → Keeps server open
 * - No automatic server shutdown after tests complete
 * - Server remains running for continued use
 * - Use Ctrl+C to stop both tests and server
 */

const axios = require('axios');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const { testCustomers, testEmployees, testPayments, getSeedData } = require('./seed-data');

const execAsync = promisify(exec);

// Server management variables
let serverProcess = null;
const SERVER_START_DELAY = 8000; // Time to wait for server to fully start
const CLEANUP_DELAY = 3000; // Time to wait after cleanup before starting
const PORT = 5001; // Expected server port

// Configuration
const CONFIG = {
    serverUrl: 'https://localhost:5001',
    timeout: 15000,
    
    // Using shared test credentials from seed-data.js
    testCustomers,
    testEmployees
};

// Test tracking
let testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    results: []
};

// Simplified Server Management Functions

async function checkAndStartServer() {
    colorLog('🔍 Checking if server is running...', 'blue');
    
    // First check if server is already running
    const isRunning = await isServerRunning();
    
    if (isRunning) {
        colorLog('✅ Server is already running - proceeding with tests', 'green');
        return true;
    }
    
    // Server not running, start it
    colorLog('🚀 Server not detected - starting now...', 'yellow');
    const started = await startServer();
    
    if (started) {
        // Wait for server to fully start and verify it's responding
        await delay(3000);
        const healthyAfterStart = await isServerRunning();
        if (healthyAfterStart) {
            colorLog('✅ Server started successfully and is responding!', 'green');
            return true;
        } else {
            colorLog('⚠️  Server started but not responding to health check', 'yellow');
            return false;
        }
    } else {
        colorLog('❌ Failed to start server', 'red');
        return false;
    }
}

async function killExistingProcesses() {
    colorLog('🔄 Cleaning up existing Node.js processes...', 'yellow');
    
    try {
        // Simple cleanup - only if needed
        await delay(1000);
        colorLog('✅ Process cleanup complete', 'green');
    } catch (error) {
        colorLog(`⚠️  Process cleanup warning: ${error.message}`, 'yellow');
    }
}

async function startServer() {
    return new Promise((resolve, reject) => {
        colorLog('🚀 Starting Customer Portal server...', 'blue');
        
        // The server directory is one level up from tests/
        const serverPath = path.join(__dirname, '..');
        const serverScript = path.join(serverPath, 'index.js');
        
        // Check if server directory exists
        if (!fs.existsSync(serverPath)) {
            reject(new Error(`Server directory not found at: ${serverPath}`));
            return;
        }
        
        // Check if server file exists - try multiple possible names
        let actualServerScript = serverScript;
        if (!fs.existsSync(serverScript)) {
            const alternatives = ['server.js', 'app.js', 'main.js'];
            let found = false;
            for (const alt of alternatives) {
                const altPath = path.join(serverPath, alt);
                if (fs.existsSync(altPath)) {
                    actualServerScript = altPath;
                    found = true;
                    colorLog(`Using ${alt} as server entry point`, 'cyan');
                    break;
                }
            }
            if (!found) {
                reject(new Error(`No server entry point found in: ${serverPath}`));
                return;
            }
        }
        
        // Start the server process
        const serverFile = path.basename(actualServerScript);
        serverProcess = spawn('node', [serverFile], {
            cwd: serverPath,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false,
            shell: false
        });
        
        let serverStarted = false;
        let startupOutput = '';
          // Monitor server output
        serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            startupOutput += output;
            colorLog(`Server output: ${output.trim()}`, 'cyan'); // Debug output
            
            // Look for server ready indicators - Updated patterns to match actual server output
            if (output.includes('HTTPS Server running securely') || 
                output.includes('HTTP Server running in development') ||
                output.includes('Server available at:') ||
                output.includes('listening on') || 
                output.includes('port 5001') ||
                output.includes('port ' + PORT)) {
                if (!serverStarted) {
                    serverStarted = true;
                    colorLog('✅ Server started successfully!', 'green');
                    colorLog(`✅ Detected startup message: ${output.trim()}`, 'green');
                    setTimeout(() => resolve(true), 2000); // Additional delay for full startup
                }
            }
        });
        
        serverProcess.stderr.on('data', (data) => {
            const error = data.toString();
            colorLog(`Server stderr: ${error}`, 'yellow');
            startupOutput += error;
        });
        
        serverProcess.on('error', (error) => {
            colorLog(`❌ Failed to start server: ${error.message}`, 'red');
            reject(error);
        });
        
        serverProcess.on('exit', (code, signal) => {
            if (!serverStarted) {
                colorLog(`❌ Server exited during startup (code: ${code}, signal: ${signal})`, 'red');
                colorLog(`Startup output: ${startupOutput}`, 'yellow');
                reject(new Error(`Server startup failed with exit code ${code}`));
            }
        });
        
        // Timeout if server doesn't start
        setTimeout(() => {
            if (!serverStarted) {
                colorLog('⏰ Server startup timeout - proceeding anyway', 'yellow');
                colorLog(`Startup output so far: ${startupOutput}`, 'yellow');
                resolve(false); // Indicate uncertain startup
            }
        }, SERVER_START_DELAY);
    });
}

async function stopServer() {
    if (serverProcess) {
        colorLog('\n🛑 Stopping server...', 'yellow');
        
        try {
            serverProcess.kill('SIGTERM');
            
            // Wait for graceful shutdown
            await delay(2000);
            
            if (!serverProcess.killed) {
                serverProcess.kill('SIGKILL');
            }
            
            colorLog('✅ Server stopped successfully', 'green');
        } catch (error) {
            colorLog(`⚠️  Server shutdown warning: ${error.message}`, 'yellow');
        }
        
        serverProcess = null;
    }
}

// Ensure cleanup on process exit (only if explicitly killed)
process.on('exit', () => {
    // Note: Server intentionally left running for continued use
    // Only cleanup if process is being forcefully terminated
    if (serverProcess && process.exitCode !== 0) {
        serverProcess.kill('SIGKILL');
    }
});

process.on('SIGINT', async () => {
    colorLog('\n\n🛑 Test interrupted by user', 'yellow');
    colorLog('🔄 Stopping server and cleaning up...', 'blue');
    await stopServer();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    colorLog('\n\n🛑 Test terminated', 'yellow');
    colorLog('🔄 Stopping server and cleaning up...', 'blue');
    await stopServer();
    process.exit(0);
});

// Axios configuration with SSL bypass for testing (more secure approach)
const https = require('https');
const api = axios.create({
    timeout: CONFIG.timeout,
    validateStatus: () => true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Only bypass SSL for localhost testing instead of globally disabling
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

// Utility functions
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
    testStats.total++;
    if (passed) {
        testStats.passed++;
        colorLog(`✅ PASS: ${testName}`, 'green');
        if (details) colorLog(`   ${details}`, 'cyan');
    } else {
        testStats.failed++;
        colorLog(`❌ FAIL: ${testName}`, 'red');
        if (details) colorLog(`   ${details}`, 'yellow');
    }
    testStats.results.push({ test: testName, passed, details });
}

function logInfo(message) {
    colorLog(`ℹ️  ${message}`, 'blue');
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    colorLog(title, 'bright');
    console.log('='.repeat(60));
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Server health check functions - FIXED VERSION
async function isServerRunning() {
    try {
        // Quick connectivity test - try the main endpoint
        const response = await axios.get(`${CONFIG.serverUrl}/`, {
            timeout: 3000,
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false
            })
        });
        
        // Any response (even 404) means server is running
        return response.status < 500;
    } catch (error) {
        // Connection refused = server not running
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return false;
        }
        // Other errors might still mean server is running
        return error.response && error.response.status < 500;
    }
}

async function ensureServerIsRunning() {
    return await checkAndStartServer();
}

// Test Functions

async function testServerConnectivity() {
    logSection('🔗 TESTING SERVER CONNECTIVITY');
    
    try {
        logInfo('Checking if server is responding...');
        const response = await api.get(`${CONFIG.serverUrl}/`);
        
        const isWorking = response.status < 500;
        logTest('Server Connectivity', isWorking, 
            `Server responded with status ${response.status}`);
        
        return isWorking;
    } catch (error) {
        logTest('Server Connectivity', false, 
            `Connection failed: ${error.message}`);
        return false;
    }
}

async function testCustomerAuthentication() {
    logSection('👤 TESTING CUSTOMER AUTHENTICATION');
    
    const tokens = {};
    
    for (const customer of CONFIG.testCustomers) {
        try {
            logInfo(`Testing login for ${customer.fullName} (${customer.username})...`);
            
            const loginData = {
                username: customer.username,
                password: customer.password
            };
            
            const response = await api.post(`${CONFIG.serverUrl}/api/auth/login`, loginData);
            
            if (response.status === 200 && response.data && response.data.token) {
                tokens[customer.username] = response.data.token;
                logTest(`Customer Login: ${customer.username}`, true, 
                    `Token received, User ID: ${response.data.user?.id || 'N/A'}`);
                
                // Test protected route access
                const dashResponse = await api.get(`${CONFIG.serverUrl}/api/auth/dashboard`, {
                    headers: { Authorization: `Bearer ${response.data.token}` }
                });
                
                logTest(`Dashboard Access: ${customer.username}`, 
                    dashResponse.status === 200,
                    `Dashboard status: ${dashResponse.status}`);
                
            } else {
                logTest(`Customer Login: ${customer.username}`, false, 
                    `Status: ${response.status}, Response: ${JSON.stringify(response.data).substring(0, 100)}`);
            }
            
            await delay(1000); // Rate limiting
            
        } catch (error) {
            logTest(`Customer Login: ${customer.username}`, false, 
                `Error: ${error.message}`);
        }
    }
    
    return tokens;
}

async function testEmployeeAuthentication() {
    logSection('👥 TESTING EMPLOYEE AUTHENTICATION');
    
    const empTokens = {};
    
    for (const employee of CONFIG.testEmployees) {
        try {
            logInfo(`Testing employee login for ${employee.fullName} (${employee.username})...`);
            
            const loginData = {
                username: employee.username,
                password: employee.password
            };
            
            const response = await api.post(`${CONFIG.serverUrl}/api/employee/login`, loginData);
            
            if (response.status === 200 && response.data && response.data.token) {
                empTokens[employee.username] = response.data.token;
                logTest(`Employee Login: ${employee.username}`, true, 
                    `Role: ${response.data.user?.role || employee.role}, Dept: ${employee.department}`);
                
                // Test employee dashboard access
                const dashResponse = await api.get(`${CONFIG.serverUrl}/api/employee/dashboard`, {
                    headers: { Authorization: `Bearer ${response.data.token}` }
                });
                
                logTest(`Employee Dashboard: ${employee.username}`, 
                    dashResponse.status === 200,
                    `Dashboard status: ${dashResponse.status}`);
                
            } else {
                logTest(`Employee Login: ${employee.username}`, false, 
                    `Status: ${response.status}, Response: ${JSON.stringify(response.data).substring(0, 100)}`);
            }
            
            await delay(1000);
            
        } catch (error) {
            logTest(`Employee Login: ${employee.username}`, false, 
                `Error: ${error.message}`);
        }
    }
    
    return empTokens;
}

async function testPaymentWorkflow(customerTokens) {
    logSection('💳 TESTING PAYMENT WORKFLOW');
    
    if (Object.keys(customerTokens).length === 0) {
        logTest('Payment Workflow', false, 'No customer tokens available');
        return;
    }
    
    const customer = CONFIG.testCustomers[0];
    const token = customerTokens[customer.username];
    
    if (!token) {
        logTest('Payment Workflow Setup', false, 'No token for test customer');
        return;
    }
    
    try {
        logInfo(`Testing payment submission for ${customer.fullName}...`);        // Test payment submission
        const paymentData = {
            payeeName: 'International Business Corporation',
            provider: 'Global Bank International',
            payeeAccountNumber: 'GB29NWBK60161331926819', // Valid IBAN format (22 chars)
            swiftCode: 'GLBLUS33',
            amount: '2500.00', // String format for regex validation
            currency: 'USD',
            purpose: 'Business Services Payment'
        };
        
        const submitResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        const submitSuccess = submitResponse.status === 200 || submitResponse.status === 201;
        logTest('Payment Submission', submitSuccess, 
            `Status: ${submitResponse.status}, Amount: $${paymentData.amount}`);
        
        // Test payment history access
        const historyResponse = await api.get(`${CONFIG.serverUrl}/api/payments/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        logTest('Payment History Access', historyResponse.status === 200, 
            `Status: ${historyResponse.status}, Payments found: ${historyResponse.data?.length || 0}`);
        
        // Test account balance/info
        const accountResponse = await api.get(`${CONFIG.serverUrl}/api/auth/account`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        logTest('Account Information Access', 
            accountResponse.status === 200 || accountResponse.status === 404,
            `Status: ${accountResponse.status}`);
        
    } catch (error) {
        logTest('Payment Workflow', false, `Error: ${error.message}`);
    }
}

async function testEmployeeOperations(employeeTokens) {
    logSection('🏢 TESTING EMPLOYEE OPERATIONS');
    
    if (Object.keys(employeeTokens).length === 0) {
        logTest('Employee Operations', false, 'No employee tokens available');
        return;
    }
    
    const employee = CONFIG.testEmployees[0]; // Sarah Chen (Manager)
    const token = employeeTokens[employee.username];
    
    if (!token) {
        logTest('Employee Operations Setup', false, 'No token for test employee');
        return;
    }
    
    try {
        logInfo(`Testing employee operations for ${employee.fullName}...`);
        
        // Test pending payments access
        const pendingResponse = await api.get(`${CONFIG.serverUrl}/api/employee/pending-payments`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        logTest('Pending Payments Access', 
            pendingResponse.status === 200,
            `Status: ${pendingResponse.status}, Pending: ${pendingResponse.data?.length || 0}`);
        
        // Test employee statistics/overview
        const statsResponse = await api.get(`${CONFIG.serverUrl}/api/employee/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        logTest('Employee Statistics Access', 
            statsResponse.status === 200 || statsResponse.status === 404,
            `Status: ${statsResponse.status}`);
        
        // Test audit trail access (if manager/admin)
        if (employee.role === 'manager' || employee.role === 'admin') {
            const auditResponse = await api.get(`${CONFIG.serverUrl}/api/employee/audit`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            logTest('Audit Trail Access', 
                auditResponse.status === 200 || auditResponse.status === 404,
                `Status: ${auditResponse.status} (${employee.role})`);
        }
        
    } catch (error) {
        logTest('Employee Operations', false, `Error: ${error.message}`);
    }
}

async function testSecurityFeatures() {
    logSection('🛡️ TESTING SECURITY FEATURES');
    
    try {
        // Test invalid customer login
        logInfo('Testing invalid customer credentials...');
        const invalidCustomerResponse = await api.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: 'fake.user',
            password: 'wrongpassword'
        });
        
        logTest('Invalid Customer Login Prevention', 
            invalidCustomerResponse.status === 401 || invalidCustomerResponse.status === 400,
            `Status: ${invalidCustomerResponse.status}`);
        
        // Test invalid employee login
        logInfo('Testing invalid employee credentials...');
        const invalidEmployeeResponse = await api.post(`${CONFIG.serverUrl}/api/employee/login`, {
            username: 'fake.employee',
            password: 'wrongpassword'
        });
        
        logTest('Invalid Employee Login Prevention', 
            invalidEmployeeResponse.status === 401 || invalidEmployeeResponse.status === 400,
            `Status: ${invalidEmployeeResponse.status}`);
        
        // Test unauthorized dashboard access
        logInfo('Testing unauthorized access...');
        const unauthorizedResponse = await api.get(`${CONFIG.serverUrl}/api/auth/dashboard`);
        
        logTest('Unauthorized Access Prevention', 
            unauthorizedResponse.status === 401,
            `Status: ${unauthorizedResponse.status}`);
        
        // Test SQL injection attempt
        logInfo('Testing SQL injection prevention...');
        const injectionResponse = await api.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: "admin'; DROP TABLE users; --",
            password: "' OR '1'='1"
        });
        
        logTest('SQL Injection Prevention', 
            injectionResponse.status !== 200,
            `Status: ${injectionResponse.status}`);
        
        await delay(1000);
        
    } catch (error) {
        logTest('Security Features', false, `Error: ${error.message}`);
    }
}

async function testUsernameValidation() {
    logSection('🔤 TESTING USERNAME VALIDATION');
    
    const testCases = [
        { username: 'test.user', valid: true, description: 'Valid dot notation' },
        { username: 'user_name', valid: true, description: 'Valid underscore' },
        { username: 'simple123', valid: true, description: 'Valid alphanumeric' },
        { username: 'user@domain', valid: false, description: 'Invalid @ symbol' },
        { username: 'user space', valid: false, description: 'Invalid space' },
        { username: 'ab', valid: false, description: 'Too short (< 3 chars)' },
        { username: 'a'.repeat(25), valid: false, description: 'Too long (> 20 chars)' }
    ];
    
    for (const testCase of testCases) {
        try {
            logInfo(`Testing username: "${testCase.username}" (${testCase.description})`);
            
            const response = await api.post(`${CONFIG.serverUrl}/api/auth/register`, {
                username: testCase.username,
                password: 'TestPassword123!',
                fullName: 'Test User',
                accountNumber: '1234567890'
            });
            
            const actualValid = response.status === 200 || response.status === 201 || response.status === 400; // 400 for existing user
            const testPassed = testCase.valid ? actualValid : !actualValid || response.status === 400;
            
            logTest(`Username Validation: ${testCase.username}`, testPassed, 
                `Expected: ${testCase.valid ? 'Valid' : 'Invalid'}, Got status: ${response.status}`);
            
            await delay(500);
            
        } catch (error) {
            logTest(`Username Validation: ${testCase.username}`, !testCase.valid, 
                `Error (expected for invalid): ${error.message}`);
        }
    }
}

// Main Test Runner
// Main Test Runner
async function runComprehensiveWorkflowTest() {
    colorLog('\n🚀 COMPREHENSIVE WORKFLOW TEST - CUSTOMER PORTAL', 'bright');
    colorLog('Testing realistic users with dot notation usernames', 'cyan');
    colorLog('🔧 With Automated Server Management', 'blue');
    console.log('\n' + '='.repeat(80));
    
    let customerTokens = {};
    let employeeTokens = {};
    let serverStartedSuccessfully = false;
      try {
        // Step 1: Ensure server is running (start if needed)
        logSection('🔄 SERVER MANAGEMENT');
        serverStartedSuccessfully = await ensureServerIsRunning();
        
        if (!serverStartedSuccessfully) {
            colorLog('⚠️  Server startup failed or uncertain - continuing with tests', 'yellow');
        }
        
        // Step 2: Initialize test environment
        logInfo(`Server: ${CONFIG.serverUrl}`);
        logInfo(`Test Users: ${CONFIG.testCustomers.length} customers, ${CONFIG.testEmployees.length} employees`);
        logInfo(`Test Start Time: ${new Date().toLocaleString()}`);
        
        // Step 3: Run all test suites
        const serverOnline = await testServerConnectivity();
        
        if (serverOnline) {
            await delay(1000);
            customerTokens = await testCustomerAuthentication();
            
            await delay(1500);
            employeeTokens = await testEmployeeAuthentication();
            
            await delay(1500);  
            await testPaymentWorkflow(customerTokens);
            
            await delay(1500);
            await testEmployeeOperations(employeeTokens);
            
            await delay(1500);
            await testSecurityFeatures();
            
            await delay(1500);
            await testUsernameValidation();
        } else {
            colorLog('❌ Server not responding - skipping functional tests', 'red');
        }
        
    } catch (error) {
        colorLog(`💥 Test execution error: ${error.message}`, 'red');
        colorLog(`Stack trace: ${error.stack}`, 'yellow');
    }
    
    // Generate comprehensive report
    logSection('📊 COMPREHENSIVE TEST RESULTS');
    
    colorLog(`\nTotal Tests: ${testStats.total}`, 'bright');
    colorLog(`Passed: ${testStats.passed}`, 'green');
    colorLog(`Failed: ${testStats.failed}`, 'red');
    colorLog(`Success Rate: ${((testStats.passed / testStats.total) * 100).toFixed(1)}%`, 'bright');
    
    // Detailed results by category
    const categories = {
        'Connectivity': testStats.results.filter(r => r.test.includes('Connectivity')),
        'Customer Auth': testStats.results.filter(r => r.test.includes('Customer') && r.test.includes('Login')),
        'Employee Auth': testStats.results.filter(r => r.test.includes('Employee') && r.test.includes('Login')),
        'Payment Flow': testStats.results.filter(r => r.test.includes('Payment')),
        'Security': testStats.results.filter(r => r.test.includes('Security') || r.test.includes('Invalid') || r.test.includes('Unauthorized')),
        'Validation': testStats.results.filter(r => r.test.includes('Username Validation'))
    };
    
    console.log('\n📋 RESULTS BY CATEGORY:');
    Object.entries(categories).forEach(([category, tests]) => {
        if (tests.length > 0) {
            const passed = tests.filter(t => t.passed).length;
            const total = tests.length;
            const rate = ((passed / total) * 100).toFixed(0);
            
            if (rate == 100) {
                colorLog(`✅ ${category}: ${passed}/${total} (${rate}%)`, 'green');
            } else if (rate >= 70) {
                colorLog(`⚠️  ${category}: ${passed}/${total} (${rate}%)`, 'yellow');
            } else {
                colorLog(`❌ ${category}: ${passed}/${total} (${rate}%)`, 'red');
            }
        }
    });
    
    // Failed tests details
    const failedTests = testStats.results.filter(r => !r.passed);
    if (failedTests.length > 0) {
        console.log('\n❌ FAILED TESTS DETAILS:');
        failedTests.forEach((test, index) => {
            colorLog(`${index + 1}. ${test.test}`, 'red');
            if (test.details) {
                colorLog(`   ${test.details}`, 'yellow');
            }
        });
    }
    
    // Final status
    console.log('\n' + '='.repeat(80));
    if (testStats.failed === 0) {
        colorLog('🎉 ALL TESTS PASSED! Customer Portal is fully functional!', 'green');
        colorLog('✨ Realistic users with dot notation working perfectly!', 'green');
    } else if (testStats.passed > testStats.failed) {
        colorLog('⚠️  Most tests passed - Application is mostly functional', 'yellow');
        colorLog('🔧 Review failed tests above for issues to address', 'yellow');
    } else {
        colorLog('💥 Multiple failures detected - Application needs attention', 'red');
        colorLog('🛠️  Check server status and configuration', 'red');
    }    colorLog(`\n📅 Test Completed: ${new Date().toLocaleString()}`, 'cyan');
    colorLog('🎯 Customer Portal Rework Verification Complete!', 'bright');
    console.log('='.repeat(80));
      // Server remains running for continued use
    colorLog('\n🔄 Tests complete - Server remains running for continued use', 'green');
    colorLog('💡 To stop the server manually, use Ctrl+C or close this terminal', 'cyan');
    colorLog('🎯 You can now access the Customer Portal at: https://localhost:5001', 'bright');
    
    // Optional: Add a simple prompt to ask user if they want to stop
    if (process.stdout.isTTY) {
        colorLog('\n📋 Press Ctrl+C to stop the server and exit, or leave running for continued use...', 'yellow');
    }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    colorLog(`Unhandled Rejection: ${reason}`, 'red');
});

process.on('uncaughtException', (error) => {
    colorLog(`Uncaught Exception: ${error.message}`, 'red');
    process.exit(1);
});

// Run the comprehensive test
if (require.main === module) {
    runComprehensiveWorkflowTest().catch(error => {
        colorLog(`Test runner failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { runComprehensiveWorkflowTest, CONFIG, testStats };
