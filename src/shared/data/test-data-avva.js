/**
 * AVVA Console Test Data Module
 * 
 * All test data constants for AVVA application testing.
 * Import: const TD = require('../../../shared/data/test-data-avva');
 * Usage: TD.avva.urls.agentBuilder, TD.avva.messages.agentSavedSuccess
 */

module.exports = {
  avva: {
    // URLs
    urls: {
      base: 'https://int-ai.aava.ai',
      console: 'https://int-ai.aava.ai/console',
      launchpad: 'https://int-ai.aava.ai/launchpad',
      agentBuilder: 'https://int-ai.aava.ai/launchpad/build/agent',
      workflowBuilder: 'https://int-ai.aava.ai/launchpad/build/workflow',
      testGenerator: 'https://int-ai.aava.ai/launchpad/generate',
      dashboard: 'https://int-ai.aava.ai/dashboard',
      testCases: 'https://int-ai.aava.ai/testcases',
      results: 'https://int-ai.aava.ai/results',
      settings: 'https://int-ai.aava.ai/settings',
    },

    // URL patterns (regex for flexible matching)
    urlPatterns: {
      agentDetail: /\/agents\/\d+/,
      agentEdit: /\/agents\/\d+\/edit/,
      testCaseDetail: /\/testcases\/\d+/,
      testRunDetail: /\/runs\/\d+/,
      userProfile: /\/profile\/\w+/,
    },

    // Authentication
    auth: {
      email: process.env.AVVA_EMAILID || 'mohan.r@ascendion.com',
      storageStatePath: 'playwright/.auth/avva-storageState.json',
      tokenKey: 'authToken',
      microsoftLoginUrl: /login\.microsoftonline\.com/,
    },

    // Success/Error messages
    messages: {
      // Agent messages
      agentSavedSuccess: 'Agent saved successfully',
      agentCreatedSuccess: 'Agent created successfully',
      agentUpdatedSuccess: 'Agent updated successfully',
      agentDeletedSuccess: 'Agent deleted successfully',
      agentRunStarted: 'Agent run started',
      
      // Test case messages
      testCaseSavedSuccess: 'Test case saved successfully',
      testCaseDeletedSuccess: 'Test case deleted successfully',
      testCaseLinkedSuccess: 'Test case linked successfully',
      
      // Test run messages
      testRunCreated: 'Test run created successfully',
      testRunCompleted: 'Test run completed',
      resultsPostedSuccess: 'Results posted successfully',
      
      // Validation errors
      validationErrorName: 'Name is required',
      validationErrorNameLength: 'Name must be between 3 and 100 characters',
      validationErrorTools: 'At least one tool must be selected',
      validationErrorModel: 'Model selection is required',
      validationErrorSteps: 'At least one step is required',
      
      // Error messages
      errorUnauthorized: 'Unauthorized',
      errorForbidden: 'You do not have permission',
      errorNotFound: 'Resource not found',
      errorServerError: 'An error occurred. Please try again.',
    },

    // Page titles
    pageTitles: {
      dashboard: /AVVA.*Dashboard/,
      launchpad: /AVVA.*Launchpad/,
      agentBuilder: /AVVA.*Agent Builder/,
      workflowBuilder: /AVVA.*Workflow/,
      testCases: /AVVA.*Test Cases/,
      results: /AVVA.*Results/,
      settings: /AVVA.*Settings/,
    },

    // Agent defaults
    agent: {
      defaultModel: 'Claude Sonnet 4.6',
      models: [
        'Claude Sonnet 4.6',
        'Claude Sonnet 4.0',
        'GPT-4',
        'GPT-4 Turbo',
        'GPT-3.5 Turbo',
      ],
      minNameLength: 3,
      maxNameLength: 100,
      statuses: ['Draft', 'Active', 'Archived'],
      toolCategories: [
        'vscode',
        'execute',
        'read',
        'agent',
        'edit',
        'search',
        'web',
        'playwright/*',
        'browser',
      ],
    },

    // Test case defaults
    testCase: {
      priorities: ['High', 'Medium', 'Low'],
      statuses: ['Not Started', 'In Progress', 'Passed', 'Failed', 'Blocked', 'Skipped'],
      maxTitleLength: 200,
      maxStepLength: 1000,
    },

    // Test run defaults
    testRun: {
      environments: ['chromium', 'firefox', 'webkit', 'mobile-chrome', 'mobile-safari'],
      statuses: ['Pending', 'Running', 'Completed', 'Failed', 'Cancelled'],
    },

    // Timeouts (milliseconds)
    timeouts: {
      elementVisible: 15000,
      pageLoad: 60000,
      networkIdle: 30000,
      apiResponse: 10000,
      toastMessage: 5000,
    },

    // Test data (dynamic values)
    testData: {
      agentNamePrefix: 'Test Agent',
      testCasePrefix: 'Test Case',
      testRunPrefix: 'Test Run',
      timestamp: () => Date.now(),
      uniqueAgentName: () => `Test Agent ${Date.now()}`,
      uniqueTestCaseName: () => `Test Case ${Date.now()}`,
      uniqueTestRunName: () => `Test Run ${new Date().toISOString().split('T')[0]}`,
    },

    // Sample data for testing
    sampleData: {
      validAgentNames: [
        'E2E Test Agent',
        'Smoke Test Bot',
        'Regression Suite Agent',
      ],
      invalidAgentNames: [
        '',                    // Empty
        'AB',                  // Too short
        'A'.repeat(101),      // Too long
        'Test Agent!@#',      // Special chars
      ],
      validTestCaseTitles: [
        'AC1: User creates new agent',
        'AC2: User updates agent configuration',
        'AC3: User deletes agent successfully',
      ],
      tools: [
        'browser',
        'playwright/browser_click',
        'playwright/browser_navigate',
        'vscode/runCommand',
        'edit/createFile',
      ],
    },
  },
};
