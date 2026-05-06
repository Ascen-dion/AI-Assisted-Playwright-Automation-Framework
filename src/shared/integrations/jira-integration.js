/**
 * 🎯 Jira Integration Module
 * 
 * Features:
 * - Fetch user stories from Jira
 * - Extract acceptance criteria
 * - Generate test cases from stories
 * - Create test automation from requirements
 * - Update Jira with test execution status
 * - Link test results back to stories
 * 
 * Setup Instructions:
 * 1. npm install axios
 * 2. Set environment variables:
 *    - JIRA_HOST=https://your-domain.atlassian.net
 *    - JIRA_EMAIL=your-email@domain.com
 *    - JIRA_API_TOKEN=your-api-token
 */

const axios = require('axios');

class JiraIntegration {
  constructor() {
    this.host = process.env.JIRA_HOST;
    this.email = process.env.JIRA_EMAIL;
    this.apiToken = process.env.JIRA_API_TOKEN;
    
    if (!this.host || !this.email || !this.apiToken) {
      console.warn('⚠️  Jira credentials not configured. Set JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN');
    }
    
    this.client = axios.create({
      baseURL: `${this.host}/rest/api/3`,
      auth: {
        username: this.email,
        password: this.apiToken
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch user story from Jira
   * @param {string} issueKey - Jira issue key (e.g., PROJ-123)
   * @returns {Promise<Object>} User story details
   */
  async fetchUserStory(issueKey) {
    try {
      const response = await this.client.get(`/issue/${issueKey}`, {
        params: {
          fields: 'summary,description,issuetype,status,priority,assignee,labels,customfield_*'
        }
      });

      const issue = response.data;
      
      console.log(`\n✅ Fetched Jira Story: ${issueKey}`);
      console.log(`   📝 Summary: ${issue.fields.summary}`);
      console.log(`   📊 Status: ${issue.fields.status.name}`);
      console.log(`   🏷️  Type: ${issue.fields.issuetype.name}\n`);

      return this.parseUserStory(issue);
    } catch (error) {
      console.error('❌ Failed to fetch user story:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Parse user story into structured format
   * @param {Object} issue - Jira issue object
   * @returns {Object} Parsed user story
   */
  parseUserStory(issue) {
    const fields = issue.fields;
    const description = fields.description?.content || [];
    
    // Extract acceptance criteria from description
    const acceptanceCriteria = this.extractAcceptanceCriteria(description);
    
    // Extract test scenarios
    const testScenarios = this.extractTestScenarios(description);

    // Parse description and extract URLs
    const parsedDescription = this.parseADF(description);
    const extractedUrls = this._extractedUrls || [];

    return {
      key: issue.key,
      summary: fields.summary,
      description: parsedDescription,
      acceptanceCriteria,
      testScenarios,
      extractedUrls: extractedUrls, // Add extracted URLs
      status: fields.status.name,
      priority: fields.priority?.name || 'Medium',
      labels: fields.labels || [],
      assignee: fields.assignee?.displayName || 'Unassigned',
      issueType: fields.issuetype.name,
      raw: issue
    };
  }

  /**
   * Extract acceptance criteria from Jira description
   * @param {Array} content - Jira ADF content
   * @returns {Array<string>} Acceptance criteria
   */
  extractAcceptanceCriteria(content) {
    const criteria = [];
    let inCriteriaSection = false;

    for (const block of content) {
      // Detect "Acceptance Criteria" in both paragraph and heading blocks
      if (block.type === 'paragraph' || block.type === 'heading') {
        const text = this.parseADF([block]);
        
        // Look for "Acceptance Criteria" header
        if (/acceptance criteria/i.test(text)) {
          inCriteriaSection = true;
          continue;
        }
        
        // Look for "Test Scenarios" - end of criteria
        if (/test scenarios|test cases/i.test(text)) {
          inCriteriaSection = false;
        }
      }

      // Collect bullet list items when inside criteria section
      if (block.type === 'bulletList' && inCriteriaSection) {
        for (const item of block.content) {
          const text = this.parseADF(item.content);
          if (text.trim()) {
            criteria.push(text.trim());
          }
        }
      }

      // Also collect ordered list items (some stories use numbered lists)
      if (block.type === 'orderedList' && inCriteriaSection) {
        for (const item of block.content) {
          const text = this.parseADF(item.content);
          if (text.trim()) {
            criteria.push(text.trim());
          }
        }
      }
    }

    // Return empty array instead of placeholder - callers handle the empty case
    return criteria;
  }

  /**
   * Extract test scenarios from description
   * @param {Array} content - Jira ADF content
   * @returns {Array<string>} Test scenarios
   */
  extractTestScenarios(content) {
    const scenarios = [];
    let inScenarioSection = false;

    for (const block of content) {
      if (block.type === 'paragraph') {
        const text = this.parseADF([block]);
        
        if (/test scenarios|test cases/i.test(text)) {
          inScenarioSection = true;
          continue;
        }
      }

      if (block.type === 'bulletList' && inScenarioSection) {
        for (const item of block.content) {
          const text = this.parseADF(item.content);
          if (text.trim()) {
            scenarios.push(text.trim());
          }
        }
      }
    }

    return scenarios;
  }

  /**
   * Parse Jira ADF (Atlassian Document Format) to plain text
   * Enhanced to extract URLs and preserve formatting
   * @param {Array} content - ADF content
   * @returns {string} Plain text with proper formatting
   */
  parseADF(content) {
    if (!Array.isArray(content)) return '';
    
    let text = '';
    let urls = [];
    
    for (const block of content) {
      if (block.type === 'text') {
        text += block.text;
      } else if (block.type === 'paragraph') {
        // Add proper paragraph breaks
        if (text && !text.endsWith('\n')) {
          text += '\n';
        }
        text += this.parseADF(block.content || []);
        text += '\n';
      } else if (block.type === 'bulletList' || block.type === 'orderedList') {
        text += '\n';
        text += this.parseADF(block.content || []);
        text += '\n';
      } else if (block.type === 'listItem') {
        text += '• ';
        text += this.parseADF(block.content || []);
        text += '\n';
      } else if (block.type === 'inlineCard' && block.attrs && block.attrs.url) {
        // Extract URLs from inline cards
        urls.push(block.attrs.url);
        text += ` ${block.attrs.url} `;
      } else if (block.content) {
        text += this.parseADF(block.content);
      }
    }
    
    // Clean up extra newlines and spaces
    text = text.replace(/\n{3,}/g, '\n\n').replace(/\s+/g, ' ').trim();
    
    // Store extracted URLs for later use
    this._extractedUrls = urls;
    
    return text;
  }

  /**
   * Generate test plan from user story
   * @param {string} issueKey - Jira issue key
   * @returns {Promise<Object>} Generated test plan
   */
  async generateTestPlan(issueKey) {
    console.log(`\n🎯 Generating test plan from Jira story: ${issueKey}\n`);
    
    const story = await this.fetchUserStory(issueKey);
    
    const testPlan = {
      storyKey: story.key,
      storySummary: story.summary,
      testCases: [],
      executionSteps: []
    };

    // Generate test cases from acceptance criteria
    story.acceptanceCriteria.forEach((criteria, index) => {
      testPlan.testCases.push({
        id: `TC-${issueKey}-${index + 1}`,
        title: `Verify: ${criteria}`,
        priority: story.priority,
        precondition: `User story ${issueKey} implemented`,
        steps: this.generateTestSteps(criteria),
        expectedResult: criteria,
        linkedStory: issueKey
      });
    });

    // Add test scenarios if available
    story.testScenarios.forEach((scenario, index) => {
      testPlan.testCases.push({
        id: `TC-${issueKey}-SC-${index + 1}`,
        title: scenario,
        priority: story.priority,
        precondition: `User story ${issueKey} implemented`,
        steps: this.generateTestSteps(scenario),
        expectedResult: `Scenario completes successfully`,
        linkedStory: issueKey
      });
    });

    console.log(`✅ Generated ${testPlan.testCases.length} test cases from story\n`);
    
    return testPlan;
  }

  /**
   * Generate test steps from criteria/scenario
   * @param {string} criteria - Acceptance criteria or scenario
   * @returns {Array<string>} Test steps
   */
  generateTestSteps(criteria) {
    // Basic step generation - can be enhanced with AI
    const steps = [
      'Navigate to the application',
      'Perform the required action',
      'Verify the expected outcome'
    ];

    // Try to extract action words
    const actionWords = criteria.match(/\b(click|enter|select|verify|open|navigate|submit|login|logout|create|delete|update)\b/gi);
    if (actionWords && actionWords.length > 0) {
      return actionWords.map((action, i) => `${i + 1}. ${action} as per: "${criteria}"`);
    }

    return steps;
  }

  /**
   * Update Jira issue with test results
   * @param {string} issueKey - Jira issue key
   * @param {Object} testResult - Test execution result
   * @returns {Promise<Object>} Updated issue
   */
  async updateTestResults(issueKey, testResult) {
    try {
      const comment = this.formatTestResultComment(testResult);
      
      await this.client.post(`/issue/${issueKey}/comment`, {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment
                }
              ]
            }
          ]
        }
      });

      console.log(`✅ Test results posted to ${issueKey}`);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to update Jira:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Format test result as comment
   * @param {Object} testResult - Test result object
   * @returns {string} Formatted comment
   */
  formatTestResultComment(testResult) {
    const emoji = testResult.status === 'passed' ? '✅' : '❌';
    const timestamp = new Date().toISOString();
    
    return `
${emoji} Automated Test Execution Result

Test: ${testResult.testName}
Status: ${testResult.status.toUpperCase()}
Duration: ${testResult.duration}ms
Timestamp: ${timestamp}

${testResult.error ? `Error: ${testResult.error}` : 'All assertions passed'}

Framework: Playwright AI Framework
    `.trim();
  }

  /**
   * Search for user stories by JQL
   * @param {string} jql - Jira Query Language string
   * @returns {Promise<Array>} Matching issues
   */
  async searchStories(jql) {
    try {
      const response = await this.client.post('/search', {
        jql,
        fields: ['key', 'summary', 'status', 'issuetype'],
        maxResults: 50
      });

      console.log(`\n🔍 Found ${response.data.issues.length} stories\n`);
      
      return response.data.issues;
    } catch (error) {
      console.error('❌ Failed to search stories:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get stories from a sprint
   * @param {number} sprintId - Sprint ID
   * @returns {Promise<Array>} Sprint stories
   */
  async getSprintStories(sprintId) {
    const jql = `sprint = ${sprintId} AND issuetype = Story ORDER BY priority DESC`;
    return this.searchStories(jql);
  }

  /**
   * Get stories for current sprint
   * @param {string} boardId - Board ID
   * @returns {Promise<Array>} Current sprint stories
   */
  async getCurrentSprintStories(boardId) {
    const jql = `board = ${boardId} AND sprint in openSprints() AND issuetype = Story ORDER BY priority DESC`;
    return this.searchStories(jql);
  }
}

/**
 * Helper function to generate automation from Jira story
 */
async function generateAutomationFromJira(issueKey, aiEngine) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🤖 AI-POWERED TEST GENERATION FROM JIRA`);
  console.log(`${'═'.repeat(80)}\n`);

  const jira = new JiraIntegration();
  
  // Fetch the story
  const story = await jira.fetchUserStory(issueKey);
  
  // Generate test plan
  const testPlan = await jira.generateTestPlan(issueKey);
  
  console.log(`📋 Test Plan Generated:`);
  console.log(`   Story: ${story.key} - ${story.summary}`);
  console.log(`   Test Cases: ${testPlan.testCases.length}`);
  console.log(`   Priority: ${story.priority}\n`);

  // Generate Playwright test script using AI
  const prompt = `
Generate a Playwright test script for the following user story:

**Story:** ${story.summary}

**Acceptance Criteria:**
${story.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Test Scenarios:**
${story.testScenarios.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Generate complete Playwright test code with proper assertions and error handling.
  `.trim();

  console.log(`🤖 Sending to AI engine for test script generation...\n`);
  
  if (aiEngine) {
    const generatedScript = await aiEngine.generateTestScript(prompt);
    
    return {
      story,
      testPlan,
      script: generatedScript,
      recommendedName: `${issueKey.toLowerCase().replace('-', '_')}.spec.js`
    };
  }

  return { story, testPlan };
}

module.exports = { JiraIntegration, generateAutomationFromJira };
