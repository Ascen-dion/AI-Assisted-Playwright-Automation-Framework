/**
 * Salesforce Automation - JIRA & TestRail Integration Script
 * 
 * This script creates JIRA user stories, TestRail test cases, and maps them together.
 * 
 * Prerequisites:
 * - .env file configured with JIRA and TestRail credentials
 * - @zereight/mcp-jira and @zereight/mcp-testrail packages available
 * 
 * Usage:
 *   node src/web/salesforce/scripts/create-salesforce-test-suite.js
 */

require('dotenv').config();

const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'DZ';
const TESTRAIL_PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID || '1');
const TESTRAIL_SUITE_ID = parseInt(process.env.TESTRAIL_SUITE_ID || '1');
const TESTRAIL_SECTION_ID = parseInt(process.env.TESTRAIL_SECTION_ID || '9');

/**
 * Salesforce Test Suite Configuration
 */
const SALESFORCE_TEST_SUITE = {
  scenarios: [
    {
      id: 'S1',
      name: 'Create a Lead and Convert to Opportunity',
      description: 'User story covering the complete lead creation and conversion process',
      acceptanceCriteria: [
        {
          id: 'AC1',
          title: 'Create a New Lead',
          description: 'Given the user is logged into Salesforce\nWhen the user navigates to the Leads tab\nAnd clicks on New\nAnd enters all mandatory lead details\nAnd clicks Save\nThen the system should successfully create the Lead\nAnd display the Lead detail page.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Log into Salesforce',
            'Navigate to Leads tab',
            'Click New button',
            'Fill all mandatory fields (First Name, Last Name, Company)',
            'Click Save',
          ],
          expectedResult: 'Lead is created successfully and detail page is displayed'
        },
        {
          id: 'AC2',
          title: 'Validate Mandatory Fields During Lead Creation',
          description: 'Given the user is creating a new Lead\nWhen the user leaves one or more mandatory fields blank\nAnd clicks Save\nThen the system should prevent the Lead from being created\nAnd display validation messages for the missing mandatory fields.',
          testType: 'Validation',
          priority: 'High',
          steps: [
            'Log into Salesforce',
            'Navigate to Leads tab',
            'Click New button',
            'Leave one or more mandatory fields blank',
            'Click Save',
          ],
          expectedResult: 'Validation error is displayed and Lead is not created'
        },
        {
          id: 'AC3',
          title: 'Convert Lead to Opportunity',
          description: 'Given an active Lead exists in Salesforce\nWhen the user clicks Convert\nAnd selects the appropriate Account and Contact options\nAnd completes the conversion process\nThen the system should successfully convert the Lead\nAnd create an Opportunity associated with the Account and Contact\nAnd mark the Lead as Converted.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Open an existing Lead',
            'Click Convert button',
            'Select Account and Contact options',
            'Complete conversion wizard',
            'Click Convert',
          ],
          expectedResult: 'Lead is converted, Opportunity is created, and Lead is marked as Converted'
        },
        {
          id: 'AC4',
          title: 'Verify Opportunity Creation After Lead Conversion',
          description: 'Given a Lead has been successfully converted\nWhen the user opens the generated Opportunity\nThen the Opportunity should contain the expected information copied from the Lead\nAnd be associated with the correct Account and Contact.',
          testType: 'Verification',
          priority: 'High',
          steps: [
            'Convert a Lead successfully',
            'Navigate to the created Opportunity',
            'Verify Opportunity fields match Lead data',
            'Verify Account and Contact associations',
          ],
          expectedResult: 'Opportunity contains correct data from Lead and proper associations'
        }
      ]
    },
    {
      id: 'S2',
      name: 'Create a Quote with Validation Rules',
      description: 'User story covering Quote creation with discount and quantity validation rules',
      acceptanceCriteria: [
        {
          id: 'AC5',
          title: 'Create a Quote Successfully',
          description: 'Given the user is logged into Salesforce\nAnd an Opportunity exists\nWhen the user creates a new Quote for the Opportunity\nAnd enters all mandatory Quote details\nAnd adds one or more Quote Line Items with valid quantity and discount values\nAnd clicks Save\nThen the Quote should be created successfully.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Log into Salesforce',
            'Open an existing Opportunity',
            'Click New Quote',
            'Fill mandatory Quote fields',
            'Add Quote Line Items with valid quantity and discount (≤15%)',
            'Click Save',
          ],
          expectedResult: 'Quote is created successfully'
        },
        {
          id: 'AC6',
          title: 'Prevent Saving Quote When Discount Exceeds 15% Without Justification',
          description: 'Given the user is creating or editing a Quote\nWhen any Quote Line discount is greater than 15%\nAnd the Justification__c field is left blank\nAnd the user clicks Save\nThen the system should prevent the Quote from being saved\nAnd display an error indicating that justification is required for discounts greater than 15%.',
          testType: 'Validation',
          priority: 'Critical',
          steps: [
            'Create or edit a Quote',
            'Add/edit Quote Line Item with discount >15%',
            'Leave Justification field blank',
            'Click Save',
          ],
          expectedResult: 'Validation error is displayed: "Justification is required for discounts greater than 15%"'
        },
        {
          id: 'AC7',
          title: 'Allow Saving Quote When Discount Exceeds 15% With Justification',
          description: 'Given the user is creating or editing a Quote\nWhen any Quote Line discount is greater than 15%\nAnd the Justification__c field contains a valid value\nAnd the user clicks Save\nThen the Quote should be saved successfully.',
          testType: 'Functional',
          priority: 'High',
          steps: [
            'Create or edit a Quote',
            'Add/edit Quote Line Item with discount >15%',
            'Fill Justification field with valid text',
            'Click Save',
          ],
          expectedResult: 'Quote is saved successfully'
        },
        {
          id: 'AC8',
          title: 'Prevent Saving Quote When Quantity is Zero or Negative',
          description: 'Given the user is creating or editing a Quote\nWhen any Quote Line quantity is less than or equal to 0\nAnd the user clicks Save\nThen the system should prevent the Quote from being saved\nAnd display an error indicating that quantity must be greater than zero.',
          testType: 'Validation',
          priority: 'Critical',
          steps: [
            'Create or edit a Quote',
            'Add/edit Quote Line Item with quantity ≤0',
            'Click Save',
          ],
          expectedResult: 'Validation error is displayed: "Quantity must be greater than zero"'
        },
        {
          id: 'AC9',
          title: 'Allow Saving Quote with Valid Quantity',
          description: 'Given the user is creating or editing a Quote\nWhen all Quote Line quantities are greater than 0\nAnd all validation rules are satisfied\nAnd the user clicks Save\nThen the Quote should be saved successfully.',
          testType: 'Functional',
          priority: 'High',
          steps: [
            'Create or edit a Quote',
            'Add Quote Line Items with quantity >0',
            'Ensure all validation rules are satisfied',
            'Click Save',
          ],
          expectedResult: 'Quote is saved successfully'
        }
      ]
    },
    {
      id: 'S3',
      name: 'Create a Quote with Approval Process',
      description: 'User story covering single-level Quote approval process for discounts >20%',
      acceptanceCriteria: [
        {
          id: 'AC10',
          title: 'Submit Quote for Approval',
          description: 'Given a Quote has been created successfully\nWhen the total discount exceeds 20%\nAnd the user clicks Submit for Approval\nThen the system should submit the Quote to the assigned manager for approval\nAnd display the Quote status as Pending Approval.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Create a Quote with total discount >20%',
            'Click Submit for Approval',
            'Verify Quote is submitted to manager',
          ],
          expectedResult: 'Quote status is updated to "Pending Approval"'
        },
        {
          id: 'AC11',
          title: 'Manager Approves Quote',
          description: 'Given a Quote is in Pending Approval status\nWhen the assigned manager approves the Quote\nThen the system should update the Quote status to Approved\nAnd record the approval action in the approval history.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Log in as manager/approver',
            'Navigate to Quote awaiting approval',
            'Click Approve button',
            'Confirm approval',
          ],
          expectedResult: 'Quote status is updated to "Approved" and approval history is recorded'
        },
        {
          id: 'AC12',
          title: 'Manager Rejects Quote',
          description: 'Given a Quote is in Pending Approval status\nWhen the assigned manager rejects the Quote\nThen the Quote should remain editable\nAnd the system should update the Quote status to Rejected\nAnd record the rejection reason in the approval history.',
          testType: 'Functional',
          priority: 'High',
          steps: [
            'Log in as manager/approver',
            'Navigate to Quote awaiting approval',
            'Click Reject button',
            'Enter rejection comments',
            'Confirm rejection',
          ],
          expectedResult: 'Quote status is updated to "Rejected", remains editable, and rejection is recorded'
        },
        {
          id: 'AC13',
          title: 'Quote Does Not Require Approval for Discounts Up to 20%',
          description: 'Given the user creates a Quote\nWhen the total discount is 20% or less\nAnd all validation rules are satisfied\nAnd the user saves the Quote\nThen the Quote should not require manager approval\nAnd the Quote should be available for further processing according to the standard business workflow.',
          testType: 'Verification',
          priority: 'High',
          steps: [
            'Create a Quote with total discount ≤20%',
            'Save the Quote',
            'Verify Quote does not enter approval process',
          ],
          expectedResult: 'Quote is saved without requiring approval'
        }
      ]
    },
    {
      id: 'S4',
      name: 'Create a Quote with Two-Level Approval Process',
      description: 'User story covering two-level Quote approval process for discounts >50%',
      acceptanceCriteria: [
        {
          id: 'AC14',
          title: 'Submit Quote for First-Level Approval',
          description: 'Given a Quote has been created successfully\nAnd the total discount is greater than 50%\nWhen the user clicks Submit for Approval\nThen the system should submit the Quote to the assigned first-level manager\nAnd update the Quote status to Pending Level 1 Approval.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Create a Quote with total discount >50%',
            'Click Submit for Approval',
            'Verify Quote is submitted to Level 1 manager',
          ],
          expectedResult: 'Quote status is updated to "Pending Level 1 Approval"'
        },
        {
          id: 'AC15',
          title: 'First-Level Manager Approves the Quote',
          description: 'Given a Quote is in Pending Level 1 Approval status\nWhen the first-level manager approves the Quote\nThen the system should automatically route the Quote to the assigned second-level manager for approval\nAnd update the Quote status to Pending Level 2 Approval\nAnd record the Level 1 approval action in the approval history.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Log in as Level 1 manager',
            'Navigate to Quote in Pending Level 1 Approval',
            'Click Approve button',
            'Verify Quote routes to Level 2 manager',
          ],
          expectedResult: 'Quote status is "Pending Level 2 Approval" and Level 1 approval is recorded'
        },
        {
          id: 'AC16',
          title: 'First-Level Manager Rejects the Quote',
          description: 'Given a Quote is in Pending Level 1 Approval status\nWhen the first-level manager rejects the Quote\nThen the system should automatically route the Quote to the assigned second-level manager for review\nAnd update the Quote status to Pending Level 2 Approval\nAnd record the Level 1 rejection action and comments in the approval history.',
          testType: 'Functional',
          priority: 'High',
          steps: [
            'Log in as Level 1 manager',
            'Navigate to Quote in Pending Level 1 Approval',
            'Click Reject button',
            'Enter rejection comments',
            'Verify Quote routes to Level 2 manager',
          ],
          expectedResult: 'Quote status is "Pending Level 2 Approval" and Level 1 rejection is recorded'
        },
        {
          id: 'AC17',
          title: 'Second-Level Manager Approves the Quote',
          description: 'Given a Quote is in Pending Level 2 Approval status\nWhen the second-level manager approves the Quote\nThen the system should update the Quote status to Approved\nAnd record the Level 2 approval action in the approval history.',
          testType: 'Functional',
          priority: 'Critical',
          steps: [
            'Log in as Level 2 manager',
            'Navigate to Quote in Pending Level 2 Approval',
            'Click Approve button',
            'Confirm approval',
          ],
          expectedResult: 'Quote status is updated to "Approved" and Level 2 approval is recorded'
        },
        {
          id: 'AC18',
          title: 'Second-Level Manager Rejects the Quote',
          description: 'Given a Quote is in Pending Level 2 Approval status\nWhen the second-level manager rejects the Quote\nThen the system should update the Quote status to Rejected\nAnd make the Quote available for modification and resubmission, if applicable\nAnd record the Level 2 rejection action and comments in the approval history.',
          testType: 'Functional',
          priority: 'High',
          steps: [
            'Log in as Level 2 manager',
            'Navigate to Quote in Pending Level 2 Approval',
            'Click Reject button',
            'Enter rejection comments',
            'Confirm rejection',
          ],
          expectedResult: 'Quote status is "Rejected", remains editable, and Level 2 rejection is recorded'
        },
        {
          id: 'AC19',
          title: 'Approval History Tracking',
          description: 'Given a Quote has been submitted for the two-level approval process\nWhen each approver completes their approval or rejection action\nThen the system should maintain a complete approval history, including: Approver Name, Approval Level, Decision (Approved/Rejected), Comments (if provided), Date and Time of the action.',
          testType: 'Verification',
          priority: 'High',
          steps: [
            'Submit a Quote through two-level approval process',
            'Complete Level 1 approval/rejection',
            'Complete Level 2 approval/rejection',
            'View Approval History',
            'Verify all details are recorded',
          ],
          expectedResult: 'Complete approval history with all details is maintained'
        },
        {
          id: 'AC20',
          title: 'Quote Does Not Require Two-Level Approval for Discounts of 50% or Less',
          description: 'Given the user creates a Quote\nWhen the total discount is 50% or less\nAnd all validation rules are satisfied\nThen the Quote should not enter the two-level approval process\nAnd it should follow the standard business workflow (or the existing single-level approval process, if configured).',
          testType: 'Verification',
          priority: 'High',
          steps: [
            'Create a Quote with total discount ≤50%',
            'Save the Quote',
            'Verify Quote does not enter two-level approval process',
          ],
          expectedResult: 'Quote follows standard workflow without two-level approval'
        }
      ]
    }
  ]
};

/**
 * Generate JIRA user story description with acceptance criteria
 */
function generateJiraDescription(scenario) {
  let description = `h3. User Story\n\n${scenario.description}\n\n`;
  description += `h3. Acceptance Criteria\n\n`;
  
  scenario.acceptanceCriteria.forEach((ac, index) => {
    description += `*${ac.id}: ${ac.title}*\n\n`;
    description += `{code}\n${ac.description}\n{code}\n\n`;
  });
  
  return description;
}

/**
 * Main execution function
 */
async function createSalesforceTestSuite() {
  console.log('🚀 Salesforce Test Suite Creation Script\n');
  console.log('📋 Configuration:');
  console.log(`   JIRA Project: ${JIRA_PROJECT_KEY}`);
  console.log(`   TestRail Project: ${TESTRAIL_PROJECT_ID}`);
  console.log(`   TestRail Suite: ${TESTRAIL_SUITE_ID}`);
  console.log(`   TestRail Section: ${TESTRAIL_SECTION_ID}\n`);
  
  const mapping = {
    scenarios: []
  };
  
  for (const scenario of SALESFORCE_TEST_SUITE.scenarios) {
    console.log(`\n📝 Processing ${scenario.id}: ${scenario.name}`);
    
    const scenarioMapping = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      jiraStoryKey: `${JIRA_PROJECT_KEY}-XXXX`, // Placeholder - will be created via JIRA MCP
      acceptanceCriteria: []
    };
    
    for (const ac of scenario.acceptanceCriteria) {
      console.log(`   ✅ ${ac.id}: ${ac.title}`);
      
      scenarioMapping.acceptanceCriteria.push({
        acId: ac.id,
        title: ac.title,
        testRailCaseId: 'CXXXX', // Placeholder - will be created via TestRail MCP
        testScriptPath: `src/web/salesforce/tests/salesforce-${scenario.id.toLowerCase()}.spec.js`
      });
    }
    
    mapping.scenarios.push(scenarioMapping);
  }
  
  console.log('\n✅ Mapping structure created successfully!\n');
  console.log('📄 Next Steps:');
  console.log('   1. Run this script with JIRA MCP integration to create user stories');
  console.log('   2. Run with TestRail MCP integration to create test cases');
  console.log('   3. Generate test scripts with embedded JIRA and TestRail IDs');
  console.log('   4. Update salesforce-test-mapping.json with actual IDs\n');
  
  return mapping;
}

// Export for use in other scripts
module.exports = {
  SALESFORCE_TEST_SUITE,
  generateJiraDescription,
  createSalesforceTestSuite
};

// Run if executed directly
if (require.main === module) {
  createSalesforceTestSuite()
    .then(mapping => {
      console.log('\n📊 Test Suite Mapping:');
      console.log(JSON.stringify(mapping, null, 2));
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
