/**
 * Create TestRail Test Cases from CSV
 * 
 * This script reads the quote-validation-testcases.csv file and creates
 * manual test cases in TestRail for each scenario.
 * 
 * Usage: node scripts/create-testrail-cases-from-csv.js [csv-file-path]
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// TestRail Configuration
const TESTRAIL_HOST = process.env.TESTRAIL_HOST;
const TESTRAIL_USER = process.env.TESTRAIL_USER;
const TESTRAIL_API_KEY = process.env.TESTRAIL_API_KEY;
const TESTRAIL_PROJECT_ID = process.env.TESTRAIL_PROJECT_ID;
const TESTRAIL_SUITE_ID = process.env.TESTRAIL_SUITE_ID;
const TESTRAIL_SECTION_ID = process.env.TESTRAIL_SECTION_ID;

// TestRail API client
const testrailClient = axios.create({
  baseURL: `${TESTRAIL_HOST}/index.php?/api/v2`,
  auth: {
    username: TESTRAIL_USER,
    password: TESTRAIL_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Parse CSV file
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const testCases = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const testCase = {};
    headers.forEach((header, index) => {
      testCase[header] = values[index] || '';
    });
    testCases.push(testCase);
  }
  
  return testCases;
}

/**
 * Create a test case in TestRail
 */
async function createTestCase(testData) {
  const steps = [
    {
      content: 'Navigate to Salesforce and log in',
      expected: 'Successfully logged in to Salesforce Lightning',
    },
    {
      content: `Create a new Lead: First Name="Test", Last Name="Lead_${Date.now()}", Company="Test Corp", Email="test@example.com"`,
      expected: 'Lead created successfully',
    },
    {
      content: 'Convert Lead to Account, Contact, and Opportunity',
      expected: 'Lead converted successfully. Opportunity created.',
    },
    {
      content: 'Create a Quote for the Opportunity',
      expected: 'Quote created and associated with Opportunity',
    },
    {
      content: `Add Quote Line Item:\n- Product: ${testData.Product}\n- Quantity: ${testData.Quantity}\n- Unit Price: ${testData['Unit Price']}\n- Discount %: ${testData['Discount %']}\n- Justification: ${testData.Justification || '(empty)'}`,
      expected: testData['Should Pass'] === 'TRUE' 
        ? `Quote Line Item saved successfully.\n- Subtotal: $${testData['Expected Subtotal']}\n- Discount Amount: $${testData['Expected Discount']}\n- Total Price: $${testData['Expected Total']}`
        : `Validation error displayed: ${testData['Expected Error']}`,
    },
  ];

  const caseData = {
    title: `[${testData['Test ID']}] ${testData.Scenario}`,
    type_id: 1, // Test Case (functional)
    priority_id: testData['Should Pass'] === 'FALSE' ? 4 : 3, // Critical for negative tests, High for positive
    custom_steps_separated: steps,
    refs: 'DZ-1', // JIRA reference
    custom_preconds: 'User is logged in to Salesforce with appropriate permissions',
  };

  try {
    const response = await testrailClient.post(
      `/add_case/${TESTRAIL_SECTION_ID}`,
      caseData
    );
    
    console.log(`✅ Created TestRail Case [${testData['Test ID']}] → Case ID: C${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create case [${testData['Test ID']}]:`, error.response?.data || error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  // Get CSV file path from command line or use default
  const csvFilePath = process.argv[2] || path.join(__dirname, '../src/shared/data/quote-validation-testcases.csv');
  
  console.log('🚀 Creating TestRail Test Cases from CSV...\n');
  console.log(`📁 CSV File: ${csvFilePath}`);
  console.log(`🎯 TestRail: ${TESTRAIL_HOST}`);
  console.log(`📊 Project ID: ${TESTRAIL_PROJECT_ID}, Suite ID: ${TESTRAIL_SUITE_ID}, Section ID: ${TESTRAIL_SECTION_ID}\n`);

  // Verify environment variables
  if (!TESTRAIL_HOST || !TESTRAIL_USER || !TESTRAIL_API_KEY) {
    console.error('❌ ERROR: TestRail credentials not found in .env file');
    process.exit(1);
  }

  // Parse CSV
  const testCases = parseCSV(csvFilePath);
  console.log(`📋 Found ${testCases.length} test cases in CSV\n`);

  // Create test cases in TestRail
  const results = [];
  for (const testCase of testCases) {
    const result = await createTestCase(testCase);
    results.push(result);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Test Cases: ${testCases.length}`);
  console.log(`Successfully Created: ${results.filter(r => r !== null).length}`);
  console.log(`Failed: ${results.filter(r => r === null).length}`);
  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
