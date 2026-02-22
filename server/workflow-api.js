const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { JiraIntegration } = require('../src/integrations/jira-integration');
const { TestRailIntegration } = require('../src/integrations/testrail-integration');
const aiEngine = require('../src/core/ai-engine');
const testAgents = require('../src/core/test-agents-mcp'); // MCP-enhanced test agents
const URLExtractor = require('../src/helpers/url-extractor'); // Enhanced URL extraction
const TestStrategyGenerator = require('../src/helpers/test-strategy-generator'); // Smart test strategies
const PageInspector = require('../src/helpers/page-inspector'); // Live page inspection before code gen
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve test-results folder as static files (for video access)
app.use('/test-results', express.static(path.join(__dirname, '..', 'test-results')));

// Initialize integrations
const jiraClient = new JiraIntegration();
const testrailClient = new TestRailIntegration();

/**
 * Ensures a story object is available - fetches from Jira if not provided.
 * This is the critical failsafe that prevents falling back to example.com
 * when the UI doesn't pass the story object.
 */
async function ensureStory(storyId, story) {
  if (story && story.title) {
    console.log(`[ensureStory] ✅ Story provided by client: "${story.title}"`);
    return story;
  }
  
  if (!storyId) {
    console.warn('[ensureStory] ⚠️ No storyId provided, cannot fetch from Jira');
    return null;
  }

  try {
    console.log(`[ensureStory] 🔄 Story missing from request, fetching from Jira: ${storyId}`);
    const userStory = await jiraClient.fetchUserStory(storyId);
    
    const fetchedStory = {
      id: storyId,
      title: userStory.summary,
      description: userStory.description || '',
      acceptanceCriteria: userStory.acceptanceCriteria || [],
      extractedUrls: userStory.extractedUrls || [],
      status: userStory.status,
      type: userStory.issueType,
      url: `${jiraClient.host}/browse/${storyId}`
    };
    
    // If Jira ADF parser didn't find URLs, try extracting from description text
    if (fetchedStory.extractedUrls.length === 0) {
      const descText = `${fetchedStory.title} ${fetchedStory.description}`;
      const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|io|co|edu|gov|ai|dev)[^\s)\]>,]*)/gi;
      const matches = descText.match(urlPattern) || [];
      const textUrls = matches.map(u => {
        u = u.replace(/[)\].,;:!?]+$/, '');
        return u.startsWith('http') ? u : `https://${u}`;
      });
      if (textUrls.length > 0) {
        fetchedStory.extractedUrls = textUrls;
        console.log(`[ensureStory] 🔗 URLs extracted from text: ${textUrls.join(', ')}`);
      }
    }
    
    console.log(`[ensureStory] ✅ Fetched story from Jira: "${fetchedStory.title}"`);
    console.log(`[ensureStory] 🔗 Extracted URLs: ${fetchedStory.extractedUrls.join(', ') || 'none'}`);
    return fetchedStory;
  } catch (error) {
    console.error(`[ensureStory] ❌ Failed to fetch story from Jira: ${error.message}`);
    return null;
  }
}

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

    // Extract URLs from the user's requirements text BEFORE AI processing
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+)(?:\/[^\s)\]>,]*)*/gi;
    const foundUrls = requirements.match(urlPattern) || [];
    const extractedUrls = foundUrls.map(url => {
      // Clean trailing punctuation/parens from URLs
      url = url.replace(/[)\].,;:!?]+$/, '');
      if (!url.startsWith('http')) {
        return 'https://' + url;
      }
      return url;
    });
    console.log(`[API] 🔗 Extracted URLs from requirements: ${extractedUrls.join(', ') || 'none'}`);
    const targetWebsite = extractedUrls.length > 0 ? extractedUrls[0] : null;

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
${targetWebsite ? `- IMPORTANT: The target website is ${targetWebsite} - include this URL in the description and acceptance criteria` : ''}
- Description should follow user story format
- If a website URL is mentioned, include it explicitly in the description
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

    // Include extracted URLs from original requirements in the story
    const storyExtractedUrls = extractedUrls.length > 0 ? extractedUrls : [];
    
    // Also try to extract URLs from the AI-generated description
    const descUrls = ((storyData.description || '').match(/https?:\/\/[^\s)\]>,]+/g) || []).map(u => u.replace(/[)\].,;:!?]+$/, ''));
    const allUrls = [...new Set([...storyExtractedUrls, ...descUrls])];
    
    console.log(`[API] 📋 Story URLs for pipeline: ${allUrls.join(', ') || 'none'}`);

    res.json({
      success: true,
      storyId: newStoryId,
      story: {
        title: storyData.title,
        description: storyData.description,
        acceptanceCriteria: storyData.acceptanceCriteria,
        extractedUrls: allUrls,
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
      extractedUrls: userStory.extractedUrls || [], // Add extracted URLs
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

Description: 
${story.description}

Acceptance Criteria:
${Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0
  ? story.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')
  : '- Verify the feature works as described'}

${story.extractedUrls && story.extractedUrls.length > 0 ? 
`Target URL(s):
${story.extractedUrls.map(url => `- ${url}`).join('\n')}` : ''}
`;

    // Generate test plan using Planner Agent with MCP support
    const planResult = await testAgents.planTest(testDescription, {
      testType: 'e2e',
      priority: 'medium',
      detailLevel: 'detailed'
    });
    
    console.log('[DEBUG] Raw Planner Agent response type:', typeof planResult);
    console.log('[DEBUG] Raw Planner Agent response preview:', JSON.stringify(planResult).substring(0, 200));
    
    // Parse MCP response if it's markdown-wrapped JSON
    let parsedPlan = planResult;
    if (typeof planResult === 'string') {
      try {
        // Extract JSON from markdown code blocks
        const jsonMatch = planResult.match(/```(?:json)?\n?([\s\S]*?)```/);
        if (jsonMatch) {
          console.log('[DEBUG] Found markdown-wrapped JSON, parsing...');
          parsedPlan = JSON.parse(jsonMatch[1]);
        } else {
          // Try to parse as direct JSON
          parsedPlan = JSON.parse(planResult);
        }
        console.log('[DEBUG] Successfully parsed JSON response');
      } catch (parseError) {
        console.log('[DEBUG] JSON parsing failed, using string response:', parseError.message);
        parsedPlan = { description: planResult };
      }
    }
    
    console.log('[DEBUG] Parsed plan structure:', JSON.stringify(parsedPlan, null, 2));
    
    // Convert plan to test cases format using correct field mapping
    const testCases = [];
    
    // Try different response structures based on MCP response format
    if (parsedPlan.testPlan) {
      // Handle structured MCP response with testPlan wrapper
      const testPlan = parsedPlan.testPlan;
      
      if (testPlan.testScenarios && Array.isArray(testPlan.testScenarios)) {
        console.log(`[DEBUG] Processing ${testPlan.testScenarios.length} test scenarios from MCP`);
        
        testPlan.testScenarios.forEach((scenario, index) => {
          // Handle both direct testSteps in scenario and testSteps lookup by scenario name
          let steps = '';
          
          if (scenario.testSteps && Array.isArray(scenario.testSteps)) {
            // Direct testSteps array in scenario
            steps = scenario.testSteps.map((step, i) => `${i + 1}. ${step}`).join('\n');
          } else if (testPlan.testSteps && testPlan.testSteps[scenario.scenario]) {
            // testSteps lookup by scenario name
            steps = testPlan.testSteps[scenario.scenario].map((step, i) => {
              // Remove existing numbering if present
              const cleanStep = step.replace(/^\d+\.\s*/, '');
              return `${i + 1}. ${cleanStep}`;
            }).join('\n');
          } else {
            // Fallback - use story's extracted URL or generic navigation
            const fallbackUrl = (story.extractedUrls && story.extractedUrls.length > 0) ? story.extractedUrls[0] : 'the target application';
            steps = `1. Navigate to ${fallbackUrl}\n2. ${scenario.description || scenario.scenario}`;
          }
          
          // Handle expectedResults similarly
          let expected = '';
          if (scenario.expectedResults) {
            expected = scenario.expectedResults;
          } else if (testPlan.expectedResults && testPlan.expectedResults[scenario.scenario]) {
            expected = testPlan.expectedResults[scenario.scenario];
          } else {
            expected = scenario.description || scenario.scenario;
          }
            
          testCases.push({
            title: `Test Case ${index + 1}: ${scenario.scenario}`,
            steps: steps,
            expected: expected
          });
        });
        
        console.log(`[DEBUG] Created ${testCases.length} test cases from MCP testScenarios`);
      }
    } else if (parsedPlan.steps && Array.isArray(parsedPlan.steps)) {
      // Handle direct steps format (legacy)
      console.log(`[DEBUG] Processing ${parsedPlan.steps.length} direct steps`);
      
      const groupedSteps = [];
      let currentGroup = { title: '', steps: [], expected: [] };
      
      parsedPlan.steps.forEach((step, index) => {
        if (index % 3 === 0 && index > 0) {
          if (currentGroup.steps.length > 0) {
            groupedSteps.push(currentGroup);
          }
          currentGroup = { title: '', steps: [], expected: [] };
        }
        currentGroup.steps.push(step.description || step.action || step);
      });
      
      if (currentGroup.steps.length > 0) {
        groupedSteps.push(currentGroup);
      }
      
      groupedSteps.forEach((group, index) => {
        testCases.push({
          title: `Test Case ${index + 1}: ${parsedPlan.testName || story.title}`,
          steps: group.steps.join('\n'),
          expected: parsedPlan.assertions?.[index]?.description || 'Test passes successfully'
        });
      });
      
      console.log(`[DEBUG] Created ${testCases.length} test cases from direct steps`);
    } else if (parsedPlan.assertions && Array.isArray(parsedPlan.assertions)) {
      // Handle assertions format
      console.log(`[DEBUG] Processing ${parsedPlan.assertions.length} assertions`);
      
      parsedPlan.assertions.forEach((assertion, index) => {
        testCases.push({
          title: `Test Case ${index + 1}: Verify ${assertion.target}`,
          steps: `1. Navigate to application\n2. Perform ${assertion.type} check on ${assertion.target}`,
          expected: assertion.description || `Verify ${assertion.expected}`
        });
      });
      
      console.log(`[DEBUG] Created ${testCases.length} test cases from assertions`);
    }
    
    // Enhanced fallback for better test case generation
    if (testCases.length === 0) {
      console.log('[DEBUG] No structured format found, creating detailed test cases from acceptance criteria...');
      
      // Generate detailed test cases from acceptance criteria
      const storyUrl = (story.extractedUrls && story.extractedUrls.length > 0) ? story.extractedUrls[0] : 'the target application';
      story.acceptanceCriteria.forEach((criteria, index) => {
        const steps = [
          `Navigate to ${storyUrl}`,
          `Verify that: ${criteria}`,
          'Ensure the requirement is fully satisfied'
        ].join('\n');
        
        testCases.push({
          title: `Test Case ${index + 1}: ${criteria}`,
          steps: steps,
          expected: criteria
        });
      });
      
      // Add responsive design test case if mentioned in scenarios
      if (story.description && story.description.toLowerCase().includes('screen size')) {
        testCases.push({
          title: `Test Case ${testCases.length + 1}: Responsive Design Verification`,
          steps: `1. Navigate to ${storyUrl}\n2. Test on desktop viewport (1920x1080)\n3. Test on tablet viewport (768x1024)\n4. Test on mobile viewport (375x667)\n5. Verify page content is visible on all screen sizes`,
          expected: 'Page content is properly displayed and formatted across all device sizes'
        });
      }
      
      console.log(`[DEBUG] Created ${testCases.length} test cases from acceptance criteria`);
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

// Step 4: Generate Test Scripts using Smart Strategy Generator
app.post('/api/workflow/generate-scripts', async (req, res) => {
  try {
    const { testCases, storyId, plan, story: clientStory } = req.body;

    if (!testCases || !storyId) {
      return res.status(400).json({ error: 'Test cases and story ID are required' });
    }

    console.log(`[API] 🧪 Using Smart Strategy Generator for ${storyId}`);
    
    // Auto-fetch story from Jira if not provided by client
    const story = await ensureStory(storyId, clientStory);

    // Step 1: Analyze story to determine test strategy
    const strategy = TestStrategyGenerator.analyzeStory(story);
    console.log(`[API] 📊 Story Analysis:`);
    console.log(`   Type: ${strategy.storyType}`);
    console.log(`   Verification: ${strategy.verificationApproach}`);
    console.log(`   Target URL: ${strategy.url}`);
    console.log(`   Target Elements: ${strategy.targetElements.targetText.join(', ')}`);
    
    // Step 2: Generate smart test cases based on strategy
    const smartTestCases = TestStrategyGenerator.generateSmartTestCases(story, strategy);
    console.log(`[API] 🧪 Generated ${smartTestCases.length} smart test cases`);
    
    let testScript;
    let targetUrl = strategy.url;

    // Step 2.5: Live page inspection - inspect actual DOM before code generation
    let pageInspection = { success: false, summary: '' };
    if (targetUrl && targetUrl !== 'https://example.com') {
      try {
        console.log(`[API] 🔍 Running live page inspection on: ${targetUrl}`);
        const credentials = PageInspector.extractCredentials(story);
        pageInspection = await PageInspector.inspect(targetUrl, {
          timeout: 30000,
          credentials: credentials
        });
        if (pageInspection.success) {
          console.log(`[API] ✅ Page inspection complete - DOM structure captured`);
        } else {
          console.warn(`[API] ⚠️ Page inspection failed: ${pageInspection.error}`);
        }
      } catch (inspectErr) {
        console.warn(`[API] ⚠️ Page inspection error: ${inspectErr.message}`);
      }
    }
    
    if (strategy.storyType === 'ADD' && smartTestCases.length > 0) {
      // For ADD stories, ALWAYS generate structural tests (don't verify content that doesn't exist yet)
      console.log(`[API] 🏗️ Generating STRUCTURAL test for ADD story`);
      testScript = smartTestCases[0].testCode;
      
    } else {
      // For other story types or fallback, use enhanced Generator Agent
      console.log(`[API] 🤖 Using Enhanced Generator Agent`);
      
      const enhancedDescription = `
STORY ANALYSIS:
- Type: ${strategy.storyType}
- Verification Approach: ${strategy.verificationApproach}
- Target URL: ${targetUrl}

STORY DETAILS:
Story ID: ${storyId}
Title: ${story?.title || storyId}
Description: ${story?.description || 'No description available'}

TEST CASES TO GENERATE:
${testCases.map((tc, i) => `${i + 1}. ${tc.title}\n   Steps: ${tc.steps}\n   Expected: ${tc.expected}`).join('\n')}

TEST STRATEGY:
${strategy.testStrategy.approach}

Required Tests:
${strategy.testStrategy.tests.map((test, i) => `${i + 1}. ${test}`).join('\n')}
${pageInspection.success ? `
--- LIVE PAGE INSPECTION (ACTUAL DOM STRUCTURE) ---
${pageInspection.summary}
--- END PAGE INSPECTION ---

CRITICAL: The page inspection above shows the REAL elements on the page.
- Use the EXACT selectors, IDs, data-test attributes, placeholders, and text shown above.
- Do NOT guess or assume element tags/roles - use what the inspection found.
- If an element has a data-test attribute, prefer that: page.locator('[data-test="value"]')
- If a heading text exists in a <span> not <h1>, do NOT use getByRole('heading') for it.
` : ''}
IMPORTANT INSTRUCTIONS:
- Generate a SEPARATE test() for EACH test case listed above
- If this is an ADD story, test page structure and areas, NOT the final content
- Use robust selectors with fallback strategies
- Include proper error handling and retries
- Use appropriate timeouts (60s for navigation, 15s for elements)

Generate a comprehensive Playwright test with one test() per test case and proper error handling.`;

      testScript = await testAgents.generateTest(enhancedDescription, {
        url: targetUrl,
        framework: 'playwright',
        useAIPage: false,
        includeComments: true
      });
    }
    
    console.log('[DEBUG] Test script generated using smart strategy');
    
    // Save the generated script
    const filename = `${storyId.toLowerCase()}-automated.spec.js`;
    const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
    console.log(`[DEBUG] Saving test file to: ${filepath}`);
    console.log(`[DEBUG] Strategy used: ${strategy.storyType} with ${strategy.verificationApproach} verification`);
    await fs.writeFile(filepath, testScript);
    console.log(`[DEBUG] File saved successfully, size: ${testScript.length} bytes`);
    
    // Verify file exists
    const fileExists = await fs.access(filepath).then(() => true).catch(() => false);
    console.log(`[DEBUG] File exists check: ${fileExists}`);

    res.json({
      success: true,
      filename,
      filepath,
      strategy: {
        storyType: strategy.storyType,
        verificationApproach: strategy.verificationApproach,
        targetUrl: targetUrl,
        testStrategy: strategy.testStrategy.approach
      },
      agentUsed: 'smart-generator',
      mcpEnabled: process.env.USE_MCP === 'true',
      pageInspection: pageInspection.success ? {
        inspected: true,
        elementsFound: {
          headings: pageInspection.pageInfo?.headings?.length || 0,
          buttons: pageInspection.pageInfo?.buttons?.length || 0,
          inputs: pageInspection.pageInfo?.inputs?.length || 0,
          images: pageInspection.pageInfo?.images?.length || 0,
          forms: pageInspection.pageInfo?.forms?.length || 0,
          postLoginPage: !!pageInspection.postLoginPageInfo
        }
      } : { inspected: false, error: pageInspection.error || 'Skipped' },
      message: `Generated smart test script (${strategy.storyType} strategy): ${filename}`
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
    const { filename, testCases, storyId, story: clientStory } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    console.log(`[API] Executing tests with self-healing: ${filename}`);
    
    // Auto-fetch story from Jira if not provided by client
    const story = await ensureStory(storyId, clientStory);

    const testPath = `src/tests/${filename}`;
    const fullTestPath = path.join(__dirname, '..', testPath);
    console.log(`[DEBUG] Test path: ${testPath}`);
    console.log(`[DEBUG] Full path: ${fullTestPath}`);
    console.log(`[DEBUG] CWD will be: ${path.join(__dirname, '..')}`);
    
    // Verify test file exists before execution
    const testFileExists = await fs.access(fullTestPath).then(() => true).catch(() => false);
    console.log(`[DEBUG] Test file exists: ${testFileExists}`);
    if (!testFileExists) {
      console.error(`[ERROR] Test file not found at: ${fullTestPath}`);
      // List files in directory
      const testsDir = path.join(__dirname, '..', 'src', 'tests');
      const files = await fs.readdir(testsDir);
      console.log(`[DEBUG] Files in tests directory: ${files.join(', ')}`);
    }
    
    const maxRetries = 2;
    let attempt = 1;
    let lastResults = null;
    let healingApplied = false;

    // Attempt test execution with self-healing retries
    while (attempt <= maxRetries) {
      console.log(`[SELF-HEAL] Attempt ${attempt}/${maxRetries}`);

      try {
        // Add --headed flag for local development (not on Railway)
        const isLocalDev = !process.env.RAILWAY_STATIC_URL && !process.env.RAILWAY_ENVIRONMENT_NAME;
        const headedFlag = isLocalDev ? '--headed' : '';
        const command = `npx playwright test "${testPath}" --config=config/playwright.config.js --project=chromium ${headedFlag}`.trim();
        console.log(`[DEBUG] Executing: ${command}`);
        console.log(`[DEBUG] Running in headed mode: ${isLocalDev}`);

        const startTime = Date.now();
        let stdout, stderr;
        
        try {
          const result = await execPromise(command, {
            cwd: path.join(__dirname, '..'),
            timeout: 180000, // 3 minute max per test run to prevent hanging
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
          });
          stdout = result.stdout;
          stderr = result.stderr;
        } catch (execError) {
          // Capture output even when process fails
          stdout = execError.stdout || '';
          stderr = execError.stderr || '';
          if (execError.killed) {
            console.error('[SELF-HEAL] ⚠️ Test execution timed out after 180 seconds');
          }
          throw execError;
        }
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        // Parse results
        const results = parsePlaywrightOutput(stdout);
        
        // Find video files from test-results
        const videoFiles = await findVideoFiles(testPath);

        // Check if any tests failed - if so, trigger self-healing
        if (results.failed > 0) {
          console.log(`[SELF-HEAL] Detected ${results.failed} failed tests, triggering self-healing`);
          const error = new Error('Tests failed');
          error.stdout = stdout;
          error.stderr = stderr;
          throw error;
        }

        // All tests passed! Return success
        const responseData = {
          success: true,
          ...results,
          duration,
          output: stdout,
          message: `Tests executed: ${results.passed}/${results.total} passed`,
          healingApplied: healingApplied ? true : false,
          healingDetails: healingApplied || null,
          attempts: attempt
        };
        
        // Add video links to output if videos exist
        if (videoFiles && videoFiles.length > 0) {
          const videoLinks = videoFiles.map(v => `\n📹 Video: ${v}`).join('');
          responseData.output = stdout + videoLinks;
          responseData.videos = videoFiles;
        }
        
        return res.json(responseData);

      } catch (error) {
        // Tests failed - analyze and potentially heal
        lastResults = parsePlaywrightOutput(error.stdout || '');
        console.log(`[SELF-HEAL] Attempt ${attempt} failed: ${lastResults.failed}/${lastResults.total} tests failed`);

        // If this was the last attempt, return failure
        if (attempt >= maxRetries) {
          console.log('[SELF-HEAL] Max retries reached, returning failure');
          
          // Find video files for failed tests
          const failedVideoFiles = await findVideoFiles(testPath);
          const failureResponse = {
            success: false,
            ...lastResults,
            error: error.message,
            output: error.stdout || error.stderr,
            healingApplied,
            attempts: attempt,
            message: `Tests failed after ${attempt} attempts`
          };
          
          // Add video links to failure output
          if (failedVideoFiles && failedVideoFiles.length > 0) {
            const videoLinks = failedVideoFiles.map(v => `\n\ud83d\udcf9 Video: ${v}`).join('');
            failureResponse.output = (error.stdout || error.stderr) + videoLinks;
            failureResponse.videos = failedVideoFiles;
          }
          
          return res.json(failureResponse);
        }

        // Apply self-healing: analyze failures and regenerate tests
        console.log('[SELF-HEAL] Analyzing failures and regenerating tests...');
        
        const errorOutput = error.stdout || error.stderr || '';
        const healingResult = await applyTestHealing({
          filename,
          testCases,
          storyId,
          story,
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
          
          // Find video files for healing failures
          const healingFailedVideos = await findVideoFiles(testPath);
          const healingFailureResponse = {
            success: false,
            ...lastResults,
            error: healingResult.error,
            output: error.stdout || error.stderr,
            healingApplied: false,
            healingDetails: healingResult,
            attempts: attempt,
            message: 'Self-healing failed'
          };
          
          // Add video links to healing failure output
          if (healingFailedVideos && healingFailedVideos.length > 0) {
            const videoLinks = healingFailedVideos.map(v => `\n\ud83d\udcf9 Video: ${v}`).join('');
            healingFailureResponse.output = (error.stdout || error.stderr) + videoLinks;
            healingFailureResponse.videos = healingFailedVideos;
          }
          
          return res.json(healingFailureResponse);
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
 * Apply self-healing to failed tests using Smart Strategy Healer Agent
 * Analyzes failures and regenerates tests with smart strategy and improved selectors
 */
async function applyTestHealing({ filename, testCases, storyId, story: inputStory, errorOutput, attempt }) {
  try {
    console.log('[SELF-HEAL] 🔧 Using Smart Strategy Healer Agent to analyze and fix test failures...');
    
    // Ensure we have the story object (auto-fetch from Jira if missing)
    const story = inputStory || await ensureStory(storyId, inputStory);
    
    // Get story strategy first for smarter healing
    let strategy = null;
    let isLogicError = false;
    
    if (story) {
      strategy = TestStrategyGenerator.analyzeStory(story);
      console.log(`[SELF-HEAL] 📊 Story strategy: ${strategy.storyType} - ${strategy.verificationApproach}`);
      
      // Check if this is a logical error (ADD story trying to verify end content)
      if (strategy.storyType === 'ADD' && (
          errorOutput.includes('element(s) not found') ||
          errorOutput.includes('expected to be visible') ||
          strategy.targetElements.targetText.some(text => errorOutput.includes(text))
      )) {
        console.log('[SELF-HEAL] 🚨 LOGIC ERROR DETECTED: ADD story is testing for content that should not exist yet');
        isLogicError = true;
      }
    }
    
    // Extract error details from Playwright output
    const errorPatterns = {
      selectorTimeout: /Timeout.*waiting for (selector|locator)/i,
      selectorNotFound: /locator\('([^']+)'\).*not found|element\(s\) not found|waiting for locator/i,
      textNotFound: /expected.*to contain.*but received|toContainText|toHaveText/i,
      navigationFailed: /(Navigation|net::ERR_|timeout.*navigation|Timeout.*goto|page\.goto)/i,
      strictModeViolation: /strict mode violation.*resolved to (\d+) elements/i,
      cssAssertion: /toHaveCSS|font-size|font-family/i,
      urlAssertion: /toHaveURL|Expected.*URL/i,
      consentPage: /consent\.google|cookie.*consent|accept.*cookie|Before you continue/i
    };

    const errors = {
      selectorIssues: [],
      textMismatches: [],
      navigationIssues: errorOutput.match(errorPatterns.navigationFailed) ? true : false,
      strictModeViolations: [],
      cssIssues: [],
      urlIssues: [],
      consentPageDetected: errorOutput.match(errorPatterns.consentPage) ? true : false
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
      if (errorPatterns.urlAssertion && errorPatterns.urlAssertion.test(line)) {
        errors.urlIssues.push(line.trim());
      }
    }
    
    // Also check full error text for selector issues (Playwright collapses errors across lines)
    if (errors.selectorIssues.length === 0 && errorOutput.match(/element\(s\) not found/i)) {
      errors.selectorIssues.push('element(s) not found - detected from full error output');
    }

    console.log('[SELF-HEAL] Error analysis:', {
      selectorIssues: errors.selectorIssues.length,
      textMismatches: errors.textMismatches.length,
      navigationIssues: errors.navigationIssues,
      strictModeViolations: errors.strictModeViolations.length,
      cssIssues: errors.cssIssues.length,
      urlIssues: errors.urlIssues.length,
      consentPageDetected: errors.consentPageDetected
    });

    // Read the failing test file
    const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
    const failingCode = await fs.readFile(filepath, 'utf-8');

    // === SMART URL EXTRACTION (story-first approach) ===
    // Priority 1: Use story's extracted URLs (from Jira)
    let targetUrl = null;
    
    if (story && story.extractedUrls && story.extractedUrls.length > 0) {
      targetUrl = story.extractedUrls[0];
      console.log(`[SELF-HEAL] 🔗 URL from story.extractedUrls: ${targetUrl}`);
    }
    
    // Priority 2: Use URLExtractor on story description
    if (!targetUrl && story) {
      const storyText = `${story.title || ''} ${story.description || ''}`;
      const extractedUrls = URLExtractor.extractURLs(storyText);
      if (extractedUrls.length > 0) {
        targetUrl = extractedUrls[0];
        console.log(`[SELF-HEAL] 🔗 URL from story text: ${targetUrl}`);
      }
    }
    
    // Priority 3: Infer URL from story ID patterns (e.g., ED- → endpointclinical.com)
    if (!targetUrl && storyId) {
      if (storyId.toUpperCase().startsWith('ED-')) {
        targetUrl = 'https://www.endpointclinical.com';
        console.log(`[SELF-HEAL] 🔗 URL inferred from story ID pattern: ${targetUrl}`);
      }
    }
    
    // Priority 4: Extract from failing code (but SKIP example.com)
    if (!targetUrl) {
      const gotoMatch = failingCode.match(/page\.goto\s*\(\s*['"]([^'"]+)['"]/);
      if (gotoMatch && !gotoMatch[1].includes('example.com')) {
        targetUrl = gotoMatch[1];
        console.log(`[SELF-HEAL] 🔗 URL from test code (non-example.com): ${targetUrl}`);
      }
    }
    
    // Priority 5: Check test cases for URLs (but SKIP example.com)
    if (!targetUrl) {
      const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\])>,]+/gi;
      for (const tc of testCases) {
        const matches = `${tc.title || ''} ${tc.steps || ''} ${tc.expected || ''}`.match(urlPattern);
        if (matches) {
          const validUrl = matches.map(u => u.replace(/[)\].,;:!?]+$/, '')).find(u => !u.includes('example.com'));
          if (validUrl) {
            targetUrl = validUrl;
            console.log(`[SELF-HEAL] 🔗 URL from test cases: ${targetUrl}`);
            break;
          }
        }
      }
    }
    
    // Priority 6: Keyword-based fallback from all available text
    if (!targetUrl) {
      const allText = `${story?.title || ''} ${story?.description || ''} ${failingCode} ${testCases.map(tc => `${tc.title} ${tc.steps} ${tc.expected}`).join(' ')}`.toLowerCase();
      
      if (allText.includes('facebook')) {
        targetUrl = 'https://www.facebook.com';
      } else if (allText.includes('google')) {
        targetUrl = 'https://www.google.com';
      } else if (allText.includes('yahoo')) {
        targetUrl = 'https://www.yahoo.com';
      } else if (allText.includes('endpoint') || allText.includes('endpointclinical')) {
        targetUrl = 'https://www.endpointclinical.com';
      } else {
        targetUrl = 'https://example.com';
        console.warn(`[SELF-HEAL] ⚠️ Could not determine target URL, falling back to example.com`);
      }
    }
    
    console.log(`[SELF-HEAL] 🎯 Target URL for healing: ${targetUrl}`);

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
      url: targetUrl,
      analysisDetails: {
        selectorIssues: errors.selectorIssues,
        textMismatches: errors.textMismatches,
        navigationIssues: errors.navigationIssues,
        strictModeViolations: errors.strictModeViolations,
        cssIssues: errors.cssIssues,
        urlIssues: errors.urlIssues,
        consentPageDetected: errors.consentPageDetected
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
    
    // Check if we got actual code back (has fixedCode property or solutions array)
    if (healingAnalysis.fixedCode) {
      // If it returned an object with fixedCode
      healedScript = healingAnalysis.fixedCode;
    } else if (healingAnalysis.solutions && healingAnalysis.solutions[0]) {
      // If it returned solutions array
      healedScript = healingAnalysis.solutions[0].code || healingAnalysis.solutions[0];
    } else {
      // Healer provided analysis only (not code) - regenerate the test
      console.log('[SELF-HEAL] ⚙️ Healer provided analysis, regenerating complete test code...');
      
      // Convert analysis to string if it's an object
      const analysisText = typeof healingAnalysis === 'object' 
        ? JSON.stringify(healingAnalysis, null, 2) 
        : healingAnalysis;
      
      let regeneratePrompt;
      
      if (isLogicError && strategy) {
        // For logic errors (ADD stories testing for end content), use smart strategy
        console.log('[SELF-HEAL] 🏗️ Applying STRUCTURAL test strategy for ADD story logic error');
        
        const smartTestCases = TestStrategyGenerator.generateSmartTestCases(story, strategy);
        if (smartTestCases && smartTestCases.length > 0) {
          // Use the smart test case code directly
          healedScript = smartTestCases[0].testCode;
          
          // Save and return early
          const filepath = path.join(__dirname, '..', 'src', 'tests', filename);
          await fs.writeFile(filepath, healedScript);
          
          return {
            success: true,
            action: 'structural-test-regeneration',
            strategy: strategy.storyType,
            details: `Fixed logic error: Generated structural test for ${strategy.storyType} story instead of content verification`,
            attempt: attempt,
            filename: filename
          };
        }
      }
      
      regeneratePrompt = `You are a Playwright test code generator. Based on this test failure analysis, generate a COMPLETE, WORKING test file.

FAILURE ANALYSIS:
${analysisText}

FAILED SELECTORS (DO NOT USE THESE AGAIN - they caused the failure):
${errors.selectorIssues.map(s => '- ' + s).join('\n') || 'None captured'}

${strategy ? `STORY STRATEGY:
- Type: ${strategy.storyType}
- Verification: ${strategy.verificationApproach}
- Test Approach: ${strategy.testStrategy.approach}
${isLogicError ? '\n⚠️ CRITICAL: This ADD story should NOT test for end content that doesn\'t exist yet!' : ''}
` : ''}

ORIGINAL TEST REQUIREMENTS:
Story ID: ${storyId}
Test Cases:
${JSON.stringify(testCases, null, 2)}

CRITICAL FIXES TO APPLY:
${isLogicError ? '- STRATEGY FIX: Generate STRUCTURAL/INFRASTRUCTURE tests, NOT content verification tests' : ''}
${errors.strictModeViolations.length > 0 ? '- Add .first() to all multi-match locators to handle strict mode violations' : ''}
${errors.navigationIssues ? '- Increase navigation timeout to 30000ms' : ''}
${errors.cssIssues.length > 0 ? '- Remove CSS exact value assertions, use visibility/existence checks instead' : ''}
${errors.selectorIssues.length > 0 ? '- The previous selectors FAILED. Use DIFFERENT, more reliable selectors. Prefer Playwright built-in locators: getByRole(), getByText(), getByPlaceholder(), getByLabel()' : ''}
${errors.textMismatches.length > 0 ? '- Use flexible text matching (contains, not exact match)' : ''}
${strategy && strategy.storyType === 'ADD' ? '- For ADD stories: Test page structure, forms, navigation - NOT final content' : ''}
${errors.consentPageDetected || true ? '- CONSENT/COOKIE DIALOGS: After page.goto(), ALWAYS try to dismiss consent dialogs before interacting with the page. Use: try { await page.getByRole("button", { name: /accept|agree|consent|got it/i }).first().click({ timeout: 5000 }); } catch(e) {}' : ''}
- URL ASSERTIONS: Never use exact URL match (sites redirect). Use regex: await expect(page).toHaveURL(/keyword/i)
- PAGE TITLE: NEVER use page.locator('title') — <title> is in <head>, not visible DOM. Use: await expect(page).toHaveTitle(/keyword/i)
- STRICT MODE: ALWAYS add .first() to getByText() and getByRole() locators. Playwright strict mode fails when multiple elements match.
  Example: page.getByText('Sign in').first() or page.getByRole('link', { name: 'Sign in' }).first()

REQUIREMENTS:
1. Generate COMPLETE test code (not snippets)
2. Include all imports: const { test, expect } = require('@playwright/test');
3. Include test.describe() wrapper
4. Apply ALL the fixes listed above
5. Add proper error handling with try/catch
6. Add console.log for debugging
7. Return ONLY executable JavaScript code (no markdown, no explanations)

Generate the fixed test file now:`;

      healedScript = await testAgents.generateTest(regeneratePrompt, {
        url: targetUrl,
        framework: 'playwright'
      });
    }

    // Clean up the code if it has markdown formatting
    healedScript = healedScript.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();

    // Validate that we have actual JavaScript code, not JSON analysis
    const isValidJS = healedScript.includes('test(') || healedScript.includes('test.describe(');
    const isJSON = healedScript.trim().startsWith('{') && 
                   (healedScript.includes('"Root Cause Analysis"') || 
                    healedScript.includes('"Specific Fix"') ||
                    healedScript.includes('"Prevention Strategy"'));

    if (isJSON || !isValidJS) {
      console.error('[SELF-HEAL] ❌ ERROR: Healer returned JSON analysis instead of code!');
      console.error('[SELF-HEAL] Attempting emergency regeneration...');
      
      // Emergency regeneration with explicit instructions
      const emergencyPrompt = `Generate a complete Playwright test file for these requirements:

Story: ${storyId}
Test Cases: ${JSON.stringify(testCases, null, 2)}
URL: ${targetUrl}

CRITICAL: Return ONLY executable JavaScript code. Do NOT return JSON analysis.

Must include:
- const { test, expect } = require('@playwright/test');
- test.describe() block
- test() functions
- Proper error handling

Example structure:
\`\`\`javascript
const { test, expect } = require('@playwright/test');

test.describe('Test Suite', () => {
  test('Test Case 1', async ({ page }) => {
    await page.goto('URL');
    // test code
  });
});
\`\`\`

Generate the complete test file now:`;

      healedScript = await testAgents.generateTest(emergencyPrompt, {
        url: targetUrl,
        framework: 'playwright'
      });
      
      healedScript = healedScript.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Final check
      if (healedScript.trim().startsWith('{')) {
        throw new Error('Healer Agent persistently returns JSON instead of code. Cannot auto-heal.');
      }
    }

    // Save the healed script (overwrite the failing one)
    await fs.writeFile(filepath, healedScript);

    console.log(`[SELF-HEAL] ✅ Saved healed test script using Healer Agent: ${filename}`);

    return {
      success: true,
      message: `Applied smart self-healing (attempt ${attempt})`,
      healedFile: filename,
      agentUsed: 'smart-healer',
      strategy: strategy ? {
        storyType: strategy.storyType,
        verificationApproach: strategy.verificationApproach,
        logicErrorDetected: isLogicError
      } : null,
      mcpEnabled: process.env.USE_MCP === 'true',
      errorAnalysis: {
        selectorIssues: errors.selectorIssues.length,
        textMismatches: errors.textMismatches.length,
        navigationIssues: errors.navigationIssues,
        strictModeViolations: errors.strictModeViolations.length,
        cssIssues: errors.cssIssues.length,
        logicError: isLogicError
      },
      fixesApplied: [
        isLogicError && 'Fixed logic error: Changed to structural test strategy',
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

// Helper function to find video files generated by Playwright
async function findVideoFiles(testFilePath) {
  try {
    const testResultsDir = path.join(__dirname, '..', 'test-results');
    
    // Check if test-results directory exists
    try {
      await fs.access(testResultsDir);
    } catch {
      console.log('[VIDEO] test-results directory not found');
      return [];
    }
    
    // Read all subdirectories in test-results
    const entries = await fs.readdir(testResultsDir, { withFileTypes: true });
    const videoFiles = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(testResultsDir, entry.name);
        const videoPath = path.join(dirPath, 'video.webm');
        
        // Check if video.webm exists in this directory
        try {
          await fs.access(videoPath);
          // Store relative path from workspace root
          const relativePath = path.relative(path.join(__dirname, '..'), videoPath);
          videoFiles.push(relativePath.replace(/\\/g, '/')); // Normalize path separators
          console.log('[VIDEO] Found video:', relativePath);
        } catch {
          // Video doesn't exist in this directory, continue
        }
      }
    }
    
    return videoFiles;
  } catch (error) {
    console.error('[VIDEO] Error finding video files:', error);
    return [];
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
