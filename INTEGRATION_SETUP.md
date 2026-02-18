# 🔗 TestRail & Jira Integration Setup Guide

This guide shows you how to integrate the framework with **TestRail** and **Jira** to enable:
- ✅ Automated test case management
- ✅ User story → Test automation generation
- ✅ Automatic result reporting
- ✅ Complete traceability

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [TestRail Integration](#testrail-integration)
3. [Jira Integration](#jira-integration)
4. [Complete Workflow: Jira → Automation](#complete-workflow)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)

---

## Prerequisites

### 1. Install Required Dependencies

```bash
npm install axios --save
```

### 2. Get API Credentials

#### TestRail
1. Go to TestRail → Administration → Site Settings → API
2. Enable API
3. Go to My Settings → API Keys → Generate API Key
4. Note your TestRail site URL, email, and API key

#### Jira
1. Go to Jira → Profile → Personal Access Tokens (or Account Settings → Security → API Tokens)
2. Create API Token
3. Note your Jira site URL, email, and API token

---

## 🎯 TestRail Integration

### Setup Environment Variables

Create a `.env` file in your project root:

```bash
# TestRail Configuration
TESTRAIL_HOST=https://your-domain.testrail.io
TESTRAIL_USER=your-email@domain.com
TESTRAIL_API_KEY=your-api-key-here
TESTRAIL_PROJECT_ID=1
TESTRAIL_SUITE_ID=1
```

### Features Available

#### 1. Push Test Cases to TestRail

```javascript
const { TestRailIntegration } = require('./src/integrations/testrail-integration');

const testRail = new TestRailIntegration();

const testCase = {
  title: 'User can login with valid credentials',
  priority: 2, // Medium
  estimate: '5m',
  steps: [
    'Navigate to login page',
    'Enter valid username',
    'Enter valid password',
    'Click login button'
  ].join('\n'),
  expected: 'User is logged in successfully',
  refs: 'PROJ-123' // Link to Jira ticket
};

await testRail.pushTestCase(projectId, suiteId, testCase);
```

#### 2. Update Test Results Automatically

```javascript
// After test execution
await testRail.updateTestResult(runId, caseId, {
  status: 'passed',
  comment: 'Test executed successfully',
  elapsed: '30s',
  screenshot: 'path/to/screenshot.png'
});
```

#### 3. Automatic Reporting in Playwright

Add to `playwright.config.js`:

```javascript
reporter: [
  ['list'],
  ['./src/integrations/testrail-reporter.js', { 
    projectId: 1, 
    suiteId: 1,
    runName: 'Automated Test Run'
  }]
]
```

Tag your tests with TestRail case IDs:

```javascript
test('C123: User can login', async ({ page }) => {
  // Test code
});
```

Results automatically sync to TestRail after execution! ✨

---

## 🎯 Jira Integration

### Setup Environment Variables

Add to your `.env` file:

```bash
# Jira Configuration
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-api-token-here
```

### Features Available

#### 1. Fetch User Story

```javascript
const { JiraIntegration } = require('./src/integrations/jira-integration');

const jira = new JiraIntegration();

// Fetch story with all details
const story = await jira.fetchUserStory('PROJ-123');

console.log(story.summary);
console.log(story.acceptanceCriteria);
console.log(story.testScenarios);
```

#### 2. Generate Test Plan from Story

```javascript
const testPlan = await jira.generateTestPlan('PROJ-123');

console.log(`Generated ${testPlan.testCases.length} test cases`);
testPlan.testCases.forEach(tc => {
  console.log(tc.title);
  console.log(tc.steps);
});
```

#### 3. Update Jira with Test Results

```javascript
await jira.updateTestResults('PROJ-123', {
  testName: 'Login Test',
  status: 'passed',
  duration: 5000,
  error: null
});
```

#### 4. Search Stories by JQL

```javascript
// Get stories from current sprint
const stories = await jira.searchStories(
  'project = PROJ AND sprint in openSprints() AND issuetype = Story'
);

// Get high priority stories
const urgent = await jira.searchStories(
  'project = PROJ AND priority = High AND status = "To Do"'
);
```

---

## 🚀 Complete Workflow: Jira → Automation

This is the **most powerful feature** - generate complete test automation from a Jira user story!

### Usage

```bash
node src/integrations/jira-to-automation.js PROJ-123
```

### What It Does

1. **Fetches** the user story from Jira
2. **Extracts** acceptance criteria and test scenarios
3. **Generates** test plan with test cases
4. **Uses AI** to create Playwright test script
5. **Executes** the generated test
6. **Pushes** test cases to TestRail (optional)
7. **Updates** Jira with test results

### Full Workflow Example

```javascript
const { JiraToAutomationWorkflow } = require('./src/integrations/jira-to-automation');

const workflow = new JiraToAutomationWorkflow();

const result = await workflow.executeWorkflow('PROJ-123', {
  execute: true,           // Run the generated test
  updateJira: true,        // Post results to Jira
  pushToTestRail: true,    // Push to TestRail
  testRailProjectId: 1,
  testRailSuiteId: 1
});

console.log(`Generated: ${result.script}`);
console.log(`Test Cases: ${result.testPlan.testCases.length}`);
console.log(`Status: ${result.executionResult.status}`);
```

### Expected Jira Story Format

For best results, format your Jira stories like this:

```
**Summary:**
User can login to the application

**Description:**

As a user
I want to login with my credentials
So that I can access my account

**Acceptance Criteria:**
- User can enter username and password
- Login button is enabled when both fields are filled
- User is redirected to dashboard after successful login
- Error message is shown for invalid credentials
- Password field is masked

**Test Scenarios:**
- Login with valid credentials (happy path)
- Login with invalid username
- Login with invalid password
- Login with empty fields
- Password visibility toggle
```

---

## ⚙️ Configuration

### Complete .env File

```bash
# TestRail Configuration
TESTRAIL_HOST=https://your-domain.testrail.io
TESTRAIL_USER=your-email@domain.com
TESTRAIL_API_KEY=your-api-key-here
TESTRAIL_PROJECT_ID=1
TESTRAIL_SUITE_ID=1

# Jira Configuration
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-api-token-here

# AI Configuration (for test generation)
OPENROUTER_API_KEY=your-openrouter-key
AI_MODEL=anthropic/claude-3.5-sonnet
```

### Load Environment Variables

Install dotenv:

```bash
npm install dotenv --save
```

Add to your test files:

```javascript
require('dotenv').config();
```

---

## 📚 Usage Examples

### Example 1: Manual Test Case Push

```javascript
const { TestRailIntegration } = require('./src/integrations/testrail-integration');

const testRail = new TestRailIntegration();

// Create suite first
const suite = await testRail.createTestSuite(
  1, // projectId
  'Login Module Tests',
  'Test cases for login functionality'
);

// Push multiple test cases
const testCases = [
  {
    title: 'Verify successful login',
    priority: 2,
    steps: 'Navigate\nEnter credentials\nClick login',
    expected: 'User logged in',
    refs: 'PROJ-123'
  },
  {
    title: 'Verify login validation',
    priority: 3,
    steps: 'Navigate\nClick login without credentials',
    expected: 'Validation error shown',
    refs: 'PROJ-123'
  }
];

await testRail.batchPushTestCases(1, suite.id, testCases);
```

### Example 2: Jira Story to Test Automation

```bash
# Simple command-line usage
node src/integrations/jira-to-automation.js PROJ-456

# This will:
# 1. Fetch PROJ-456 from Jira
# 2. Generate test cases from acceptance criteria
# 3. Create Playwright test script using AI
# 4. Execute the test
# 5. Report results back to Jira
```

### Example 3: Batch Process Sprint Stories

```javascript
const { JiraIntegration } = require('./src/integrations/jira-integration');
const { JiraToAutomationWorkflow } = require('./src/integrations/jira-to-automation');

const jira = new JiraIntegration();
const workflow = new JiraToAutomationWorkflow();

// Get all stories from current sprint
const stories = await jira.getCurrentSprintStories('board-id');

// Generate automation for each story
for (const story of stories) {
  console.log(`\nProcessing: ${story.key}`);
  
  await workflow.executeWorkflow(story.key, {
    execute: false,        // Don't execute yet
    updateJira: false,     // Generate only
    pushToTestRail: true
  });
}

console.log(`\n✅ Generated automation for ${stories.length} stories`);
```

### Example 4: TestRail Auto-Reporting

```javascript
// In playwright.config.js
module.exports = {
  reporter: [
    ['list'],
    ['html'],
    ['./src/integrations/testrail-reporter.js', {
      projectId: 1,
      suiteId: 1,
      runName: `Automated Run - ${new Date().toLocaleDateString()}`
    }]
  ]
};

// In your tests, use TestRail case IDs
test('C101: Homepage loads correctly', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('C102: User can search', async ({ page }) => {
  // Test code
});

// Run tests - results automatically sync to TestRail!
// npx playwright test
```

---

## 🎯 Benefits

### For QA Teams
- ✅ **Automated Test Management**: Push test cases automatically
- ✅ **Instant Reporting**: Results sync to TestRail after every run
- ✅ **Traceability**: Link tests to Jira stories automatically
- ✅ **Time Savings**: No manual test case documentation

### For Developers
- ✅ **Story → Test**: Generate automation from user stories
- ✅ **CI/CD Ready**: Automatic result reporting in pipelines
- ✅ **Coverage Tracking**: See what's tested in TestRail
- ✅ **Less Context Switching**: Everything connected

### For Management
- ✅ **Real-time Visibility**: Test results in TestRail dashboard
- ✅ **ROI Metrics**: See automation coverage vs. manual
- ✅ **Sprint Progress**: Track testing status in Jira
- ✅ **Quality Metrics**: Test pass rates and trends

---

## 🔧 Troubleshooting

### Issue: "TestRail credentials not configured"

**Solution:** Set environment variables in `.env` file or system environment.

### Issue: "Failed to fetch user story"

**Solution:** 
- Check Jira API token is valid
- Verify issue key exists (e.g., PROJ-123)
- Ensure you have permission to view the issue

### Issue: "No acceptance criteria found"

**Solution:** 
- Format Jira description with "Acceptance Criteria:" header
- Use bullet points for each criterion
- See "Expected Jira Story Format" section above

### Issue: "Test case already exists in TestRail"

**Solution:** TestRail doesn't allow duplicate titles in same suite. Either:
- Delete existing case
- Use different title
- Update existing case instead

---

## 🚀 Next Steps

1. **Set up credentials** for TestRail and Jira
2. **Try the examples** above with your projects
3. **Run the complete workflow** with a Jira story
4. **Customize** the integrations for your team's needs
5. **Share** the results with your QA head! 🎉

---

## 📞 Support

For issues or questions:
1. Check the integration module code in `src/integrations/`
2. Review error messages - they include helpful guidance
3. Verify API credentials are correct
4. Test API access with curl commands first

---

**Happy Testing!** 🎯✨
