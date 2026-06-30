/**
 * Verify and Sync Medtronic Test Cases with TestRail
 * 
 * This script:
 * 1. Reads all Medtronic test specs from src/web/tests/nav
 * 2. Extracts TestRail case IDs from test titles (e.g., [C47])
 * 3. Verifies these cases exist in TestRail
 * 4. Creates or updates cases as needed
 * 5. Links them to JIRA stories
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const fs = require('fs');
const path = require('path');
const { TestRailIntegration } = require('../integrations/testrail-integration');

const PROJECT_ID = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
const SECTION_ID = parseInt(process.env.TESTRAIL_SECTION_ID, 10);

// Load the JIRA-TestRail mapping
const mappingPath = path.resolve(__dirname, 'medtronic-jira-testrail-map.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Flatten all test cases with their JIRA references
const allTestCases = [];
mapping.forEach(story => {
  story.testCases.forEach(tc => {
    allTestCases.push({
      caseId: tc.caseId,
      title: tc.specTitle,
      jiraKey: story.jiraKey,
      summary: story.summary,
      labels: story.labels,
    });
  });
});

async function main() {
  console.log('\n🔍 Verifying TestRail Cases for Medtronic Tests...\n');
  console.log(`   Project ID: ${PROJECT_ID}`);
  console.log(`   Suite ID: ${SUITE_ID}`);
  console.log(`   Section ID: ${SECTION_ID}`);
  console.log(`   Total Test Cases: ${allTestCases.length}\n`);

  const testrail = new TestRailIntegration();

  // Get all existing cases in the section
  console.log('📥 Fetching existing TestRail cases...');
  const existingCases = await testrail.getTestCases(PROJECT_ID, SUITE_ID, SECTION_ID);
  console.log(`   Found ${existingCases.length} existing cases in TestRail\n`);

  // Create a map of existing case IDs
  const existingCaseMap = new Map();
  existingCases.forEach(c => {
    existingCaseMap.set(c.id, c);
  });

  let verified = 0;
  let created = 0;
  let updated = 0;
  let errors = 0;

  // Process each test case
  for (const tc of allTestCases) {
    const caseIdNum = parseInt(tc.caseId.replace('C', ''), 10);
    
    try {
      if (existingCaseMap.has(caseIdNum)) {
        // Case exists - verify and update if needed
        const existing = existingCaseMap.get(caseIdNum);
        console.log(`   ✓  [${tc.caseId}] exists in TestRail: "${existing.title}"`);
        
        // Check if title matches
        if (existing.title !== tc.title) {
          console.log(`      ⚠️  Title mismatch! Updating...`);
          console.log(`         Current: "${existing.title}"`);
          console.log(`         New:     "${tc.title}"`);
          
          await testrail.updateTestCase(caseIdNum, {
            title: tc.title,
            refs: tc.jiraKey,
            priority: 2,
            estimate: '5m',
          });
          updated++;
        } else {
          // Update refs to link to JIRA if not already linked
          if (!existing.refs || !existing.refs.includes(tc.jiraKey)) {
            await testrail.updateTestCase(caseIdNum, {
              title: tc.title,
              refs: tc.jiraKey,
              priority: existing.priority_id || 2,
              estimate: existing.estimate || '5m',
            });
            console.log(`      🔗 Updated JIRA reference to ${tc.jiraKey}`);
          }
          verified++;
        }
      } else {
        // Case doesn't exist - this is a problem since IDs are already assigned
        console.log(`   ⚠️  [${tc.caseId}] NOT FOUND in TestRail!`);
        console.log(`      Title: "${tc.title}"`);
        console.log(`      This case should exist with ID ${caseIdNum}`);
        console.log(`      You may need to manually create this case in TestRail first.`);
        errors++;
      }
    } catch (err) {
      console.error(`   ❌ Error processing [${tc.caseId}]: ${err.message}`);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('═'.repeat(70));
  console.log(`   ✅ Verified (matching):     ${verified}`);
  console.log(`   🔄 Updated (title/refs):    ${updated}`);
  console.log(`   ❌ Missing in TestRail:     ${errors}`);
  console.log(`   📝 Total Cases Processed:   ${allTestCases.length}`);
  console.log('');

  if (errors > 0) {
    console.log('⚠️  Some test cases are missing in TestRail!');
    console.log('   The test specs reference case IDs that don\'t exist yet.');
    console.log('   You may need to:');
    console.log('   1. Manually create these cases in TestRail first, OR');
    console.log('   2. Remove the [C##] IDs from the test titles and let TestRail auto-assign new IDs');
    console.log('');
  } else if (verified + updated === allTestCases.length) {
    console.log('✅ All test cases are in sync with TestRail!');
    console.log('');
  }
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
