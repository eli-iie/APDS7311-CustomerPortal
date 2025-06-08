# Customer Portal Comprehensive Test Runner
# PowerShell script for reliable server management and testing

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Customer Portal Comprehensive Test Runner" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

try {
    # Step 1: Kill existing Node.js processes
    Write-Host "`n[1/4] Cleaning up existing processes..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Process cleanup completed" -ForegroundColor Green

    # Step 2: Start server in background
    Write-Host "`n[2/4] Starting Customer Portal server..." -ForegroundColor Yellow
    $serverPath = Join-Path $PSScriptRoot "server"
    $serverProcess = Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory $serverPath -PassThru -WindowStyle Hidden
    Write-Host "✅ Server started (PID: $($serverProcess.Id))" -ForegroundColor Green

    # Step 3: Wait for server startup
    Write-Host "`n[3/4] Waiting for server initialization..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    
    # Optional: Test server connectivity
    try {
        $response = Invoke-WebRequest -Uri "https://localhost:5001" -SkipCertificateCheck -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Server is responding (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Server connectivity uncertain - proceeding with tests" -ForegroundColor Yellow
    }

    # Step 4: Run comprehensive tests
    Write-Host "`n[4/4] Running comprehensive tests..." -ForegroundColor Yellow
    $testScript = Join-Path $PSScriptRoot "simple-comprehensive-test.js"
    & node $testScript

    Write-Host "`n✅ Test execution completed!" -ForegroundColor Green

} catch {
    Write-Host "`n❌ Error during test execution: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Cleanup: Stop server
    Write-Host "`n[CLEANUP] Stopping server..." -ForegroundColor Yellow
    if ($serverProcess -and !$serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force
        Write-Host "✅ Server stopped" -ForegroundColor Green
    } else {
        # Fallback: Kill all node processes
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        Write-Host "✅ All Node.js processes stopped" -ForegroundColor Green
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Test Runner Completed: $(Get-Date)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Keep window open
Read-Host "`nPress Enter to exit"
