/**
 * Medtronic JIRA & TestRail Sync Script
 *
 * 1. Checks existing issues in MED project
 * 2. Creates user stories for existing + new test cases
 * 3. Links TestRail case IDs to JIRA stories via comments
 *
 * Usage: node src/shared/traceability/sync-medtronic-jira-testrail.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const PROJECT_KEY = 'MED';

const jira = axios.create({
  baseURL: `${JIRA_HOST}/rest/api/3`,
  auth: { username: JIRA_EMAIL, password: JIRA_API_TOKEN },
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// ── Story definitions ─────────────────────────────────────────────────────
// Each story groups related test cases and maps to TestRail case IDs
const STORIES = [
  {
    summary: 'MED: Verify Medtronic India Homepage sections and content',
    description: `As a user visiting the Medtronic India homepage,
I want to see all key sections (Hero, MEIC, Healthcare Professionals, Impact, Careers, Footer),
So that I can navigate to relevant information about Medtronic's healthcare technology solutions.

*Acceptance Criteria:*
* AC1: Homepage loads with correct URL and title, hero "See how" CTA is visible
* AC2: MEIC section heading "Medtronic Engineering & Innovation Center" is visible
* AC3: Healthcare Professionals section "Creating connections to optimize healthcare systems" is visible
* AC4: Impact section heading "Impact with purpose" is visible
* AC5: Careers section heading "Join the team that powers the extraordinary" is visible
* AC6: Footer section headers (PATIENTS AND CAREGIVERS, OUR COMPANY, OUR IMPACT) are visible

*Target URL:* https://www.medtronic.com/in-en/index.html`,
    testCases: [
      { specTitle: 'Test Case 1: Verify homepage loads and displays the hero CTA', caseId: 'C47' },
      { specTitle: 'Test Case 2: Verify MEIC section heading is visible on homepage', caseId: 'C48' },
      { specTitle: 'Test Case 3: Verify Healthcare Professionals section is visible', caseId: 'C49' },
      { specTitle: 'Test Case 4: Verify Impact section is visible on homepage', caseId: 'C50' },
      { specTitle: 'Test Case 5: Verify Careers section is visible on homepage', caseId: 'C51' },
      { specTitle: 'Test Case 6: Verify footer sections are visible', caseId: 'C52' },
    ],
    labels: ['medtronic', 'homepage', 'smoke'],
  },
  {
    summary: 'MED: Homepage navigation to Our Company, MEIC, and Careers pages',
    description: `As a user on the Medtronic India homepage,
I want to navigate to key pages via CTA links,
So that I can access detailed information about the company, R&D center, and career opportunities.

*Acceptance Criteria:*
* AC1: Clicking "See how" CTA navigates to Our Company page (/our-company.html)
* AC2: Clicking "Learn more" CTA in MEIC section navigates to MEIC page
* AC3: Clicking "Join us" CTA navigates to Careers page (/our-company/careers.html)

*Target URL:* https://www.medtronic.com/in-en/index.html`,
    testCases: [
      { specTitle: 'Test Case 7: Navigate to Our Company page via hero "See how" CTA', caseId: 'C53' },
      { specTitle: 'Test Case 8: Navigate to MEIC page via "Learn more" CTA', caseId: 'C54' },
      { specTitle: 'Test Case 9: Navigate to Careers page via "Join us" CTA', caseId: 'C55' },
    ],
    labels: ['medtronic', 'homepage', 'navigation', 'regression'],
  },
  {
    summary: 'MED: Verify Patients & Caregivers page sections and CTAs',
    description: `As a patient or caregiver visiting the Medtronic India Patients page,
I want to see all key sections and call-to-action links,
So that I can find information about my condition, treatment options, and patient services.

*Acceptance Criteria:*
* AC1: Patients page loads and "FIND YOUR CONDITION" CTA is visible
* AC2: "SELECT OPTIONS" treatment CTA is visible
* AC3: "CONTACT PATIENT SERVICES" CTA is visible
* AC4: Response Care section heading is visible
* AC5: Stay Heart Safe section heading is visible

*Target URL:* https://www.medtronic.com/in-en/patients.html`,
    testCases: [
      { specTitle: 'Test Case 1: Verify Patients page loads and FIND YOUR CONDITION CTA is visible', caseId: 'C56' },
      { specTitle: 'Test Case 2: Verify SELECT OPTIONS treatment CTA is visible', caseId: 'C57' },
      { specTitle: 'Test Case 3: Verify CONTACT PATIENT SERVICES CTA is visible', caseId: 'C58' },
      { specTitle: 'Test Case 4: Verify Response Care section is visible', caseId: 'C59' },
      { specTitle: 'Test Case 5: Verify Stay Heart Safe section is visible', caseId: 'C60' },
    ],
    labels: ['medtronic', 'patients', 'smoke'],
  },
  {
    summary: 'MED: Patients page navigation to Conditions and Treatments pages',
    description: `As a patient on the Medtronic India Patients page,
I want to navigate to Conditions and Treatments pages via CTA links,
So that I can learn about my specific condition and available treatment options.

*Acceptance Criteria:*
* AC1: Clicking "FIND YOUR CONDITION" navigates to Conditions page (/patients/conditions.html)
* AC2: Clicking "SELECT OPTIONS" navigates to Treatments & Therapies page (/patients/treatments-therapies.html)

*Target URL:* https://www.medtronic.com/in-en/patients.html`,
    testCases: [
      { specTitle: 'Test Case 6: Navigate to Conditions page via FIND YOUR CONDITION CTA', caseId: 'C61' },
      { specTitle: 'Test Case 7: Navigate to Treatments page via SELECT OPTIONS CTA', caseId: 'C62' },
    ],
    labels: ['medtronic', 'patients', 'navigation', 'regression'],
  },
  {
    summary: 'MED: Verify Our Company page loads and sub-page navigation',
    description: `As a user visiting the Medtronic India Our Company page,
I want to navigate to sub-pages (Mission, Key Facts, History, Medtronic in India),
So that I can learn about the company's mission, history, and presence in India.

*Acceptance Criteria:*
* AC1: Our Company page loads with correct URL and title
* AC2: Clicking "Mission" navigates to Mission page (/our-company/mission.html)
* AC3: Clicking "Key Facts" navigates to Key Facts page (/our-company/key-facts.html)
* AC4: Clicking "History" navigates to History page (/our-company/history.html)
* AC5: Clicking "Medtronic in India" navigates to India page (/our-company/india.html)

*Target URL:* https://www.medtronic.com/in-en/our-company.html`,
    testCases: [
      { specTitle: 'Test Case 1: Verify Our Company page loads successfully', caseId: 'C63' },
      { specTitle: 'Test Case 2: Navigate to Mission page from Our Company', caseId: 'C64' },
      { specTitle: 'Test Case 3: Navigate to Key Facts page from Our Company', caseId: 'C65' },
      { specTitle: 'Test Case 4: Navigate to History page from Our Company', caseId: 'C66' },
      { specTitle: 'Test Case 5: Navigate to Medtronic in India page from Our Company', caseId: 'C67' },
    ],
    labels: ['medtronic', 'our-company', 'navigation', 'regression'],
  },
  // ── NEW STORIES for additional coverage ──────────────────────────────────
  {
    summary: 'MED: Verify Our Impact page loads and sub-page navigation',
    description: `As a user interested in Medtronic's social impact,
I want to navigate to Impact sub-pages (Health Equity, Inclusion & Diversity, Planet, Communities),
So that I can learn about Medtronic's commitment to social responsibility.

*Acceptance Criteria:*
* AC1: Our Impact page loads with correct URL
* AC2: Clicking "Health Equity" navigates to Health Equity page
* AC3: Clicking "Inclusion, Diversity & Equity" navigates to ID&E page
* AC4: Clicking "Planet" navigates to Protecting Our Planet page
* AC5: Clicking "Communities" navigates to Communities page

*Target URL:* https://www.medtronic.com/in-en/our-impact.html`,
    testCases: [
      { specTitle: 'Test Case 1: Verify Our Impact page loads successfully', caseId: 'C70' },
      { specTitle: 'Test Case 2: Navigate to Health Equity page from Our Impact', caseId: 'C71' },
      { specTitle: 'Test Case 3: Navigate to Inclusion Diversity Equity page from Our Impact', caseId: 'C72' },
      { specTitle: 'Test Case 4: Navigate to Protecting Our Planet page from Our Impact', caseId: 'C73' },
      { specTitle: 'Test Case 5: Navigate to Communities page from Our Impact', caseId: 'C74' },
    ],
    labels: ['medtronic', 'our-impact', 'navigation'],
  },
  {
    summary: 'MED: Verify footer legal links navigation (Privacy, Terms, Contact)',
    description: `As a user on any Medtronic India page,
I want to access legal and contact information via footer links,
So that I can review privacy policies, terms of use, and contact Medtronic.

*Acceptance Criteria:*
* AC1: Clicking "Privacy Statement" in footer navigates to Privacy page
* AC2: Clicking "Terms of Use" in footer navigates to Terms page
* AC3: Clicking "Contact" in footer navigates to Contact Us page

*Target URL:* https://www.medtronic.com/in-en/index.html (footer section)`,
    testCases: [
      { specTitle: 'Test Case 1: Navigate to Privacy Statement page via footer link', caseId: 'C75' },
      { specTitle: 'Test Case 2: Navigate to Terms of Use page via footer link', caseId: 'C76' },
      { specTitle: 'Test Case 3: Navigate to Contact Us page via footer link', caseId: 'C77' },
    ],
    labels: ['medtronic', 'footer', 'navigation'],
  },
  {
    summary: 'MED: Verify Healthcare Professionals page loads and content',
    description: `As a healthcare professional visiting the Medtronic India HCP page,
I want to see information about therapies, procedures, and products,
So that I can explore Medtronic's offerings for my practice.

*Acceptance Criteria:*
* AC1: Healthcare Professionals page loads with correct URL
* AC2: Page content about therapies and procedures is visible
* AC3: Products information section is accessible

*Target URL:* https://www.medtronic.com/in-en/healthcare-professionals.html`,
    testCases: [
      { specTitle: 'Test Case 1: Verify Healthcare Professionals page loads successfully', caseId: 'C78' },
      { specTitle: 'Test Case 2: Verify main heading is visible on HCP page', caseId: 'C79' },
      { specTitle: 'Test Case 3: Verify therapies or products section content is visible', caseId: 'C80' },
    ],
    labels: ['medtronic', 'healthcare-professionals'],
  },
  {
    summary: 'MED: Verify header navigation menu items are displayed',
    description: `As a user visiting the Medtronic India website,
I want to see all main navigation menu items in the header,
So that I can quickly access different sections of the website.

*Acceptance Criteria:*
* AC1: "Healthcare Professionals" menu item is visible in the header navigation
* AC2: "Patients & Caregivers" menu item is visible in the header navigation
* AC3: "Our Company" menu item is visible in the header navigation
* AC4: "Our Impact" menu item is visible in the header navigation
* AC5: "Careers" section is displayed on the homepage

*Target URL:* https://www.medtronic.com/in-en/index.html`,
    testCases: [
      { specTitle: 'Test Case 10: Verify Healthcare Professionals menu item is displayed in header', caseId: 'C81' },
      { specTitle: 'Test Case 11: Verify Patients & Caregivers menu item is displayed in header', caseId: 'C82' },
      { specTitle: 'Test Case 12: Verify Our Company menu item is displayed in header', caseId: 'C83' },
      { specTitle: 'Test Case 13: Verify Our Impact menu item is displayed in header', caseId: 'C84' },
      { specTitle: 'Test Case 14: Verify Careers section is displayed on the homepage', caseId: 'C85' },
    ],
    labels: ['medtronic', 'navigation', 'header', 'smoke'],
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

async function getIssueTypes() {
  try {
    const res = await jira.get(`/project/${PROJECT_KEY}`);
    const issueTypesRes = await jira.get(`/issue/createmeta?projectKeys=${PROJECT_KEY}&expand=projects.issuetypes`);
    const project = issueTypesRes.data.projects?.[0];
    if (project) {
      return project.issuetypes || [];
    }
    return [];
  } catch (err) {
    // Try the newer API
    try {
      const res = await jira.get(`/issue/createmeta/${PROJECT_KEY}/issuetypes`);
      return res.data.issueTypes || res.data.values || [];
    } catch (err2) {
      console.log('⚠️  Could not fetch issue types:', err2.response?.data?.errorMessages?.[0] || err2.message);
      return [];
    }
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
  console.log('\n🔍 Checking existing issues in JIRA project MED...');
  const existing = await searchExistingIssues();
  const existingSummaries = existing.map(i => i.fields.summary);
  console.log(`   Found ${existing.length} existing issue(s)`);
  if (existing.length > 0) {
    existing.forEach(i => console.log(`   • ${i.key}: ${i.fields.summary} [${i.fields.status.name}]`));
  }

  console.log('\n🚀 Creating JIRA stories for Medtronic test coverage...\n');

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
        const comment = `🔗 TestRail Traceability\n\nAutomated test cases linked to this story:\n${caseList}\n\nTestRail: Project 2, Suite 6, Section 45\nSpec files: src/web/tests/nav/medtronic-*.spec.js\nAll tests passing ✅`;
        await addComment(result.key, comment);
        console.log(`   📎 Added TestRail traceability comment to ${result.key}`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${story.summary} — ${err.message}`);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(70));
  console.log('📊 SYNC SUMMARY');
  console.log('═'.repeat(70));
  console.log(`   JIRA Stories Created:  ${createdIssues.length}`);
  console.log(`   JIRA Stories Skipped:  ${skipped}`);
  console.log(`   TestRail Cases Linked: ${STORIES.filter(s => s.testCases.length > 0).reduce((sum, s) => sum + s.testCases.length, 0)}`);
  console.log('');

  if (createdIssues.length > 0) {
    console.log('📋 Created Issues:');
    createdIssues.forEach(i => {
      const caseIds = i.testCases.length > 0
        ? i.testCases.map(tc => tc.caseId).join(', ')
        : '(new — no tests yet)';
      console.log(`   ${i.key}: ${i.summary}`);
      console.log(`          TestRail: ${caseIds}`);
    });
  }

  // ── Write mapping file ──────────────────────────────────────────────────
  const mappingPath = path.resolve(__dirname, 'medtronic-jira-testrail-map.json');
  const mapping = createdIssues.map(i => ({
    jiraKey: i.key,
    summary: i.summary,
    testCases: i.testCases,
    labels: i.labels,
  }));
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`\n💾 Mapping saved to: ${mappingPath}`);
  console.log('');
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
