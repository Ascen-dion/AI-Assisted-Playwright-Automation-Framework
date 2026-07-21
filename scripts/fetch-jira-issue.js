#!/usr/bin/env node
require('dotenv').config();
const https = require('https');

const jiraUrl = process.env.JIRA_URL;
const jiraEmail = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const issueKey = process.argv[2] || 'DZ-1';

if (!jiraUrl || !jiraEmail || !jiraApiToken) {
  console.error('❌ JIRA credentials not configured in .env file');
  process.exit(1);
}

// Extract domain from JIRA_URL
const jiraDomain = jiraUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const apiPath = `/rest/api/3/issue/${issueKey}`;

const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64');

const options = {
  hostname: jiraDomain,
  path: apiPath,
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

console.log(`\n🔍 Fetching JIRA issue: ${issueKey}`);
console.log(`📍 From: ${jiraUrl}\n`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const issue = JSON.parse(data);
      console.log('✅ Successfully fetched JIRA issue:\n');
      console.log('═══════════════════════════════════════════════════');
      console.log(`Issue Key:     ${issue.key}`);
      console.log(`Summary:       ${issue.fields.summary}`);
      console.log(`Issue Type:    ${issue.fields.issuetype?.name || 'N/A'}`);
      console.log(`Status:        ${issue.fields.status?.name || 'N/A'}`);
      console.log(`Priority:      ${issue.fields.priority?.name || 'N/A'}`);
      console.log(`Reporter:      ${issue.fields.reporter?.displayName || 'N/A'}`);
      console.log(`Assignee:      ${issue.fields.assignee?.displayName || 'Unassigned'}`);
      console.log(`Created:       ${issue.fields.created ? new Date(issue.fields.created).toLocaleString() : 'N/A'}`);
      console.log('═══════════════════════════════════════════════════');
      
      if (issue.fields.description) {
        console.log('\n📝 Description:');
        console.log('───────────────────────────────────────────────────');
        // Handle both plain text and Atlassian Document Format (ADF)
        if (typeof issue.fields.description === 'string') {
          console.log(issue.fields.description);
        } else if (issue.fields.description.content) {
          // ADF format - extract text from content nodes
          const extractText = (node) => {
            if (node.type === 'text') return node.text;
            if (node.content) return node.content.map(extractText).join('');
            return '';
          };
          const description = issue.fields.description.content.map(extractText).join('\n');
          console.log(description);
        }
        console.log('───────────────────────────────────────────────────');
      }

      if (issue.fields.acceptance) {
        console.log('\n✔️ Acceptance Criteria:');
        console.log('───────────────────────────────────────────────────');
        console.log(issue.fields.acceptance);
        console.log('───────────────────────────────────────────────────');
      }

      if (issue.fields.labels && issue.fields.labels.length > 0) {
        console.log(`\n🏷️  Labels: ${issue.fields.labels.join(', ')}`);
      }

      if (issue.fields.components && issue.fields.components.length > 0) {
        const components = issue.fields.components.map(c => c.name).join(', ');
        console.log(`\n🧩 Components: ${components}`);
      }

      console.log('\n');
      
      // Output full JSON for programmatic use
      console.log('📦 Full JSON output:');
      console.log(JSON.stringify(issue, null, 2));
      
    } else {
      console.error(`❌ Error fetching issue: ${res.statusCode}`);
      console.error(data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.end();
