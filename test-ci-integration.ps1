#!/bin/powershell
# Test CircleCI and SonarCloud Integration
# This script pushes a test change to GitHub to trigger the CircleCI pipeline
# Usage: Run in PowerShell from the project root directory

# Display banner
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Testing CircleCI Pipeline with SonarCloud Analysis   " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# Check if git is installed
$gitInstalled = $null -ne (Get-Command "git" -ErrorAction SilentlyContinue)
if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/downloads" -ForegroundColor Red
    exit 1
}

# Check for GitHub username
Write-Host "Please enter your GitHub username:" -ForegroundColor Yellow
$githubUsername = Read-Host

# Confirm repository name or allow customization
$repoName = "APDS7311-CustomerPortal"
Write-Host "Is '$repoName' the correct repository name? (Y/N)" -ForegroundColor Yellow
$repoConfirmation = Read-Host
if ($repoConfirmation -ne "Y" -and $repoConfirmation -ne "y") {
    Write-Host "Please enter the correct repository name:" -ForegroundColor Yellow
    $repoName = Read-Host
}

# Check if .git directory exists
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    
    # Add remote repository
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin "https://github.com/$githubUsername/$repoName.git"
    Write-Host "✅ Remote repository added" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
    
    # Check if remote exists
    $remoteExists = git remote -v
    if (-not $remoteExists) {
        Write-Host "Adding remote repository..." -ForegroundColor Yellow
        git remote add origin "https://github.com/$githubUsername/$repoName.git"
        Write-Host "✅ Remote repository added" -ForegroundColor Green
    }
}

# Stage all changes including the new test file
Write-Host "`nStaging changes..." -ForegroundColor Yellow
git add .
Write-Host "✅ Changes staged" -ForegroundColor Green

# Commit changes
Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "Test: Trigger CircleCI pipeline with SonarCloud analysis"
Write-Host "✅ Changes committed" -ForegroundColor Green

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Write-Host "This will trigger the CircleCI pipeline with SonarCloud analysis." -ForegroundColor Yellow
Write-Host "You may be prompted to enter your GitHub credentials." -ForegroundColor Yellow
Write-Host "`nDo you want to proceed? (Y/N)" -ForegroundColor Yellow
$confirmation = Read-Host

if ($confirmation -eq "Y" -or $confirmation -eq "y") {
    # Determine the current branch
    $currentBranch = git rev-parse --abbrev-ref HEAD
    
    # If not on a branch (detached HEAD), create and checkout main branch
    if ($currentBranch -eq "HEAD") {
        Write-Host "Creating and checking out 'main' branch..." -ForegroundColor Yellow
        git checkout -b main
        $currentBranch = "main"
    }
    
    # Push to the current branch
    git push -u origin $currentBranch
    
    Write-Host "`n✅ Changes pushed to GitHub. CircleCI pipeline should start automatically." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your CircleCI dashboard: https://app.circleci.com/pipelines" -ForegroundColor White
    Write-Host "2. Verify that the pipeline is running" -ForegroundColor White
    Write-Host "3. Check the 'sonarcloud-analysis' job" -ForegroundColor White
    Write-Host "4. After completion, visit your SonarCloud dashboard: https://sonarcloud.io" -ForegroundColor White
    Write-Host "5. Verify that a new analysis has been triggered" -ForegroundColor White
} else {
    Write-Host "`nPush cancelled. You can push manually later with: git push -u origin main" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
