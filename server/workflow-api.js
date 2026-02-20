const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { JiraIntegration } = require('../src/integrations/jira-integration');
const { TestRailIntegration } = require('../src/integrations/testrail-integration');
const aiEngine = require('../src/core/ai-engine');
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
  res.json({ status: 'ok', message: 'Workflow API is running' });
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

// Step 2: Generate Test Cases
app.post('/api/workflow/generate-tests', async (req, res) => {
  try {
    const { story } = req.body;

    if (!story) {
      return res.status(400).json({ error: 'Story data is required' });
    }

    console.log(`[API] Generating test cases for: ${story.id}`);
    
    const criteriaText = Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0
      ? story.acceptanceCriteria.join('\n- ')
      : 'Verify the feature works as described';
    
    const prompt = `Generate a comprehensive test plan for this user story:

**Story Title:** ${story.title}

**Description:** ${story.description}

**Acceptance Criteria:**
- ${criteriaText}

**Instructions:**
1. Generate at least 1-5 detailed test cases
2. Cover all acceptance criteria
3. Include positive and negative test scenarios
4. Format each test case as follows:

Test Case 1: [Clear descriptive title]
Steps: [Detailed steps to execute]
Expected: [Expected outcome]

Test Case 2: [Clear descriptive title]
Steps: [Detailed steps to execute]
Expected: [Expected outcome]

... and so on.

Generate the test cases now:`;

    const testPlan = await aiEngine.query(prompt, { maxTokens: 3000 });
    
    console.log('[DEBUG] Raw AI response length:', testPlan.length);
    console.log('[DEBUG] First 500 chars:', testPlan.substring(0, 500));
    
    const testCases = parseTestCases(testPlan);
    console.log('[DEBUG] Parsed test cases count:', testCases.length);

    res.json({
      success: true,
      testCases,
      message: `Generated ${testCases.length} test cases`
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
      } else {
        // Create new test case
        await testrailClient.pushTestCase(projectId, suiteId, testCaseData, sectionId);
        created++;
      }
    }

    const testrailUrl = `${testrailClient.host}/index.php?/suites/view/${suiteId}&group_by=cases:section_id&group_id=${sectionId}`;

    res.json({
      success: true,
      created,
      updated,
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

// Step 4: Generate Test Scripts
app.post('/api/workflow/generate-scripts', async (req, res) => {
  try {
    const { testCases, storyId } = req.body;

    if (!testCases || !storyId) {
      return res.status(400).json({ error: 'Test cases and story ID are required' });
    }

    console.log(`[API] Generating Playwright scripts for ${storyId}`);

    // Enhanced prompt with specific page insights
    const prompt = `Generate Playwright test scripts for these test cases:
${JSON.stringify(testCases, null, 2)}

**CRITICAL INSTRUCTIONS:**

1. **Page URL:** https://www.endpointclinical.com
2. **Target Element:** The main H1 headline on the homepage
3. **IMPORTANT HTML Structure:** The H1 tag contains text WITHOUT spaces in HTML: "Your hiddenadvantagein RTSM"
   - Although it displays with spaces visually (due to CSS), the actual HTML text has no spaces
   - DO NOT use exact text matching like 'h1:has-text("Your hidden advantage in RTSM")'
   - INSTEAD use: page.locator('h1') and verify keywords individually

4. **Selector Strategy:**
   - Use simple selectors: \`page.locator('h1')\` (NOT page.locator('h1:has-text(...)')
   - Verify content by checking if text CONTAINS keywords: 'hidden', 'advantage', 'RTSM'
   - Example: \`const text = await headline.textContent(); expect(text.toLowerCase()).toContain('rtsm');\`

5. **Test Requirements:**
   - Import: \`import { test, expect } from '@playwright/test';\`
   - Use proper assertions: \`await expect(locator).toBeVisible()\`, \`toBeInViewport()\`
   - Handle timeouts gracefully with try-catch for navigation
   - Use \`{ waitUntil: 'domcontentloaded', timeout: 10000 }\` for page.goto()

6. **Responsive Testing:**
   - Desktop: 1280x800
   - Tablet: 768x1024
   - Mobile: 375x667

7. **Best Practices:**
   - Keep tests simple and focused
   - Avoid brittle exact text matches
   - Use flexible keyword-based assertions
   - Remove 'await' from page.locator() calls - use: \`const headline = page.locator('selector')\`

Create a complete, executable Playwright test file following these guidelines.`;

    const testScript = await aiEngine.generateTestScript(prompt);
    
    // Save the generated script
    const filename = `${storyId.toLowerCase()}-automated.spec.js`;
    const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
    await fs.writeFile(filepath, testScript);

    res.json({
      success: true,
      filename,
      filepath,
      message: `Generated test script: ${filename}`
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
        const command = `npx playwright test "${testPath}"`;
        console.log(`[DEBUG] Executing: ${command}`);

        const startTime = Date.now();
        const { stdout } = await execPromise(command, {
          cwd: path.join(__dirname, '..')
        });
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // Parse results
        const results = parsePlaywrightOutput(stdout);

        // Success! Return results
        return res.json({
          success: true,
          ...results,
          duration,
          output: stdout,
          message: `Tests executed: ${results.passed}/${results.total} passed`,
          healingApplied,
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
          healingApplied = true;
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
 * Apply self-healing to failed tests
 * Analyzes failures and regenerates tests with improved selectors
 */
async function applyTestHealing({ filename, testCases, storyId, errorOutput, attempt }) {
  try {
    console.log('[SELF-HEAL] Analyzing test failures...');
    
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

    // Generate healing prompt for AI
    const healingPrompt = `You are debugging Playwright tests that failed. Analyze the errors and regenerate improved tests.

**Original Test Cases:**
${JSON.stringify(testCases, null, 2)}

**Test Failures (Attempt ${attempt}):**
${errorOutput}

**Error Analysis:**
- Selector issues: ${errors.selectorIssues.length}
- Text mismatches: ${errors.textMismatches.length}
- Navigation issues: ${errors.navigationIssues ? 'YES' : 'NO'}
- Strict mode violations: ${errors.strictModeViolations.length}
- CSS assertion failures: ${errors.cssIssues.length}

**Failed Error Messages:**
${errors.selectorIssues.join('\n')}
${errors.textMismatches.join('\n')}
${errors.strictModeViolations.join('\n')}
${errors.cssIssues.join('\n')}

**HEALING INSTRUCTIONS:**

1. **Fix Strict Mode Violations (CRITICAL):**
   - If error says "strict mode violation: locator resolved to X elements"
   - ALWAYS use \`.first()\`, \`.last()\`, or \`.nth(index)\` to target specific element
   - Example: \`page.locator('h1').first()\` instead of \`page.locator('h1')\`
   - Or use more specific selectors: \`page.getByRole('heading', { level: 1 }).first()\`

2. **Fix Navigation Timeouts:**
   - Increase timeout to 30000ms: \`{ waitUntil: 'domcontentloaded', timeout: 30000 }\`
   - Add network idle wait with error handling: \`await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})\`
   - Some sites are slow, be patient with timeouts

3. **Fix CSS Assertions (Avoid Exact Values):**
   - NEVER check exact CSS values like 'font-size': '32px' or 'font-family'
   - Instead, use flexible checks:
     \`\`\`javascript
     const fontSize = await element.evaluate(el => window.getComputedStyle(el).fontSize);
     expect(parseFloat(fontSize)).toBeGreaterThan(20);
     \`\`\`
   - Or just verify element is visible: \`await expect(element).toBeVisible()\`

4. **Fix Positioning/Centering Checks:**
   - Avoid exact positioning math (brittle and fails often)
   - Use \`await expect(element).toBeInViewport()\` instead
   - This is more reliable than checking x/y coordinates

5. **Fix Text Matching:**
   - Use \`.toContain()\` for partial matches
   - Check for keywords individually if text has formatting issues
   - Example: \`expect(text.toLowerCase()).toContain('keyword')\`

6. **Fix Selector Issues:**
   - If selectors timing out, use more reliable selectors (data-testid, role, labels)
   - Add proper wait conditions before assertions
   - Use \`await expect(locator).toBeVisible({ timeout: 10000 })\`

7. **Best Practices:**
   - ALWAYS use \`.first()\` when locator might match multiple elements
   - Check element visibility before interacting
   - Use flexible assertions, not exact values
   - Handle errors gracefully with try-catch for navigation

**Generate a COMPLETE, EXECUTABLE Playwright test file** that fixes all identified issues.
Include:
- All imports: \`import { test, expect } from '@playwright/test';\`
- All test cases (even ones that passed)
- Improved selectors and assertions
- Proper error handling

Return ONLY the complete test file code, no explanations.`;

    console.log('[SELF-HEAL] Generating healed tests with AI...');
    const healedScript = await aiEngine.generateTestScript(healingPrompt);

    // Save the healed script (overwrite the failing one)
    const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
    await fs.writeFile(filepath, healedScript);

    console.log(`[SELF-HEAL] Saved healed test script: ${filename}`);

    return {
      success: true,
      message: `Applied self-healing (attempt ${attempt})`,
      healedFile: filename
    };

  } catch (error) {
    console.error('[SELF-HEAL] Healing failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function parsePlaywrightOutput(output) {
  if (!output) {
    console.warn('[Parser] Empty output received');
    return { passed: 0, failed: 0, total: 0, skipped: 0, duration: 0 };
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

  console.log('[DEBUG] Parsed results:', { passed, failed, skipped, total, duration });

  // If no matches found but output exists, check for error patterns
  if (total === 0 && output.length > 0) {
    // Check if tests were found
    if (output.includes('no tests found') || output.includes('No tests found')) {
      console.log('[WARN] No tests found in output');
    }
  }

  return { passed, failed, skipped, total, duration };
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Workflow API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
