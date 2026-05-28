/**
 * Experian JIRA & TestRail Sync Script
 *
 * 1. Checks existing issues in EX project
 * 2. Creates user stories for existing + new test cases
 * 3. Links TestRail case IDs to JIRA stories via comments
 *
 * Usage: node src/shared/traceability/sync-experian-jira-testrail.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'EX';

const jira = axios.create({
  baseURL: `${JIRA_HOST}/rest/api/3`,
  auth: { username: JIRA_EMAIL, password: JIRA_API_TOKEN },
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// ── Story definitions ─────────────────────────────────────────────────────
const STORIES = [
  {
    summary: 'EXP: Verify Experian Homepage sections and content',
    description: `As a user visiting the Experian homepage,
I want to see all key sections (Hero, Credit Score tabs, BFF, How can we help, Footer),
So that I can navigate to relevant credit and financial services.

*Acceptance Criteria:*
* AC1: Homepage loads with correct URL and title, hero heading "Reach your credit and money goals" is visible
* AC2: Credit Score tab "Get a credit report & FICO Score" is visible in the hero section
* AC3: BFF section heading "Say hi to your Big Financial Friend" is visible
* AC4: "How can we help?" section heading is visible
* AC5: Footer section headers (Support, Education & advice, Credit resources, Experian for businesses) are visible

*Target URL:* https://www.experian.com/`,
    testCases: [
      { specTitle: 'Test Case 1: Verify homepage loads and displays the hero heading', caseId: 'C86' },
      { specTitle: 'Test Case 2: Verify Credit Score tab is visible on hero section', caseId: 'C87' },
      { specTitle: 'Test Case 3: Verify BFF section is visible on homepage', caseId: 'C88' },
      { specTitle: 'Test Case 4: Verify "How can we help?" section is visible', caseId: 'C89' },
      { specTitle: 'Test Case 5: Verify footer sections are visible', caseId: 'C90' },
    ],
    labels: ['experian', 'homepage', 'smoke'],
  },
  {
    summary: 'EXP: Homepage navigation to Credit Support pages',
    description: `As a user on the Experian homepage,
I want to navigate to credit support pages via the "How can we help?" cards,
So that I can access Security Freeze, Disputes, and Fraud Alert services.

*Acceptance Criteria:*
* AC1: Clicking "Security freeze" card navigates to /help/credit-freeze/
* AC2: Clicking "Disputes" card navigates to /help/dispute-credit/
* AC3: Clicking "Fraud alert" card navigates to /help/fraud-alert/

*Target URL:* https://www.experian.com/`,
    testCases: [
      { specTitle: 'Test Case 6: Navigate to Security Freeze page', caseId: 'C91' },
      { specTitle: 'Test Case 7: Navigate to Disputes page', caseId: 'C92' },
      { specTitle: 'Test Case 8: Navigate to Fraud Alert page', caseId: 'C93' },
    ],
    labels: ['experian', 'homepage', 'navigation', 'regression'],
  },
  {
    summary: 'EXP: Verify header navigation menu items are visible',
    description: `As a user on the Experian homepage,
I want to see all main navigation menu items in the header,
So that I can access Credit, Protection, Money, Credit Cards, Loans, and Insurance sections.

*Acceptance Criteria:*
* AC1: "Credit" menu button is visible in header navigation
* AC2: "Protection" menu button is visible in header navigation
* AC3: "Money" menu button is visible in header navigation
* AC4: "Credit Cards" menu button is visible in header navigation
* AC5: "Loans" menu button is visible in header navigation
* AC6: "Insurance" menu button is visible in header navigation

*Target URL:* https://www.experian.com/`,
    testCases: [
      { specTitle: 'Test Case 9: Verify Credit menu item is displayed in header', caseId: 'C94' },
      { specTitle: 'Test Case 10: Verify Protection menu item is displayed in header', caseId: 'C95' },
      { specTitle: 'Test Case 11: Verify Money menu item is displayed in header', caseId: 'C96' },
      { specTitle: 'Test Case 12: Verify Credit Cards menu item is displayed in header', caseId: 'C97' },
      { specTitle: 'Test Case 13: Verify Loans menu item is displayed in header', caseId: 'C98' },
      { specTitle: 'Test Case 14: Verify Insurance menu item is displayed in header', caseId: 'C99' },
    ],
    labels: ['experian', 'navigation', 'smoke'],
  },
];

async function searchExistingIssues() {
  try {
    const jql = `project = ${PROJECT_KEY} ORDER BY created DESC`;
    const res = await jira.get('/search', { params: { jql, maxResults: 50, fields: 'summary,status,labels' } });
    return res.data.issues || [];
  } catch (err) {
    console.log('⚠️  Could not fetch existing issues:', err.response?.data?.errorMessages?.[0] || err.message);
    return [];
  }
}

async function createStory(story) {
  const payload = {
    fields: {
      project: { key: PROJECT_KEY },
      summary: story.summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: story.description }],
          },
        ],
      },
      issuetype: { name: 'Story' },
      labels: story.labels || [],
    },
  };

  try {
    const res = await jira.post('/issue', payload);
    return res.data;
  } catch (err) {
    // If Story type doesn't exist, try Task
    if (err.response?.data?.errors?.issuetype) {
      payload.fields.issuetype = { name: 'Task' };
      try {
        const res = await jira.post('/issue', payload);
        return res.data;
      } catch (err2) {
        console.error(`❌ Failed to create issue: ${err2.response?.data?.errorMessages?.[0] || err2.message}`);
        throw err2;
      }
    }
    console.error(`❌ Failed to create issue: ${err.response?.data?.errorMessages?.[0] || err.message}`);
    throw err;
  }
}

async function addComment(issueKey, commentText) {
  try {
    await jira.post(`/issue/${issueKey}/comment`, {
      body: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: commentText }],
          },
        ],
      },
    });
  } catch (err) {
    console.log(`   ⚠️  Could not add comment to ${issueKey}:`, err.response?.data?.errorMessages?.[0] || err.message);
  }
}

async function main() {
  console.log(`\n🔍 Checking existing issues in JIRA project ${PROJECT_KEY}...`);
  const existing = await searchExistingIssues();
  const existingSummaries = existing.map(i => i.fields.summary);
  console.log(`   Found ${existing.length} existing issue(s)`);
  if (existing.length > 0) {
    existing.forEach(i => console.log(`   • ${i.key}: ${i.fields.summary} [${i.fields.status.name}]`));
  }

  console.log(`\n🚀 Creating JIRA stories for Experian test coverage...\n`);

  const createdIssues = [];
  let skipped = 0;

  for (const story of STORIES) {
    // Check if story already exists
    if (existingSummaries.some(s => s === story.summary)) {
      console.log(`   ⏭️  Already exists: ${story.summary}`);
      skipped++;
      continue;
    }

    try {
      const result = await createStory(story);
      console.log(`   ✅ Created ${result.key}: ${story.summary}`);
      createdIssues.push({ key: result.key, ...story });

      // Add traceability comment linking to TestRail cases
      if (story.testCases && story.testCases.length > 0) {
        const caseList = story.testCases.map(tc => `• [${tc.caseId}] ${tc.specTitle}`).join('\n');
        const comment = `🔗 TestRail Traceability\n\nAutomated test cases linked to this story:\n${caseList}\n\nTestRail: Project 2, Suite 6, Section 46\nSpec files: src/web/tests/nav/experian-*.spec.js`;
        await addComment(result.key, comment);
        console.log(`   📎 Added TestRail traceability comment to ${result.key}`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${story.summary} — ${err.message}`);
    }
  }

  // ── Save JIRA-TestRail map ──────────────────────────────────────────────
  const mapData = STORIES.map(story => ({
    jiraKey: createdIssues.find(i => i.summary === story.summary)?.key || '(existing)',
    summary: story.summary,
    testCases: story.testCases,
    labels: story.labels,
    isNew: createdIssues.some(i => i.summary === story.summary),
  }));

  const mapPath = path.resolve(__dirname, 'experian-jira-testrail-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2), 'utf8');
  console.log(`\n📁 JIRA-TestRail map saved to: ${mapPath}`);

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(70));
  console.log('📊 SYNC SUMMARY');
  console.log('═'.repeat(70));
  console.log(`   JIRA Stories Created:  ${createdIssues.length}`);
  console.log(`   JIRA Stories Skipped:  ${skipped}`);
  console.log(`   TestRail Cases Linked: ${STORIES.reduce((sum, s) => sum + s.testCases.length, 0)}`);
  console.log('');

  if (createdIssues.length > 0) {
    console.log('📋 Created Issues:');
    createdIssues.forEach(i => {
      const caseIds = i.testCases.length > 0
        ? i.testCases.map(tc => tc.caseId).join(', ')
        : '(no tests yet)';
      console.log(`   ${i.key}: ${i.summary}`);
      console.log(`          TestRail: ${caseIds}`);
    });
  }

  console.log('\n🎉 Experian JIRA sync complete!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
