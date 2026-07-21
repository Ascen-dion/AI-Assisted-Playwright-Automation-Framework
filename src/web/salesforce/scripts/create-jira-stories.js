/**
 * Create JIRA User Stories for Salesforce Test Suite
 * 
 * This script creates JIRA user stories using the JIRA REST API directly.
 * It reads credentials from .env and creates stories for all 4 scenarios.
 * 
 * Usage:
 *   node src/web/salesforce/scripts/create-jira-stories.js
 */

require('dotenv').config();
const https = require('https');
const { URL } = require('url');

const JIRA_URL = process.env.JIRA_URL || 'https://aavademo.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'DZ';

// Salesforce Test Suite Scenarios
const SCENARIOS = [
  {
    id: 'S1',
    title: '[Salesforce] Create a Lead and Convert to Opportunity',
    description: 'User story covering the complete lead creation and conversion process',
    acceptanceCriteria: [
      {
        id: 'AC1',
        title: 'Create a New Lead',
        gherkin: 'Given the user is logged into Salesforce\nWhen the user navigates to the Leads tab\nAnd clicks on New\nAnd enters all mandatory lead details\nAnd clicks Save\nThen the system should successfully create the Lead\nAnd display the Lead detail page.'
      },
      {
        id: 'AC2',
        title: 'Validate Mandatory Fields During Lead Creation',
        gherkin: 'Given the user is creating a new Lead\nWhen the user leaves one or more mandatory fields blank\nAnd clicks Save\nThen the system should prevent the Lead from being created\nAnd display validation messages for the missing mandatory fields.'
      },
      {
        id: 'AC3',
        title: 'Convert Lead to Opportunity',
        gherkin: 'Given an active Lead exists in Salesforce\nWhen the user clicks Convert\nAnd selects the appropriate Account and Contact options\nAnd completes the conversion process\nThen the system should successfully convert the Lead\nAnd create an Opportunity associated with the Account and Contact\nAnd mark the Lead as Converted.'
      },
      {
        id: 'AC4',
        title: 'Verify Opportunity Creation After Lead Conversion',
        gherkin: 'Given a Lead has been successfully converted\nWhen the user opens the generated Opportunity\nThen the Opportunity should contain the expected information copied from the Lead\nAnd be associated with the correct Account and Contact.'
      }
    ],
    testScript: 'src/web/salesforce/tests/salesforce-s1-lead-conversion.spec.js'
  },
  {
    id: 'S2',
    title: '[Salesforce] Create a Quote with Validation Rules',
    description: 'User story covering Quote creation with discount and quantity validation rules',
    acceptanceCriteria: [
      {
        id: 'AC5',
        title: 'Create a Quote Successfully',
        gherkin: 'Given the user is logged into Salesforce\nAnd an Opportunity exists\nWhen the user creates a new Quote for the Opportunity\nAnd enters all mandatory Quote details\nAnd adds one or more Quote Line Items with valid quantity and discount values\nAnd clicks Save\nThen the Quote should be created successfully.'
      },
      {
        id: 'AC6',
        title: 'Prevent Saving Quote When Discount Exceeds 15% Without Justification',
        gherkin: 'Given the user is creating or editing a Quote\nWhen any Quote Line discount is greater than 15%\nAnd the Justification__c field is left blank\nAnd the user clicks Save\nThen the system should prevent the Quote from being saved\nAnd display an error indicating that justification is required for discounts greater than 15%.'
      },
      {
        id: 'AC7',
        title: 'Allow Saving Quote When Discount Exceeds 15% With Justification',
        gherkin: 'Given the user is creating or editing a Quote\nWhen any Quote Line discount is greater than 15%\nAnd the Justification__c field contains a valid value\nAnd the user clicks Save\nThen the Quote should be saved successfully.'
      },
      {
        id: 'AC8',
        title: 'Prevent Saving Quote When Quantity is Zero or Negative',
        gherkin: 'Given the user is creating or editing a Quote\nWhen any Quote Line quantity is less than or equal to 0\nAnd the user clicks Save\nThen the system should prevent the Quote from being saved\nAnd display an error indicating that quantity must be greater than zero.'
      },
      {
        id: 'AC9',
        title: 'Allow Saving Quote with Valid Quantity',
        gherkin: 'Given the user is creating or editing a Quote\nWhen all Quote Line quantities are greater than 0\nAnd all validation rules are satisfied\nAnd the user clicks Save\nThen the Quote should be saved successfully.'
      }
    ],
    testScript: 'src/web/salesforce/tests/salesforce-s2-quote-validation.spec.js'
  },
  {
    id: 'S3',
    title: '[Salesforce] Create a Quote with Approval Process',
    description: 'User story covering single-level Quote approval process for discounts >20%',
    acceptanceCriteria: [
      {
        id: 'AC10',
        title: 'Submit Quote for Approval',
        gherkin: 'Given a Quote has been created successfully\nWhen the total discount exceeds 20%\nAnd the user clicks Submit for Approval\nThen the system should submit the Quote to the assigned manager for approval\nAnd display the Quote status as Pending Approval.'
      },
      {
        id: 'AC11',
        title: 'Manager Approves Quote',
        gherkin: 'Given a Quote is in Pending Approval status\nWhen the assigned manager approves the Quote\nThen the system should update the Quote status to Approved\nAnd record the approval action in the approval history.'
      },
      {
        id: 'AC12',
        title: 'Manager Rejects Quote',
        gherkin: 'Given a Quote is in Pending Approval status\nWhen the assigned manager rejects the Quote\nThen the Quote should remain editable\nAnd the system should update the Quote status to Rejected\nAnd record the rejection reason in the approval history.'
      },
      {
        id: 'AC13',
        title: 'Quote Does Not Require Approval for Discounts Up to 20%',
        gherkin: 'Given the user creates a Quote\nWhen the total discount is 20% or less\nAnd all validation rules are satisfied\nAnd the user saves the Quote\nThen the Quote should not require manager approval\nAnd the Quote should be available for further processing according to the standard business workflow.'
      }
    ],
    testScript: 'src/web/salesforce/tests/salesforce-s3-quote-approval.spec.js'
  },
  {
    id: 'S4',
    title: '[Salesforce] Create a Quote with Two-Level Approval Process',
    description: 'User story covering two-level Quote approval process for discounts >50%',
    acceptanceCriteria: [
      {
        id: 'AC14',
        title: 'Submit Quote for First-Level Approval',
        gherkin: 'Given a Quote has been created successfully\nAnd the total discount is greater than 50%\nWhen the user clicks Submit for Approval\nThen the system should submit the Quote to the assigned first-level manager\nAnd update the Quote status to Pending Level 1 Approval.'
      },
      {
        id: 'AC15',
        title: 'First-Level Manager Approves the Quote',
        gherkin: 'Given a Quote is in Pending Level 1 Approval status\nWhen the first-level manager approves the Quote\nThen the system should automatically route the Quote to the assigned second-level manager for approval\nAnd update the Quote status to Pending Level 2 Approval\nAnd record the Level 1 approval action in the approval history.'
      },
      {
        id: 'AC16',
        title: 'First-Level Manager Rejects the Quote',
        gherkin: 'Given a Quote is in Pending Level 1 Approval status\nWhen the first-level manager rejects the Quote\nThen the system should automatically route the Quote to the assigned second-level manager for review\nAnd update the Quote status to Pending Level 2 Approval\nAnd record the Level 1 rejection action and comments in the approval history.'
      },
      {
        id: 'AC17',
        title: 'Second-Level Manager Approves the Quote',
        gherkin: 'Given a Quote is in Pending Level 2 Approval status\nWhen the second-level manager approves the Quote\nThen the system should update the Quote status to Approved\nAnd record the Level 2 approval action in the approval history.'
      },
      {
        id: 'AC18',
        title: 'Second-Level Manager Rejects the Quote',
        gherkin: 'Given a Quote is in Pending Level 2 Approval status\nWhen the second-level manager rejects the Quote\nThen the system should update the Quote status to Rejected\nAnd make the Quote available for modification and resubmission, if applicable\nAnd record the Level 2 rejection action and comments in the approval history.'
      },
      {
        id: 'AC19',
        title: 'Approval History Tracking',
        gherkin: 'Given a Quote has been submitted for the two-level approval process\nWhen each approver completes their approval or rejection action\nThen the system should maintain a complete approval history, including: Approver Name, Approval Level, Decision (Approved/Rejected), Comments (if provided), Date and Time of the action.'
      },
      {
        id: 'AC20',
        title: 'Quote Does Not Require Two-Level Approval for Discounts of 50% or Less',
        gherkin: 'Given the user creates a Quote\nWhen the total discount is 50% or less\nAnd all validation rules are satisfied\nThen the Quote should not enter the two-level approval process\nAnd it should follow the standard business workflow (or the existing single-level approval process, if configured).'
      }
    ],
    testScript: 'src/web/salesforce/tests/salesforce-s4-two-level-approval.spec.js'
  }
];

/**
 * Generate JIRA description with Acceptance Criteria
 */
function generateJiraDescription(scenario) {
  let desc = `h3. User Story\n\n${scenario.description}\n\n`;
  desc += `h3. Acceptance Criteria\n\n`;
  
  scenario.acceptanceCriteria.forEach((ac) => {
    desc += `*${ac.id}: ${ac.title}*\n\n`;
    desc += `{code}\n${ac.gherkin}\n{code}\n\n`;
  });
  
  desc += `h3. Test Automation\n\n`;
  desc += `* Automated test script: {{${scenario.testScript}}}\n`;
  desc += `* Test cases: ${scenario.acceptanceCriteria.map(ac => ac.id).join(', ')} (${scenario.acceptanceCriteria.length} test cases)\n`;
  desc += `* Framework: Playwright with Page Object Model\n`;
  
  return desc;
}

/**
 * Make JIRA API request
 */
function makeJiraRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${JIRA_URL}/rest/api/3/${endpoint}`);
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`JIRA API Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Create a JIRA Story
 */
async function createJiraStory(scenario) {
  console.log(`\n📝 Creating JIRA story for ${scenario.id}: ${scenario.title}`);
  
  const issueData = {
    fields: {
      project: {
        key: JIRA_PROJECT_KEY
      },
      summary: scenario.title,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'User Story' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: scenario.description }]
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Acceptance Criteria' }]
          },
          ...scenario.acceptanceCriteria.flatMap(ac => [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: `${ac.id}: ${ac.title}`, marks: [{ type: 'strong' }] }
              ]
            },
            {
              type: 'codeBlock',
              content: [{ type: 'text', text: ac.gherkin }]
            }
          ]),
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Test Automation' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Automated test script: ' },
                    { type: 'text', text: scenario.testScript, marks: [{ type: 'code' }] }
                  ]
                }]
              },
              {
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [{
                    type: 'text',
                    text: `Test cases: ${scenario.acceptanceCriteria.map(ac => ac.id).join(', ')} (${scenario.acceptanceCriteria.length} test cases)`
                  }]
                }]
              },
              {
                type: 'listItem',
                content: [{
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Framework: Playwright with Page Object Model' }]
                }]
              }
            ]
          }
        ]
      },
      issuetype: {
        name: 'Task'
      },
      labels: ['Salesforce', 'Automation', 'TestAutomation', 'UserStory']
    }
  };
  
  try {
    const result = await makeJiraRequest('POST', 'issue', issueData);
    console.log(`   ✅ Created: ${result.key} - ${JIRA_URL}/browse/${result.key}`);
    return {
      scenarioId: scenario.id,
      jiraKey: result.key,
      jiraUrl: `${JIRA_URL}/browse/${result.key}`,
      title: scenario.title
    };
  } catch (error) {
    console.error(`   ❌ Error creating story: ${error.message}`);
    
    // If error is about issue type, try to get available issue types
    if (error.message.includes('issuetype')) {
      console.log('   ℹ️  Fetching available issue types...');
      try {
        const meta = await makeJiraRequest('GET', `issue/createmeta?projectKeys=${JIRA_PROJECT_KEY}&expand=projects.issuetypes`);
        const issueTypes = meta.projects[0]?.issuetypes || [];
        console.log('   Available issue types:', issueTypes.map(it => it.name).join(', '));
      } catch (metaError) {
        console.error('   Could not fetch issue types');
      }
    }
    
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Creating JIRA User Stories for Salesforce Test Suite\n');
  console.log('📋 Configuration:');
  console.log(`   JIRA URL: ${JIRA_URL}`);
  console.log(`   JIRA Project: ${JIRA_PROJECT_KEY}`);
  console.log(`   JIRA Email: ${JIRA_EMAIL}`);
  console.log(`   Total Scenarios: ${SCENARIOS.length}\n`);
  
  if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
    console.error('❌ Error: JIRA_EMAIL and JIRA_API_TOKEN must be set in .env file');
    process.exit(1);
  }
  
  const createdStories = [];
  
  for (const scenario of SCENARIOS) {
    try {
      const story = await createJiraStory(scenario);
      createdStories.push(story);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to create story for ${scenario.id}:`, error.message);
    }
  }
  
  console.log('\n\n✅ JIRA Stories Created Successfully!\n');
  console.log('📊 Summary:');
  console.log('═'.repeat(80));
  createdStories.forEach(story => {
    console.log(`${story.scenarioId} → ${story.jiraKey}`);
    console.log(`   ${story.title}`);
    console.log(`   ${story.jiraUrl}`);
    console.log('');
  });
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Update test scripts with JIRA story keys');
  console.log('   2. Create TestRail test cases');
  console.log('   3. Update salesforce-test-mapping.json with JIRA keys');
  console.log('   4. Link TestRail cases to JIRA stories\n');
  
  // Save mapping to file
  const fs = require('fs');
  const mappingPath = 'src/web/salesforce/jira-mapping.json';
  fs.writeFileSync(mappingPath, JSON.stringify(createdStories, null, 2));
  console.log(`📄 Mapping saved to: ${mappingPath}\n`);
  
  return createdStories;
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createJiraStory, SCENARIOS, generateJiraDescription };
