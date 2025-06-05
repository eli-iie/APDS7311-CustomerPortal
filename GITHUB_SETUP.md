<!-- filepath: c:\Users\eliiz\Desktop\Learning\CustomerPortal\GITHUB_SETUP.md -->
# GitHub Repository Setup Guide

This guide will walk you through setting up your GitHub repository with automated SonarCloud analysis.

## 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the "+" icon in the upper right corner and select "New repository"
3. Name your repository `APDS7311-CustomerPortal`
4. Add a description: "Secure Customer International Payments Portal for APDS7311 Assignment"
5. Choose "Private" repository (or Public if required by your assignment)
6. Click "Create repository"

## 2. Push Your Code to GitHub

Run these commands in your terminal from the project root directory:

```powershell
# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Commit the changes
git commit -m "Initial commit for final submission"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/APDS7311-CustomerPortal.git

# Push the code to GitHub
git push -u origin main
```

## 3. Set Up SonarCloud

1. Go to [SonarCloud](https://sonarcloud.io/) and sign in with your GitHub account
2. Click "+" and select "Analyze new project"
3. Find and select your repository
4. Choose the free plan option
5. Select "GitHub Actions" as your analysis method
6. Follow SonarCloud's setup instructions to:
   - Generate a SONAR_TOKEN
   - Add it to your GitHub repository secrets

## 4. Add SONAR_TOKEN to GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `SONAR_TOKEN`
5. Value: Paste the token from SonarCloud
6. Click "Add secret"

## 5. Verify Setup

1. Go to the "Actions" tab in your GitHub repository
2. You should see the "SonarCloud Analysis" workflow
3. This workflow will run automatically when you push code
4. You can also manually trigger it by clicking "Run workflow"

## 6. Access SonarCloud Results

1. After the workflow runs successfully, go to [SonarCloud](https://sonarcloud.io/)
2. Find your project in the dashboard
3. Review the analysis results, including:
   - Code quality metrics
   - Security vulnerabilities
   - Code smells
   - Test coverage

The GitHub Actions workflow has been added to your project at `.github/workflows/sonarcloud.yml`
