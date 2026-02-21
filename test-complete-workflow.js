const { JiraIntegration } = require('./src/integrations/jira-integration');
const testAgents = require('./src/core/test-agents-mcp');
const URLExtractor = require('./src/helpers/url-extractor');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function testCompleteWorkflow() {
  console.log('🚀 Testing Complete ED-2 End-to-End Workflow...\n');
  
  let story, testCases, targetUrl, testScript, filename;
  
  try {
    // Step 1: Fetch Jira Story
    console.log('📄 Step 1: Fetch ED-2 from Jira');
    console.log('=' .repeat(50));
    const jiraClient = new JiraIntegration();
    const userStory = await jiraClient.fetchUserStory('ED-2');
    
    story = {
      id: 'ED-2',
      title: userStory.summary,
      description: userStory.description,
      acceptanceCriteria: userStory.acceptanceCriteria,
      extractedUrls: userStory.extractedUrls || []
    };
    
    console.log('✅ Story fetched successfully');
    console.log(`   Title: ${story.title}`);
    console.log(`   URLs: ${story.extractedUrls.join(', ')}`);
    console.log();

    // Step 2: Generate Test Cases
    console.log('🧪 Step 2: Generate Test Cases using MCP');
    console.log('=' .repeat(50));
    
    const testDescription = `
User Story: ${story.title}

Description: 
${story.description}

Acceptance Criteria:
${story.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

${story.extractedUrls.length > 0 ? `Target URL(s):\n${story.extractedUrls.map(url => `- ${url}`).join('\n')}` : ''}
`;

    const planResult = await testAgents.planTest(testDescription, {
      testType: 'e2e',
      priority: 'medium',
      detailLevel: 'detailed'
    });
    
    // Parse and convert to test cases (using same logic as workflow-api.js)
    let parsedPlan = planResult;
    if (typeof planResult === 'string') {
      const jsonMatch = planResult.match(/```(?:json)?\n?([\s\S]*?)```/);
      if (jsonMatch) {
        parsedPlan = JSON.parse(jsonMatch[1]);
      }
    }
    
    testCases = [];
    if (parsedPlan.testPlan && parsedPlan.testPlan.testScenarios) {
      parsedPlan.testPlan.testScenarios.forEach((scenario, index) => {
        let steps = '';
        if (scenario.testSteps && Array.isArray(scenario.testSteps)) {
          steps = scenario.testSteps.map((step, i) => `${i + 1}. ${step}`).join('\n');
        } else {
          steps = `1. Navigate to https://www.endpointclinical.com/\n2. ${scenario.scenario}`;
        }
        
        const expected = scenario.expectedResults || scenario.description;
        
        testCases.push({
          title: `Test Case ${index + 1}: ${scenario.scenario}`,
          steps: steps,
          expected: expected
        });
      });
    }
    
    console.log(`✅ Generated ${testCases.length} test cases`);
    testCases.forEach((tc, i) => {
      console.log(`   ${i + 1}. ${tc.title}`);
    });
    console.log();

    // Step 3: Extract URL
    console.log('🌐 Step 3: Extract Target URL');
    console.log('=' .repeat(50));
    
    targetUrl = URLExtractor.extractBestURL(story);
    if (!targetUrl) {
      // Fallback logic
      if (story.id.startsWith('ED-')) {
        targetUrl = 'https://www.endpointclinical.com';
      } else {
        targetUrl = 'https://example.com';
      }
    }
    
    console.log(`✅ Target URL: ${targetUrl}`);
    console.log();

    // Step 4: Generate Test Script
    console.log('💻 Step 4: Generate Playwright Script');
    console.log('=' .repeat(50));
    
    const scriptDescription = `
Story ID: ED-2
Target URL: ${targetUrl}

Test Cases:
${testCases.map((tc, i) => `
Test Case ${i + 1}: ${tc.title}
Steps: ${tc.steps}
Expected: ${tc.expected}
`).join('\n')}
`;

    console.log('🤖 Calling Generator Agent...');
    testScript = await testAgents.generateTest(scriptDescription, {
      url: targetUrl,
      framework: 'playwright',
      useAIPage: false,
      includeComments: true
    });
    
    console.log(`✅ Script generated (${testScript.length} characters)`);
    console.log('📄 Script preview:');
    console.log(testScript.substring(0, 300) + '...');
    console.log();

    // Step 5: Save Script
    console.log('💾 Step 5: Save Test Script');
    console.log('=' .repeat(50));
    
    filename = 'ed-2-automated.spec.js';
    const filepath = path.join(__dirname, 'src', 'tests', filename);
    
    // Ensure tests directory exists
    const testsDir = path.dirname(filepath);
    await fs.mkdir(testsDir, { recursive: true });
    
    await fs.writeFile(filepath, testScript);
    console.log(`✅ Script saved: ${filepath}`);
    console.log();

    // Step 6: Execute Test (First Attempt)
    console.log('⚡ Step 6: Execute Test (First Attempt)');
    console.log('=' .repeat(50));
    
    const testPath = `src/tests/${filename}`;
    let attempt = 1;
    let lastError = null;
    let success = false;
    
    while (attempt <= 3 && !success) {
      console.log(`🔄 Attempt ${attempt}/3`);
      
      try {
        const command = `npx playwright test "${testPath}" --config=config/playwright.config.js --project=chromium`;
        console.log(`   Running: ${command}`);
        
        const result = await execPromise(command, {
          cwd: __dirname,
          timeout: 60000
        });
        
        console.log('✅ Test PASSED!');
        console.log('📊 Results:', result.stdout);
        success = true;
        
      } catch (error) {
        lastError = error;
        console.log(`❌ Test FAILED on attempt ${attempt}`);
        console.log('📋 Error output:');
        console.log(error.stdout || '');
        console.log(error.stderr || '');
        
        if (attempt < 3) {
          console.log('\n🔧 Attempting self-healing...');
          
          // Step 7: Self-Healing
          const healingContext = {
            testCode: testScript,
            errorMessage: error.message,
            stdout: error.stdout || '',
            stderr: error.stderr || '',
            attempt: attempt,
            url: targetUrl
          };
          
          try {
            console.log('🤖 Calling Healer Agent...');
            const healingAnalysis = await testAgents.healTest(healingContext, {
              maxRetries: 1
            });
            
            console.log('📋 Healing Analysis:', healingAnalysis.substring(0, 200) + '...');
            
            // Try to generate a healed version
            console.log('🔧 Generating healed script...');
            const healedPrompt = `
The original test script failed. Please fix the issues and generate a working version.

Original Script:
${testScript}

Error Details:
${error.message}
${error.stdout || ''}
${error.stderr || ''}

Target URL: ${targetUrl}
Story: ${story.title}

Generate a robust Playwright test that:
1. Uses proper selectors
2. Has appropriate waits
3. Handles loading states
4. Has correct syntax
5. Uses best practices

Return ONLY the JavaScript code.
`;

            const healedScript = await testAgents.generateTest(healedPrompt, {
              url: targetUrl,
              framework: 'playwright',
              useAIPage: false,
              includeComments: true
            });
            
            // Save healed version
            console.log('💾 Saving healed script...');
            await fs.writeFile(filepath, healedScript);
            testScript = healedScript; // Update for next attempt
            
            console.log('✅ Self-healing applied');
            
          } catch (healingError) {
            console.log('❌ Self-healing failed:', healingError.message);
          }
        }
        
        attempt++;
        console.log();
      }
    }

    // Final Results
    console.log('🏁 Final Results');
    console.log('=' .repeat(50));
    
    if (success) {
      console.log('✅ END-TO-END WORKFLOW SUCCESSFUL!');
      console.log(`   Story: ${story.id} - ${story.title}`);
      console.log(`   Test Cases: ${testCases.length}`);
      console.log(`   Target URL: ${targetUrl}`);
      console.log(`   Script: ${filename}`);
      console.log(`   Attempts: ${attempt - 1}`);
    } else {
      console.log('❌ END-TO-END WORKFLOW FAILED');
      console.log(`   Final Error: ${lastError?.message}`);
      console.log('\n🔍 ISSUES IDENTIFIED:');
      
      // Analyze the issues
      if (lastError?.message?.includes('selector')) {
        console.log('   1. ❌ Selector issues - Elements not found');
      }
      if (lastError?.message?.includes('timeout')) {
        console.log('   2. ❌ Timeout issues - Page loading problems');
      }
      if (lastError?.message?.includes('syntax')) {
        console.log('   3. ❌ Syntax errors in generated script');
      }
      if (testScript.includes('example.com')) {
        console.log('   4. ❌ Wrong URL - Still using example.com');
      }
    }

  } catch (error) {
    console.error('💥 WORKFLOW CRASHED:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCompleteWorkflow();