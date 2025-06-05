# Dry Run of Cleanup Script
# This script checks what files would be deleted by the cleanup script without actually deleting them
# Usage: Run in PowerShell with administrator privileges from the project root directory

# Define project root directory
$projectRoot = "C:\Users\eliiz\Desktop\Learning\CustomerPortal"

# Display banner
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  APDS7311 Assignment - Cleanup Dry Run   " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan
Write-Host "This script will check which files would be removed by the cleanup script." -ForegroundColor Yellow
Write-Host "No files will be deleted.`n" -ForegroundColor Yellow

# Function to check if files exist
function Test-FilesExist {
    param (
        [string[]]$files,
        [string]$description
    )
    
    Write-Host "`nChecking $description..." -ForegroundColor Yellow
    $existingFiles = @()
    
    foreach ($file in $files) {
        $filePath = Join-Path $projectRoot $file
        if (Test-Path $filePath) {
            $existingFiles += $file
            Write-Host "  - Would delete: $file" -ForegroundColor Gray
        }
    }
    
    if ($existingFiles.Count -eq 0) {
        Write-Host "  - No matching files found" -ForegroundColor Yellow
    } else {
        Write-Host "  - Total: $($existingFiles.Count) file(s)" -ForegroundColor White
    }
    
    return $existingFiles
}

# 1. Check duplicate documentation files
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
$docsToDelete = Test-FilesExist -files $duplicateDocs -description "duplicate documentation files"

# 2. Check test and debug scripts
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
$scriptsToDelete = Test-FilesExist -files $testScripts -description "test and debug scripts"

# 3. Check redundant component files
$redundantComponents = @(
    "client/src/components/EmployeeDashboard_fixed.js"
)
$componentsToDelete = Test-FilesExist -files $redundantComponents -description "redundant component files"

# Summary
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Cleanup Dry Run Summary  " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$totalFiles = $docsToDelete.Count + $scriptsToDelete.Count + $componentsToDelete.Count
Write-Host "Total files that would be deleted: $totalFiles" -ForegroundColor Yellow

if ($totalFiles -gt 0) {
    Write-Host "`nBreakdown:" -ForegroundColor White
    Write-Host "  - Duplicate documentation files: $($docsToDelete.Count)" -ForegroundColor Gray
    Write-Host "  - Test and debug scripts: $($scriptsToDelete.Count)" -ForegroundColor Gray
    Write-Host "  - Redundant component files: $($componentsToDelete.Count)" -ForegroundColor Gray
}

Write-Host "`nTo actually perform the cleanup, run the cleanup_for_submission.ps1 script." -ForegroundColor Green
Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
