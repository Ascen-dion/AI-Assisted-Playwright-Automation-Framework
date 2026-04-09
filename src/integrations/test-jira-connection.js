/**
 * Quick Jira Connection Test
 * Tests authentication and issue access
 */

require('dotenv').config();
const axios = require('axios');

async function testJiraConnection() {
  console.log('\n🔍 Testing Jira Connection...\n');
  const sampleIssueKey = process.env.JIRA_SAMPLE_ISSUE_KEY || process.argv[2] || 'ECOM-1';
  
  const host = process.env.JIRA_HOST;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  
  console.log('📋 Configuration:');
  console.log(`   Host: ${host}`);
  console.log(`   Email: ${email}`);
  console.log(`   API Token: ${apiToken ? '***' + apiToken.slice(-8) : 'NOT SET'}\n`);
  
  if (!host || !email || !apiToken) {
    console.error('❌ Missing Jira credentials in .env file');
    return;
  }
  
  const client = axios.create({
    baseURL: `${host}/rest/api/3`,
    auth: {
      username: email,
      password: apiToken
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  
  try {
    // Test 1: Check authentication
    console.log('🔐 Test 1: Checking authentication...');
    const myselfResponse = await client.get('/myself');
    console.log(`   ✅ Authenticated as: ${myselfResponse.data.displayName} (${myselfResponse.data.emailAddress})\n`);
    
    // Test 2: Try to fetch a sample issue key
    console.log(`📄 Test 2: Fetching issue ${sampleIssueKey}...`);
    const issueResponse = await client.get(`/issue/${sampleIssueKey}`);
    const issue = issueResponse.data;
    
    console.log(`   ✅ Issue found!`);
    console.log(`   📝 Summary: ${issue.fields.summary}`);
    console.log(`   📊 Status: ${issue.fields.status.name}`);
    console.log(`   🏷️  Type: ${issue.fields.issuetype.name}`);
    console.log(`   🔗 URL: ${host}/browse/${sampleIssueKey}\n`);
    
    // Test 3: Show description
    console.log('📋 Test 3: Issue Description:');
    if (issue.fields.description) {
      console.log(JSON.stringify(issue.fields.description, null, 2));
    } else {
      console.log('   ⚠️  No description found');
    }
    
    console.log('\n✅ All tests passed! You can now run the full workflow.\n');
    
  } catch (error) {
    console.error('\n❌ Test Failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error: ${error.response.data.errorMessages || error.response.statusText}`);
      
      if (error.response.status === 401) {
        console.error('\n💡 Suggestion: Your API token might be invalid. Generate a new one at:');
        console.error('   https://id.atlassian.com/manage-profile/security/api-tokens');
      } else if (error.response.status === 404) {
        console.error('\n💡 Suggestions:');
        console.error(`   1. Verify issue ${sampleIssueKey} exists at: ${host}/browse/${sampleIssueKey}`);
        console.error('   2. Check if you have permission to view the target project');
        console.error('   3. Try with a different issue key');
      }
    } else {
      console.error(`   Error: ${error.message}`);
    }
    console.log('');
  }
}

testJiraConnection();
