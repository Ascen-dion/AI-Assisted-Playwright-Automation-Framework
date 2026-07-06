/**
 * 🎯 Create JIRA Ticket for Galaxy A57 5G Purchase Journey
 * 
 * This script creates a JIRA ticket with the acceptance criteria
 * and links it to the TestRail test cases.
 * 
 * Usage:
 *   node src/integrations/create-galaxy-a57-jira-ticket.js
 * 
 * Output:
 *   - Creates JIRA ticket with acceptance criteria
 *   - Updates testrail-test-cases.json with JIRA reference
 *   - Re-pushes test cases to TestRail with JIRA link
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { JiraIntegration } = require('./jira-integration');
const fs = require('fs');
const path = require('path');

// ── Story Details ──────────────────────────────────────────────────────────
const STORY_SUMMARY = 'Samsung Galaxy A57 5G Purchase Journey - Automated Test Coverage';

const STORY_DESCRIPTION = `
h2. User Story

As a customer visiting the StarHub website, I want to purchase a Samsung Galaxy A57 5G device so that I can enjoy 5G connectivity and modern smartphone features.

h2. Target URL

https://www.starhub.com/personal.html

h2. Acceptance Criteria

h3. AC1: Navigate to Mobile Devices Listing

*Given* the user launches the StarHub website
*When* the user navigates to "Mobiles"
*And* clicks on "All Phones"
*Then* the system should display a list of available mobile devices

h3. AC2: Select Mobile Device

*Given* the user is on the "All Phones" listing page
*When* the user selects "Samsung Galaxy A57 5G"
*Then* the device details page should be displayed

h3. AC3: Verify Default Device Configuration

*Given* the user is on the Samsung Galaxy A57 5G details page
*Then* the following default selections should be applied:
* Colour should be set to Black (or Awesome Navy per live app)
* Storage should be set to 256 GB
* Payment option should be set to 24-month installment
*And* all selected options should be clearly visible on the page

h3. AC4: Proceed to Next Step

*Given* the user has reviewed or selected device configuration
*When* the user clicks on the "Next" button
*Then* the system should initiate the next step in the purchase journey

h3. AC5: Display Login / Sign-Up Popup

*Given* the user clicks on "Next" without being logged in
*Then* a popup window should be displayed
*And* the popup should contain the message: "Please log in or create an account to continue with your purchase"
*And* the following options should be visible:
* "Log in with Hub ID" button
* "Don't have an account? Sign up here" button

h2. Test Automation

Automated test suite: {{src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js}}

TestRail Case IDs:
* C309 - AC1: Navigate to Mobile Devices Listing
* C310 - AC2: Select Samsung Galaxy A57 5G
* C311 - AC3: Verify Default Device Configuration
* C312 - AC4: Proceed to Next Step
* C313 - AC5: Display Login / Sign-Up Popup
* C314 - E2E: Complete Purchase Journey

h2. Definition of Done

* All 5 acceptance criteria are validated
* Test cases are created in TestRail
* Test automation is implemented and passing
* Test results are synced to JIRA
* Documentation is updated

h2. Notes

⚠️ *Colour Default Discrepancy:* AC3 specifies "Black" as default colour, but the live application (as of April 2026) shows "Awesome Navy" as the default. Tests currently assert against actual application behavior. Product Owner confirmation needed if "Black" should be enforced.
`;

// ── Test Case Titles for JIRA Linking ──────────────────────────────────────
const TEST_CASE_SPECS = [
  'AC1: Navigate to Mobile Devices Listing via Mobile dropdown',
  'AC2: Select Samsung Galaxy A57 5G from device listing',
  'AC3: Verify default device configuration (Colour, Storage, Payment)',
  'AC4: Proceed to next step by clicking Next button',
  'AC5: Verify login/sign-up popup for unauthenticated users',
  'End-to-End: Complete Galaxy A57 5G purchase journey'
];

// ── Main Function ──────────────────────────────────────────────────────────
async function createJiraTicket() {
  console.log('\n' + '═'.repeat(80));
  console.log('🎯 CREATING JIRA TICKET FOR GALAXY A57 5G PURCHASE JOURNEY');
  console.log('═'.repeat(80) + '\n');

  const jira = new JiraIntegration();

  try {
    // Step 1: Create JIRA ticket
    console.log('📝 Step 1: Creating JIRA ticket...\n');
    
    const issueData = {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_KEY || 'STAR'
        },
        summary: STORY_SUMMARY,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: STORY_DESCRIPTION
                }
              ]
            }
          ]
        },
        issuetype: {
          name: 'Story'
        },
        priority: {
          name: 'Medium'
        },
        labels: [
          'automation',
          'mobile-purchase',
          'galaxy-a57',
          'e-commerce',
          'playwright'
        ]
      }
    };

    // Create the ticket
    const response = await jira.client.post('/issue', issueData);
    const issueKey = response.data.key;

    console.log(`✅ JIRA ticket created successfully!`);
    console.log(`   Key: ${issueKey}`);
    console.log(`   URL: ${process.env.JIRA_HOST}/browse/${issueKey}\n`);

    // Step 2: Update testrail-test-cases.json with JIRA reference
    console.log('📝 Step 2: Updating TestRail test cases JSON with JIRA reference...\n');
    
    const testCasesPath = path.resolve(__dirname, 'testrail-test-cases.json');
    const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

    let updated = 0;
    for (const tc of testCases) {
      // Update only the Galaxy A57 purchase journey test cases
      if (TEST_CASE_SPECS.includes(tc.specTitle)) {
        tc.jiraRef = issueKey;
        updated++;
      }
    }

    fs.writeFileSync(testCasesPath, JSON.stringify(testCases, null, 2), 'utf8');
    console.log(`✅ Updated ${updated} test cases with JIRA reference: ${issueKey}\n`);

    // Step 3: Update test spec file with JIRA reference
    console.log('📝 Step 3: Updating test spec file with JIRA reference...\n');
    
    const specFilePath = path.resolve(__dirname, '../tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js');
    let specContent = fs.readFileSync(specFilePath, 'utf8');
    
    // Replace "JIRA Ticket: To be linked" with actual ticket key
    specContent = specContent.replace(
      /JIRA Ticket: To be linked/,
      `JIRA Ticket: ${issueKey}`
    );
    
    fs.writeFileSync(specFilePath, specContent, 'utf8');
    console.log(`✅ Updated test spec file with JIRA reference: ${issueKey}\n`);

    // Step 4: Instructions for re-pushing to TestRail
    console.log('📝 Step 4: TestRail Update Instructions\n');
    console.log('   To update TestRail test cases with the JIRA link, run:\n');
    console.log(`   $env:JIRA_REF="${issueKey}"`);
    console.log('   node src/integrations/push-to-testrail.js\n');

    // Summary
    console.log('═'.repeat(80));
    console.log('✅ JIRA TICKET CREATION COMPLETE');
    console.log('═'.repeat(80) + '\n');
    
    console.log('📋 Summary:');
    console.log(`   ✓ JIRA Ticket: ${issueKey}`);
    console.log(`   ✓ URL: ${process.env.JIRA_HOST}/browse/${issueKey}`);
    console.log(`   ✓ Test Cases Updated: ${updated}`);
    console.log(`   ✓ Spec File Updated: starhub-galaxy-a57-purchase-journey.spec.js`);
    console.log('');
    
    console.log('🔗 Next Steps:');
    console.log('   1. Review the JIRA ticket and make any necessary adjustments');
    console.log('   2. Run the TestRail push command above to link JIRA to TestRail');
    console.log('   3. Execute tests: npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js');
    console.log('   4. Update JIRA with test results: node src/integrations/update-jira-results.js ' + issueKey);
    console.log('');

    console.log('📚 Documentation:');
    console.log('   View full documentation: docs/GALAXY_A57_PURCHASE_TESTS.md\n');

  } catch (error) {
    console.error('\n❌ Failed to create JIRA ticket:', error.response?.data || error.message);
    
    if (error.response?.data?.errors) {
      console.error('\n🔍 Detailed errors:');
      for (const [field, errorMsg] of Object.entries(error.response.data.errors)) {
        console.error(`   ${field}: ${errorMsg}`);
      }
    }
    
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Verify JIRA credentials in .env file');
    console.error('   2. Ensure JIRA_PROJECT_KEY is correct (currently: ' + (process.env.JIRA_PROJECT_KEY || 'STAR') + ')');
    console.error('   3. Check if you have permissions to create stories in the project');
    console.error('   4. Verify the issue type "Story" exists in your JIRA project\n');
    
    process.exit(1);
  }
}

// ── Execute ────────────────────────────────────────────────────────────────
createJiraTicket();
