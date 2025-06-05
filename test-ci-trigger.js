/**
 * Test file to trigger CircleCI pipeline and SonarCloud analysis
 * This will verify that the automation is working correctly
 * Date: June 5, 2025
 */

// Simple function to verify pipeline trigger
function testSonarCloudIntegration() {
  console.log('Testing CircleCI pipeline with SonarCloud integration');
  return {
    status: 'success',
    message: 'CircleCI pipeline triggered successfully',
    timestamp: new Date().toISOString()
  };
}

// Export the function for potential use in tests
module.exports = testSonarCloudIntegration;
