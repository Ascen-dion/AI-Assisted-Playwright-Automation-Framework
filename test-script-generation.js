const fetch = require('node-fetch');

async function testScriptGeneration() {
  console.log('🧪 Testing Script Generation with Smart Strategy...');
  
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
  
  const testCases = [
    {
      title: "Verify homepage headline visibility",
      steps: "Navigate to homepage and check for headline visibility",
      expected: "The headline 'Your hidden advantage in RTSM' should be prominently displayed"
    }
  ];
  
  try {
    const response = await fetch('http://localhost:3001/api/workflow/generate-scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId: 'ED-2',
        testCases,
        story
      })
    });
    
    const result = await response.json();
    console.log('📊 Script Generation Result:', JSON.stringify(result, null, 2));
    
    if (result.strategy && result.strategy.storyType === 'ADD') {
      console.log('✅ Strategy correctly identified as ADD story');
      console.log(`🔧 Verification approach: ${result.strategy.verificationApproach}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing script generation:', error);
  }
}

testScriptGeneration();