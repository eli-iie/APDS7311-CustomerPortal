# GitHub Actions Workflows

This directory contains workflows for continuous integration and automated quality checks.

## Workflows

### SonarCloud Analysis

The `sonarcloud.yml` workflow automatically analyzes your code with SonarCloud whenever you push changes to your repository.

It performs the following steps:
1. Checks out the repository code
2. Sets up Node.js environment
3. Installs dependencies
4. Runs tests with coverage
5. Runs SonarCloud analysis
6. Reports results to the SonarCloud dashboard

## Configuration

To configure SonarCloud analysis:
1. Add a `SONAR_TOKEN` secret to your GitHub repository
2. The GitHub token is automatically provided by GitHub Actions

See the `GITHUB_SETUP.md` file in the project root for detailed setup instructions.
