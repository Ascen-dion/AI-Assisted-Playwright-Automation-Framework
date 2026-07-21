/**
 * TestRail Test Case Creation Script
 * Creates 20 test cases for Salesforce automation (one per acceptance criteria)
 * Links test cases to JIRA stories and updates test scripts
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

// TestRail Configuration from .env
const TESTRAIL_URL = process.env.TESTRAIL_URL;
const TESTRAIL_EMAIL = process.env.TESTRAIL_EMAIL;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const TESTRAIL_PROJECT_ID = process.env.TESTRAIL_PROJECT_ID || '1';
const TESTRAIL_SUITE_ID = process.env.TESTRAIL_SUITE_ID || '1';
const TESTRAIL_SECTION_ID = process.env.TESTRAIL_SECTION_ID || '9';

// Load JIRA mapping to link test cases to stories
const jiraMappingPath = path.join(__dirname, '..', 'jira-mapping.json');
const jiraMapping = JSON.parse(fs.readFileSync(jiraMappingPath, 'utf8'));

// Test case definitions (all 20 acceptance criteria)
const TEST_CASES = [
  // Scenario 1: Lead Conversion (AC1-AC4)
  {
    scenarioId: 'S1',
    jiraKey: 'DZ-1',
    acId: 'AC1',
    title: 'Create a New Lead',
    description: 'Verify that a new Lead can be created successfully with all required fields.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Navigate to Salesforce Lightning', expected: 'User is logged in and on Home page' },
      { step: 'Click on Leads tab from App Launcher', expected: 'Leads list view is displayed' },
      { step: 'Click on New button', expected: 'New Lead form is displayed' },
      { step: 'Fill in required fields (Last Name, Company)', expected: 'Fields are populated correctly' },
      { step: 'Fill in optional fields (First Name, Email, Phone)', expected: 'Fields are populated correctly' },
      { step: 'Click Save button', expected: 'Lead is created successfully with confirmation message' },
      { step: 'Verify Lead record is displayed', expected: 'Lead record page shows all entered data' }
    ]
  },
  {
    scenarioId: 'S1',
    jiraKey: 'DZ-1',
    acId: 'AC2',
    title: 'Validate Mandatory Fields During Lead Creation',
    description: 'Verify that mandatory field validation works during Lead creation.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Navigate to Salesforce Lightning and go to Leads', expected: 'Leads list view is displayed' },
      { step: 'Click on New button', expected: 'New Lead form is displayed' },
      { step: 'Leave Last Name field empty', expected: 'Field remains empty' },
      { step: 'Leave Company field empty', expected: 'Field remains empty' },
      { step: 'Click Save button', expected: 'Validation error message is displayed' },
      { step: 'Verify error message mentions required fields', expected: 'Error clearly states Last Name and Company are required' }
    ]
  },
  {
    scenarioId: 'S1',
    jiraKey: 'DZ-1',
    acId: 'AC3',
    title: 'Convert Lead to Opportunity',
    description: 'Verify that a Lead can be successfully converted to an Opportunity.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a new Lead with all required data', expected: 'Lead is created successfully' },
      { step: 'Open the Lead record', expected: 'Lead record page is displayed' },
      { step: 'Click on Convert button', expected: 'Lead conversion wizard is displayed' },
      { step: 'Select options (Create Opportunity, Create Account)', expected: 'Options are selected' },
      { step: 'Enter Opportunity details', expected: 'Opportunity form is populated' },
      { step: 'Click Convert button', expected: 'Conversion process completes successfully' },
      { step: 'Verify success message', expected: 'Message confirms Lead was converted' }
    ]
  },
  {
    scenarioId: 'S1',
    jiraKey: 'DZ-1',
    acId: 'AC4',
    title: 'Verify Opportunity Creation After Lead Conversion',
    description: 'Verify that an Opportunity is created correctly after Lead conversion.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Complete Lead to Opportunity conversion', expected: 'Lead is converted successfully' },
      { step: 'Click on link to view created Opportunity', expected: 'Opportunity record page is displayed' },
      { step: 'Verify Opportunity name matches Lead name', expected: 'Names match correctly' },
      { step: 'Verify Opportunity is linked to Account', expected: 'Account relationship is established' },
      { step: 'Verify Opportunity stage is set correctly', expected: 'Stage is Prospecting or configured default' },
      { step: 'Verify all data transferred correctly', expected: 'All relevant Lead data appears in Opportunity' }
    ]
  },

  // Scenario 2: Quote Validation (AC5-AC9)
  {
    scenarioId: 'S2',
    jiraKey: 'DZ-2',
    acId: 'AC5',
    title: 'Create a Quote Successfully',
    description: 'Verify that a Quote can be created successfully with valid data.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create an Opportunity', expected: 'Opportunity is created successfully' },
      { step: 'Open the Opportunity record', expected: 'Opportunity record page is displayed' },
      { step: 'Navigate to Quotes related list', expected: 'Quotes section is visible' },
      { step: 'Click New Quote button', expected: 'New Quote form is displayed' },
      { step: 'Fill in Quote details (Name, Expiration Date)', expected: 'Fields are populated' },
      { step: 'Add Quote Line Items with valid discount (≤15%)', expected: 'Line items are added' },
      { step: 'Click Save button', expected: 'Quote is created successfully' },
      { step: 'Verify Quote record is displayed', expected: 'Quote record shows all entered data' }
    ]
  },
  {
    scenarioId: 'S2',
    jiraKey: 'DZ-2',
    acId: 'AC6',
    title: 'Prevent Saving Quote When Discount Exceeds 15% Without Justification',
    description: 'Verify that validation rule prevents saving Quote with >15% discount without justification.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with all required fields', expected: 'Quote form is filled' },
      { step: 'Add Quote Line Item with discount >15% (e.g., 20%)', expected: 'Line item shows 20% discount' },
      { step: 'Leave Discount Justification field empty', expected: 'Field remains empty' },
      { step: 'Click Save button', expected: 'Validation error message is displayed' },
      { step: 'Verify error message mentions justification required', expected: 'Error clearly states justification is needed for discounts >15%' }
    ]
  },
  {
    scenarioId: 'S2',
    jiraKey: 'DZ-2',
    acId: 'AC7',
    title: 'Allow Saving Quote When Discount Exceeds 15% With Justification',
    description: 'Verify that Quote with >15% discount can be saved when justification is provided.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with all required fields', expected: 'Quote form is filled' },
      { step: 'Add Quote Line Item with discount >15% (e.g., 20%)', expected: 'Line item shows 20% discount' },
      { step: 'Enter Discount Justification text', expected: 'Justification field is populated' },
      { step: 'Click Save button', expected: 'Quote is saved successfully' },
      { step: 'Verify Quote record is created', expected: 'Quote record displays with justification' }
    ]
  },
  {
    scenarioId: 'S2',
    jiraKey: 'DZ-2',
    acId: 'AC8',
    title: 'Prevent Saving Quote When Quantity is Zero or Negative',
    description: 'Verify that validation rule prevents saving Quote Line Items with quantity ≤0.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with all required fields', expected: 'Quote form is filled' },
      { step: 'Add Quote Line Item', expected: 'Line item form is displayed' },
      { step: 'Set Quantity to 0 or negative value', expected: 'Quantity field shows invalid value' },
      { step: 'Click Save button', expected: 'Validation error message is displayed' },
      { step: 'Verify error message mentions invalid quantity', expected: 'Error clearly states quantity must be greater than 0' }
    ]
  },
  {
    scenarioId: 'S2',
    jiraKey: 'DZ-2',
    acId: 'AC9',
    title: 'Allow Saving Quote with Valid Quantity',
    description: 'Verify that Quote Line Item can be saved with valid quantity (>0).',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with all required fields', expected: 'Quote form is filled' },
      { step: 'Add Quote Line Item', expected: 'Line item form is displayed' },
      { step: 'Set Quantity to valid positive value (e.g., 5)', expected: 'Quantity field shows 5' },
      { step: 'Click Save button', expected: 'Line item is saved successfully' },
      { step: 'Verify Line Item appears in Quote', expected: 'Line item is displayed with correct quantity' }
    ]
  },

  // Scenario 3: Single-Level Approval (AC10-AC13)
  {
    scenarioId: 'S3',
    jiraKey: 'DZ-3',
    acId: 'AC10',
    title: 'Submit Quote for Approval',
    description: 'Verify that Quote with >20% discount is submitted for manager approval.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with discount >20% (e.g., 25%)', expected: 'Quote is created' },
      { step: 'Add justification for high discount', expected: 'Justification is entered' },
      { step: 'Click Submit for Approval button', expected: 'Approval request is submitted' },
      { step: 'Verify approval request status', expected: 'Quote status shows Pending Approval' },
      { step: 'Verify notification sent to approver', expected: 'Approver receives notification' }
    ]
  },
  {
    scenarioId: 'S3',
    jiraKey: 'DZ-3',
    acId: 'AC11',
    title: 'Manager Approves Quote',
    description: 'Verify that manager can approve a Quote successfully.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Submit Quote for approval (discount >20%)', expected: 'Quote is pending approval' },
      { step: 'Log in as approving manager', expected: 'Manager is logged in' },
      { step: 'Navigate to approval requests', expected: 'Approval list is displayed' },
      { step: 'Open the Quote approval request', expected: 'Quote details are shown' },
      { step: 'Click Approve button', expected: 'Approval action completes' },
      { step: 'Add approval comments', expected: 'Comments are saved' },
      { step: 'Verify Quote status changes to Approved', expected: 'Status is updated to Approved' }
    ]
  },
  {
    scenarioId: 'S3',
    jiraKey: 'DZ-3',
    acId: 'AC12',
    title: 'Manager Rejects Quote',
    description: 'Verify that manager can reject a Quote successfully.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Submit Quote for approval (discount >20%)', expected: 'Quote is pending approval' },
      { step: 'Log in as approving manager', expected: 'Manager is logged in' },
      { step: 'Navigate to approval requests', expected: 'Approval list is displayed' },
      { step: 'Open the Quote approval request', expected: 'Quote details are shown' },
      { step: 'Click Reject button', expected: 'Rejection action completes' },
      { step: 'Add rejection reason', expected: 'Reason is saved' },
      { step: 'Verify Quote status changes to Rejected', expected: 'Status is updated to Rejected' }
    ]
  },
  {
    scenarioId: 'S3',
    jiraKey: 'DZ-3',
    acId: 'AC13',
    title: 'Quote Does Not Require Approval for Discounts Up to 20%',
    description: 'Verify that Quote with discount ≤20% does not require approval.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with discount ≤20% (e.g., 15%)', expected: 'Quote is created' },
      { step: 'Add justification if needed', expected: 'Justification is entered' },
      { step: 'Click Save button', expected: 'Quote is saved successfully' },
      { step: 'Verify no approval button is shown', expected: 'Submit for Approval button is not visible' },
      { step: 'Verify Quote status is Active', expected: 'Quote can be used immediately without approval' }
    ]
  },

  // Scenario 4: Two-Level Approval (AC14-AC20)
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC14',
    title: 'Submit Quote for First-Level Approval',
    description: 'Verify that Quote with >50% discount is submitted for two-level approval.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with discount >50% (e.g., 55%)', expected: 'Quote is created' },
      { step: 'Add justification for very high discount', expected: 'Justification is entered' },
      { step: 'Click Submit for Approval button', expected: 'Approval request is submitted' },
      { step: 'Verify two-level approval process starts', expected: 'Quote status shows Pending L1 Approval' },
      { step: 'Verify Level 1 approver receives notification', expected: 'First approver gets notification' }
    ]
  },
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC15',
    title: 'First-Level Manager Approves the Quote',
    description: 'Verify that L1 approval routes Quote to Level 2 approver.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Submit Quote for two-level approval (discount >50%)', expected: 'Quote is pending L1 approval' },
      { step: 'Log in as Level 1 approving manager', expected: 'L1 manager is logged in' },
      { step: 'Open the Quote approval request', expected: 'Quote details are shown' },
      { step: 'Click Approve button', expected: 'L1 approval completes' },
      { step: 'Add L1 approval comments', expected: 'Comments are saved' },
      { step: 'Verify Quote routes to Level 2', expected: 'Status changes to Pending L2 Approval' },
      { step: 'Verify Level 2 approver receives notification', expected: 'Second approver gets notification' }
    ]
  },
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC16',
    title: 'First-Level Manager Rejects the Quote',
    description: 'Verify that L1 rejection still routes to Level 2 for final decision.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Submit Quote for two-level approval (discount >50%)', expected: 'Quote is pending L1 approval' },
      { step: 'Log in as Level 1 approving manager', expected: 'L1 manager is logged in' },
      { step: 'Open the Quote approval request', expected: 'Quote details are shown' },
      { step: 'Click Reject button', expected: 'L1 rejection is recorded' },
      { step: 'Add L1 rejection reason', expected: 'Reason is saved' },
      { step: 'Verify Quote still routes to Level 2', expected: 'Status changes to Pending L2 Approval' },
      { step: 'Verify Level 2 approver can override', expected: 'L2 can still approve or reject' }
    ]
  },
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC17',
    title: 'Second-Level Manager Approves the Quote',
    description: 'Verify that L2 approval finalizes the approval process.',
    priority: 'Critical',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Complete Level 1 approval process', expected: 'Quote is pending L2 approval' },
      { step: 'Log in as Level 2 approving manager', expected: 'L2 manager is logged in' },
      { step: 'Open the Quote approval request', expected: 'Quote details with L1 decision shown' },
      { step: 'Review L1 comments', expected: 'L1 decision and comments are visible' },
      { step: 'Click Approve button', expected: 'L2 approval completes' },
      { step: 'Add L2 approval comments', expected: 'Comments are saved' },
      { step: 'Verify Quote status changes to Approved', expected: 'Final status is Approved' }
    ]
  },
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC18',
    title: 'Second-Level Manager Rejects the Quote',
    description: 'Verify that L2 rejection finalizes the rejection process.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Complete Level 1 approval process', expected: 'Quote is pending L2 approval' },
      { step: 'Log in as Level 2 approving manager', expected: 'L2 manager is logged in' },
      { step: 'Open the Quote approval request', expected: 'Quote details with L1 decision shown' },
      { step: 'Review L1 comments', expected: 'L1 decision and comments are visible' },
      { step: 'Click Reject button', expected: 'L2 rejection completes' },
      { step: 'Add L2 rejection reason', expected: 'Reason is saved' },
      { step: 'Verify Quote status changes to Rejected', expected: 'Final status is Rejected' }
    ]
  },
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC19',
    title: 'Approval History Tracking',
    description: 'Verify that complete approval history is maintained for two-level approvals.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Complete entire two-level approval process', expected: 'Quote is approved or rejected' },
      { step: 'Open Quote record', expected: 'Quote record page is displayed' },
      { step: 'Navigate to Approval History related list', expected: 'Approval history section is shown' },
      { step: 'Verify L1 approver name and decision are logged', expected: 'L1 approval entry exists' },
      { step: 'Verify L1 timestamp is recorded', expected: 'L1 approval date/time is shown' },
      { step: 'Verify L2 approver name and decision are logged', expected: 'L2 approval entry exists' },
      { step: 'Verify L2 timestamp is recorded', expected: 'L2 approval date/time is shown' },
      { step: 'Verify all comments are preserved', expected: 'Both L1 and L2 comments are visible' }
    ]
  },
  {
    scenarioId: 'S4',
    jiraKey: 'DZ-4',
    acId: 'AC20',
    title: 'Quote Does Not Require Two-Level Approval for Discounts of 50% or Less',
    description: 'Verify that Quote with discount ≤50% uses single-level approval only.',
    priority: 'High',
    type: 'Functional',
    template: 'Test Case (Steps)',
    customSteps: [
      { step: 'Create a Quote with discount ≤50% but >20% (e.g., 30%)', expected: 'Quote is created' },
      { step: 'Add justification', expected: 'Justification is entered' },
      { step: 'Click Submit for Approval button', expected: 'Approval request is submitted' },
      { step: 'Verify single-level approval process starts', expected: 'Quote status shows Pending Approval (not L1)' },
      { step: 'Verify only one approver is notified', expected: 'Only manager receives notification, not senior manager' }
    ]
  }
];

// Priority mapping for TestRail API
const PRIORITY_MAP = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

// Type mapping for TestRail API
const TYPE_MAP = {
  'Functional': 1,
  'Regression': 2,
  'Automated': 3,
  'Other': 4
};

/**
 * Make HTTPS request to TestRail API
 */
function makeTestRailRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${TESTRAIL_EMAIL}:${TESTRAIL_API_KEY}`).toString('base64');
    const url = new URL(`/index.php?/api/v2/${endpoint}`, TESTRAIL_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0'
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (error) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`TestRail API Error: ${res.statusCode} - ${responseData}`));
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
 * Format test steps for TestRail
 */
function formatSteps(steps) {
  return steps.map((s, i) => ({
    content: `${i + 1}. ${s.step}`,
    expected: s.expected
  }));
}

/**
 * Create a single test case in TestRail
 */
async function createTestCase(testCase, caseNumber) {
  const caseId = `C${String(caseNumber).padStart(3, '0')}`;
  
  console.log(`\n📝 Creating TestRail case ${caseId}: ${testCase.title}`);
  
  const caseData = {
    title: `[${caseId}][${testCase.acId}] ${testCase.title}`,
    section_id: parseInt(TESTRAIL_SECTION_ID),
    template_id: 2, // Test Case (Steps) template
    type_id: TYPE_MAP[testCase.type] || 1,
    priority_id: PRIORITY_MAP[testCase.priority] || 3,
    custom_steps_separated: formatSteps(testCase.customSteps),
    refs: testCase.jiraKey, // Link to JIRA
    custom_preconds: `Related JIRA: ${testCase.jiraKey} - ${testCase.scenarioId}`,
    custom_automation_type: 0, // None (will be automated via Playwright)
  };

  try {
    const result = await makeTestRailRequest(
      'POST',
      `add_case/${TESTRAIL_SECTION_ID}`,
      caseData
    );
    
    console.log(`   ✅ Created: ${caseId} (TestRail ID: ${result.id})`);
    
    return {
      caseId: caseId,
      testRailId: result.id,
      scenarioId: testCase.scenarioId,
      acId: testCase.acId,
      jiraKey: testCase.jiraKey,
      title: testCase.title,
      testRailUrl: `${TESTRAIL_URL}/index.php?/cases/view/${result.id}`
    };
  } catch (error) {
    console.error(`   ❌ Error creating case: ${error.message}`);
    throw error;
  }
}

/**
 * Update test script files with TestRail case IDs
 */
async function updateTestScripts(testRailMapping) {
  console.log('\n\n🔄 Updating Test Scripts with TestRail Case IDs...\n');
  
  const scriptUpdates = [
    {
      file: 'salesforce-s1-lead-conversion.spec.js',
      cases: testRailMapping.filter(c => c.scenarioId === 'S1')
    },
    {
      file: 'salesforce-s2-quote-validation.spec.js',
      cases: testRailMapping.filter(c => c.scenarioId === 'S2')
    },
    {
      file: 'salesforce-s3-quote-approval.spec.js',
      cases: testRailMapping.filter(c => c.scenarioId === 'S3')
    },
    {
      file: 'salesforce-s4-two-level-approval.spec.js',
      cases: testRailMapping.filter(c => c.scenarioId === 'S4')
    }
  ];

  for (const update of scriptUpdates) {
    const scriptPath = path.join(__dirname, '..', 'tests', update.file);
    let content = fs.readFileSync(scriptPath, 'utf8');
    
    for (const testCase of update.cases) {
      // Replace placeholder [CXXX] with actual case ID
      const placeholderRegex = new RegExp(`\\[C\\d{3}\\]\\[${testCase.acId}\\]`, 'g');
      const replacement = `[${testCase.caseId}][${testCase.acId}]`;
      content = content.replace(placeholderRegex, replacement);
    }
    
    fs.writeFileSync(scriptPath, content, 'utf8');
    console.log(`   ✅ Updated: ${update.file}`);
  }
}

/**
 * Update salesforce-test-mapping.json with TestRail IDs
 */
async function updateMappingFile(testRailMapping) {
  console.log('\n🔄 Updating salesforce-test-mapping.json...');
  
  const mappingPath = path.join(__dirname, '..', 'salesforce-test-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  
  // Update each scenario's acceptance criteria with TestRail IDs
  for (const scenario of mapping.scenarios) {
    for (const ac of scenario.acceptanceCriteria) {
      const testRailCase = testRailMapping.find(
        tc => tc.scenarioId === scenario.scenarioId && tc.acId === ac.acId
      );
      
      if (testRailCase) {
        ac.testRailCaseId = testRailCase.caseId;
        ac.testRailId = testRailCase.testRailId;
        ac.testRailUrl = testRailCase.testRailUrl;
      }
    }
  }
  
  // Update summary
  mapping.summary.testRailCasesCreated = testRailMapping.length;
  mapping.summary.testRailCasesPending = 0;
  
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('   ✅ Mapping file updated successfully');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Creating TestRail Test Cases for Salesforce Automation\n');
  console.log('📋 Configuration:');
  console.log(`   TestRail URL: ${TESTRAIL_URL}`);
  console.log(`   TestRail Project: ${TESTRAIL_PROJECT_ID}`);
  console.log(`   TestRail Suite: ${TESTRAIL_SUITE_ID}`);
  console.log(`   TestRail Section: ${TESTRAIL_SECTION_ID}`);
  console.log(`   Total Test Cases: ${TEST_CASES.length}\n`);

  const testRailMapping = [];
  const errors = [];

  // Create all test cases
  for (let i = 0; i < TEST_CASES.length; i++) {
    const caseNumber = i + 1;
    try {
      const result = await createTestCase(TEST_CASES[i], caseNumber);
      testRailMapping.push(result);
      
      // Rate limiting: wait 500ms between requests
      if (i < TEST_CASES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      errors.push({
        caseNumber,
        testCase: TEST_CASES[i],
        error: error.message
      });
      console.error(`Failed to create case ${caseNumber}: ${error.message}`);
    }
  }

  // Save TestRail mapping
  const mappingOutputPath = path.join(__dirname, '..', 'testrail-mapping.json');
  fs.writeFileSync(
    mappingOutputPath,
    JSON.stringify(testRailMapping, null, 2),
    'utf8'
  );

  // Update test scripts with TestRail case IDs
  if (testRailMapping.length > 0) {
    await updateTestScripts(testRailMapping);
    await updateMappingFile(testRailMapping);
  }

  // Print summary
  console.log('\n\n✅ TestRail Test Cases Creation Complete!\n');
  console.log('📊 Summary:');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
  
  // Group by scenario
  const scenarios = ['S1', 'S2', 'S3', 'S4'];
  for (const scenarioId of scenarios) {
    const scenarioCases = testRailMapping.filter(c => c.scenarioId === scenarioId);
    if (scenarioCases.length > 0) {
      console.log(`${scenarioId} (${scenarioCases[0].jiraKey}):`);
      scenarioCases.forEach(tc => {
        console.log(`   ${tc.caseId} - ${tc.title}`);
        console.log(`          ${tc.testRailUrl}`);
      });
      console.log('');
    }
  }
  
  console.log(`\n📈 Statistics:`);
  console.log(`   Total Cases Created: ${testRailMapping.length}/${TEST_CASES.length}`);
  console.log(`   Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.forEach(err => {
      console.log(`   Case ${err.caseNumber}: ${err.error}`);
    });
  }
  
  console.log('\n📝 Next Steps:');
  console.log('   1. ✅ Test scripts updated with TestRail case IDs');
  console.log('   2. ✅ Mapping file updated with TestRail links');
  console.log('   3. 🔗 Link TestRail cases to JIRA stories (refs field set)');
  console.log('   4. 🧪 Execute test suite');
  console.log('   5. 📤 Sync test results to TestRail\n');
  
  console.log(`📄 TestRail mapping saved to: ${mappingOutputPath}`);
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
