const TestStrategyGenerator = require('./src/helpers/test-strategy-generator.js');

// Test ED-2 story analysis
const story = {
  id: 'ED-2',
  title: '[UI] Add "Your hidden advantage in RTSM" headline',
  description: `As a user, I want to see the "Your hidden advantage in RTSM" headline prominently displayed on the homepage, so that I understand the key value proposition.
  
  Acceptance Criteria:
  - The headline "Your hidden advantage in RTSM" should be visible on the homepage
  - The headline should be prominently displayed in the hero section
  - The text should be visible on all device sizes
  - The headline should follow brand typography guidelines`
};

console.log('🧪 Testing TestStrategyGenerator with ED-2 story...');

// Analyze story
const strategy = TestStrategyGenerator.analyzeStory(story);
console.log('\n📊 Strategy Analysis:', JSON.stringify(strategy, null, 2));

// Generate smart test cases  
const smartTestCases = TestStrategyGenerator.generateSmartTestCases(story, strategy);
console.log('\n📝 Smart Test Cases:', smartTestCases.length);

smartTestCases.forEach((tc, i) => {
  console.log(`\n--- TEST CASE ${i + 1} ---`);
  console.log(`Title: ${tc.title}`);
  console.log(`Type: ${tc.type}`);
  console.log(`Steps: ${JSON.stringify(tc.steps, null, 2)}`);
  console.log(`Test Code Preview:`, tc.testCode.substring(0, 500) + '...');
});