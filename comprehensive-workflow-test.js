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

async function testPaymentVerificationWorkflow(customerTokens, employeeTokens) {
    logSection('🔄 TESTING PAYMENT VERIFICATION WORKFLOW');
    
    if (Object.keys(customerTokens).length === 0 || Object.keys(employeeTokens).length === 0) {
        logTest('Payment Verification Workflow', false, 'Missing customer or employee tokens');
        return;
    }
    
    const customer = CONFIG.testCustomers[0]; // Alexandra Mitchell
    const employee = CONFIG.testEmployees[0]; // Sarah Chen (Manager)
    const manager = CONFIG.testEmployees[0]; // Sarah Chen (Manager)
    
    const customerToken = customerTokens[customer.username];
    const employeeToken = employeeTokens[employee.username];
    const managerToken = employeeTokens[manager.username];
    
    if (!customerToken || !employeeToken || !managerToken) {
        logTest('Payment Verification Setup', false, 'Missing required tokens');
        return;
    }
    
    try {
        logInfo('Testing complete payment verification workflow...');
        
        // Step 1: Customer creates a payment for verification
        const verificationPaymentData = {
            payeeName: 'Global Trade Partners Ltd',
            provider: 'SWIFT',
            payeeAccountNumber: 'DE89370400440532013000', // Valid German IBAN
            swiftCode: 'DEUTDEFF',
            amount: '5750.50',
            currency: 'EUR'
        };
        
        logInfo('Step 1: Customer creates payment for verification test...');
        const createResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            verificationPaymentData, {
                headers: { Authorization: `Bearer ${customerToken}` }
            });
        
        const paymentCreated = createResponse.status === 200 || createResponse.status === 201;
        logTest('Payment Creation for Verification', paymentCreated, 
            `Status: ${createResponse.status}, Amount: €${verificationPaymentData.amount}`);
        
        if (!paymentCreated) {
            logTest('Payment Verification Workflow', false, 'Could not create test payment');
            return;
        }
        
        await delay(1000); // Allow database to update
        
        // Step 2: Employee views pending payments
        logInfo('Step 2: Employee checks pending payments...');
        const pendingResponse = await api.get(`${CONFIG.serverUrl}/api/employee/payments/pending`, {
            headers: { Authorization: `Bearer ${employeeToken}` }
        });
        
        const pendingAccess = pendingResponse.status === 200;
        const pendingCount = pendingResponse.data?.length || 0;
        logTest('Employee Pending Payments Access', pendingAccess, 
            `Status: ${pendingResponse.status}, Pending payments: ${pendingCount}`);
        
        // Step 3: Employee views specific payment details
        if (pendingAccess && pendingResponse.data && pendingResponse.data.length > 0) {
            const testPayment = pendingResponse.data.find(p => 
                p.payeeName === verificationPaymentData.payeeName && 
                p.amount === parseFloat(verificationPaymentData.amount)
            ) || pendingResponse.data[0];
            
            logInfo(`Step 3: Employee views payment details for ${testPayment.referenceNumber}...`);
            const detailResponse = await api.get(`${CONFIG.serverUrl}/api/employee/payments/${testPayment._id}`, {
                headers: { Authorization: `Bearer ${employeeToken}` }
            });
            
            logTest('Payment Detail Retrieval', detailResponse.status === 200, 
                `Status: ${detailResponse.status}, Payment ID: ${testPayment._id.substring(0, 8)}...`);
            
            // Step 4: Employee verifies the payment
            logInfo('Step 4: Employee verifies payment...');
            const verifyResponse = await api.put(`${CONFIG.serverUrl}/api/employee/payments/${testPayment._id}/verify`, {}, {
                headers: { Authorization: `Bearer ${employeeToken}` }
            });
            
            const verificationSuccess = verifyResponse.status === 200;
            logTest('Payment Verification by Employee', verificationSuccess, 
                `Status: ${verifyResponse.status}, Reference: ${testPayment.referenceNumber}`);
            
            // Step 5: Manager views verified payments
            if (verificationSuccess) {
                await delay(1000);
                logInfo('Step 5: Manager checks verified payments ready for SWIFT...');
                const verifiedResponse = await api.get(`${CONFIG.serverUrl}/api/employee/payments/verified`, {
                    headers: { Authorization: `Bearer ${managerToken}` }
                });
                
                const verifiedAccess = verifiedResponse.status === 200;
                const verifiedCount = verifiedResponse.data?.length || 0;
                logTest('Manager Verified Payments Access', verifiedAccess, 
                    `Status: ${verifiedResponse.status}, Verified payments: ${verifiedCount}`);
                
                // Step 6: Manager submits to SWIFT
                if (verifiedAccess && verifiedResponse.data && verifiedResponse.data.length > 0) {
                    const verifiedPayment = verifiedResponse.data.find(p => p._id === testPayment._id);
                    if (verifiedPayment) {
                        logInfo('Step 6: Manager submits verified payment to SWIFT...');
                        const swiftResponse = await api.post(`${CONFIG.serverUrl}/api/employee/payments/submit-to-swift`, 
                            { paymentIds: [verifiedPayment._id] }, {
                                headers: { Authorization: `Bearer ${managerToken}` }
                            });
                        
                        logTest('SWIFT Submission by Manager', swiftResponse.status === 200, 
                            `Status: ${swiftResponse.status}, Submitted: ${swiftResponse.data?.submissions?.length || 0} payments`);
                    }
                }
            }
        }
        
        // Step 7: Test payment rejection workflow
        logInfo('Step 7: Testing payment rejection workflow...');
        
        // Create another payment for rejection test
        const rejectionPaymentData = {
            payeeName: 'Suspicious Transaction Corp',
            provider: 'SWIFT',
            payeeAccountNumber: 'FR1420041010050500013M02606',
            swiftCode: 'BDFEFRPP',
            amount: '999.99',
            currency: 'USD'
        };
        
        const rejectCreateResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            rejectionPaymentData, {
                headers: { Authorization: `Bearer ${customerToken}` }
            });
        
        if (rejectCreateResponse.status === 200 || rejectCreateResponse.status === 201) {
            await delay(1000);
            
            // Get the new payment for rejection
            const newPendingResponse = await api.get(`${CONFIG.serverUrl}/api/employee/payments/pending`, {
                headers: { Authorization: `Bearer ${employeeToken}` }
            });
            
            if (newPendingResponse.status === 200 && newPendingResponse.data) {
                const rejectPayment = newPendingResponse.data.find(p => 
                    p.payeeName === rejectionPaymentData.payeeName
                ) || newPendingResponse.data[0];
                
                if (rejectPayment) {
                    const rejectionReason = 'Payment details require additional verification due to compliance requirements.';
                    const rejectResponse = await api.put(`${CONFIG.serverUrl}/api/employee/payments/${rejectPayment._id}/reject`, 
                        { rejectionReason }, {
                            headers: { Authorization: `Bearer ${employeeToken}` }
                        });
                    
                    logTest('Payment Rejection by Employee', rejectResponse.status === 200, 
                        `Status: ${rejectResponse.status}, Reason: ${rejectionReason.substring(0, 50)}...`);
                }
            }
        }
        
    } catch (error) {
        logTest('Payment Verification Workflow', false, `Error: ${error.message}`);
    }
}

async function testRoleBasedAccessControl(employeeTokens) {
    logSection('🔐 TESTING ROLE-BASED ACCESS CONTROL');
    
    if (Object.keys(employeeTokens).length === 0) {
        logTest('Role-Based Access Control', false, 'No employee tokens available');
        return;
    }
    
    try {
        // Test different role permissions
        for (const employee of CONFIG.testEmployees) {
            const token = employeeTokens[employee.username];
            if (!token) continue;
            
            logInfo(`Testing ${employee.role} permissions for ${employee.fullName}...`);
            
            // Test verified payments access (Manager/Admin only)
            const verifiedResponse = await api.get(`${CONFIG.serverUrl}/api/employee/payments/verified`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const shouldHaveAccess = employee.role === 'manager' || employee.role === 'admin';
            const hasAccess = verifiedResponse.status === 200;
            const accessCorrect = shouldHaveAccess === hasAccess;
            
            logTest(`Verified Payments Access (${employee.role})`, accessCorrect, 
                `Status: ${verifiedResponse.status}, Expected: ${shouldHaveAccess ? 'Allow' : 'Deny'}, Got: ${hasAccess ? 'Allow' : 'Deny'}`);
            
            // Test SWIFT submission access (Manager/Admin only)
            const swiftResponse = await api.post(`${CONFIG.serverUrl}/api/employee/payments/submit-to-swift`, 
                { paymentIds: [] }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            
            const swiftShouldWork = employee.role === 'manager' || employee.role === 'admin';
            const swiftAccessCorrect = swiftShouldWork ? 
                (swiftResponse.status === 200 || swiftResponse.status === 400) : // 400 for empty array is acceptable
                (swiftResponse.status === 403); // Should be forbidden for employees
            
            logTest(`SWIFT Submission Access (${employee.role})`, swiftAccessCorrect, 
                `Status: ${swiftResponse.status}, Role: ${employee.role}`);
            
            // Test audit trail access (Admin only)
            const auditResponse = await api.get(`${CONFIG.serverUrl}/api/employee/audit-trail`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const auditShouldWork = employee.role === 'admin';
            const auditAccessCorrect = auditShouldWork ? 
                (auditResponse.status === 200) : 
                (auditResponse.status === 403);
            
            logTest(`Audit Trail Access (${employee.role})`, auditAccessCorrect, 
                `Status: ${auditResponse.status}, Role: ${employee.role}`);
        }
        
    } catch (error) {
        logTest('Role-Based Access Control', false, `Error: ${error.message}`);
    }
}

async function testAuditTrailFunctionality(employeeTokens) {
    logSection('📋 TESTING AUDIT TRAIL FUNCTIONALITY');
    
    const adminEmployee = CONFIG.testEmployees.find(emp => emp.role === 'admin');
    if (!adminEmployee) {
        logTest('Audit Trail Testing', false, 'No admin employee found');
        return;
    }
    
    const adminToken = employeeTokens[adminEmployee.username];
    if (!adminToken) {
        logTest('Audit Trail Testing', false, 'No admin token available');
        return;
    }
    
    try {
        logInfo('Testing audit trail access and pagination...');
        
        // Test audit trail access
        const auditResponse = await api.get(`${CONFIG.serverUrl}/api/employee/audit-trail`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        logTest('Audit Trail Access', auditResponse.status === 200, 
            `Status: ${auditResponse.status}, Entries: ${auditResponse.data?.auditEntries?.length || 0}`);
        
        // Test audit trail pagination
        const paginatedResponse = await api.get(`${CONFIG.serverUrl}/api/employee/audit-trail?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        const hasPagination = paginatedResponse.status === 200 && 
                             paginatedResponse.data?.pagination;
        
        logTest('Audit Trail Pagination', hasPagination, 
            `Status: ${paginatedResponse.status}, Pagination: ${hasPagination ? 'Yes' : 'No'}`);
        
        // Verify audit trail contains expected action types
        if (auditResponse.status === 200 && auditResponse.data?.auditEntries) {
            const entries = auditResponse.data.auditEntries;
            const actionTypes = [...new Set(entries.map(entry => entry.action))];
            
            const expectedActions = ['LOGIN_SUCCESS', 'VIEW_PENDING_PAYMENTS', 'VERIFY_PAYMENT', 'REJECT_PAYMENT'];
            const foundActions = expectedActions.filter(action => actionTypes.includes(action));
            
            logTest('Audit Trail Action Types', foundActions.length > 0, 
                `Found actions: ${foundActions.join(', ')} (${foundActions.length}/${expectedActions.length})`);
        }
        
    } catch (error) {
        logTest('Audit Trail Functionality', false, `Error: ${error.message}`);
    }
}

async function testPaymentValidationEnhancements(customerTokens) {
    logSection('🛡️ TESTING ENHANCED PAYMENT VALIDATION');
    
    if (Object.keys(customerTokens).length === 0) {
        logTest('Payment Validation', false, 'No customer tokens available');
        return;
    }
    
    const customer = CONFIG.testCustomers[1]; // Benjamin Carter
    const token = customerTokens[customer.username];
    
    if (!token) {
        logTest('Payment Validation Setup', false, 'No token for test customer');
        return;
    }
    
    try {
        logInfo('Testing payment validation edge cases...');
        
        // Test 1: Invalid SWIFT code format
        const invalidSwiftData = {
            payeeName: 'Test Corporation',
            provider: 'SWIFT',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'INVALID', // Invalid format
            amount: '100.00',
            currency: 'USD'
        };
        
        const invalidSwiftResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            invalidSwiftData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        logTest('Invalid SWIFT Code Rejection', invalidSwiftResponse.status === 400, 
            `Status: ${invalidSwiftResponse.status}, Should reject invalid SWIFT format`);
        
        // Test 2: Invalid IBAN format
        const invalidIbanData = {
            payeeName: 'Test Corporation',
            provider: 'SWIFT',
            payeeAccountNumber: '123', // Too short for IBAN
            swiftCode: 'GLBLUS33',
            amount: '100.00',
            currency: 'USD'
        };
        
        const invalidIbanResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            invalidIbanData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        logTest('Invalid IBAN Rejection', invalidIbanResponse.status === 400, 
            `Status: ${invalidIbanResponse.status}, Should reject invalid IBAN format`);
        
        // Test 3: Invalid amount format
        const invalidAmountData = {
            payeeName: 'Test Corporation',
            provider: 'SWIFT',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'GLBLUS33',
            amount: 'not-a-number', // Invalid amount
            currency: 'USD'
        };
        
        const invalidAmountResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            invalidAmountData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        logTest('Invalid Amount Rejection', invalidAmountResponse.status === 400, 
            `Status: ${invalidAmountResponse.status}, Should reject invalid amount format`);
        
        // Test 4: SQL injection attempt in payee name
        const sqlInjectionData = {
            payeeName: "'; DROP TABLE payments; --",
            provider: 'SWIFT',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'GLBLUS33',
            amount: '100.00',
            currency: 'USD'
        };
        
        const sqlInjectionResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            sqlInjectionData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        logTest('SQL Injection Prevention', sqlInjectionResponse.status === 400, 
            `Status: ${sqlInjectionResponse.status}, Should reject malicious payee name`);
        
        // Test 5: Very large amount
        const largeAmountData = {
            payeeName: 'Test Corporation',
            provider: 'SWIFT',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'GLBLUS33',
            amount: '999999999.99', // Very large amount
            currency: 'USD'
        };
        
        const largeAmountResponse = await api.post(`${CONFIG.serverUrl}/api/payments/submit`, 
            largeAmountData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
        // This might be accepted or rejected depending on business rules
        logTest('Large Amount Handling', largeAmountResponse.status !== 500, 
            `Status: ${largeAmountResponse.status}, System handles large amounts gracefully`);
        
    } catch (error) {
        logTest('Payment Validation Enhancements', false, `Error: ${error.message}`);
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
            
            // NEW ENHANCED TESTS
            await delay(2000);
            await testPaymentVerificationWorkflow(customerTokens, employeeTokens);
            
            await delay(2000);
            await testRoleBasedAccessControl(employeeTokens);
            
            await delay(2000);
            await testAuditTrailFunctionality(employeeTokens);
            
            await delay(2000);
            await testPaymentValidationEnhancements(customerTokens);
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
        'Payment Flow': testStats.results.filter(r => r.test.includes('Payment') && !r.test.includes('Verification') && !r.test.includes('Validation')),
        'Payment Verification': testStats.results.filter(r => r.test.includes('Verification') || r.test.includes('Reject') || r.test.includes('SWIFT')),
        'Role Access Control': testStats.results.filter(r => r.test.includes('Access') && (r.test.includes('Manager') || r.test.includes('Admin') || r.test.includes('Employee'))),
        'Audit Trail': testStats.results.filter(r => r.test.includes('Audit')),
        'Validation': testStats.results.filter(r => r.test.includes('Validation') || r.test.includes('Invalid') || r.test.includes('Rejection')),
        'Security': testStats.results.filter(r => r.test.includes('Security') || r.test.includes('Unauthorized') || r.test.includes('Prevention'))
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
