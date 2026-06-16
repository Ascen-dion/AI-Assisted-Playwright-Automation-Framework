/**
 * Jira story management for Ksirs Admission Application Form.
 * Searches for existing story, creates one if not found, posts traceability comment.
 *
 * Usage: node src/shared/traceability/sync-ksirs-jira.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const axios = require('axios');

const HOST      = process.env.JIRA_HOST;
const EMAIL     = process.env.JIRA_EMAIL;
const TOKEN     = process.env.JIRA_API_TOKEN;
const PROJ_KEY  = process.env.JIRA_PROJECT_KEY || 'KSIR';

const client = axios.create({
  baseURL: `${HOST}/rest/api/3`,
  auth:    { username: EMAIL, password: TOKEN },
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

const STORY_SUMMARY = '[UI] Admission Application Form Submission - Ksirs';
const TESTRAIL_CASES = 'C1284, C1285, C1286, C1287, C1288';
const SPEC_FILE      = 'src/web/tests/application/ksirs-admission-form.spec.js';
const SECTION_ID     = 77;

const DESCRIPTION_ADF = {
  version: 1,
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'User Story' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'As a prospective parent/applicant, I want to complete the admission application form with the required details and proceed to the next step, so that I can review and confirm my admission application.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Target URL' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'https://corp49.myclassboard.com/ApplicationForm_Custom/3268E71E-BD48-4243-BEBA-0B28912E91C2/1/0', marks: [{ type: 'code' }] }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Acceptance Criteria' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'AC1: All required form fields and the Next button should be displayed on page load.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'AC2: Validation messages are shown when mandatory fields are left blank and form submission is prevented.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'AC3: Valid data entry in all mandatory fields is accepted without validation errors.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'AC4: Clicking Next after completing all mandatory fields saves the application data.' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'AC5: System navigates to the Admission Confirmation Page after successful Next click.' }] }] },
    ]},
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'TestRail Cases' }] },
    { type: 'paragraph', content: [{ type: 'text', text: `Section ID: ${SECTION_ID} — Cases: ${TESTRAIL_CASES}` }] },
  ],
};

const COMMENT_ADF = {
  version: 1,
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: '✅ Automated test cases created by Brownfield Automation Agent.' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: `TestRail Section: "Ksirs - Admission Application Form" (ID: ${SECTION_ID})` }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: `TestRail Cases: ${TESTRAIL_CASES}` }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: `Spec file: ${SPEC_FILE}` }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Page object: src/web/pages/ksirs-admission-form.page.js' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Locators: src/web/locators/ksirs-admission-form.locators.js' }] }] },
    ]},
  ],
};

async function searchIssues(jql) {
  const res = await client.post('/search', { jql, maxResults: 5, fields: ['summary', 'status', 'issuetype'] });
  return res.data.issues || [];
}

async function createIssue() {
  const res = await client.post('/issue', {
    fields: {
      project: { key: PROJ_KEY },
      summary: STORY_SUMMARY,
      description: DESCRIPTION_ADF,
      issuetype: { name: 'Story' },
    },
  });
  return res.data;
}

async function addComment(issueKey) {
  const res = await client.post(`/issue/${issueKey}/comment`, { body: COMMENT_ADF });
  return res.data;
}

async function main() {
  console.log('\n🔍 Searching Jira for existing Ksirs story...');

  let issues = [];
  try {
    issues = await searchIssues(`project = "${PROJ_KEY}" AND summary ~ "Admission Application Form" ORDER BY created DESC`);
  } catch (err) {
    // Project might not exist yet — fall through to create
    console.log(`   ⚠️  JQL search failed (project may not exist): ${err.response?.data?.errorMessages?.join(', ') || err.message}`);
  }

  let issueKey;

  if (issues.length > 0) {
    issueKey = issues[0].key;
    console.log(`   ✅ Found existing story: ${issueKey} — "${issues[0].fields.summary}"`);
  } else {
    console.log(`   ℹ️  No existing story found. Creating new story in project "${PROJ_KEY}"...`);
    try {
      const created = await createIssue();
      issueKey = created.key;
      console.log(`   ✅ Story created: ${issueKey}`);
    } catch (err) {
      console.error(`   ❌ Failed to create story: ${err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err.message}`);
      console.log(`\n📋 Manual action required — create Jira story with:`);
      console.log(`   Project: ${PROJ_KEY}  |  Summary: ${STORY_SUMMARY}`);
      console.log(`   TestRail Cases: ${TESTRAIL_CASES}`);
      return;
    }
  }

  // Add traceability comment
  console.log(`\n💬 Adding traceability comment to ${issueKey}...`);
  try {
    const comment = await addComment(issueKey);
    console.log(`   ✅ Comment added (ID: ${comment.id})`);
  } catch (err) {
    console.error(`   ⚠️  Comment failed: ${err.response?.data?.errorMessages?.join(', ') || err.message}`);
  }

  console.log(`\n✅ Jira sync complete. Story: ${issueKey}`);
  console.log(`   URL: ${HOST}/browse/${issueKey}`);
}

main().catch(err => {
  console.error('❌ Fatal:', err.response?.data || err.message);
  process.exit(1);
});
