#!/bin/powershell
# GitHub Repository Setup Script
# This script helps set up your GitHub repository with SonarCloud integration
# Usage: Run in PowerShell with administrator privileges

# Display banner
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  GitHub Repository Setup for SonarCloud Integration   " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# Check if Git is installed
$gitInstalled = $null -ne (Get-Command "git" -ErrorAction SilentlyContinue)
if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/downloads" -ForegroundColor Red
    exit 1
}

# Get GitHub username
Write-Host "Enter your GitHub username:" -ForegroundColor Yellow
$githubUsername = Read-Host

# Initialize Git repository if needed
if (-not (Test-Path ".git")) {
    Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "`n✅ Git repository already initialized" -ForegroundColor Green
}

# Add remote repository
Write-Host "`nAdding remote repository..." -ForegroundColor Yellow
git remote add origin "https://github.com/$githubUsername/APDS7311-CustomerPortal.git"
Write-Host "✅ Remote repository added" -ForegroundColor Green

# Stage all files
Write-Host "`nStaging all files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged" -ForegroundColor Green

# Commit changes
Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "Initial commit with SonarCloud integration"
Write-Host "✅ Changes committed" -ForegroundColor Green

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Write-Host "This will push your code to the GitHub repository."
Write-Host "You may be prompted to enter your GitHub credentials." -ForegroundColor Yellow
Write-Host "`nDo you want to push the code now? (Y/N)" -ForegroundColor Yellow
$confirmation = Read-Host
if ($confirmation -eq "Y" -or $confirmation -eq "y") {
    git push -u origin main
    Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "Push skipped. You can push manually later using: git push -u origin main" -ForegroundColor Yellow
}

# Next steps
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Next Steps   " -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan
Write-Host "1. Create a SonarCloud account at https://sonarcloud.io/" -ForegroundColor White
Write-Host "2. Link your GitHub account to SonarCloud" -ForegroundColor White
Write-Host "3. Set up your project in SonarCloud" -ForegroundColor White
Write-Host "4. Generate a SONAR_TOKEN" -ForegroundColor White
Write-Host "5. Add the SONAR_TOKEN to your GitHub repository secrets" -ForegroundColor White
Write-Host "`nFor detailed instructions, see the GITHUB_SETUP.md file" -ForegroundColor White

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
