/**
 * Salesforce Lead to Quote Validation - Data-Driven Test Spec
 * 
 * This test spec validates the complete Lead → Opportunity → Quote flow
 * with calculations and business rules validation against CSV/JSON test data.
 * 
 * Test Data Sources:
 * - CSV: src/shared/data/quote-validation-testcases.csv (15 test scenarios)
 * - JSON: src/shared/data/salesforce-quote-validation-data.json (detailed test cases)
 * 
 * JIRA Story: DZ-1
 * TestRail Section ID: 9
 */

const { test, expect } = require('../../../shared/fixtures');
const SalesforceLeadPage = require('../pages/salesforce-lead.page');
const SalesforceQuotePage = require('../pages/salesforce-quote.page');
const TD = require('../../../shared/data/salesforce-test-data');
const fs = require('fs');
const path = require('path');

// ========================================================================
// STEP 1: LOAD TEST DATA FROM JSON/CSV FILES
// ========================================================================

const testDataPath = path.join(__dirname, '../../../shared/data/salesforce-quote-validation-data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

console.log(`📊 Loaded ${testData.testCases.length} test cases from JSON`);

// ========================================================================
// TEST SUITE
// ========================================================================

test.describe('Salesforce Lead to Quote Validation [JIRA: DZ-1]', () => {
  let leadPage;
  let quotePage;

  test.beforeEach(async ({ page }) => {
    leadPage = new SalesforceLeadPage(page);
    quotePage = new SalesforceQuotePage(page);
    
    // Login to Salesforce
    await page.goto(process.env.SALESFORCE_ORG_URL || TD.urls.login);
    await page.fill('input#username', process.env.SALESFORCE_USERNAME);
    await page.fill('input#password', process.env.SALESFORCE_PASSWORD);
    await page.click('input#Login');
    await page.waitForURL(/.*lightning.*/);
  });

  // ========================================================================
  // STEP 2: DATA-DRIVEN TESTS - Loop through each test case from JSON
  // ========================================================================

  testData.testCases.forEach((testCase) => {
    test(`[${testCase.testId}] ${testCase.scenario}`, async ({ page }) => {
      
      console.log(`\n${'='.repeat(70)}`);
      console.log(`🧪 Running Test Case: [${testCase.testId}]`);
      console.log(`📋 Scenario: ${testCase.scenario}`);
      console.log(`${'='.repeat(70)}`);

      // ====================================================================
      // STEP 3: CALCULATE EXPECTED VALUES FROM JSON/CSV DATA
      // ====================================================================

      const unitPrice = testCase.calculations.unitPrice;
      const expectedSubtotal = testCase.quantity * unitPrice;
      const expectedDiscount = expectedSubtotal * (testCase.discount / 100);
      const expectedTotal = expectedSubtotal - expectedDiscount;
      const shouldPass = testCase.expectedResult.shouldPass;

      console.log('\n📊 EXPECTED VALUES (from JSON/CSV):');
      console.log(`   Product: ${testCase.product}`);
      console.log(`   Quantity: ${testCase.quantity}`);
      console.log(`   Unit Price: $${unitPrice}`);
      console.log(`   Discount %: ${testCase.discount}%`);
      console.log(`   Justification: "${testCase.justification || '(empty)'}"`);
      console.log(`   Expected Subtotal: $${expectedSubtotal.toFixed(2)}`);
      console.log(`   Expected Discount: $${expectedDiscount.toFixed(2)}`);
      console.log(`   Expected Total: $${expectedTotal.toFixed(2)}`);
      console.log(`   Should Pass: ${shouldPass ? 'YES ✅' : 'NO ❌ (Expected to fail)'}`);

      // ====================================================================
      // STEP 4: CREATE LEAD
      // ====================================================================

      console.log('\n📝 STEP 1: Creating Lead...');
      const timestamp = Date.now();
      const leadData = {
        firstName: 'Test',
        lastName: `Lead_${timestamp}`,
        company: `Test Corp ${timestamp}`,
        email: `test${timestamp}@example.com`,
        phone: '555-0100',
      };

      await leadPage.navigateToLeads();
      await leadPage.createLead(leadData);
      console.log(`   ✅ Lead created: ${leadData.firstName} ${leadData.lastName}`);

      // ====================================================================
      // STEP 5: CONVERT LEAD TO OPPORTUNITY
      // ====================================================================

      console.log('\n🔄 STEP 2: Converting Lead to Opportunity...');
      const opportunityName = `Opp_${timestamp}`;
      await leadPage.convertLead(opportunityName);
      console.log(`   ✅ Lead converted. Opportunity: ${opportunityName}`);

      // ====================================================================
      // STEP 6: CREATE QUOTE
      // ====================================================================

      console.log('\n📄 STEP 3: Creating Quote...');
      const quoteData = {
        name: `Quote_${testCase.testId}_${timestamp}`,
        expirationDate: '12/31/2026',
      };
      await quotePage.createQuote(quoteData);
      console.log(`   ✅ Quote created: ${quoteData.name}`);

      // ====================================================================
      // STEP 7: ADD QUOTE LINE ITEM (Input values from JSON/CSV)
      // ====================================================================

      console.log('\n🛒 STEP 4: Adding Quote Line Item...');
      console.log(`   Product: ${testCase.product}`);
      console.log(`   Quantity: ${testCase.quantity}`);
      console.log(`   Discount: ${testCase.discount}%`);
      console.log(`   Justification: "${testCase.justification || '(none)'}"`);

      const lineItemData = {
        product: testCase.product,
        quantity: testCase.quantity,
        discount: testCase.discount,
        justification: testCase.justification,
      };

      await quotePage.addQuoteLineItem(lineItemData);
      console.log(`   ✅ Quote Line Item added`);

      // ====================================================================
      // STEP 8: CAPTURE ACTUAL VALUES FROM SALESFORCE UI
      // ====================================================================

      console.log('\n📊 STEP 5: Capturing ACTUAL values from Salesforce UI...');

      if (shouldPass) {
        // For positive tests, we should get calculations
        const calculations = await quotePage.getQuoteCalculations();
        
        const actualSubtotal = parseFloat(calculations.subtotal.replace('$', '').replace(',', ''));
        const actualDiscount = parseFloat(calculations.discountAmount.replace('$', '').replace(',', ''));
        const actualTotal = parseFloat(calculations.totalPrice.replace('$', '').replace(',', ''));

        console.log(`   Actual Subtotal: $${actualSubtotal.toFixed(2)}`);
        console.log(`   Actual Discount: $${actualDiscount.toFixed(2)}`);
        console.log(`   Actual Total: $${actualTotal.toFixed(2)}`);

        // ================================================================
        // STEP 9: VALIDATE - COMPARE ACTUAL vs EXPECTED (JSON/CSV)
        // ================================================================

        console.log('\n🔍 STEP 6: VALIDATING - Comparing ACTUAL vs EXPECTED...');

        // Validate Subtotal
        console.log(`\n   Subtotal Validation:`);
        console.log(`     Expected: $${expectedSubtotal.toFixed(2)}`);
        console.log(`     Actual:   $${actualSubtotal.toFixed(2)}`);
        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
        console.log(`     ✅ PASS - Subtotal matches`);

        // Validate Discount Amount
        console.log(`\n   Discount Amount Validation:`);
        console.log(`     Expected: $${expectedDiscount.toFixed(2)}`);
        console.log(`     Actual:   $${actualDiscount.toFixed(2)}`);
        expect(actualDiscount).toBeCloseTo(expectedDiscount, 2);
        console.log(`     ✅ PASS - Discount matches`);

        // Validate Total Price
        console.log(`\n   Total Price Validation:`);
        console.log(`     Expected: $${expectedTotal.toFixed(2)}`);
        console.log(`     Actual:   $${actualTotal.toFixed(2)}`);
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
        console.log(`     ✅ PASS - Total matches`);

        console.log('\n✅ ALL VALIDATIONS PASSED - Test case successful!');

      } else {
        // ================================================================
        // NEGATIVE TEST CASE - Should fail with validation error
        // ================================================================

        console.log(`\n⚠️  This is a NEGATIVE test case - expecting validation error`);

        const errorMessage = await quotePage.getValidationError();
        const expectedError = testCase.expectedResult.validationErrors[0];

        console.log(`\n🔍 STEP 6: VALIDATING - Checking for expected error...');`);
        console.log(`   Expected Error: "${expectedError}"`);
        console.log(`   Actual Error:   "${errorMessage}"`);

        expect(errorMessage).toContain(expectedError);
        console.log(`\n✅ PASS - Validation error displayed as expected`);
      }

      console.log(`\n${'='.repeat(70)}`);
      console.log(`✅ Test Case [${testCase.testId}] COMPLETED SUCCESSFULLY`);
      console.log(`${'='.repeat(70)}\n`);
    });
  });

  // ========================================================================
  // ADDITIONAL TEST: Validate CSV data integrity
  // ========================================================================

  test('[META] Validate test data integrity between JSON and CSV', async () => {
    const csvPath = path.join(__dirname, '../../../shared/data/quote-validation-testcases.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const csvLines = csvContent.split('\n').filter(line => line.trim());

    console.log(`\n📊 CSV contains ${csvLines.length - 1} test cases (excluding header)`);
    console.log(`📊 JSON contains ${testData.testCases.length} test cases`);

    // Verify all test IDs from JSON exist in CSV
    testData.testCases.forEach(testCase => {
      const foundInCSV = csvContent.includes(testCase.testId);
      expect(foundInCSV).toBe(true);
      console.log(`   ✅ ${testCase.testId} found in both JSON and CSV`);
    });

    console.log('\n✅ Test data integrity validated - JSON and CSV are aligned');
  });
});

// ========================================================================
// HELPER FUNCTION: Format validation report for TestRail
// ========================================================================

function formatValidationReport(testCase, actual, expected, passed) {
  return `
**Test Case:** ${testCase.testId} - ${testCase.scenario}

**INPUT DATA (from JSON/CSV):**
- Product: ${testCase.product}
- Quantity: ${testCase.quantity}
- Discount: ${testCase.discount}%
- Justification: ${testCase.justification || '(none)'}

**EXPECTED RESULTS (from CSV):**
- Subtotal: $${expected.subtotal}
- Discount: $${expected.discount}
- Total: $${expected.total}
- Should Pass: ${expected.shouldPass ? 'YES' : 'NO'}

**ACTUAL RESULTS (from Salesforce):**
- Subtotal: $${actual.subtotal} ${actual.subtotal === expected.subtotal ? '✅' : '❌'}
- Discount: $${actual.discount} ${actual.discount === expected.discount ? '✅' : '❌'}
- Total: $${actual.total} ${actual.total === expected.total ? '✅' : '❌'}

**VALIDATION STATUS:** ${passed ? '✅ PASS' : '❌ FAIL'}
  `;
}
