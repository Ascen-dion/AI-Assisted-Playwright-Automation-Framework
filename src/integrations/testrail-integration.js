/**
 * 🎯 TestRail Integration Module
 * 
 * Features:
 * - Push automated test cases to TestRail
 * - Update test run results automatically
 * - Create test suites and sections
 * - Map Playwright tests to TestRail cases
 * - Sync test execution status
 * 
 * Setup Instructions:
 * 1. npm install axios
 * 2. Set environment variables:
 *    - TESTRAIL_HOST=https://your-domain.testrail.io
 *    - TESTRAIL_USER=your-email@domain.com
 *    - TESTRAIL_API_KEY=your-api-key
 */

const axios = require('axios');

class TestRailIntegration {
  constructor() {
    this.host = process.env.TESTRAIL_HOST;
    this.user = process.env.TESTRAIL_USER;
    this.apiKey = process.env.TESTRAIL_API_KEY;
    
    if (!this.host || !this.user || !this.apiKey) {
      console.warn('⚠️  TestRail credentials not configured. Set TESTRAIL_HOST, TESTRAIL_USER, TESTRAIL_API_KEY');
    }
    
    this.client = axios.create({
      baseURL: `${this.host}/index.php?/api/v2`,
      auth: {
        username: this.user,
        password: this.apiKey
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Push a test case to TestRail
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @param {Object} testCase - Test case object
   * @returns {Promise<Object>} Created test case
   */
  async pushTestCase(projectId, suiteId, testCase) {
    try {
      const payload = {
        title: testCase.title,
        type_id: 1, // Automated
        priority_id: testCase.priority || 2, // Medium
        estimate: testCase.estimate || '5m',
        custom_automation_type: 1, // Playwright
        custom_steps: testCase.steps || '',
        custom_expected: testCase.expected || '',
        custom_preconds: testCase.preconditions || '',
        refs: testCase.refs || '' // Link to Jira ticket
      };

      const response = await this.client.post(
        `/add_case/${suiteId}`,
        payload
      );

      console.log(`✅ Test case pushed to TestRail: ${response.data.id} - ${testCase.title}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to push test case:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a test suite in TestRail
   * @param {number} projectId - TestRail project ID
   * @param {string} name - Suite name
   * @param {string} description - Suite description
   * @returns {Promise<Object>} Created suite
   */
  async createTestSuite(projectId, name, description = '') {
    try {
      const response = await this.client.post(
        `/add_suite/${projectId}`,
        {
          name,
          description
        }
      );

      console.log(`✅ Test suite created: ${response.data.id} - ${name}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create test suite:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a test run in TestRail
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @param {string} name - Run name
   * @param {Array<number>} caseIds - Array of test case IDs
   * @returns {Promise<Object>} Created test run
   */
  async createTestRun(projectId, suiteId, name, caseIds = []) {
    try {
      const payload = {
        suite_id: suiteId,
        name,
        include_all: caseIds.length === 0,
        case_ids: caseIds
      };

      const response = await this.client.post(
        `/add_run/${projectId}`,
        payload
      );

      console.log(`✅ Test run created: ${response.data.id} - ${name}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create test run:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update test result in TestRail
   * @param {number} runId - Test run ID
   * @param {number} caseId - Test case ID
   * @param {Object} result - Test result
   * @returns {Promise<Object>} Updated result
   */
  async updateTestResult(runId, caseId, result) {
    try {
      const payload = {
        status_id: this.mapStatus(result.status),
        comment: result.comment || '',
        elapsed: result.elapsed || '',
        defects: result.defects || '',
        version: result.version || ''
      };

      // Add screenshot/attachment if available
      if (result.screenshot) {
        payload.comment += `\n\n📸 Screenshot: ${result.screenshot}`;
      }

      const response = await this.client.post(
        `/add_result_for_case/${runId}/${caseId}`,
        payload
      );

      console.log(`✅ Test result updated: Case ${caseId} - ${result.status}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update test result:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Map Playwright test status to TestRail status ID
   * @param {string} status - Playwright status (passed, failed, skipped)
   * @returns {number} TestRail status ID
   */
  mapStatus(status) {
    const statusMap = {
      'passed': 1,   // Passed
      'failed': 5,   // Failed
      'skipped': 2,  // Blocked
      'timedout': 4, // Retest
      'broken': 5    // Failed
    };
    return statusMap[status] || 3; // Untested
  }

  /**
   * Batch push multiple test cases
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @param {Array<Object>} testCases - Array of test cases
   * @returns {Promise<Array>} Created test cases
   */
  async batchPushTestCases(projectId, suiteId, testCases) {
    console.log(`\n🔄 Pushing ${testCases.length} test cases to TestRail...\n`);
    
    const results = [];
    for (const testCase of testCases) {
      try {
        const result = await this.pushTestCase(projectId, suiteId, testCase);
        results.push(result);
      } catch (error) {
        console.error(`⚠️  Failed to push: ${testCase.title}`);
        results.push({ error: error.message, testCase });
      }
    }

    console.log(`\n✅ Batch push complete: ${results.filter(r => !r.error).length}/${testCases.length} successful\n`);
    return results;
  }

  /**
   * Get all test cases from a suite
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @returns {Promise<Array>} Test cases
   */
  async getTestCases(projectId, suiteId) {
    try {
      const response = await this.client.get(
        `/get_cases/${projectId}&suite_id=${suiteId}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get test cases:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Close a test run
   * @param {number} runId - Test run ID
   * @returns {Promise<Object>} Closed run
   */
  async closeTestRun(runId) {
    try {
      const response = await this.client.post(`/close_run/${runId}`);
      console.log(`✅ Test run closed: ${runId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to close test run:', error.response?.data || error.message);
      throw error;
    }
  }
}

/**
 * Playwright Reporter for TestRail
 * Add to playwright.config.js:
 * 
 * reporter: [
 *   ['list'],
 *   ['./src/integrations/testrail-reporter.js', { 
 *     projectId: 1, 
 *     suiteId: 1,
 *     runName: 'Automated Test Run'
 *   }]
 * ]
 */
class TestRailReporter {
  constructor(options) {
    this.options = options;
    this.testRail = new TestRailIntegration();
    this.results = [];
  }

  onBegin(config, suite) {
    console.log('\n🔗 TestRail Reporter: Starting test run...\n');
  }

  async onTestEnd(test, result) {
    // Extract TestRail case ID from test title or tags
    // Example: test.describe('C123: Login Test')
    const caseIdMatch = test.title.match(/C(\d+)/);
    if (caseIdMatch) {
      const caseId = parseInt(caseIdMatch[1]);
      this.results.push({
        caseId,
        status: result.status,
        elapsed: `${Math.round(result.duration / 1000)}s`,
        comment: result.error?.message || 'Test executed successfully'
      });
    }
  }

  async onEnd(result) {
    if (this.results.length === 0) {
      console.log('ℹ️  No TestRail cases found to report');
      return;
    }

    try {
      // Create test run
      const run = await this.testRail.createTestRun(
        this.options.projectId,
        this.options.suiteId,
        this.options.runName || `Automated Run - ${new Date().toISOString()}`,
        this.results.map(r => r.caseId)
      );

      // Update results
      for (const testResult of this.results) {
        await this.testRail.updateTestResult(
          run.id,
          testResult.caseId,
          testResult
        );
      }

      console.log(`\n✅ TestRail results updated: ${this.results.length} tests\n`);
    } catch (error) {
      console.error('❌ Failed to report to TestRail:', error.message);
    }
  }
}

module.exports = { TestRailIntegration, TestRailReporter };
