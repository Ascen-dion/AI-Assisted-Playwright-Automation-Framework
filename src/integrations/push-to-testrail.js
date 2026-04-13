/**
 * Push acceptance-criteria-derived test cases to TestRail.
 *
 * Usage:
 *   node src/integrations/push-to-testrail.js
 *
 * Required env vars (.env):
 *   TESTRAIL_HOST=https://yourcompany.testrail.io
 *   TESTRAIL_USER=you@company.com
 *   TESTRAIL_API_KEY=your-api-key
 *   TESTRAIL_PROJECT_ID=<numeric project id>
 *   TESTRAIL_SUITE_ID=<numeric suite id>
 *
 * Optional:
 *   TESTRAIL_SECTION_NAME=StarHub Mobile Purchase  (default shown)
 *   JIRA_REF=AU-1                                  (Jira story key for traceability)
 *
 * Output:
 *   Writes src/integrations/testrail-case-map.json  — maps spec test titles → TestRail case IDs
 *   This file is consumed by testrail-reporter.js to post results after each test run.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs   = require('fs');
const path = require('path');
const { TestRailIntegration } = require('./testrail-integration');

// ── Configuration ──────────────────────────────────────────────────────────
const PROJECT_ID   = parseInt(process.env.TESTRAIL_PROJECT_ID, 10);
const SUITE_ID     = parseInt(process.env.TESTRAIL_SUITE_ID, 10);
// Use TESTRAIL_SECTION_ID from .env if set; push-to-testrail does not need to
// create/look up sections — just use an existing one.
const SECTION_ID   = process.env.TESTRAIL_SECTION_ID
  ? parseInt(process.env.TESTRAIL_SECTION_ID, 10)
  : null;
const JIRA_REF     = process.env.JIRA_REF || '';

if (!PROJECT_ID || !SUITE_ID) {
  console.error('❌ TESTRAIL_PROJECT_ID and TESTRAIL_SUITE_ID must be set in .env');
  process.exit(1);
}

// ── Test case definitions derived from Jira ACs ────────────────────────────
// Each entry maps 1:1 to a test case in the spec file.
// The `specTitle` value MUST match the exact string passed to test() in the spec.
const TEST_CASES = [
  {
    specTitle: 'Test Case 1: Navigate to All Phones listing via Mobile dropdown',
    title:     'AC1: Navigate to Mobile Devices Listing via Mobile dropdown',
    preconditions:
      'User has launched https://www.starhub.com/personal.html in a browser.\n' +
      'No prior session / not logged in.',
    steps:
      '1. Click the "Mobile" navigation tab to open the dropdown megamenu.\n' +
      '2. In the "Mobile Phones" column click "All Phones".',
    expected:
      'Browser navigates to consumer.starhub.com/personal/store/mobile/devices.\n' +
      '"Mobile Devices" heading is visible.\n' +
      'Device listing shows at least one item (count text matches /\\d+ items/).',
    refs: JIRA_REF
  },
  {
    specTitle: 'Test Case 2: Select Samsung Galaxy A57 5G from the device listing',
    title:     'AC2: Select Samsung Galaxy A57 5G device from All Phones listing',
    preconditions:
      'User is on the All Phones listing page: consumer.starhub.com/personal/store/mobile/devices.',
    steps:
      '1. Locate the "Galaxy A57 5G" device card.\n' +
      '2. Click the card.',
    expected:
      'Browser navigates to a URL containing "galaxy-a57-5g".\n' +
      '"Samsung Galaxy A57 5G" breadcrumb title is visible on the product detail page.',
    refs: JIRA_REF
  },
  {
    specTitle: 'Test Case 3: Verify Samsung Galaxy A57 5G default configuration',
    title:     'AC3: Verify default colour, storage, and payment options on Galaxy A57 5G PDP',
    preconditions:
      'User is on the Galaxy A57 5G product detail page.\n' +
      'No prior selection has been made.',
    steps:
      '1. Observe the Colour label above the colour swatches.\n' +
      '2. Observe the Storage label and storage option chips.\n' +
      '3. Observe the Payment option selector.',
    expected:
      'Colour label reads "Colour: Awesome Navy" (live default as of April 2026).\n' +
      'Storage label reads "Storage: 256GB" and the 256GB chip is visible.\n' +
      'The "24-month" payment option chip is marked active.',
    refs: JIRA_REF
  },
  {
    specTitle: 'Test Case 4: Click Next to initiate the purchase journey next step',
    title:     'AC4: Clicking Next on the PDP initiates the next purchase step',
    preconditions:
      'User is on the Galaxy A57 5G PDP.\n' +
      'Default configuration is applied (colour, storage, 24-month payment).\n' +
      'User is NOT logged in.',
    steps:
      '1. Click the "Next" button in the purchase summary section.',
    expected:
      'System initiates the next step — confirmed by the auth gate popup becoming visible.\n' +
      'User remains on the same URL (no full-page redirect).',
    refs: JIRA_REF
  },
  {
    specTitle: 'Test Case 5: Verify login and sign-up popup after clicking Next',
    title:     'AC5: Login/Sign-up popup is displayed for unauthenticated users clicking Next',
    preconditions:
      'User is on the Galaxy A57 5G PDP and is NOT logged in.',
    steps:
      '1. Click the "Next" button.\n' +
      '2. Observe the popup that appears.',
    expected:
      'An overlay modal becomes visible.\n' +
      'Modal message reads: "Please log in or create an account to continue with your purchase".\n' +
      '"Log in with Hub ID" button is visible.\n' +
      '"Don\'t have an account? Sign up here" button is visible.',
    refs: JIRA_REF
  }
];

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const testrail = new TestRailIntegration();

  console.log('\n🚀 Pushing 5 test cases to TestRail...');
  console.log(`   Project: ${PROJECT_ID}  |  Suite: ${SUITE_ID}  |  Section: ${SECTION_ID || '(none — cases go to suite root)'}\n`);

  const caseMap = {}; // specTitle → TestRail case ID

  for (const tc of TEST_CASES) {
    const existing = await testrail.findTestCaseByTitle(PROJECT_ID, SUITE_ID, tc.title, SECTION_ID);

    let result;
    if (existing) {
      console.log(`   ⟳  Updating existing case ${existing.id}: ${tc.title}`);
      result = await testrail.updateTestCase(existing.id, tc);
    } else {
      result = await testrail.pushTestCase(PROJECT_ID, SUITE_ID, tc, SECTION_ID);
    }

    caseMap[tc.specTitle] = result.id;
  }

  // Save the case map so the reporter can reference it
  const mapPath = path.resolve(__dirname, 'testrail-case-map.json');
  fs.writeFileSync(
    mapPath,
    JSON.stringify({ sectionId: SECTION_ID, cases: caseMap }, null, 2),
    'utf8'
  );

  console.log(`\n✅ Done. Case map written to: ${mapPath}`);
  console.log('\n📋 TestRail case IDs (update [C0] in the spec with these):');
  for (const [specTitle, caseId] of Object.entries(caseMap)) {
    console.log(`   C${caseId}  →  ${specTitle}`);
  }
  console.log('');
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
