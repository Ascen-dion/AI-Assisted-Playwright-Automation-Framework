const fetch = require('node-fetch');

async function testSmartExecution() {
  console.log('🧪 Testing Smart Execution and Healing...');
  
  const baseUrl = 'http://localhost:3001/api/workflow';
  
  // Hardcoded story for testing
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
  
  // Test cases
  const testCases = [
    {
      title: "Verify homepage headline visibility",
      steps: "Navigate to homepage and check for headline visibility",
      expected: "The headline 'Your hidden advantage in RTSM' should be prominently displayed"
    }
  ];
  
  console.log('\n1️⃣ Generating scripts with smart strategy...');
  const scriptsResponse = await fetch(`${baseUrl}/generate-scripts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storyId: 'ED-2', 
      testCases: testCases,
      story: story
    })
  });
  const scriptsResult = await scriptsResponse.json();
  console.log('🔧 Strategy used:', scriptsResult.strategy?.storyType, '-', scriptsResult.strategy?.verificationApproach);
  console.log('💻 Script generated:', scriptsResult.filename);
  
  console.log('\n2️⃣ Executing tests with smart healing...');
  const executeResponse = await fetch(`${baseUrl}/execute-tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: scriptsResult.filename,
      testCases: testCases,
      storyId: 'ED-2',
      story: story
    })
  });
  const executeResult = await executeResponse.json();
  
  console.log('\n📊 Final Results:');
  console.log(`✅ Success: ${executeResult.success}`);
  if (executeResult.results) {
    console.log(`📈 Tests: ${executeResult.results.total} total, ${executeResult.results.passed} passed, ${executeResult.results.failed} failed`);
  }
  
  if (executeResult.healingApplied) {
    console.log('🔧 Self-healing was applied');
    console.log('🧠 Healing details:', JSON.stringify(executeResult.healingDetails, null, 2));
  }
  
  if (executeResult.error) {
    console.log(`❌ Error: ${executeResult.error}`);
  }
  
  return executeResult;
}

testSmartExecution().catch(console.error);