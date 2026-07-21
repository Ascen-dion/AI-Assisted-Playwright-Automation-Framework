/**
 * Link TestRail Cases to JIRA Stories
 * Adds TestRail case links as comments to JIRA stories for bidirectional traceability
 */

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const TESTRAIL_URL = process.env.TESTRAIL_URL;

/**
 * Make HTTPS request to JIRA API
 */
function makeJiraRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    const url = new URL(`/rest/api/3/${endpoint}`, JIRA_URL);
    
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
          reject(new Error(`JIRA API Error: ${res.statusCode} - ${responseData}`));
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
 * Get existing comments on a JIRA issue
 */
async function getJiraComments(jiraKey) {
  try {
    const result = await makeJiraRequest('GET', `issue/${jiraKey}/comment`);
    return result.comments || [];
  } catch (error) {
    console.error(`   ❌ Error getting comments: ${error.message}`);
    return [];
  }
}

/**
 * Add TestRail links as comment to JIRA issue
 */
async function addTestRailLinksToJira(jiraKey, testCases) {
  console.log(`\n📝 Adding TestRail links to ${jiraKey}...`);
  
  // Check if comment already exists
  const existingComments = await getJiraComments(jiraKey);
  const hasTestRailComment = existingComments.some(comment => 
    comment.body?.content?.some(c => 
      c.content?.some(text => text.text?.includes('TestRail Test Cases'))
    )
  );

  if (hasTestRailComment) {
    console.log(`   ℹ️  TestRail links comment already exists, skipping...`);
    return { jiraKey, status: 'already_exists' };
  }

  // Build comment with TestRail case links
  const testCaseLinks = testCases.map(tc => ({
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: `• ${tc.caseId} - ${tc.title}: `
      },
      {
        type: 'text',
        text: tc.testRailUrl,
        marks: [
          {
            type: 'link',
            attrs: {
              href: tc.testRailUrl
            }
          }
        ]
      }
    ]
  }));

  const commentBody = {
    body: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [
            {
              type: 'text',
              text: '🔗 TestRail Test Cases',
              marks: [{ type: 'strong' }]
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `This story is covered by ${testCases.length} automated test cases in TestRail:`
            }
          ]
        },
        ...testCaseLinks,
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '\n'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `View all cases in TestRail: `,
            },
            {
              type: 'text',
              text: `${TESTRAIL_URL}/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&group_id=9`,
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: `${TESTRAIL_URL}/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&group_id=9`
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  };

  try {
    await makeJiraRequest('POST', `issue/${jiraKey}/comment`, commentBody);
    console.log(`   ✅ Added ${testCases.length} TestRail case links to ${jiraKey}`);
    return { jiraKey, status: 'added', count: testCases.length };
  } catch (error) {
    console.error(`   ❌ Failed to add comment: ${error.message}`);
    return { jiraKey, status: 'error', error: error.message };
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔗 Linking TestRail Cases to JIRA Stories\n');
  console.log('📋 Configuration:');
  console.log(`   JIRA URL: ${JIRA_URL}`);
  console.log(`   TestRail URL: ${TESTRAIL_URL}\n`);

  // Load mappings
  const testRailMappingPath = path.join(__dirname, '..', 'testrail-mapping.json');
  const jiraMappingPath = path.join(__dirname, '..', 'jira-mapping.json');

  if (!fs.existsSync(testRailMappingPath)) {
    console.error('❌ TestRail mapping file not found');
    process.exit(1);
  }

  if (!fs.existsSync(jiraMappingPath)) {
    console.error('❌ JIRA mapping file not found');
    process.exit(1);
  }

  const testRailMapping = JSON.parse(fs.readFileSync(testRailMappingPath, 'utf8'));
  const jiraMapping = JSON.parse(fs.readFileSync(jiraMappingPath, 'utf8'));

  console.log(`📊 Found ${jiraMapping.length} JIRA stories`);
  console.log(`📊 Found ${testRailMapping.length} TestRail test cases\n`);

  const results = [];

  // Group test cases by JIRA key
  for (const jiraStory of jiraMapping) {
    const testCasesForStory = testRailMapping.filter(tc => tc.jiraKey === jiraStory.jiraKey);
    
    if (testCasesForStory.length === 0) {
      console.log(`⚠️  No test cases found for ${jiraStory.jiraKey}`);
      continue;
    }

    const result = await addTestRailLinksToJira(jiraStory.jiraKey, testCasesForStory);
    results.push(result);

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  console.log('\n\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('📊 Linking Summary\n');
  
  const added = results.filter(r => r.status === 'added').length;
  const alreadyExists = results.filter(r => r.status === 'already_exists').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log(`   Total JIRA Stories: ${results.length}`);
  console.log(`   ✅ Links Added: ${added}`);
  console.log(`   ℹ️  Already Linked: ${alreadyExists}`);
  console.log(`   ❌ Errors: ${errors}\n`);

  if (errors > 0) {
    console.log('⚠️  Errors encountered:\n');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`   ${r.jiraKey}: ${r.error}`);
    });
    console.log('');
  }

  console.log('📝 JIRA Stories with TestRail Links:\n');
  results.forEach(r => {
    const emoji = r.status === 'added' ? '✅' : r.status === 'already_exists' ? 'ℹ️' : '❌';
    console.log(`   ${emoji} ${r.jiraKey}: ${JIRA_URL}/browse/${r.jiraKey}`);
  });
  console.log('\n✅ Bidirectional linking complete!');
  console.log('   • TestRail cases have JIRA references in the "refs" field');
  console.log('   • JIRA stories have TestRail case links in comments\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});
