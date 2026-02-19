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
  async pushTestCase(projectId, suiteId, testCase, sectionId = null) {
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

      // Use section_id in URL if provided, otherwise use suite_id
      const endpoint = sectionId 
        ? `/add_case/${sectionId}`
        : `/add_case/${suiteId}`;

      const response = await this.client.post(endpoint, payload);

      console.log(`✅ Test case pushed to TestRail: ${response.data.id} - ${testCase.title}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to push test case:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get all test cases from a suite/section
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @param {number} sectionId - Optional section ID
   * @returns {Promise<Array>} Array of test cases
   */
  async getTestCases(projectId, suiteId, sectionId = null) {
    try {
      let url = `/get_cases/${projectId}&suite_id=${suiteId}`;
      if (sectionId) {
        url += `&section_id=${sectionId}`;
      }

      const response = await this.client.get(url);
      return response.data.cases || response.data;
    } catch (error) {
      console.error('❌ Failed to get test cases:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Find existing test case by title
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @param {string} title - Test case title
   * @param {number} sectionId - Optional section ID
   * @returns {Promise<Object|null>} Existing test case or null
   */
  async findTestCaseByTitle(projectId, suiteId, title, sectionId = null) {
    try {
      const cases = await this.getTestCases(projectId, suiteId, sectionId);
      return cases.find(testCase => testCase.title === title) || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update an existing test case
   * @param {number} caseId - Test case ID to update
   * @param {Object} testCase - Updated test case data
   * @returns {Promise<Object>} Updated test case
   */
  async updateTestCase(caseId, testCase) {
    try {
      const payload = {
        title: testCase.title,
        type_id: 1, // Automated
        priority_id: testCase.priority || 2,
        estimate: testCase.estimate || '5m',
        custom_automation_type: 1,
        custom_steps: testCase.steps || '',
        custom_expected: testCase.expected || '',
        custom_preconds: testCase.preconditions || '',
        refs: testCase.refs || ''
      };

      const response = await this.client.post(`/update_case/${caseId}`, payload);
      console.log(`✅ Test case updated: ${caseId} - ${testCase.title}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update test case:', error.response?.data || error.message);
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
   * Batch push multiple test cases (with duplicate detection)
   * @param {number} projectId - TestRail project ID
   * @param {number} suiteId - TestRail suite ID
   * @param {Array<Object>} testCases - Array of test cases
   * @param {number} sectionId - Optional section ID
   * @param {boolean} updateExisting - Whether to update existing test cases (default: true)
   * @returns {Promise<Array>} Created/updated test cases
   */
  async batchPushTestCases(projectId, suiteId, testCases, sectionId = null, updateExisting = true) {
    console.log(`\n🔄 Pushing ${testCases.length} test cases to TestRail...\n`);
    
    // Fetch existing test cases to check for duplicates
    console.log('🔍 Checking for existing test cases...');
    const existingCases = await this.getTestCases(projectId, suiteId, sectionId);
    
    const results = [];
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const testCase of testCases) {
      try {
        // Check if test case already exists
        const existing = existingCases.find(tc => tc.title === testCase.title);
        
        if (existing) {
          if (updateExisting) {
            console.log(`🔄 Updating existing test case: ${existing.id} - ${testCase.title}`);
            const result = await this.updateTestCase(existing.id, testCase);
            results.push({ ...result, action: 'updated' });
            updated++;
          } else {
            console.log(`⏭️  Skipping existing test case: ${existing.id} - ${testCase.title}`);
            results.push({ ...existing, action: 'skipped' });
            skipped++;
          }
        } else {
          // Create new test case
          const result = await this.pushTestCase(projectId, suiteId, testCase, sectionId);
          results.push({ ...result, action: 'created' });
          created++;
        }
      } catch (error) {
        console.error(`⚠️  Failed to process: ${testCase.title}`);
        results.push({ error: error.message, testCase, action: 'failed' });
      }
    }

    console.log(`\n✅ Batch push complete:`);
    console.log(`   📝 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${results.filter(r => r.error).length}\n`);
    
    return results;
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
