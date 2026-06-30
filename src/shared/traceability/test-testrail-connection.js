/**
 * Test TestRail Connection
 * 
 * This script verifies your TestRail credentials and connection.
 * Run this first before attempting to upload test cases.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const axios = require('axios');

const TESTRAIL_HOST = process.env.TESTRAIL_HOST;
const TESTRAIL_USER = process.env.TESTRAIL_USER;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const PROJECT_ID = process.env.TESTRAIL_PROJECT_ID;
const SUITE_ID = process.env.TESTRAIL_SUITE_ID;
const SECTION_ID = process.env.TESTRAIL_SECTION_ID;

console.log('\n🔍 TestRail Connection Test\n');
console.log('═'.repeat(70));
console.log('Configuration from .env:');
console.log('═'.repeat(70));
console.log(`Host:       ${TESTRAIL_HOST}`);
console.log(`User:       ${TESTRAIL_USER}`);
console.log(`API Key:    ${TESTRAIL_API_KEY ? '***' + TESTRAIL_API_KEY.slice(-4) : '(not set)'}`);
console.log(`Project ID: ${PROJECT_ID}`);
console.log(`Suite ID:   ${SUITE_ID}`);
console.log(`Section ID: ${SECTION_ID}`);
console.log('');

if (!TESTRAIL_HOST || !TESTRAIL_USER || !TESTRAIL_API_KEY) {
  console.error('❌ Missing required configuration!');
  console.error('   Please set TESTRAIL_HOST, TESTRAIL_USER, and TESTRAIL_API_KEY in .env');
  process.exit(1);
}

// Create axios instance
const testrail = axios.create({
  baseURL: `${TESTRAIL_HOST}/index.php?/api/v2`,
  auth: {
    username: TESTRAIL_USER,
    password: TESTRAIL_API_KEY
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testConnection() {
  console.log('Test 1: Fetching Projects...');
  try {
    const response = await testrail.get('/get_projects');
    const projects = response.data || [];
    console.log(`   ✅ SUCCESS - Found ${projects.length} projects\n`);
    
    if (projects.length > 0) {
      console.log('   Available Projects:');
      projects.forEach(p => {
        console.log(`   • [ID ${p.id}] ${p.name}${p.id == PROJECT_ID ? ' ← (configured)' : ''}`);
      });
      console.log('');
    }
    return true;
  } catch (error) {
    console.error('   ❌ FAILED');
    console.error(`   Error: ${error.response?.data?.error || error.message}\n`);
    return false;
  }
}

async function testProject() {
  console.log(`Test 2: Fetching Project ${PROJECT_ID}...`);
  try {
    const response = await testrail.get(`/get_project/${PROJECT_ID}`);
    const project = response.data;
    console.log(`   ✅ SUCCESS - Project: ${project.name}`);
    console.log(`   URL: ${project.url}\n`);
    return true;
  } catch (error) {
    console.error('   ❌ FAILED');
    console.error(`   Error: ${error.response?.data?.error || error.message}\n`);
    return false;
  }
}

async function testSuite() {
  console.log(`Test 3: Fetching Suites in Project ${PROJECT_ID}...`);
  try {
    const response = await testrail.get(`/get_suites/${PROJECT_ID}`);
    const suites = response.data || [];
    console.log(`   ✅ SUCCESS - Found ${suites.length} suites\n`);
    
    if (suites.length > 0) {
      console.log('   Available Suites:');
      suites.forEach(s => {
        console.log(`   • [ID ${s.id}] ${s.name}${s.id == SUITE_ID ? ' ← (configured)' : ''}`);
      });
      console.log('');
    }
    return true;
  } catch (error) {
    console.error('   ❌ FAILED');
    console.error(`   Error: ${error.response?.data?.error || error.message}\n`);
    return false;
  }
}

async function testSection() {
  console.log(`Test 4: Fetching Sections in Suite ${SUITE_ID}...`);
  try {
    const response = await testrail.get(`/get_sections/${PROJECT_ID}&suite_id=${SUITE_ID}`);
    const sections = response.data.sections || response.data || [];
    console.log(`   ✅ SUCCESS - Found ${sections.length} sections\n`);
    
    if (sections.length > 0) {
      console.log('   Available Sections:');
      sections.forEach(s => {
        console.log(`   • [ID ${s.id}] ${s.name}${s.id == SECTION_ID ? ' ← (configured)' : ''}`);
      });
      console.log('');
    }
    return true;
  } catch (error) {
    console.error('   ❌ FAILED');
    console.error(`   Error: ${error.response?.data?.error || error.message}\n`);
    return false;
  }
}

async function testCases() {
  console.log(`Test 5: Fetching Cases in Section ${SECTION_ID}...`);
  try {
    const response = await testrail.get(`/get_cases/${PROJECT_ID}&suite_id=${SUITE_ID}&section_id=${SECTION_ID}`);
    const cases = response.data.cases || response.data || [];
    console.log(`   ✅ SUCCESS - Found ${cases.length} test cases\n`);
    
    if (cases.length > 0) {
      console.log('   Sample Cases (first 5):');
      cases.slice(0, 5).forEach(c => {
        console.log(`   • [C${c.id}] ${c.title}`);
      });
      if (cases.length > 5) {
        console.log(`   ... and ${cases.length - 5} more`);
      }
      console.log('');
    }
    return true;
  } catch (error) {
    console.error('   ❌ FAILED');
    console.error(`   Error: ${error.response?.data?.error || error.message}\n`);
    return false;
  }
}

async function main() {
  const tests = [
    testConnection,
    testProject,
    testSuite,
    testSection,
    testCases
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
      // Stop on first failure
      break;
    }
  }

  console.log('═'.repeat(70));
  console.log('SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Tests Passed: ${passed}/${tests.length}`);
  console.log(`Tests Failed: ${failed}/${tests.length}`);
  console.log('');

  if (failed === 0) {
    console.log('✅ All tests passed! Your TestRail connection is working correctly.');
    console.log('   You can now run: node src/shared/traceability/upload-medtronic-to-testrail.js');
  } else {
    console.log('❌ Some tests failed. Please verify:');
    console.log('   1. TESTRAIL_HOST is correct (include https://)');
    console.log('   2. TESTRAIL_USER is a valid email with TestRail access');
    console.log('   3. TESTRAIL_API_KEY is a valid API key (not password)');
    console.log('   4. The user has access to the specified project/suite/section');
    console.log('');
    console.log('To generate a new API key:');
    console.log(`   1. Log in to ${TESTRAIL_HOST}`);
    console.log('   2. Click your name → My Settings');
    console.log('   3. Go to API Keys tab');
    console.log('   4. Click "Add Key" and copy the generated key');
    console.log('   5. Update TESTRAIL_API_KEY in .env file');
  }
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Unhandled error:', err.message);
  if (err.response?.data) {
    console.error('   API Response:', JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
