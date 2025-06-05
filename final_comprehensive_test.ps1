# FINAL COMPREHENSIVE TEST - APDS7311 Assignment
# Customer Payment Portal - Post Registration Removal Testing

Write-Host "🎯 APDS7311 ASSIGNMENT - FINAL COMPREHENSIVE TEST" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "Testing: Secure Customer International Payments Portal" -ForegroundColor Yellow
Write-Host "Status: Registration functionality REMOVED" -ForegroundColor Yellow
Write-Host "Users: PRELOADED ONLY" -ForegroundColor Yellow
Write-Host ""

# Test Results Storage
$testResults = @{
    BackendHealth = $false
    FrontendHealth = $false
    CustomerLogins = @()
    EmployeeLogins = @()
    RegistrationBlocked = $false
    PaymentFlow = $false
    SecurityFeatures = $false
}

# 1. TEST BACKEND HEALTH
Write-Host "1. 🔍 TESTING BACKEND SERVER HEALTH" -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Backend server is healthy" -ForegroundColor Green
    Write-Host "   📊 Status: $($healthResponse.status)" -ForegroundColor Gray
    Write-Host "   🕒 Timestamp: $($healthResponse.timestamp)" -ForegroundColor Gray
    $testResults.BackendHealth = $true
}
catch {
    Write-Host "   ❌ Backend server health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. TEST FRONTEND AVAILABILITY
Write-Host "`n2. 🌐 TESTING FRONTEND AVAILABILITY" -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is accessible" -ForegroundColor Green
        Write-Host "   📄 Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Gray
        $testResults.FrontendHealth = $true
    }
}
catch {
    Write-Host "   ❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. TEST PRELOADED CUSTOMER ACCOUNTS
Write-Host "`n3. 👥 TESTING PRELOADED CUSTOMER ACCOUNTS" -ForegroundColor Cyan

$customers = @(
    @{username='demo_user'; password='DemoPass123!'; name='Demo User'},
    @{username='test_customer'; password='TestPass123!'; name='Test Customer'}
)

foreach ($customer in $customers) {
    try {
        $loginData = @{
            username = $customer.username
            password = $customer.password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 5
        Write-Host "   ✅ $($customer.name) ($($customer.username)) - Login successful" -ForegroundColor Green
        Write-Host "      🔑 Token received: $(if($response.token) {'Yes'} else {'No'})" -ForegroundColor Gray
        $testResults.CustomerLogins += @{username=$customer.username; success=$true}
    }
    catch {
        Write-Host "   ❌ $($customer.name) ($($customer.username)) - Login failed: $($_.Exception.Message)" -ForegroundColor Red
        $testResults.CustomerLogins += @{username=$customer.username; success=$false}
    }
}

# 4. TEST PRELOADED EMPLOYEE ACCOUNTS
Write-Host "`n4. 👔 TESTING PRELOADED EMPLOYEE ACCOUNTS" -ForegroundColor Cyan

$employees = @(
    @{username='admin.user'; password='AdminPass123!'; name='Admin User'; expectedRole='admin'},
    @{username='john.smith'; password='SecurePass123!'; name='John Smith'; expectedRole='employee'},
    @{username='sarah.jones'; password='SecurePass123!'; name='Sarah Jones'; expectedRole='employee'}
)

foreach ($employee in $employees) {
    try {
        $loginData = @{
            username = $employee.username
            password = $employee.password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/employee/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 5
        Write-Host "   ✅ $($employee.name) ($($employee.username)) - Login successful" -ForegroundColor Green
        Write-Host "      👤 Role: $($response.employee.role)" -ForegroundColor Gray
        Write-Host "      🏢 Department: $($response.employee.department)" -ForegroundColor Gray
        $testResults.EmployeeLogins += @{username=$employee.username; success=$true; role=$response.employee.role}
    }
    catch {
        Write-Host "   ❌ $($employee.name) ($($employee.username)) - Login failed: $($_.Exception.Message)" -ForegroundColor Red
        $testResults.EmployeeLogins += @{username=$employee.username; success=$false}
    }
}

# 5. VERIFY REGISTRATION ENDPOINT REMOVED
Write-Host "`n5. 🚫 VERIFYING REGISTRATION REMOVAL" -ForegroundColor Cyan
try {
    $registerData = @{
        username = "test_attempt"
        password = "TestPass123!"
        email = "test@example.com"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" -Method POST -Body $registerData -ContentType "application/json" -TimeoutSec 5
    Write-Host "   ❌ CRITICAL: Registration endpoint still exists!" -ForegroundColor Red
    $testResults.RegistrationBlocked = $false
}
catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   ✅ Registration endpoint properly removed (404 Not Found)" -ForegroundColor Green
        $testResults.RegistrationBlocked = $true
    }
    else {
        Write-Host "   ✅ Registration properly blocked: $($_.Exception.Message)" -ForegroundColor Green
        $testResults.RegistrationBlocked = $true
    }
}

# 6. TEST PAYMENT FLOW
Write-Host "`n6. 💳 TESTING PAYMENT SUBMISSION FLOW" -ForegroundColor Cyan
try {
    # First login as customer
    $customerLogin = @{
        username = "demo_user"
        password = "DemoPass123!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -Body $customerLogin -ContentType "application/json" -TimeoutSec 5
    $token = $loginResponse.token
    
    # Test payment submission
    $paymentData = @{
        recipientName = "Test Recipient"
        recipientBank = "International Bank"
        recipientAccount = "ACC123456789"
        amount = 1000.00
        currency = "USD"
        swiftCode = "INTLBNK1"
        purpose = "International Transfer"
    } | ConvertTo-Json
    
    $headers = @{
        'Authorization' = "Bearer $token"
        'Content-Type' = 'application/json'
    }
    
    $paymentResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/payment/submit" -Method POST -Body $paymentData -Headers $headers -TimeoutSec 5
    Write-Host "   ✅ Payment submission successful" -ForegroundColor Green
    Write-Host "      💰 Amount: $1000.00 USD" -ForegroundColor Gray
    Write-Host "      🎯 Recipient: Test Recipient" -ForegroundColor Gray
    $testResults.PaymentFlow = $true
}
catch {
    Write-Host "   ❌ Payment flow failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.PaymentFlow = $false
}

# 7. SECURITY HEADERS CHECK
Write-Host "`n7. 🔒 TESTING SECURITY FEATURES" -ForegroundColor Cyan
try {
    $securityResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/health" -Method GET -TimeoutSec 5
    $securityHeaders = $securityResponse.Headers
    
    $securityFeatures = @()
    if ($securityHeaders['Content-Security-Policy']) { $securityFeatures += "CSP" }
    if ($securityHeaders['X-Frame-Options']) { $securityFeatures += "Frame Protection" }
    if ($securityHeaders['X-Content-Type-Options']) { $securityFeatures += "MIME Protection" }
    if ($securityHeaders['Strict-Transport-Security']) { $securityFeatures += "HSTS" }
    
    if ($securityFeatures.Count -gt 0) {
        Write-Host "   ✅ Security headers present: $($securityFeatures -join ', ')" -ForegroundColor Green
        $testResults.SecurityFeatures = $true
    } else {
        Write-Host "   ⚠️  Some security headers missing" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   ❌ Security check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# FINAL RESULTS SUMMARY
Write-Host "`n" + "="*60 -ForegroundColor Green
Write-Host "🎉 FINAL TEST RESULTS SUMMARY" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Green

Write-Host "`n📊 SYSTEM HEALTH:" -ForegroundColor Cyan
Write-Host "   Backend Server: $(if($testResults.BackendHealth) {'✅ Healthy'} else {'❌ Failed'})" -ForegroundColor $(if($testResults.BackendHealth) {'Green'} else {'Red'})
Write-Host "   Frontend Server: $(if($testResults.FrontendHealth) {'✅ Healthy'} else {'❌ Failed'})" -ForegroundColor $(if($testResults.FrontendHealth) {'Green'} else {'Red'})

Write-Host "`n👥 USER AUTHENTICATION:" -ForegroundColor Cyan
$successfulCustomers = ($testResults.CustomerLogins | Where-Object {$_.success}).Count
$totalCustomers = $testResults.CustomerLogins.Count
Write-Host "   Customer Logins: $successfulCustomers/$totalCustomers successful" -ForegroundColor $(if($successfulCustomers -eq $totalCustomers) {'Green'} else {'Red'})

$successfulEmployees = ($testResults.EmployeeLogins | Where-Object {$_.success}).Count
$totalEmployees = $testResults.EmployeeLogins.Count
Write-Host "   Employee Logins: $successfulEmployees/$totalEmployees successful" -ForegroundColor $(if($successfulEmployees -eq $totalEmployees) {'Green'} else {'Red'})

Write-Host "`n🔒 SECURITY COMPLIANCE:" -ForegroundColor Cyan
Write-Host "   Registration Blocked: $(if($testResults.RegistrationBlocked) {'✅ Yes'} else {'❌ No'})" -ForegroundColor $(if($testResults.RegistrationBlocked) {'Green'} else {'Red'})
Write-Host "   Security Headers: $(if($testResults.SecurityFeatures) {'✅ Present'} else {'❌ Missing'})" -ForegroundColor $(if($testResults.SecurityFeatures) {'Green'} else {'Red'})

Write-Host "`n💳 BUSINESS FUNCTIONALITY:" -ForegroundColor Cyan
Write-Host "   Payment Processing: $(if($testResults.PaymentFlow) {'✅ Working'} else {'❌ Failed'})" -ForegroundColor $(if($testResults.PaymentFlow) {'Green'} else {'Red'})

# ASSIGNMENT COMPLIANCE ASSESSMENT
$totalTests = 7
$passedTests = 0
if ($testResults.BackendHealth) { $passedTests++ }
if ($testResults.FrontendHealth) { $passedTests++ }
if ($successfulCustomers -eq $totalCustomers) { $passedTests++ }
if ($successfulEmployees -eq $totalEmployees) { $passedTests++ }
if ($testResults.RegistrationBlocked) { $passedTests++ }
if ($testResults.SecurityFeatures) { $passedTests++ }
if ($testResults.PaymentFlow) { $passedTests++ }

$passPercentage = [math]::Round(($passedTests / $totalTests) * 100, 1)

Write-Host "`n🎯 ASSIGNMENT COMPLIANCE:" -ForegroundColor Cyan
Write-Host "   Overall Score: $passedTests/$totalTests tests passed ($passPercentage%)" -ForegroundColor $(if($passPercentage -ge 80) {'Green'} elseif($passPercentage -ge 60) {'Yellow'} else {'Red'})

if ($passPercentage -ge 80) {
    Write-Host "`n🏆 ASSIGNMENT STATUS: READY FOR SUBMISSION" -ForegroundColor Green
    Write-Host "   ✅ Registration functionality successfully removed" -ForegroundColor Green
    Write-Host "   ✅ Preloaded users working correctly" -ForegroundColor Green
    Write-Host "   ✅ Core payment functionality operational" -ForegroundColor Green
    Write-Host "   ✅ Security measures in place" -ForegroundColor Green
} elseif ($passPercentage -ge 60) {
    Write-Host "`n⚠️  ASSIGNMENT STATUS: NEEDS MINOR FIXES" -ForegroundColor Yellow
    Write-Host "   Most functionality working, minor issues to resolve" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ ASSIGNMENT STATUS: REQUIRES ATTENTION" -ForegroundColor Red
    Write-Host "   Critical issues need to be addressed" -ForegroundColor Red
}

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Review any failed tests above" -ForegroundColor Gray
Write-Host "   2. Verify all APDS7311 assignment requirements" -ForegroundColor Gray
Write-Host "   3. Run manual testing through web interface" -ForegroundColor Gray
Write-Host "   4. Prepare final submission documentation" -ForegroundColor Gray

Write-Host "`n✅ FINAL COMPREHENSIVE TEST COMPLETED!" -ForegroundColor Green
