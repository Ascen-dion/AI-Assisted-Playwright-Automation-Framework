const fetch = require('node-fetch');

async function testSmartWorkflow() {
  console.log('🧪 Testing Complete Smart Workflow via API...');
  
  const baseUrl = 'http://localhost:3001/api/workflow';
  
  // Step 1: Fetch story from Jira
  console.log('\n1️⃣ Fetching story from Jira...');
  const storyResponse = await fetch(`${baseUrl}/fetch-story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storyId: 'ED-2' })
  });
  const storyResult = await storyResponse.json();
  console.log('📋 Story fetched:', storyResult.story?.title);
  
  // Step 2: Generate Test Cases
  console.log('\n2️⃣ Generating test cases...');
  const testCasesResponse = await fetch(`${baseUrl}/generate-tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      storyId: 'ED-2',
      story: storyResult.story
    })
  });
  const testCasesResult = await testCasesResponse.json();
  console.log(`📝 Generated ${testCasesResult.testCases?.length} test cases`);
  
  // Step 3: Generate Scripts (Smart Strategy)
  console.log('\n3️⃣ Generating test scripts with smart strategy...');
  const scriptsResponse = await fetch(`${baseUrl}/generate-scripts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storyId: 'ED-2', 
      testCases: testCasesResult.testCases,
      story: storyResult.story
    })
  });
  const scriptsResult = await scriptsResponse.json();
  console.log('🔧 Strategy used:', scriptsResult.strategy?.storyType, '-', scriptsResult.strategy?.verificationApproach);
  console.log('💻 Script generated:', scriptsResult.filename);
  
  // Step 4: Execute Tests with Smart Healing
  console.log('\n4️⃣ Executing tests with smart healing...');
  const executeResponse = await fetch(`${baseUrl}/execute-tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: scriptsResult.filename,
      testCases: testCasesResult.testCases,
      storyId: 'ED-2',
      story: storyResult.story
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
    if (executeResult.healingDetails?.strategy?.logicErrorDetected) {
      console.log('🧠 Logic error was detected and fixed');
    }
  }
  
  if (executeResult.error) {
    console.log(`❌ Error: ${executeResult.error}`);
  }
  
  return executeResult;
}

testSmartWorkflow().catch(console.error);