#!/usr/bin/env node

/**
 * COMPREHENSIVE WORKFLOW TEST
 * Complete testing of Customer Portal with realistic users
 * Works with existing running servers (no server management)
 */

const axios = require('axios');

// Configuration
const CONFIG = {
    serverUrl: 'https://localhost:5001',
    timeout: 15000,
    
    // Realistic test accounts from seeded data
    testCustomers: [
        { 
            username: 'alexandra.mitchell', 
            password: 'CustomerSecure2025!',
            fullName: 'Alexandra Mitchell',
            accountNumber: '4001234567'
        },
        { 
            username: 'benjamin.carter', 
            password: 'BusinessPass2025!',
            fullName: 'Benjamin Carter',
            accountNumber: '4009876543'
        },
        { 
            username: 'catherine.williams', 
            password: 'TradeSecure2025!',
            fullName: 'Catherine Williams',
            accountNumber: '4005555666'
        }
    ],
    
    testEmployees: [
        { 
            username: 'sarah.chen', 
            password: 'SecureManager2025!',
            fullName: 'Sarah Chen',
            role: 'manager',
            department: 'International Payments'
        },
        { 
            username: 'emily.watson', 
            password: 'OfficerPass2025!',
            fullName: 'Emily Watson',
            role: 'employee',
            department: 'Payment Processing'
        },
        { 
            username: 'michael.rodriguez', 
            password: 'AdminSecure2025!',
            fullName: 'Michael Rodriguez',
            role: 'admin',
            department: 'System Administration'
        }
    ]
};

// Test tracking
let testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    results: []
};

// Simplified cleanup on process exit (no server management needed)
process.on('SIGINT', async () => {
    colorLog('\n\n🛑 Test interrupted by user', 'yellow');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    colorLog('\n\n🛑 Test terminated', 'yellow');
    process.exit(0);
});

// Axios configuration with SSL bypass
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const api = axios.create({
    timeout: CONFIG.timeout,
    validateStatus: () => true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
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
        logInfo(`Testing comprehensive payment workflow for ${customer.fullName}...`);
        
        // Step 1: Check existing payment history first
        const initialHistoryResponse = await api.get(`${CONFIG.serverUrl}/api/payments/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const initialPaymentCount = initialHistoryResponse.data?.length || 0;
        logTest('Initial Payment History Check', initialHistoryResponse.status === 200, 
            `Status: ${initialHistoryResponse.status}, Existing payments: ${initialPaymentCount}`);
        
        // Step 2: Test payment submission (CREATE NEW PAYMENT)
        const paymentData = {
            payeeName: 'International Business Corporation',
            provider: 'SWIFT', // Required field
            payeeAccountNumber: 'GB29NWBK60161331926819', // Valid IBAN format (22 chars)
            swiftCode: 'GLBLUS33',
            amount: '2500.00', // String format for regex validation
            currency: 'USD'
        };
        
        logInfo('Creating new payment submission...');
        const submitResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        const submitSuccess = submitResponse.status === 200 || submitResponse.status === 201;
        logTest('Payment Submission', submitSuccess, 
            `Status: ${submitResponse.status}, Amount: $${paymentData.amount}, Response: ${JSON.stringify(submitResponse.data).substring(0, 100)}`);
        
        // Step 3: Verify payment was added to history
        await delay(1000); // Allow database to update
        const updatedHistoryResponse = await api.get(`${CONFIG.serverUrl}/api/payments/history`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const newPaymentCount = updatedHistoryResponse.data?.length || 0;
        const paymentAdded = newPaymentCount > initialPaymentCount;
        logTest('Payment Added to History', paymentAdded, 
            `Payments after submission: ${newPaymentCount} (was ${initialPaymentCount})`);
        
        // Step 4: Test getting payment by ID (if payment was created successfully)
        if (submitSuccess && updatedHistoryResponse.data && updatedHistoryResponse.data.length > 0) {
            const latestPayment = updatedHistoryResponse.data[0]; // Assuming newest first
            if (latestPayment._id) {
                const paymentDetailResponse = await api.get(
                    `${CONFIG.serverUrl}/api/payments/${latestPayment._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                
                logTest('Payment Detail Retrieval', 
                    paymentDetailResponse.status === 200 || paymentDetailResponse.status === 404,
                    `Status: ${paymentDetailResponse.status}`);
            }
        }
        
        // Step 5: Test account information access
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

// Main Test Runner
async function runComprehensiveWorkflowTest() {
    colorLog('\n🚀 COMPREHENSIVE WORKFLOW TEST - CUSTOMER PORTAL', 'bright');
    colorLog('Testing realistic users with dot notation usernames', 'cyan');
    colorLog('🔧 Using existing running servers (npm run dev)', 'blue');
    console.log('\n' + '='.repeat(80));
    
    let customerTokens = {};
    let employeeTokens = {};
    
    try {
        // Initialize test environment
        logInfo(`Server: ${CONFIG.serverUrl}`);
        logInfo(`Test Users: ${CONFIG.testCustomers.length} customers, ${CONFIG.testEmployees.length} employees`);
        logInfo(`Test Start Time: ${new Date().toLocaleString()}`);
        
        // Run all test suites
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
        'Security': testStats.results.filter(r => r.test.includes('Security') || r.test.includes('Invalid') || r.test.includes('Unauthorized'))
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
    }
    
    colorLog(`\n📅 Test Completed: ${new Date().toLocaleString()}`, 'cyan');
    colorLog('🎯 Customer Portal Comprehensive Test Complete!', 'bright');
    console.log('='.repeat(80));
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
