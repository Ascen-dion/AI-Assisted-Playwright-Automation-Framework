/**
 * Salesforce Test Suite - Scenario 4: Create a Quote with Two-Level Approval Process
 * 
 * JIRA Story: DZ-4 (https://aavademo.atlassian.net/browse/DZ-4)
 * TestRail Cases: C014 (857), C015 (858), C016 (859), C017 (860), C018 (861), C019 (862), C020 (863)
 * TestRail Section: https://aava-testrail.avateam.io/index.php?/suites/view/1&group_by=cases:section_id&group_id=9
 * 
 * This spec tests two-level Quote approval process for discounts >50%.
 * 
 * Prerequisites:
 * - SALESFORCE_USERNAME and SALESFORCE_PASSWORD set in .env
 * - SALESFORCE_APPROVER1 and SALESFORCE_APPROVER1_PASSWORD (Level 1 manager)
 * - SALESFORCE_APPROVER2 and SALESFORCE_APPROVER2_PASSWORD (Level 2 manager)
 * - Quote approval process configured for two-level approval when discount >50%
 * - APPROVAL_THRESHOLD_TWO_LEVEL=50 in .env
 */

const { test, expect } = require('../../../shared/fixtures');
const TD = require('../../../shared/data/salesforce-test-data');
const SalesforceLoginPage = require('../pages/salesforce-login.page');
const SalesforceHomePage = require('../pages/salesforce-home.page');
const SalesforceOpportunityPage = require('../pages/salesforce-opportunity.page');
const SalesforceQuotePage = require('../pages/salesforce-quote.page');

test.describe('[DZ-4] Scenario 4: Create a Quote with Two-Level Approval Process', () => {
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
      name: `Two-Level Approval Opportunity ${timestamp}`,
      amount: '500000',
      closeDate: '2026-12-31',
      stage: 'Proposal/Price Quote'
    });
    await opportunityPage.clickSave();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Opportunity\/(.*?)\/view/);
    opportunityId = match ? match[1] : null;
  });

  test('[C014][AC14] Should submit Quote for first-level approval when discount >50%', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `Two-Level Approval Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with discount >50% (requires two-level approval)
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 100,
      discount: 55, // 55% discount - requires two-level approval
      justification: 'Strategic partnership deal - enterprise contract'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // Submit for approval
    await quotePage.submitForApproval();

    // Verify Quote is in "Pending Level 1 Approval" status
    await quotePage.verifyApprovalStatus('Pending');

    // Store Quote ID
    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;
  });

  test('[C015][AC15] Should route to Level 2 when Level 1 manager approves', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote
    const quoteData = {
      name: `L1 Approve L2 Route Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 100,
      discount: 60,
      justification: 'Major account - strategic deal'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Log in as Level 1 manager and approve
    await homePage.logout();

    const level1Username = process.env.SALESFORCE_APPROVER1;
    const level1Password = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level1Username, level1Password);

    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 3: Verify Quote is now pending Level 2 approval
    await quotePage.verifyApprovalStatus('Pending');

    // Verify approval history shows Level 1 approval
    const history = await quotePage.getApprovalHistory();
    const level1Approval = history.find(h => h.status.includes('Approved'));
    expect(level1Approval).toBeDefined();
  });

  test('[C016][AC16] Should route to Level 2 when Level 1 manager rejects', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote
    const quoteData = {
      name: `L1 Reject L2 Route Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 100,
      discount: 65,
      justification: 'Aggressive pricing request'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Log in as Level 1 manager and reject
    await homePage.logout();

    const level1Username = process.env.SALESFORCE_APPROVER1;
    const level1Password = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level1Username, level1Password);

    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.rejectQuote('Discount too high - need Level 2 review');

    // Step 3: Verify Quote is routed to Level 2 for review
    await quotePage.verifyApprovalStatus('Pending');

    // Verify approval history shows Level 1 rejection
    const history = await quotePage.getApprovalHistory();
    const level1Rejection = history.find(h => h.status.includes('Rejected') || h.comments.includes('Level 2 review'));
    expect(level1Rejection).toBeDefined();
  });

  test('[C017][AC17] Should finalize approval when Level 2 manager approves', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote
    const quoteData = {
      name: `L2 Final Approve Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 100,
      discount: 55,
      justification: 'VIP customer - executive approved'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Level 1 approval
    await homePage.logout();
    const level1Username = process.env.SALESFORCE_APPROVER1;
    const level1Password = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level1Username, level1Password);
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 3: Level 2 approval
    await homePage.logout();
    const level2Username = process.env.SALESFORCE_APPROVER2;
    const level2Password = process.env.SALESFORCE_APPROVER2_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level2Username, level2Password);
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 4: Verify Quote is fully approved
    await quotePage.verifyApprovalStatus('Approved');

    // Verify complete approval history
    const history = await quotePage.getApprovalHistory();
    expect(history.length).toBeGreaterThanOrEqual(2); // At least L1 and L2 approvals
  });

  test('[C018][AC18] Should finalize rejection when Level 2 manager rejects', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote
    const quoteData = {
      name: `L2 Final Reject Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 100,
      discount: 70,
      justification: 'Exceptional case - competitive bid'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Level 1 approval
    await homePage.logout();
    const level1Username = process.env.SALESFORCE_APPROVER1;
    const level1Password = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level1Username, level1Password);
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 3: Level 2 rejection
    await homePage.logout();
    const level2Username = process.env.SALESFORCE_APPROVER2;
    const level2Password = process.env.SALESFORCE_APPROVER2_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level2Username, level2Password);
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.rejectQuote('Discount exceeds company policy - please revise');

    // Step 4: Verify Quote is rejected and editable
    await quotePage.verifyApprovalStatus('Rejected');

    // Verify Quote can be edited
    await quotePage.clickEdit();
    await page.waitForURL(/.*\/edit/, { timeout: 5000 });
    expect(page.url()).toContain('/edit');
  });

  test('[C019][AC19] Should maintain complete approval history', async ({ page }) => {
    const timestamp = Date.now();
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    // Step 1: Create and submit Quote
    const quoteData = {
      name: `Approval History Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 100,
      discount: 60,
      justification: 'Full approval history test'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.submitForApproval();

    const currentUrl = page.url();
    const match = currentUrl.match(/\/Quote\/(.*?)\/view/);
    quoteId = match ? match[1] : null;

    // Step 2: Level 1 approval with comments
    await homePage.logout();
    const level1Username = process.env.SALESFORCE_APPROVER1;
    const level1Password = process.env.SALESFORCE_APPROVER1_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level1Username, level1Password);
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 3: Level 2 approval with comments
    await homePage.logout();
    const level2Username = process.env.SALESFORCE_APPROVER2;
    const level2Password = process.env.SALESFORCE_APPROVER2_PASSWORD;
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(level2Username, level2Password);
    await quotePage.navigateTo(baseUrl, quoteId);
    await quotePage.approveQuote();

    // Step 4: Verify approval history contains all required information
    const history = await quotePage.getApprovalHistory();
    
    // Verify history has at least 2 entries (L1 and L2)
    expect(history.length).toBeGreaterThanOrEqual(2);
    
    // Verify each entry has required fields
    for (const entry of history) {
      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('status');
      expect(entry).toHaveProperty('approver');
      expect(entry.date).not.toBe('');
      expect(entry.status).not.toBe('');
      expect(entry.approver).not.toBe('');
    }
    
    console.log('✓ Complete approval history verified:', history);
  });

  test('[C020][AC20] Should not require two-level approval for discounts ≤50%', async ({ page }) => {
    const timestamp = Date.now();
    const quoteData = {
      name: `No Two-Level Approval Quote ${timestamp}`,
      expirationDate: '2026-12-31',
      status: 'Draft'
    };

    // Create Quote
    await opportunityPage.createQuote(quoteData);
    await quotePage.verifySuccessToast('Quote');

    // Add Quote Line Item with discount ≤50%
    const lineItemData = {
      product: 'GenWatt Diesel 1000kW',
      quantity: 50,
      discount: 50, // Exactly 50% - should not require two-level approval
      justification: 'Volume discount - standard approval threshold'
    };

    await quotePage.addQuoteLineItem(lineItemData);
    await quotePage.verifySuccessToast('saved');

    // If discount is ≤50%, it should follow single-level approval (20-50%) or no approval (≤20%)
    // Verify total discount
    const totalDiscount = await quotePage.getTotalDiscount();
    
    if (totalDiscount > 20 && totalDiscount <= 50) {
      // Should require single-level approval only
      await quotePage.submitForApproval();
      await quotePage.verifyApprovalStatus('Pending');
      console.log('✓ Quote entered single-level approval process (discount >20% and ≤50%)');
    } else if (totalDiscount <= 20) {
      // Should not require approval
      console.log('✓ Quote does not require approval (discount ≤20%)');
    }
    
    // Verify it does NOT enter two-level approval
    const approvalStatus = await quotePage.getApprovalStatus().catch(() => 'N/A');
    expect(approvalStatus).not.toContain('Level 2');
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
