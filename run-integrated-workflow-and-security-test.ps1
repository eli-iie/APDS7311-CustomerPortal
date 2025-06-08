# Customer Portal Integrated Workflow and Security Test Runner
# Starts server, runs comprehensive workflow tests first, then security tests

Write-Host "CUSTOMER PORTAL - INTEGRATED WORKFLOW & SECURITY TEST" -ForegroundColor Cyan
Write-Host "Comprehensive Workflow -> Security Validation Testing" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Function to clean up processes
function Stop-AllProcesses {
    Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
    
    # Kill all node and npm processes using taskkill for reliability
    taskkill /F /IM node.exe /T 2>$null
    taskkill /F /IM npm.cmd /T 2>$null
    
    # Also try PowerShell method as backup
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Write-Host "Process cleanup completed" -ForegroundColor Green
}

# Function to start development servers
function Start-DevServers {
    Write-Host "Starting development servers..." -ForegroundColor Yellow
    Write-Host "  React Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  Express Backend: https://localhost:5001" -ForegroundColor Cyan
    
    # Start npm run dev without opening new window
    $process = Start-Process -FilePath "cmd" -ArgumentList "/c", "npm", "run", "dev" -WorkingDirectory $PSScriptRoot -PassThru -WindowStyle Hidden
    
    Write-Host "Servers started (PID: $($process.Id))" -ForegroundColor Green
    return $process
}

# Main execution
try {
    # Step 1: Clean up existing processes
    Stop-AllProcesses
    Start-Sleep -Seconds 2
    
    # Step 2: Check dependencies
    Write-Host "Checking dependencies..." -ForegroundColor Yellow
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing root dependencies..." -ForegroundColor Yellow
        & npm install
    }
    if (!(Test-Path "server/node_modules")) {
        Write-Host "Installing server dependencies..." -ForegroundColor Yellow
        & npm run install-server
    }
    Write-Host "Dependencies ready" -ForegroundColor Green
    
    # Step 3: Start development servers
    $serverProcess = Start-DevServers
    
    # Step 4: Wait for servers to be ready
    Write-Host "Waiting for servers to initialize..." -ForegroundColor Yellow
    Write-Host "React (port 3000) and Express (port 5001) servers are starting..." -ForegroundColor Gray
    Write-Host "Waiting 20 seconds for startup..." -ForegroundColor Gray
    Start-Sleep -Seconds 20
    Write-Host "Server startup wait complete - proceeding with tests" -ForegroundColor Green
    
    # Step 5: Run COMPREHENSIVE WORKFLOW tests first
    Write-Host "" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "PHASE 1: COMPREHENSIVE WORKFLOW TESTING" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    if (!(Test-Path "comprehensive-workflow-test.js")) {
        throw "Workflow test script not found: comprehensive-workflow-test.js"
    }
    
    & node "comprehensive-workflow-test.js"
    $workflowExitCode = $LASTEXITCODE
    
    if ($workflowExitCode -eq 0) {
        Write-Host "Workflow tests completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Workflow tests completed with exit code: $workflowExitCode" -ForegroundColor Yellow
    }
    
    # Brief pause between test phases
    Write-Host "" -ForegroundColor White
    Write-Host "Brief pause between test phases..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
    
    # Step 6: Run SECURITY tests second
    Write-Host "" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "PHASE 2: ENHANCED SECURITY VALIDATION" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    
    if (!(Test-Path "enhanced-security-test.js")) {
        throw "Security test script not found: enhanced-security-test.js"
    }
    
    & node "enhanced-security-test.js"
    $securityExitCode = $LASTEXITCODE
    
    if ($securityExitCode -eq 0) {
        Write-Host "Security tests completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Security tests completed with exit code: $securityExitCode" -ForegroundColor Yellow
    }
    
    # Final summary
    Write-Host "" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "COMPLETE TEST SUITE SUMMARY" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    if ($workflowExitCode -eq 0) {
        Write-Host "Workflow Tests: PASSED" -ForegroundColor Green
    } else {
        Write-Host "Workflow Tests: Issues detected (code: $workflowExitCode)" -ForegroundColor Yellow
    }
    
    if ($securityExitCode -eq 0) {
        Write-Host "Security Tests: PASSED" -ForegroundColor Green
    } else {
        Write-Host "Security Tests: Issues detected (code: $securityExitCode)" -ForegroundColor Yellow
    }
    
    if ($workflowExitCode -eq 0 -and $securityExitCode -eq 0) {
        Write-Host "" -ForegroundColor White
        Write-Host "ALL TESTS PASSED! Customer Portal fully validated!" -ForegroundColor Green
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Always clean up
    Write-Host "" -ForegroundColor White
    Write-Host "Performing cleanup..." -ForegroundColor Yellow
    
    if ($serverProcess -and !$serverProcess.HasExited) {
        Write-Host "Stopping server process..." -ForegroundColor Gray
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    Stop-AllProcesses
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Integrated test suite finished at $(Get-Date)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
