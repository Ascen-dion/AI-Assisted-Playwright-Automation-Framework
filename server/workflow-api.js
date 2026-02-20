const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { JiraIntegration } = require('../src/integrations/jira-integration');
const { TestRailIntegration } = require('../src/integrations/testrail-integration');
const aiEngine = require('../src/core/ai-engine');
const testAgents = require('../src/core/test-agents-mcp'); // MCP-enhanced test agents
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize integrations
const jiraClient = new JiraIntegration();
const testrailClient = new TestRailIntegration();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Workflow API is running',
    agents: {
      mcp: process.env.USE_MCP === 'true',
      planner: true,
      generator: true,
      healer: true
    }
  });
});

// Step 0: Create Jira Story from Plain English
app.post('/api/workflow/create-story', async (req, res) => {
  try {
    const { requirements } = req.body;
    
    if (!requirements) {
      return res.status(400).json({ error: 'Requirements text is required' });
    }

    console.log(`[API] Creating Jira story from requirements (${requirements.length} chars)`);

    // Use AI to convert plain English to structured user story
    const aiPrompt = `Convert the following requirements into a structured Jira user story format.

Requirements:
${requirements}

Generate a JSON object with this exact structure:
{
  "title": "[Short, clear title for the user story - max 80 chars]",
  "description": "[Detailed description in user story format: As a [user], I want [feature] so that [benefit]]",
  "acceptanceCriteria": [
    "Criterion 1 - should be testable and specific",
    "Criterion 2 - should be testable and specific",
    "Criterion 3 - should be testable and specific"
  ]
}

Rules:
- Title should be concise and descriptive (prefix with [UI], [API], [Backend] if applicable)
- Description should follow user story format
- Generate 3-5 clear, testable acceptance criteria
- Each criterion should start with an action verb
- Make criteria specific and measurable

Return ONLY the JSON object, no additional text.`;

    const aiResponse = await aiEngine.query(aiPrompt, { maxTokens: 1500 });
    
    // Parse AI response
    let storyData;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      storyData = JSON.parse(cleaned);
    } catch (e) {
      console.error('[API] Failed to parse AI response:', e);
      throw new Error('AI generated invalid response format');
    }

    console.log('[API] AI generated story structure:', JSON.stringify(storyData, null, 2));

    // Create Jira issue
    const issueData = {
      fields: {
        project: { key: process.env.JIRA_PROJECT_KEY || 'ED' },
        summary: storyData.title,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: storyData.description }]
            },
            {
              type: 'heading',
              attrs: { level: 3 },
              content: [{ type: 'text', text: 'Acceptance Criteria' }]
            },
            {
              type: 'bulletList',
              content: storyData.acceptanceCriteria.map(criterion => ({
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [{ type: 'text', text: criterion }]
                }]
              }))
            }
          ]
        },
        issuetype: { name: 'Story' }
      }
    };

    const response = await jiraClient.client.post('/issue', issueData);
    const newStoryId = response.data.key;

    console.log(`[API] Created Jira story: ${newStoryId}`);

    res.json({
      success: true,
      storyId: newStoryId,
      story: {
        title: storyData.title,
        description: storyData.description,
        acceptanceCriteria: storyData.acceptanceCriteria,
        status: 'To Do',
        url: `${jiraClient.host}/browse/${newStoryId}`
      },
      message: `Successfully created story ${newStoryId}`
    });
  } catch (error) {
    console.error('[API] Error creating Jira story:', error);
    res.status(500).json({
      error: error.message,
      details: 'Failed to create Jira story from requirements'
    });
  }
});

// Step 1: Fetch Jira Story
app.post('/api/workflow/fetch-jira', async (req, res) => {
  try {
    const { storyId } = req.body;
    
    if (!storyId) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    console.log(`[API] Fetching Jira story: ${storyId}`);
    const userStory = await jiraClient.fetchUserStory(storyId);

    const story = {
      id: storyId,
      title: userStory.summary,
      description: userStory.description || '',
      acceptanceCriteria: userStory.acceptanceCriteria || [],
      status: userStory.status,
      type: userStory.issueType,
      url: `${jiraClient.host}/browse/${storyId}`
    };

    res.json({ 
      success: true, 
      story,
      message: `Successfully fetched story ${storyId}`,
      jiraUrl: `${jiraClient.host}/browse/${storyId}`
    });
  } catch (error) {
    console.error('[API] Error fetching Jira story:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to fetch Jira story'
    });
  }
});

// Step 2: Generate Test Cases using Planner Agent
app.post('/api/workflow/generate-tests', async (req, res) => {
  try {
    const { story } = req.body;

    if (!story) {
      return res.status(400).json({ error: 'Story data is required' });
    }

    console.log(`[API] 🎭 Using Planner Agent to generate test cases for: ${story.id}`);
    
    // Use Test Agents Planner for comprehensive test planning
    const testDescription = `
User Story: ${story.title}

Description: ${story.description}

Acceptance Criteria:
${Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0
  ? story.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')
  : '- Verify the feature works as described'}
`;

    // Generate test plan using Planner Agent with MCP support
    const planResult = await testAgents.planTest(testDescription, {
      testType: 'e2e',
      priority: 'medium',
      detailLevel: 'detailed'
    });
    
    console.log('[DEBUG] Planner Agent generated:', planResult);
    
    // Convert plan to test cases format
    const testCases = [];
    
    if (planResult.steps && Array.isArray(planResult.steps)) {
      // If we have structured steps, convert them to test cases
      const groupedSteps = [];
      let currentGroup = { title: '', steps: [], expected: [] };
      
      planResult.steps.forEach((step, index) => {
        if (index % 3 === 0 && index > 0) {
          if (currentGroup.steps.length > 0) {
            groupedSteps.push(currentGroup);
          }
          currentGroup = { title: '', steps: [], expected: [] };
        }
        currentGroup.steps.push(step.description || step.action);
      });
      
      if (currentGroup.steps.length > 0) {
        groupedSteps.push(currentGroup);
      }
      
      groupedSteps.forEach((group, index) => {
        testCases.push({
          title: `Test Case ${index + 1}: ${planResult.testName || story.title}`,
          steps: group.steps.join('\n'),
          expected: planResult.assertions?.[index]?.description || 'Test passes successfully'
        });
      });
    }
    
    // Fallback: Create test cases from assertions if available
    if (testCases.length === 0 && planResult.assertions && Array.isArray(planResult.assertions)) {
      planResult.assertions.forEach((assertion, index) => {
        testCases.push({
          title: `Test Case ${index + 1}: Verify ${assertion.target}`,
          steps: `1. Navigate to application\n2. Perform ${assertion.type} check on ${assertion.target}`,
          expected: assertion.description || `Verify ${assertion.expected}`
        });
      });
    }
    
    // Final fallback: Generate basic test case
    if (testCases.length === 0) {
      testCases.push({
        title: `Test Case 1: ${planResult.testName || story.title}`,
        steps: planResult.description || 'Execute test steps as planned',
        expected: 'All acceptance criteria are met'
      });
    }

    res.json({
      success: true,
      testCases,
      plan: planResult,
      agentUsed: 'planner',
      mcpEnabled: process.env.USE_MCP === 'true',
      message: `Generated ${testCases.length} test cases using Planner Agent`
    });
  } catch (error) {
    console.error('[API] Error generating test cases:', error);
    res.status(500).json({
      error: error.message,
      details: 'Failed to generate test cases'
    });
  }
});

// Step 3: Push to TestRail
app.post('/api/workflow/push-testrail', async (req, res) => {
  try {
    const { testCases, storyId } = req.body;

    if (!testCases || !storyId) {
      return res.status(400).json({ error: 'Test cases and story ID are required' });
    }

    console.log(`[API] Pushing ${testCases.length} test cases to TestRail`);

    // Get projectId, suiteId, sectionId from env
    const projectId = parseInt(process.env.TESTRAIL_PROJECT_ID || '7');
    const suiteId = parseInt(process.env.TESTRAIL_SUITE_ID || '14');
    const sectionId = parseInt(process.env.TESTRAIL_SECTION_ID || '45');

    let created = 0;
    let updated = 0;
    const createdCases = [];
    const updatedCases = [];

    for (const testCase of testCases) {
      // Check if test case already exists
      const existing = await testrailClient.findTestCaseByTitle(
        projectId, 
        suiteId, 
        testCase.title, 
        sectionId
      );

      const testCaseData = {
        title: testCase.title,
        steps: testCase.steps || testCase.description || '',
        expected: testCase.expectedResult || testCase.expected || 'Test passes successfully',
        preconditions: testCase.preconditions || '',
        refs: storyId
      };

      if (existing) {
        // Update existing test case
        await testrailClient.updateTestCase(existing.id, testCaseData);
        updated++;
        updatedCases.push({ id: existing.id, title: testCase.title });
        console.log(`[API] ✓ Updated: C${existing.id} - ${testCase.title}`);
      } else {
        // Create new test case
        const newCase = await testrailClient.pushTestCase(projectId, suiteId, testCaseData, sectionId);
        created++;
        createdCases.push({ id: newCase?.id || 'new', title: testCase.title });
        console.log(`[API] ✓ Created: ${testCase.title}`);
      }
    }

    const testrailUrl = `${testrailClient.host}/index.php?/suites/view/${suiteId}&group_by=cases:section_id&group_id=${sectionId}`;

    res.json({
      success: true,
      created,
      updated,
      createdCases,
      updatedCases,
      message: `TestRail sync complete: ${created} created, ${updated} updated`,
      testrailUrl
    });
  } catch (error) {
    console.error('[API] Error pushing to TestRail:', error);
    res.status(500).json({
      error: error.message,
      details: 'Failed to push test cases to TestRail'
    });
  }
});

// Step 4: Generate Test Scripts using Generator Agent
app.post('/api/workflow/generate-scripts', async (req, res) => {
  try {
    const { testCases, storyId, plan } = req.body;

    if (!testCases || !storyId) {
      return res.status(400).json({ error: 'Test cases and story ID are required' });
    }

    console.log(`[API] 💻 Using Generator Agent to create Playwright scripts for ${storyId}`);

    // Prepare test description for Generator Agent
    const testDescription = `
Story ID: ${storyId}
Target URL: https://www.endpointclinical.com

Test Cases:
${testCases.map((tc, i) => `
Test Case ${i + 1}: ${tc.title}
Steps: ${tc.steps}
Expected: ${tc.expected}
`).join('\n')}

**IMPORTANT Page-Specific Instructions:**
1. H1 Element: Contains text "Your hiddenadvantagein RTSM" (no spaces in HTML)
2. Use flexible selectors: page.locator('h1') NOT exact text matching
3. Verify keywords individually: 'hidden', 'advantage', 'RTSM'
4. Handle navigation timeouts gracefully
5. Use domcontentloaded for faster page loads
`;

    // Use Generator Agent to create test code with MCP support
    const testScript = await testAgents.generateTest(testDescription, {
      url: 'https://www.endpointclinical.com',
      framework: 'playwright',
      useAIPage: false,
      includeComments: true
    });
    
    console.log('[DEBUG] Generator Agent created test script');
    
    // Save the generated script
    const filename = `${storyId.toLowerCase()}-automated.spec.js`;
    const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
    await fs.writeFile(filepath, testScript);

    res.json({
      success: true,
      filename,
      filepath,
      agentUsed: 'generator',
      mcpEnabled: process.env.USE_MCP === 'true',
      message: `Generated test script using Generator Agent: ${filename}`
    });
  } catch (error) {
    console.error('[API] Error generating scripts:', error);
    res.status(500).json({
      error: error.message,
      details: 'Failed to generate test scripts'
    });
  }
});

// Step 5: Execute Tests with Self-Healing
app.post('/api/workflow/execute-tests', async (req, res) => {
  try {
    const { filename, testCases, storyId } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    console.log(`[API] Executing tests with self-healing: ${filename}`);

    const testPath = `src/tests/${filename}`;
    const maxRetries = 2;
    let attempt = 1;
    let lastResults = null;
    let healingApplied = false;

    // Attempt test execution with self-healing retries
    while (attempt <= maxRetries) {
      console.log(`[SELF-HEAL] Attempt ${attempt}/${maxRetries}`);

      try {
        const command = `npx playwright test "${testPath}" --config=config/playwright.config.js --project=chromium`;
        console.log(`[DEBUG] Executing: ${command}`);

        const startTime = Date.now();
        let stdout, stderr;
        
        try {
          const result = await execPromise(command, {
            cwd: path.join(__dirname, '..')
          });
          stdout = result.stdout;
          stderr = result.stderr;
        } catch (execError) {
          // Capture output even when process fails
          stdout = execError.stdout || '';
          stderr = execError.stderr || '';
          throw execError;
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // Parse results
        const results = parsePlaywrightOutput(stdout);

        // Check if any tests failed - if so, trigger self-healing
        if (results.failed > 0) {
          console.log(`[SELF-HEAL] Detected ${results.failed} failed tests, triggering self-healing`);
          const error = new Error('Tests failed');
          error.stdout = stdout;
          error.stderr = stderr;
          throw error;
        }

        // All tests passed! Return success
        return res.json({
          success: true,
          ...results,
          duration,
          output: stdout,
          message: `Tests executed: ${results.passed}/${results.total} passed`,
          healingApplied: healingApplied ? true : false,
          healingDetails: healingApplied || null,
          attempts: attempt
        });

      } catch (error) {
        // Tests failed - analyze and potentially heal
        lastResults = parsePlaywrightOutput(error.stdout || '');
        console.log(`[SELF-HEAL] Attempt ${attempt} failed: ${lastResults.failed}/${lastResults.total} tests failed`);

        // If this was the last attempt, return failure
        if (attempt >= maxRetries) {
          console.log('[SELF-HEAL] Max retries reached, returning failure');
          return res.json({
            success: false,
            ...lastResults,
            error: error.message,
            output: error.stdout || error.stderr,
            healingApplied,
            attempts: attempt,
            message: `Tests failed after ${attempt} attempts`
          });
        }

        // Apply self-healing: analyze failures and regenerate tests
        console.log('[SELF-HEAL] Analyzing failures and regenerating tests...');
        
        const errorOutput = error.stdout || error.stderr || '';
        const healingResult = await applyTestHealing({
          filename,
          testCases,
          storyId,
          errorOutput,
          attempt
        });

        if (healingResult.success) {
          console.log('[SELF-HEAL] Successfully regenerated tests with improved selectors');
          healingApplied = healingResult; // Store full healing details
          attempt++;
        } else {
          // Healing failed, return current results
          console.log('[SELF-HEAL] Healing failed, returning current results');
          return res.json({
            success: false,
            ...lastResults,
            error: healingResult.error,
            output: error.stdout || error.stderr,
            healingApplied: false,
            healingDetails: healingResult,
            attempts: attempt,
            message: 'Self-healing failed'
          });
        }
      }
    }

  } catch (error) {
    console.error('[API] Critical error in test execution:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Critical failure in test execution system'
    });
  }
});

// Step 6: Update Results
app.post('/api/workflow/update-results', async (req, res) => {
  try {
    const { storyId, results } = req.body;

    if (!storyId || !results) {
      return res.status(400).json({ error: 'Story ID and results are required' });
    }

    console.log(`[API] Updating results in Jira for ${storyId}`);

    const testResult = {
      testName: `Automated Test Suite - ${storyId}`,
      status: results.failed === 0 ? 'passed' : 'failed',
      duration: Math.round(results.duration * 1000), // Convert to ms
      totalTests: results.total,
      passed: results.passed,
      failed: results.failed,
      error: results.failed > 0 ? `${results.failed} test(s) failed` : null
    };

    await jiraClient.updateTestResults(storyId, testResult);

    res.json({
      success: true,
      message: `Results posted to Jira ticket ${storyId}`
    });
  } catch (error) {
    console.error('[API] Error updating results:', error);
    res.status(500).json({
      error: error.message,
      details: 'Failed to update results in Jira'
    });
  }
});

// Helper Functions

function extractAcceptanceCriteria(description) {
  if (!description) return [];
  
  const lines = description.split('\n');
  const criteria = [];
  let inCriteriaSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('acceptance criteria')) {
      inCriteriaSection = true;
      continue;
    }
    if (inCriteriaSection && (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.match(/^\d+\./))) {
      criteria.push(trimmed.replace(/^[\*\-\d\.]+\s*/, ''));
    }
  }

  return criteria.length > 0 ? criteria : ['Default criterion: System works as expected'];
}

function parseTestCases(testPlan) {
  const testCases = [];
  
  // Try parsing as JSON first (AI often returns structured JSON)
  try {
    // Remove markdown code fences if present
    let cleanedPlan = testPlan.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse as JSON
    const jsonData = JSON.parse(cleanedPlan);
    
    // Handle different JSON structures
    if (Array.isArray(jsonData)) {
      return jsonData.map((tc, idx) => ({
        id: tc.id || tc.testCaseId || idx + 1,
        title: tc.title || tc.name || `Test Case ${idx + 1}`,
        steps: Array.isArray(tc.steps) ? tc.steps.join('\n') : (tc.steps || ''),
        expectedResult: tc.expected || tc.expectedResult || 'Test passes successfully',
        description: tc.description || ''
      }));
    } else if (jsonData.testCases && Array.isArray(jsonData.testCases)) {
      return jsonData.testCases.map((tc, idx) => ({
        id: tc.id || tc.testCaseId || idx + 1,
        title: tc.title || tc.name || `Test Case ${idx + 1}`,
        steps: Array.isArray(tc.steps) ? tc.steps.join('\n') : (tc.steps || ''),
        expectedResult: tc.expected || tc.expectedResult || 'Test passes successfully',
        description: tc.description || ''
      }));
    }
  } catch (e) {
    // Not valid JSON, continue with text parsing
    console.log('[DEBUG] Not JSON format, parsing as text');
  }
  
  // Fall back to text parsing
  const lines = testPlan.split('\n');
  let currentCase = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match test case titles (various formats)
    const isTestCaseTitle = trimmed.match(/^(test case|tc|scenario)\s*\d+/i) || 
                            trimmed.match(/^\d+\.\s+\w+/) ||
                            trimmed.match(/^#{1,3}\s*(test|scenario)/i);
    
    if (isTestCaseTitle) {
      if (currentCase) {
        testCases.push(currentCase);
      }
      // Clean up the title
      let title = trimmed
        .replace(/^(test case|tc|scenario)\s*\d+:?\s*/i, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^#{1,3}\s*/i, '')
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .trim();
      
      currentCase = {
        id: testCases.length + 1,
        title: title || `Test Case ${testCases.length + 1}`,
        steps: '',
        expectedResult: '',
        description: ''
      };
    } else if (currentCase && trimmed) {
      // Check for expected result markers
      if (trimmed.toLowerCase().match(/^(expected|expect|result):/i)) {
        currentCase.expectedResult = trimmed.replace(/^(expected|expect|result):\s*/i, '');
      } else if (trimmed.toLowerCase().match(/^steps:/i)) {
        currentCase.steps = trimmed.replace(/^steps:\s*/i, '');
      } else {
        // Add to description or steps
        if (!currentCase.steps) {
          currentCase.steps += trimmed + '\n';
        } else {
          currentCase.description += trimmed + '\n';
        }
      }
    }
  }

  if (currentCase) {
    testCases.push(currentCase);
  }

  // Clean up test cases
  testCases.forEach(tc => {
    tc.steps = tc.steps.trim();
    tc.expectedResult = tc.expectedResult || 'Test passes successfully';
    tc.description = tc.description.trim();
  });

  // If no test cases were parsed, create basic test cases from the AI response
  if (testCases.length === 0) {
    // Try to extract any numbered lists or bullet points as test cases
    const numberedItems = testPlan.match(/^\s*\d+\.\s+.+$/gm);
    if (numberedItems && numberedItems.length > 0) {
      numberedItems.forEach((item, idx) => {
        const title = item.replace(/^\s*\d+\.\s+/, '').trim();
        testCases.push({
          id: idx + 1,
          title: title,
          steps: 'Execute the test as described',
          expectedResult: 'Test passes successfully',
          description: ''
        });
      });
    }
  }

  // Still no test cases? Create a default one
  if (testCases.length === 0) {
    return [{
      id: 1,
      title: 'Verify functionality works as expected',
      steps: 'Execute the feature according to acceptance criteria',
      expectedResult: 'Feature works as described',
      description: testPlan.substring(0, 500)
    }];
  }

  return testCases;
}

/**
 * Apply self-healing to failed tests using Healer Agent
 * Analyzes failures and regenerates tests with improved selectors
 */
async function applyTestHealing({ filename, testCases, storyId, errorOutput, attempt }) {
  try {
    console.log('[SELF-HEAL] 🔧 Using Healer Agent to analyze and fix test failures...');
    
    // Extract error details from Playwright output
    const errorPatterns = {
      selectorTimeout: /Timeout.*waiting for (selector|locator)/i,
      selectorNotFound: /locator\('([^']+)'\).*not found/i,
      textNotFound: /expected.*to contain.*but received/i,
      navigationFailed: /(Navigation|net::ERR_|timeout.*navigation|Timeout.*goto)/i,
      strictModeViolation: /strict mode violation.*resolved to (\d+) elements/i,
      cssAssertion: /toHaveCSS|font-size|font-family/i
    };

    const errors = {
      selectorIssues: [],
      textMismatches: [],
      navigationIssues: errorOutput.match(errorPatterns.navigationFailed) ? true : false,
      strictModeViolations: [],
      cssIssues: []
    };

    // Parse error lines
    const errorLines = errorOutput.split('\n');
    for (const line of errorLines) {
      if (errorPatterns.selectorTimeout.test(line) || errorPatterns.selectorNotFound.test(line)) {
        errors.selectorIssues.push(line.trim());
      }
      if (errorPatterns.textNotFound.test(line)) {
        errors.textMismatches.push(line.trim());
      }
      if (errorPatterns.strictModeViolation.test(line)) {
        errors.strictModeViolations.push(line.trim());
      }
      if (errorPatterns.cssAssertion.test(line)) {
        errors.cssIssues.push(line.trim());
      }
    }

    console.log('[SELF-HEAL] Error analysis:', {
      selectorIssues: errors.selectorIssues.length,
      textMismatches: errors.textMismatches.length,
      navigationIssues: errors.navigationIssues,
      strictModeViolations: errors.strictModeViolations.length,
      cssIssues: errors.cssIssues.length
    });

    // Read the failing test file
    const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
    const failingCode = await fs.readFile(filepath, 'utf-8');

    // Prepare context for Healer Agent
    const healingContext = {
      testCode: failingCode,
      error: {
        message: errorOutput.substring(0, 1000), // First 1000 chars of error
        stack: errorOutput,
        type: errors.strictModeViolations.length > 0 ? 'strict-mode-violation' :
              errors.navigationIssues ? 'navigation-timeout' :
              errors.selectorIssues.length > 0 ? 'selector-not-found' :
              errors.cssIssues.length > 0 ? 'css-assertion' : 'unknown'
      },
      testCases: testCases,
      storyId: storyId,
      attempt: attempt,
      url: 'https://www.endpointclinical.com',
      analysisDetails: {
        selectorIssues: errors.selectorIssues,
        textMismatches: errors.textMismatches,
        navigationIssues: errors.navigationIssues,
        strictModeViolations: errors.strictModeViolations,
        cssIssues: errors.cssIssues
      }
    };

    // Use Healer Agent to analyze and get fix recommendations
    console.log('[SELF-HEAL] 🤖 Invoking Healer Agent with MCP support...');
    const healingAnalysis = await testAgents.healTest(healingContext, {
      autoFix: true,
      returnCode: true,
      fixStrategies: [
        'strict-mode-fix',
        'timeout-increase',
        'flexible-selectors',
        'remove-css-assertions'
      ]
    });

    console.log('[SELF-HEAL] Healer Agent analysis received');

    // Extract the healed code from the analysis
    let healedScript;
    
    if (typeof healingAnalysis === 'string') {
      // If the healer returned code directly
      healedScript = healingAnalysis;
    } else if (healingAnalysis.fixedCode) {
      // If it returned an object with fixedCode
      healedScript = healingAnalysis.fixedCode;
    } else if (healingAnalysis.solutions && healingAnalysis.solutions[0]) {
      // If it returned solutions array
      healedScript = healingAnalysis.solutions[0].code || healingAnalysis.solutions[0];
    } else {
      // Fallback: use the original healing analysis as instructions to regenerate
      console.log('[SELF-HEAL] Healer provided analysis, regenerating code...');
      
      const regeneratePrompt = `${healingAnalysis}

Based on this analysis, generate a COMPLETE, FIXED Playwright test file for:

Story ID: ${storyId}
Test Cases:
${JSON.stringify(testCases, null, 2)}

**Critical Fixes Required:**
${errors.strictModeViolations.length > 0 ? '- Add .first() to all multi-match locators' : ''}
${errors.navigationIssues ? '- Increase navigation timeout to 30000ms' : ''}
${errors.cssIssues.length > 0 ? '- Remove CSS exact value assertions, use visibility checks instead' : ''}
${errors.selectorIssues.length > 0 ? '- Improve selector reliability and add wait conditions' : ''}

Return ONLY the complete, executable test code.`;

      healedScript = await testAgents.generateTest(regeneratePrompt, {
        url: 'https://www.endpointclinical.com',
        framework: 'playwright'
      });
    }

    // Clean up the code if it has markdown formatting
    healedScript = healedScript.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();

    // Save the healed script (overwrite the failing one)
    await fs.writeFile(filepath, healedScript);

    console.log(`[SELF-HEAL] ✅ Saved healed test script using Healer Agent: ${filename}`);

    return {
      success: true,
      message: `Applied self-healing with Healer Agent (attempt ${attempt})`,
      healedFile: filename,
      agentUsed: 'healer',
      mcpEnabled: process.env.USE_MCP === 'true',
      errorAnalysis: {
        selectorIssues: errors.selectorIssues.length,
        textMismatches: errors.textMismatches.length,
        navigationIssues: errors.navigationIssues,
        strictModeViolations: errors.strictModeViolations.length,
        cssIssues: errors.cssIssues.length
      },
      fixesApplied: [
        errors.strictModeViolations.length > 0 && 'Added .first() to multi-match locators',
        errors.navigationIssues && 'Increased navigation timeout to 30000ms',
        errors.cssIssues.length > 0 && 'Removed CSS exact value assertions',
        errors.selectorIssues.length > 0 && 'Improved selector reliability'
      ].filter(Boolean),
      analysis: typeof healingAnalysis === 'object' ? healingAnalysis : { rawAnalysis: healingAnalysis }
    };

  } catch (error) {
    console.error('[SELF-HEAL] ❌ Healer Agent failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function parsePlaywrightOutput(output) {
  if (!output) {
    console.warn('[Parser] Empty output received');
    return { passed: 0, failed: 0, total: 0, skipped: 0, duration: 0, testResults: [] };
  }

  console.log('[DEBUG] Parsing test output, length:', output.length);
  console.log('[DEBUG] Output preview:', output.substring(0, 500));

  const passedMatch = output.match(/(\d+) passed/);
  const failedMatch = output.match(/(\d+) failed/);
  const skippedMatch = output.match(/(\d+) skipped/);
  const durationMatch = output.match(/\((\d+(?:\.\d+)?)s\)/);
  
  const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
  const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
  const skipped = skippedMatch ? parseInt(skippedMatch[1]) : 0;
  const total = passed + failed; // Don't count skipped in total
  const duration = durationMatch ? parseFloat(durationMatch[1]) : 0;

  // Extract individual test results
  const testResults = [];
  const testPattern = /\[[\w-]+\]\s+›\s+[^\n]+\.spec\.js:\d+:\d+\s+›\s+([^\n]+)\s+\((\d+)ms\)/g;
  let match;
  
  // Parse test results from Playwright output
  const lines = output.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match passed tests (✓ or checkmark)
    if (line.includes('✓') || line.includes('[') && line.includes('] ›')) {
      const testMatch = line.match(/›\s+([^(]+)\s+\((\d+)ms\)/);
      if (testMatch) {
        testResults.push({
          title: testMatch[1].trim(),
          status: 'passed',
          duration: parseInt(testMatch[2])
        });
      }
    }
    
    // Match failed tests (✗ or X mark or number with x)
    if (line.includes('✗') || line.includes('×') || /^\s*\d+\)\s+/.test(line)) {
      const failMatch = line.match(/\d+\)\s+([^›\n]+)(?:›\s+([^\n]+))?/);
      if (failMatch) {
        const title = (failMatch[2] || failMatch[1]).trim();
        // Look ahead for timing
        let testDuration = 0;
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const timeMatch = lines[j].match(/\((\d+)ms\)/);
          if (timeMatch) {
            testDuration = parseInt(timeMatch[1]);
            break;
          }
        }
        testResults.push({
          title: title,
          status: 'failed',
          duration: testDuration
        });
      }
    }
  }

  console.log('[DEBUG] Parsed results:', { passed, failed, skipped, total, duration, testResults: testResults.length });

  // If no matches found but output exists, check for error patterns
  if (total === 0 && output.length > 0) {
    // Check if tests were found
    if (output.includes('no tests found') || output.includes('No tests found')) {
      console.log('[WARN] No tests found in output');
    }
  }

  return { passed, failed, skipped, total, duration, testResults };
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Workflow API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
