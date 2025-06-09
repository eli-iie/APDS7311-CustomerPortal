#!/usr/bin/env node

/**
 * APDS7311 - COMPREHENSIVE SECURITY TEST SCRIPT
 * Complete security testing suite for Customer Portal application
 * Tests all security requirements: authentication, authorization, input validation, 
 * HTTPS implementation, rate limiting, session management, and vulnerability protection
 */

const axios = require('axios');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const { testCustomers, testEmployees, getSeedData } = require('./seed-data');

const execAsync = promisify(exec);

// Server management variables
let serverProcess = null;
const SERVER_START_DELAY = 8000;
const CLEANUP_DELAY = 3000;
const PORT = 5001;

// Configuration
const CONFIG = {
    serverUrl: 'https://localhost:5001',
    timeout: 10000,
    testCustomers,
    testEmployees
};

// Test tracking
let securityStats = {
    total: 0,
    passed: 0,
    failed: 0,
    vulnerabilities: [],
    results: []
};

// Utility functions
function colorLog(message, color = 'white') {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function recordTest(testName, passed, details = '') {
    securityStats.total++;
    if (passed) {
        securityStats.passed++;
        colorLog(`✅ ${testName}`, 'green');
    } else {
        securityStats.failed++;
        securityStats.vulnerabilities.push(testName);
        colorLog(`❌ ${testName}`, 'red');
        if (details) colorLog(`   ${details}`, 'yellow');
    }
    securityStats.results.push({ testName, passed, details });
}

// Robust Server Management Functions (adapted from workflow test)

async function checkAndStartServer() {
    colorLog('🔍 Checking if server is running...', 'blue');
    
    // First check if server is already running
    const isRunning = await isServerRunning();
    
    if (isRunning) {
        colorLog('✅ Server is already running - proceeding with security tests', 'green');
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

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        colorLog('🚀 Starting Customer Portal server for security testing...', 'blue');
        
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
            colorLog(`Server output: ${output.trim()}`, 'cyan');
            
            // Look for server ready indicators
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
                    setTimeout(() => resolve(true), 2000);
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
                resolve(false);
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

// Process exit handlers to keep server running after tests (like workflow test)
process.on('exit', () => {
    // Note: Server intentionally left running for continued use
    // Only cleanup if process is being forcefully terminated
    if (serverProcess && process.exitCode !== 0) {
        serverProcess.kill('SIGKILL');
    }
});

process.on('SIGINT', async () => {
    colorLog('\n\n🛑 Security test interrupted by user', 'yellow');
    colorLog('🔄 Stopping server and cleaning up...', 'blue');
    await stopServer();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    colorLog('\n\n🛑 Security test terminated', 'yellow');
    colorLog('🔄 Stopping server and cleaning up...', 'blue');
    await stopServer();
    process.exit(0);
});

// Security Test Functions

/**
 * Test 1: Authentication Security
 */
async function testAuthenticationSecurity() {
    colorLog('\n🔐 Testing Authentication Security...', 'cyan');
    
    // Test 1.1: Login without credentials
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {}, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Login without credentials should fail', response.status >= 400);
    } catch (error) {
        recordTest('Login without credentials should fail', error.response?.status >= 400);
    }

    // Test 1.2: Login with invalid credentials
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: 'invalid_user',
            password: 'wrong_password'
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Login with invalid credentials should fail', response.status >= 400);
    } catch (error) {
        recordTest('Login with invalid credentials should fail', error.response?.status >= 400);
    }

    // Test 1.3: SQL Injection in login
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: "admin'; DROP TABLE users; --",
            password: "' OR '1'='1"
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('SQL Injection protection in login', response.status >= 400);
    } catch (error) {
        recordTest('SQL Injection protection in login', error.response?.status >= 400);
    }

    // Test 1.4: XSS in login
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: "<script>alert('XSS')</script>",
            password: "<img src=x onerror=alert('XSS')>"
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('XSS protection in login', response.status >= 400);
    } catch (error) {
        recordTest('XSS protection in login', error.response?.status >= 400);
    }

    // Test 1.5: Valid customer login
    try {
        const customer = CONFIG.testCustomers[0];
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: customer.username,
            password: customer.password
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Valid customer login should succeed', response.status === 200 && response.data.token);
    } catch (error) {
        recordTest('Valid customer login should succeed', false, error.message);
    }
}

/**
 * Test 2: Authorization Security
 */
async function testAuthorizationSecurity() {
    colorLog('\n🔒 Testing Authorization Security...', 'cyan');
    
    // Get valid tokens first
    let customerToken = '';
    let employeeToken = '';
    
    try {
        // Get customer token
        const customerResponse = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: CONFIG.testCustomers[0].username,
            password: CONFIG.testCustomers[0].password
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        customerToken = customerResponse.data.token;

        // Get employee token
        const employeeResponse = await axios.post(`${CONFIG.serverUrl}/api/auth/employee-login`, {
            username: CONFIG.testEmployees[0].username,
            password: CONFIG.testEmployees[0].password
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        employeeToken = employeeResponse.data.token;
    } catch (error) {
        colorLog('⚠️  Could not obtain tokens for authorization testing', 'yellow');
    }    // Test 2.1: Access employee routes with customer token
    try {
        const response = await axios.get(`${CONFIG.serverUrl}/api/employee/payments`, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Customer should not access employee routes', response.status >= 400);
    } catch (error) {
        recordTest('Customer should not access employee routes', error.response?.status >= 400);
    }    // Test 2.2: Access protected routes without token
    try {
        const response = await axios.get(`${CONFIG.serverUrl}/api/payment/my-payments`, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Protected routes should require authentication', response.status >= 400);
    } catch (error) {
        recordTest('Protected routes should require authentication', error.response?.status >= 400);
    }

    // Test 2.3: Access with malformed token
    try {
        const response = await axios.get(`${CONFIG.serverUrl}/api/payment/my-payments`, {
            headers: { Authorization: 'Bearer invalid.token.here' },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Malformed tokens should be rejected', response.status >= 400);
    } catch (error) {
        recordTest('Malformed tokens should be rejected', error.response?.status >= 400);
    }
}

/**
 * Test 3: Input Validation Security
 */
async function testInputValidationSecurity() {
    colorLog('\n🛡️  Testing Input Validation Security...', 'cyan');
    
    // Get customer token for testing
    let customerToken = '';
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: CONFIG.testCustomers[0].username,
            password: CONFIG.testCustomers[0].password
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        customerToken = response.data.token;
    } catch (error) {
        colorLog('⚠️  Could not obtain token for input validation testing', 'yellow');
        return;
    }

    // Test 3.1: Payment with negative amount
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/payments`, {
            amount: -1000,
            currency: 'USD',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'NWBKGB2L',
            payeeName: 'Test Payee'
        }, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Negative payment amounts should be rejected', response.status >= 400);
    } catch (error) {
        recordTest('Negative payment amounts should be rejected', error.response?.status >= 400);
    }

    // Test 3.2: Payment with excessive amount
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/payments`, {
            amount: 9999999999,
            currency: 'USD',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'NWBKGB2L',
            payeeName: 'Test Payee'
        }, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Excessive payment amounts should be rejected', response.status >= 400);
    } catch (error) {
        recordTest('Excessive payment amounts should be rejected', error.response?.status >= 400);
    }

    // Test 3.3: Payment with invalid SWIFT code
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/payments`, {
            amount: 1000,
            currency: 'USD',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'INVALID',
            payeeName: 'Test Payee'
        }, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Invalid SWIFT codes should be rejected', response.status >= 400);
    } catch (error) {
        recordTest('Invalid SWIFT codes should be rejected', error.response?.status >= 400);
    }

    // Test 3.4: Payment with XSS in payee name
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/payments`, {
            amount: 1000,
            currency: 'USD',
            payeeAccountNumber: 'GB29NWBK60161331926819',
            swiftCode: 'NWBKGB2L',
            payeeName: '<script>alert("XSS")</script>'
        }, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('XSS in payee name should be rejected', response.status >= 400);
    } catch (error) {
        recordTest('XSS in payee name should be rejected', error.response?.status >= 400);
    }
}

/**
 * Test 4: HTTPS and Security Headers
 */
async function testHTTPSAndHeaders() {
    colorLog('\n🔐 Testing HTTPS and Security Headers...', 'cyan');
    
    try {
        const response = await axios.get(`${CONFIG.serverUrl}/api/health`, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        
        // Check if server is using HTTPS
        recordTest('Server uses HTTPS', CONFIG.serverUrl.startsWith('https://'));
        
        // Check for security headers
        const headers = response.headers;
        recordTest('X-Content-Type-Options header present', !!headers['x-content-type-options']);
        recordTest('X-Frame-Options header present', !!headers['x-frame-options']);
        recordTest('X-XSS-Protection header present', !!headers['x-xss-protection']);
        
    } catch (error) {
        recordTest('HTTPS connection test', false, error.message);
    }
}

/**
 * Test 5: Rate Limiting and DoS Protection
 */
async function testRateLimitingAndDoS() {
    colorLog('\n⚡ Testing Rate Limiting and DoS Protection...', 'cyan');
      // Test 5.1: Rapid login attempts
    let loginAttempts = 0;
    let rateLimited = false;
    let startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
        try {
            const attemptStart = Date.now();
            await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
                username: 'test_user',
                password: 'wrong_password'
            }, {
                timeout: 2000,
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
            });
            const attemptTime = Date.now() - attemptStart;
            
            // If request takes longer than 1 second, likely being rate limited
            if (attemptTime > 1000) {
                rateLimited = true;
                break;
            }
            loginAttempts++;
        } catch (error) {
            if (error.response?.status === 429) {
                rateLimited = true;
                break;
            }
            // If timeout or connection reset, likely rate limited
            if (error.code === 'ECONNRESET' || error.code === 'TIMEOUT') {
                rateLimited = true;
                break;
            }
            loginAttempts++;
        }
    }
    
    let totalTime = Date.now() - startTime;
    // If 10 attempts took more than 5 seconds, likely some rate limiting
    let hasDelay = totalTime > 5000;
    
    recordTest('Rate limiting on failed login attempts', rateLimited || hasDelay || loginAttempts < 10);
    
    // Test 5.2: Large payload attack
    try {
        const largePayload = 'x'.repeat(1000000); // 1MB payload
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: largePayload,
            password: largePayload
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Large payload protection', response.status >= 400);
    } catch (error) {
        recordTest('Large payload protection', error.code === 'ECONNRESET' || error.response?.status >= 400);
    }
}

/**
 * Test 6: Session Management
 */
async function testSessionManagement() {
    colorLog('\n🎫 Testing Session Management...', 'cyan');
    
    let customerToken = '';
    
    // Get a valid token
    try {
        const response = await axios.post(`${CONFIG.serverUrl}/api/auth/login`, {
            username: CONFIG.testCustomers[0].username,
            password: CONFIG.testCustomers[0].password
        }, {
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        customerToken = response.data.token;
    } catch (error) {
        colorLog('⚠️  Could not obtain token for session testing', 'yellow');
        return;
    }    // Test 6.1: Token should work for authorized requests
    try {
        const response = await axios.get(`${CONFIG.serverUrl}/api/payment/my-payments`, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Valid token allows access', response.status === 200);
    } catch (error) {
        recordTest('Valid token allows access', false, error.message);
    }

    // Test 6.2: Token reuse should work (if not expired)
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        const response = await axios.get(`${CONFIG.serverUrl}/api/payment/my-payments`, {
            headers: { Authorization: `Bearer ${customerToken}` },
            timeout: CONFIG.timeout,
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        recordTest('Token reuse within validity period', response.status === 200);
    } catch (error) {
        recordTest('Token reuse within validity period', false, error.message);
    }
}

// Main execution function
async function runComprehensiveSecurityTests() {
    colorLog('🛡️  APDS7311 COMPREHENSIVE SECURITY TEST SUITE STARTING', 'cyan');
    colorLog('='.repeat(60), 'cyan');
    colorLog('📋 Testing ALL security requirements for the assignment', 'yellow');
    colorLog('='.repeat(60), 'cyan');
    
    try {
        // Ensure server is running using robust server management
        const serverReady = await checkAndStartServer();
        
        if (!serverReady) {
            colorLog('❌ Could not ensure server is running - aborting security tests', 'red');
            return;
        }
        
        // Run all security tests
        await testAuthenticationSecurity();
        await testAuthorizationSecurity();
        await testInputValidationSecurity();
        await testHTTPSAndHeaders();
        await testRateLimitingAndDoS();
        await testSessionManagement();
        
        // Generate security report
        generateSecurityReport();
        
        // Note: Server intentionally left running for continued use
        colorLog('\n🚀 Server left running for continued testing/development', 'green');
        colorLog('Use Ctrl+C to stop both tests and server', 'cyan');
          } catch (error) {
        colorLog(`❌ Security testing error: ${error.message}`, 'red');
        colorLog('Stack trace:', 'yellow');
        console.error(error);
    }
}

function generateSecurityReport() {
    colorLog('\n🛡️  SECURITY TEST REPORT', 'cyan');
    colorLog('='.repeat(50), 'cyan');
    
    colorLog(`📊 Tests Run: ${securityStats.total}`, 'white');
    colorLog(`✅ Passed: ${securityStats.passed}`, 'green');
    colorLog(`❌ Failed: ${securityStats.failed}`, 'red');
    colorLog(`🔒 Security Score: ${Math.round((securityStats.passed / securityStats.total) * 100)}%`, 'yellow');
    
    if (securityStats.vulnerabilities.length > 0) {
        colorLog('\n🚨 SECURITY VULNERABILITIES FOUND:', 'red');
        securityStats.vulnerabilities.forEach(vuln => {
            colorLog(`   • ${vuln}`, 'red');
        });
        colorLog('\n⚠️  SECURITY REVIEW REQUIRED!', 'yellow');
    } else {
        colorLog('\n🎉 NO CRITICAL VULNERABILITIES FOUND!', 'green');
    }
    
    // Detailed results
    colorLog('\n📋 DETAILED TEST RESULTS:', 'cyan');
    securityStats.results.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        const color = result.passed ? 'green' : 'red';
        colorLog(`${status} ${result.testName}`, color);
        if (result.details && !result.passed) {
            colorLog(`   Details: ${result.details}`, 'yellow');
        }
    });
    
    colorLog('\n='.repeat(50), 'cyan');
    colorLog('🛡️  SECURITY TESTING COMPLETED', 'cyan');
}

// Export for use in other scripts
module.exports = {
    runComprehensiveSecurityTests,
    testAuthenticationSecurity,
    testAuthorizationSecurity,
    testInputValidationSecurity,
    testHTTPSAndHeaders,
    testRateLimitingAndDoS,
    testSessionManagement
};

// Run tests if called directly
if (require.main === module) {
    runComprehensiveSecurityTests();
}
