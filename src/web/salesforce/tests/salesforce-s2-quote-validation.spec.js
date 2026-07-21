/**
 * Salesforce Test Suite - Scenario 2: Create a Quote with Validation Rules
 * 
 * JIRA Story: DZ-2 (https://aavademo.atlassian.net/browse/DZ-2)
 * TestRail Cases: C005 (848), C006 (849), C007 (850), C008 (851), C009 (852)
 * TestRail Section: https://aava-testrail.avateam.io/index.php?/suites/view/1&group_by=cases:section_id&group_id=9
 * 
 * This spec tests Quote creation with discount and quantity validation rules.
 * 
 * Prerequisites:
 * - SALESFORCE_USERNAME and SALESFORCE_PASSWORD set in .env
 * - An Opportunity must exist or be created
 * - Products must be available in Salesforce
 */

const { test, expect } = require('../../../shared/fixtures');
const TD = require('../../../shared/data/salesforce-test-data');
const SalesforceLoginPage = require('../pages/salesforce-login.page');
const SalesforceHomePage = require('../pages/salesforce-home.page');
const SalesforceOpportunityPage = require('../pages/salesforce-opportunity.page');
const SalesforceQuotePage = require('../pages/salesforce-quote.page');

test.describe('[DZ-2] Scenario 2: Create a Quote with Validation Rules', () => {
  let loginPage;
  let homePage;
  let opportunityPage;
  let quotePage;
  let opportunityId;
  let quoteId;

  test.beforeEach(async ({ page }) => {
    loginPage = new SalesforceLoginPage(page);
    homePage = new SalesforceHomePage(page);
    opportunityPage = new SalesforceOpportunityPage(page);
    quotePage = new SalesforceQuotePage(page);

    const username = process.env.SALESFORCE_USERNAME;
    const password = process.env.SALESFORCE_PASSWORD;
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(username, password);
    await homePage.verifyHomePage();

    // Create an Opportunity for testing
    const timestamp = Date.now();
    await homePage.navigateToObject('Opportunities');
    await opportunityPage.clickNew();
    await opportunityPage.fillOpportunityForm({
      name: `Test Opportunity ${timestamp}`,
      amount: '50000',
      closeDate: '2026-12-31',
      stage: 'Prospecting'
    });
    await opportunityPage.clickSave();
    
    const currentUrl = page.url();
    const match = currentUrl.match(/\/Opportunity\/(.*?)\/view/);
    opportunityId = match ? match[1] : null;
  });

  test('[C005][AC5] Should create a Quote successfully with valid data', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Test Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote from Opportunity
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with valid quantity and discount ≤15%
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 5,
      discount: 10, // 10% discount (valid without justification)
      justification: '' // Not required for discount ≤15%
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // Store Quote ID
    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;
  });

  test('[C006][AC6] Should prevent saving Quote when discount >15% without justification', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Validation Test Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Try to add Quote Line Item with discount >15% without justification
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 5,
      discount: 20, // 20% discount (requires justification)
      justification: '' // Left blank - should trigger validation error
    };

    await quotePage.addQuoteLineItem(lineItemData);

    // Verify validation error
    await quotePage.verifyValidationError('Justification is required for discounts greater than 15%');
  });

  test('[C007][AC7] Should allow saving Quote when discount >15% with justification', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Justified Discount Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with discount >15% WITH justification
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 5,
      discount: 20, // 20% discount
      justification: 'Volume purchase discount for preferred customer' // Justification provided
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // Verify Quote was saved successfully
    const currentUrl = page.url();
    expect(currentUrl).toContain('/Quote/');
  });

  test('[C008][AC8] Should prevent saving Quote when quantity is zero or negative', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Zero Quantity Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Try to add Quote Line Item with quantity ≤0
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 0, // Invalid quantity
      discount: 5
    };

    await quotePage.addQuoteLineItem(lineItemData);

    // Verify validation error
    await quotePage.verifyValidationError('Quantity must be greater than zero');
  });

  test('[C009][AC9] Should allow saving Quote with valid quantity', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Valid Quantity Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with valid quantity >0
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 10, // Valid quantity
      discount: 5
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // Verify Quote was saved successfully
    const currentUrl = page.url();
    expect(currentUrl).toContain('/Quote/');
  });

  test.afterEach(async ({ page }) => {
    if (quoteId) {
      console.log(`Quote created: ${quoteId}`);
    }
    if (opportunityId) {
      console.log(`Opportunity created: ${opportunityId}`);
    }
  });
});
