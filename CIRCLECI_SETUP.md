<!-- filepath: c:\Users\eliiz\Desktop\Learning\CustomerPortal\CIRCLECI_SETUP.md -->
# CircleCI and SonarCloud Integration Guide

This guide will walk you through setting up your CircleCI pipeline with SonarCloud integration for code quality analysis, focusing specifically on security hotspots and code smells as required by the assignment.

## 1. Setting Up Your GitHub Repository

1. Create a GitHub repository for your project:
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" icon and select "New repository"
   - Name it `APDS7311-CustomerPortal`
   - Add an appropriate description
   - Choose public or private visibility as required
   - Click "Create repository"

2. Push your code to the repository:
   ```powershell
   # Initialize git repository (if not already initialized)
   git init
   
   # Add all files
   git add .
   
   # Commit the changes
   git commit -m "Initial commit with CircleCI and SonarCloud integration"
   
   # Add remote and push (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/APDS7311-CustomerPortal.git
   git push -u origin main
   ```

## 2. Setting Up CircleCI

1. Sign up/Log in to [CircleCI](https://circleci.com/) using your GitHub account
2. Click "Add Projects" in the left sidebar
3. Find your `APDS7311-CustomerPortal` repository
4. Click "Set Up Project"
5. Select "Use Existing Config" as we already have `.circleci/config.yml` in the repository
6. Click "Start Building" to initiate the first build

## 3. Setting Up SonarCloud

1. Sign up/Log in to [SonarCloud](https://sonarcloud.io/) using your GitHub account
2. Click "+" at the top right and select "Analyze new project"
3. Find and select your `APDS7311-CustomerPortal` repository
4. Choose the free plan
5. Set up the organization:
   - Create a new organization named `eli-iie` (or use an existing one)
   - Set the project key to `eli-iie_APDS7311-CustomerPortal`

## 4. Generating a SonarCloud Token

1. In SonarCloud, click on your avatar in the top right corner
2. Select "My Account"
3. Click the "Security" tab
4. Click "Generate Token"
5. Enter a name, e.g., "CircleCI Integration"
6. Click "Generate"
7. **IMPORTANT**: Copy the token immediately as you won't be able to see it again

## 5. Adding the SonarCloud Token to CircleCI

1. Go to your project in CircleCI
2. Click the "Project Settings" button (gear icon)
3. Select "Environment Variables" in the left sidebar
4. Click "Add Environment Variable"
5. Name: `SONAR_TOKEN`
6. Value: Paste the token you copied from SonarCloud
7. Click "Add Environment Variable"

## 6. Verify the Integration

1. Make a small change to any file in your repository
2. Commit and push the change
3. Go to CircleCI dashboard and watch the pipeline run
4. After completion, check SonarCloud dashboard for analysis results

## 7. Understanding the Analysis Results

The SonarCloud dashboard will show:

1. **Security Hotspots**: Potential security vulnerabilities that require review
   - Review each hotspot and mark as "Safe" or "Fixed"
   - Focus on addressing all high-priority hotspots

2. **Code Smells**: Maintainability issues that make code harder to work with
   - Address code smells to improve code quality
   - Focus on high-impact issues first

3. **Quality Gate**: Overall pass/fail status based on your quality criteria
   - Green means your code meets the defined quality standards
   - Red means there are issues that need to be addressed

## Assignment-Specific Configuration

The configuration for this assignment focuses specifically on:

1. Security hotspots detection (enabled via `sonar.security.hotspots.enable=true`)
2. Code smells analysis (enabled via `sonar.security.enableCodeSmells=true`)
3. Comprehensive CircleCI workflow including:
   - Dependency installation
   - Security testing
   - Code quality analysis
   - Build and deployment

This setup satisfies the assignment requirement to "set up a GitHub repository with a CircleCI pipeline to run a SonarQube scan to check for hotspots and code smells."
