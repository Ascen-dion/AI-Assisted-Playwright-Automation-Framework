/**
 * Generate Test Plan for Aava AI Website
 * Uses MCP Planner Agent to create comprehensive test plan
 */

require('dotenv').config();
const testAgents = require('./src/core/test-agents-mcp');

async function generateTestPlan() {
  console.log('\n🎯 Generating Test Plan for Aava AI Website...\n');
  console.log('Target: https://int-ai.aava.ai/');
  console.log('Requirement: Verify "Future of Engineering" title exists\n');
  console.log('=' .repeat(80) + '\n');

  try {
    const testPlan = await testAgents.planTest(
      'Test the Aava AI website at https://int-ai.aava.ai/ and verify that the "Future of Engineering" title exists on the page',
      {
        url: 'https://int-ai.aava.ai/',
        actions: [
          'Navigate to the Aava AI website',
          'Wait for page to load completely',
          'Verify "Future of Engineering" title is visible',
          'Check page accessibility',
          'Validate responsive design'
        ],
        validations: [
          'Title "Future of Engineering" should be present',
          'Title should be visible to users',
          'Page should load within acceptable time',
          'No console errors should occur'
        ]
      }
    );

    console.log('\n📋 GENERATED TEST PLAN:\n');
    console.log('=' .repeat(80));
    console.log(testPlan);
    console.log('=' .repeat(80) + '\n');

    console.log('✅ Test plan generated successfully!\n');
    console.log('💡 Next steps:');
    console.log('   1. Review the test plan above');
    console.log('   2. Use the Generator Agent to create Playwright code');
    console.log('   3. Run: node generate-aava-test.js\n');

  } catch (error) {
    console.error('❌ Error generating test plan:', error.message);
    process.exit(1);
  }
}

generateTestPlan();
