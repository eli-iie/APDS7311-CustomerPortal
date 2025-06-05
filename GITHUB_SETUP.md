# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com and log in to your account
2. Click "New" to create a new repository
3. Repository name: `secure-customer-payments-portal`
4. Description: `APDS7311 Assignment - Secure Customer International Payments Portal`
5. Set as **Public** (for assignment submission)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Push Local Repository to GitHub

Run these commands in your terminal:

```bash
# Add the GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/secure-customer-payments-portal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Set up Circle CI

1. Go to https://circleci.com and sign in with your GitHub account
2. Click "Projects" in the sidebar
3. Find your `secure-customer-payments-portal` repository
4. Click "Set Up Project"
5. Choose "Use existing config" (we already have `.circleci/config.yml`)
6. Click "Start Building"

## Step 4: Configure SonarCloud

1. Go to https://sonarcloud.io and sign in with your GitHub account
2. Click "+" and select "Analyze new project"
3. Choose your `secure-customer-payments-portal` repository
4. Select "Previous version" for analysis method
5. Copy the project key and token
6. In Circle CI, go to your project settings
7. Add environment variables:
   - `SONAR_TOKEN`: [paste your SonarCloud token]
   - `SONAR_PROJECT_KEY`: [paste your project key]

## Step 5: Verify Pipeline

1. Make a small change to trigger the pipeline
2. Check Circle CI dashboard for build status
3. Check SonarCloud for code quality analysis
4. Verify both pass successfully

## CI/CD Pipeline Features

Your pipeline includes:
- Node.js dependency installation
- Security vulnerability scanning
- Code quality analysis with SonarQube
- Automated testing execution
- Build verification

## Repository Structure

```
secure-customer-payments-portal/
├── .circleci/config.yml        # Circle CI pipeline configuration
├── sonar-project.properties    # SonarQube project settings
├── README.md                   # Project documentation
├── PROJECT_SUMMARY.md          # Assignment summary
├── client/                     # React frontend
├── server/                     # Node.js backend
├── docs/                       # Technical documentation
└── tests/                      # Test suites
```

This setup provides a complete CI/CD pipeline with automated code quality checks as required by the assignment.
