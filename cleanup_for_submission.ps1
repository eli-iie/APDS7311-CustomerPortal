# Clean Up Script for Final Submission
# This script cleans up the project for final submission by removing unnecessary files
# Usage: Run in PowerShell with administrator privileges from the project root directory

# Define project root directory
$projectRoot = "C:\Users\eliiz\Desktop\Learning\CustomerPortal"

# Display banner
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  APDS7311 Assignment - Final Submission Cleanup Tool   " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan
Write-Host "This script will clean up your project for final submission." -ForegroundColor Yellow
Write-Host "It will remove unnecessary files and consolidate documentation.`n" -ForegroundColor Yellow

# Function to remove files safely
function Remove-FilesSafely {
    param (
        [string[]]$files,
        [string]$description
    )
    
    Write-Host "`nRemoving $description..." -ForegroundColor Yellow
    
    foreach ($file in $files) {
        $filePath = Join-Path $projectRoot $file
        if (Test-Path $filePath) {
            Remove-Item $filePath -Force
            Write-Host "  - Deleted: $file" -ForegroundColor Gray
        }
    }
}

# Ask for confirmation before proceeding
Write-Host "Do you want to proceed with cleanup? (This action cannot be undone)" -ForegroundColor Red
$confirmation = Read-Host "Type 'YES' to continue, any other key to cancel"

if ($confirmation -ne "YES") {
    Write-Host "`nCleanup cancelled. No files were modified." -ForegroundColor Yellow
    exit
}

# 1. Remove duplicate documentation files
$duplicateDocs = @(
    "ASSIGNMENT_COMPLIANCE_ANALYSIS.md",
    "COMPILATION_ERROR_RESOLUTION.md",
    "COMPREHENSIVE_TEST_RESULTS_FINAL.md",
    "FINAL_ASSIGNMENT_ASSESSMENT.md",
    "FINAL_COMPLETION_STATUS.md",
    "FINAL_COMPLETION_STATUS_VERIFIED.md",
    "FINAL_STATUS_REPORT.md",
    "REGISTRATION_REMOVAL_TEST.md",
    "USER_MANAGEMENT_REMOVAL_COMPLETION.md"
)
# Note: CIRCLECI_SETUP.md is now kept as it contains important CircleCI/SonarCloud setup information for the assignment
Remove-FilesSafely -files $duplicateDocs -description "duplicate documentation files"

# 2. Remove test and debug scripts
$testScripts = @(
    "complete_test.js",
    "manual_login_test.js",
    "quick_test.js",
    "test_node.js",
    "test_employee_login.js",
    "test_application.ps1",
    "final_comprehensive_test.ps1",
    "start_backend.js",
    "clear_cache_and_restart.bat"
)

# 3. Remove fixed/backup component files
$redundantComponents = @(
    "client/src/components/EmployeeDashboard_fixed.js"
)
Remove-FilesSafely -files $testScripts -description "test and debug scripts"

# Remove redundant component files
Remove-FilesSafely -files $redundantComponents -description "redundant component files"

# 4. Check and run SonarQube analysis
Write-Host "`nPreparing SonarQube Analysis..." -ForegroundColor Yellow

# Check if sonar-scanner is available in PATH
$sonarScannerAvailable = $null -ne (Get-Command "sonar-scanner" -ErrorAction SilentlyContinue)

if ($sonarScannerAvailable) {
    Write-Host "  - sonar-scanner found in PATH" -ForegroundColor Green
    Write-Host "  - Running SonarCloud analysis..." -ForegroundColor Yellow
      # Run SonarQube analysis with focus on hotspots and code smells
    try {
        & sonar-scanner -D"sonar.organization=eli-iie" -D"sonar.projectKey=eli-iie_APDS7311-CustomerPortal" -D"sonar.sources=." -D"sonar.host.url=https://sonarcloud.io" -D"sonar.login=3ca93cfe1d8a0b023e5c0d0f76d12b66b6dd8ac2" -D"sonar.security.hotspots.enable=true" -D"sonar.security.enableCodeSmells=true" -D"sonar.verbose=true"
        Write-Host "  - SonarCloud analysis for hotspots and code smells completed successfully" -ForegroundColor Green
    } catch {
        Write-Host "  - Error running SonarCloud analysis: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  - sonar-scanner not found in PATH" -ForegroundColor Red
    Write-Host "  - Please install sonar-scanner or run SonarCloud analysis manually" -ForegroundColor Yellow
}

# 4. Final message
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Project Cleanup Complete!   " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan
Write-Host "The following important files have been preserved:" -ForegroundColor Green
Write-Host "  - README.md (Main project documentation)" -ForegroundColor Gray
Write-Host "  - PRELOADED_USERS.md (Account information for testing)" -ForegroundColor Gray
Write-Host "  - PROJECT_SUMMARY.md (Technical overview)" -ForegroundColor Gray
Write-Host "  - FINAL_SUBMISSION_STATUS.md (Submission readiness report)" -ForegroundColor Gray
Write-Host "  - VIDEO_SCRIPT.md (Video demonstration script)" -ForegroundColor Gray
Write-Host "  - CIRCLECI_SETUP.md (CircleCI and SonarCloud integration guide)" -ForegroundColor Gray
Write-Host "  - SONARCLOUD_ANALYSIS.md (SonarCloud configuration documentation)" -ForegroundColor Gray
Write-Host "  - ./docs/System_Requirements_Document.md (Requirements specification)" -ForegroundColor Gray
Write-Host "  - All source code in client/, server/, and tests/ directories" -ForegroundColor Gray
Write-Host "  - CircleCI configuration files for SonarCloud integration" -ForegroundColor Gray

Write-Host "`nYour project is now ready for final submission!" -ForegroundColor Green
Write-Host "Recommended next steps:" -ForegroundColor Yellow
Write-Host "  1. Record your demonstration video using the VIDEO_SCRIPT.md" -ForegroundColor Gray
Write-Host "  2. Verify all requirements in FINAL_SUBMISSION_STATUS.md" -ForegroundColor Gray
Write-Host "  3. Check SonarCloud dashboard for any issues" -ForegroundColor Gray
Write-Host "  4. Submit your assignment" -ForegroundColor Gray

Write-Host "`nGood luck with your submission!" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
