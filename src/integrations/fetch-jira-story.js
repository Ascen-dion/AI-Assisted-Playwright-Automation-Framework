/**
 * fetch-jira-story.js — Quick Jira story fetcher for automation workflow.
 *
 * Usage:
 *   node src/integrations/fetch-jira-story.js <ISSUE-KEY>
 *
 * Example:
 *   node src/integrations/fetch-jira-story.js ED-74
 *
 * Output:
 *   Prints story key, summary, status, description, and parsed ACs to stdout.
 *   Ready to copy-paste into the automation workflow.
 *
 * Required .env vars (already configured):
 *   JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { JiraIntegration } = require('./jira-integration');

const issueKey = process.argv[2];

if (!issueKey) {
  console.error('\n❌ Usage: node src/integrations/fetch-jira-story.js <ISSUE-KEY>');
  console.error('   Example: node src/integrations/fetch-jira-story.js ED-74\n');
  process.exit(1);
}

async function main() {
  const jira = new JiraIntegration();

  let story;
  try {
    story = await jira.fetchUserStory(issueKey);
  } catch (err) {
    console.error(`\n❌ Failed to fetch ${issueKey}: ${err.message}`);
    if (err.response?.status === 404) {
      console.error(`   Issue not found. Check the key and that your account has access.`);
    } else if (err.response?.status === 401) {
      console.error(`   Authentication failed. Check JIRA_EMAIL and JIRA_API_TOKEN in .env`);
    }
    process.exit(1);
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`  JIRA STORY: ${story.key}`);
  console.log('═'.repeat(60));
  console.log(`  Summary  : ${story.summary}`);
  console.log(`  Type     : ${story.issueType}`);
  console.log(`  Status   : ${story.status}`);
  console.log(`  Priority : ${story.priority}`);
  console.log(`  Assignee : ${story.assignee}`);
  if (story.labels.length) {
    console.log(`  Labels   : ${story.labels.join(', ')}`);
  }

  console.log('\n── Description ──────────────────────────────────────────');
  console.log(story.description || '  (no description)');

  if (story.acceptanceCriteria.length) {
    console.log('\n── Acceptance Criteria ──────────────────────────────────');
    story.acceptanceCriteria.forEach((ac, i) => {
      console.log(`  AC${i + 1}: ${ac}`);
    });
  } else {
    console.log('\n── Acceptance Criteria ──────────────────────────────────');
    console.log('  (no structured ACs found — see description above)');
  }

  if (story.testScenarios.length) {
    console.log('\n── Test Scenarios ───────────────────────────────────────');
    story.testScenarios.forEach((ts, i) => {
      console.log(`  TS${i + 1}: ${ts}`);
    });
  }

  if (story.extractedUrls.length) {
    console.log('\n── Extracted URLs ───────────────────────────────────────');
    story.extractedUrls.forEach(url => console.log(`  ${url}`));
  }

  console.log('\n' + '═'.repeat(60) + '\n');
}

main();
