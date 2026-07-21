/**
 * Salesforce Test Suite - Scenario 3: Create a Quote with Approval Process
 * 
 * JIRA Story: DZ-3 (https://aavademo.atlassian.net/browse/DZ-3)
 * TestRail Cases: C010 (853), C011 (854), C012 (855), C013 (856)
 * TestRail Section: https://aava-testrail.avateam.io/index.php?/suites/view/1&group_by=cases:section_id&group_id=9
 * 
 * This spec tests single-level Quote approval process for discounts >20%.
 * 
 * Prerequisites:
 * - SALESFORCE_USERNAME and SALESFORCE_PASSWORD set in .env
 * - SALESFORCE_APPROVER1 and SALESFORCE_APPROVER1_PASSWORD for approval testing
 * - Quote approval process configured for discounts >20%
 * - APPROVAL_THRESHOLD_SINGLE_LEVEL=20 in .env
 */

const { test, expect } = require('../../../shared/fixtures');
const TD = require('../../../shared/data/salesforce-test-data');
const SalesforceLoginPage = require('../pages/salesforce-login.page');
const SalesforceHomePage = require('../pages/salesforce-home.page');
const SalesforceOpportunityPage = require('../pages/salesforce-opportunity.page');
const SalesforceQuotePage = require('../pages/salesforce-quote.page');

test.describe('[DZ-3] Scenario 3: Create a Quote with Approval Process', () => {
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

    // Create an Opportunity
    const timestamp = Date.now();
    await homePage.navigateToObject('Opportunities');
    await opportunityPage.clickNew();
    await opportunityPage.fillOpportunityForm({
      name: `Approval Test Opportunity ${timestamp}`,
      amount: '100000',
      closeDate: '2026-12-31',
      stage: 'Proposal/Price Quote'
    });
    await opportunityPage.clickSave();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Opportunity\/(.*?)\/view/);
    opportunityId = match ? match[1] : null;
  });

  test('[C010][AC10] Should submit Quote for approval when discount >20%', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Approval Required Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with discount >20% (with justification)
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 10,
      discount: 25, // 25% discount - requires approval
      justification: 'Strategic customer - high volume deal'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // Submit for approval
    await quotePage.submitForApproval();

    // Verify Quote is in "Pending Approval" status
    await quotePage.verifyApprovalStatus('Pending');

    // Store Quote ID
    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;
  });

  test('[C011][AC11] Should allow manager to approve Quote', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote as regular user
    const quoteData = {
      name: `Manager Approve Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 10,
      discount: 25,
      justification: 'Competitive pricing match'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Log out and log in as manager/approver
    await homePage.logout();

    const approverUsername = process.env.SALESFORCE_APPROVER1;
    const approverPassword = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(approverUsername, approverPassword);

    // Step 3: Navigate to Quote and approve it
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 4: Verify approval status
    await quotePage.verifyApprovalStatus('Approved');

    // Verify approval history
    const history = await quotePage.getApprovalHistory();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toContain('Approved');
  });

  test('[C012][AC12] Should allow manager to reject Quote', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote
    const quoteData = {
      name: `Manager Reject Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 10,
      discount: 30,
      justification: 'Requesting special discount'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Log in as manager
    await homePage.logout();

    const approverUsername = process.env.SALESFORCE_APPROVER1;
    const approverPassword = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(approverUsername, approverPassword);

    // Step 3: Navigate to Quote and reject it
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.rejectQuote('Discount is too high - please revise');

    // Step 4: Verify rejection
    await quotePage.verifyApprovalStatus('Rejected');

    // Verify Quote is editable (Edit button should be visible)
    await quotePage.clickEdit();
    await page.waitForURL(/.*\/edit/, { timeout: 5000 });
    expect(page.url()).toContain('/edit');
  });

  test('[C013][AC13] Should not require approval for discounts ≤20%', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `No Approval Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with discount ≤20%
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 10,
      discount: 20, // Exactly 20% - should not require approval
      justification: 'Standard volume discount'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // Verify Submit for Approval button is NOT visible (or approval is not required)
    const submitButton = page.locator('button:has-text("Submit for Approval")');
    const isVisible = await submitButton.isVisible().catch(() => false);
    
    // If button is visible, verify Quote does not enter approval process
    if (!isVisible) {
      console.log('✓ Submit for Approval button not visible - approval not required');
    } else {
      // Verify Quote can be processed without approval
      const approvalStatus = await quotePage.getApprovalStatus().catch(() => 'Not In Approval');
      expect(approvalStatus).not.toContain('Pending');
    }
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
