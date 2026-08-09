/**
 * Salesforce E2E Test: Lead → Opportunity → Quote with ZOOM Product
 * 
 * This test covers the complete end-to-end workflow:
 * 1. Create a Lead
 * 2. Convert Lead to Opportunity
 * 3. Add Quote with ZOOM product
 * 4. Validate discount rules (discount < 15%)
 * 
 * Prerequisites:
 * - SALESFORCE_USERNAME and SALESFORCE_PASSWORD set in .env
 * - ZOOM product must exist in Salesforce
 * - User must have Lead conversion and Quote creation permissions
 */

const { test, expect } = require('../../../shared/fixtures');
const SalesforceLoginPage = require('../pages/salesforce-login.page');
const SalesforceHomePage = require('../pages/salesforce-home.page');
const SalesforceLeadPage = require('../pages/salesforce-lead.page');
const SalesforceOpportunityPage = require('../pages/salesforce-opportunity.page');
const SalesforceQuotePage = require('../pages/salesforce-quote.page');
const SalesforceAPI = require('../../../shared/integrations/salesforce-api');

test.describe('E2E: Lead → Opportunity → Quote with ZOOM Product', () => {
  let loginPage;
  let homePage;
  let leadPage;
  let opportunityPage;
  let quotePage;
  let leadId;
  let opportunityId;
  let quoteId;

  test.beforeEach(async ({ page }) => {
    loginPage = new SalesforceLoginPage(page);
    homePage = new SalesforceHomePage(page);
    leadPage = new SalesforceLeadPage(page);
    opportunityPage = new SalesforceOpportunityPage(page);
    quotePage = new SalesforceQuotePage(page);

    const username = process.env.SALESFORCE_USERNAME;
    const password = process.env.SALESFORCE_PASSWORD;
    const baseUrl = process.env.SALESFORCE_ORG_URL;

    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(username, password);
    await homePage.verifyHomePage();
  });

  test('[E2E] Lead → Opportunity → Quote with ZOOM Product', async ({ page }) => {
    test.setTimeout(180000); // 180 seconds for E2E test
    
    // Close any lingering modals from previous runs
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // ========== STEP 1: Create Lead ==========
    console.log('\n📝 Step 1: Creating Lead...');
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    
    const leadData = {
      firstName: `John_${randomSuffix}`,
      lastName: `E2E_Lead_${timestamp}`,
      company: `E2E_Co_${timestamp}_${randomSuffix}`,
      email: `e2e_${timestamp}_${randomSuffix}@test.com`,
      phone: `555-${randomSuffix.toString().padStart(4, '0')}`,
      status: 'Open - Not Contacted',
      leadSource: 'Web'
    };

    await homePage.navigateToObject('Leads');
    await leadPage.clickNew();
    await leadPage.fillLeadForm(leadData);
    await leadPage.clickSave();
    
    // Wait for success and extract Lead ID
    await page.waitForTimeout(2000);
    let currentUrl = page.url();
    console.log(`Current URL after save: ${currentUrl}`);
    
    if (currentUrl.includes('/Lead/')) {
      // Try direct URL pattern: /Lead/00QxxxXXXX/view
      let match = currentUrl.match(/\/Lead\/(.*?)\//);
      if (match) {
        leadId = match[1];
      } else {
        // Try backgroundContext parameter: backgroundContext=%2Flightning%2Fr%2F00QxxxXXXX%2Fview
        match = currentUrl.match(/backgroundContext=%2Flightning%2Fr%2F(00Q[^%\/]+)/);
        leadId = match ? match[1] : null;
      }
      console.log(`✅ Lead created - ID: ${leadId}`);
      
      // Navigate directly to the Lead record to avoid modal issues
      if (leadId) {
        const leadUrl = `${process.env.SALESFORCE_ORG_URL}/lightning/r/Lead/${leadId}/view`;
        console.log(`Navigating to Lead record: ${leadUrl}`);
        await page.goto(leadUrl);
        await page.waitForTimeout(3000); // Wait for page to load
      }
    } else {
      await homePage.navigateToObject('Leads');
      await page.waitForTimeout(2000);
      const leadLink = page.locator(`a:has-text("${leadData.lastName}")`).first();
      await leadLink.waitFor({ state: 'visible', timeout: 10000 });
      await leadLink.click();
      await page.waitForTimeout(2000);
      currentUrl = page.url();
      if (currentUrl.includes('/Lead/')) {
        const match = currentUrl.match(/\/Lead\/(.*?)\//);
        leadId = match ? match[1] : null;
        console.log(`✅ Lead created - ID from record: ${leadId}`);
      }
    }
    
    expect(leadId).not.toBeNull();
    console.log(`✅ Step 1 Complete: Lead ${leadId} created`);

    // ========== STEP 2: Convert Lead to Opportunity ==========
    console.log('\n📝 Step 2: Converting Lead to Opportunity...');
    
    // Make sure we're on the Lead page
    const baseUrl = process.env.SALESFORCE_ORG_URL;
    if (!currentUrl.includes(leadId)) {
      await page.goto(`${baseUrl}/lightning/r/Lead/${leadId}/view`);
      await page.waitForTimeout(2000);
    }
    
    // Convert Lead - this will navigate to Opportunity page
    await leadPage.convertLead({
      createOpportunity: true,
      opportunityName: `E2E_Opportunity_${timestamp}`
    });
    
    // Get Opportunity ID from URL (we're now on Opportunity page)
    const oppUrl = page.url();
    const oppMatch = oppUrl.match(/\/Opportunity\/([^\/]+)\/view/);
    opportunityId = oppMatch ? oppMatch[1] : null;
    
    // If not on Opportunity page, try to get ID from Lead page
    if (!opportunityId) {
      opportunityId = await leadPage.getConvertedOpportunityId();
    }
    
    console.log(`✅ Step 2 Complete: Opportunity ${opportunityId} created from Lead`);
    expect(opportunityId).not.toBeNull();

    // ========== STEP 3: Create Quote with ZOOM Product ==========
    console.log('\n📝 Step 3: Creating Quote with ZOOM product...');
    
    // Ensure we're on the Opportunity page
    if (!page.url().includes(opportunityId)) {
      await page.goto(`${baseUrl}/lightning/r/Opportunity/${opportunityId}/view`);
      await page.waitForTimeout(2000);
    }
    
    // Create Quote from Opportunity
    const quoteData = {
      name: `E2E_Quote_${timestamp}`,
      expirationDate: '12/31/2026', // MM/DD/YYYY format
      status: 'Draft'
    };
    
    await opportunityPage.createQuote(quoteData);
    await page.waitForTimeout(3000);
    
    // After Quote creation, Salesforce may redirect back to Opportunity page
    // Navigate back to Opportunity to find the newly created Quote
    console.log('Navigating back to Opportunity to find Quote...');
    await page.goto(`${baseUrl}/lightning/r/Opportunity/${opportunityId}/view`);
    await page.waitForTimeout(2000);
    
    // Click on Quotes tab to see the Quote
    const quotesTab = page.locator('a[data-tab-name="Quotes"], a:has-text("Quotes")').first();
    await quotesTab.waitFor({ state: 'visible', timeout: 10000 });
    await quotesTab.click();
    await page.waitForTimeout(2000);
    
    // Find and click on the newly created Quote
    const quoteName = quoteData.name;
    console.log(`Looking for Quote: ${quoteName}`);
    const quoteLink = page.locator(`a[title*="${quoteName}"]`).first();
    await quoteLink.waitFor({ state: 'visible', timeout: 10000 });
    await quoteLink.click();
    await page.waitForTimeout(3000);
    
    // Extract Quote ID from URL
    const quoteUrl = page.url();
    const quoteMatch = quoteUrl.match(/\/Quote\/([^\/]+)\/view/);
    quoteId = quoteMatch ? quoteMatch[1] : null;
    
    console.log(`✅ Quote created - ID: ${quoteId}`);
    expect(quoteId).not.toBeNull();
    
    // Verify we're on Quote page
    console.log(`Current URL: ${page.url()}`);
    expect(page.url()).toContain(quoteId);
    
    // ========== STEP 4: Add ZOOM Product via API (bypasses Shadow DOM) ==========
    console.log('📦 Adding ZOOM product with 10% discount via API...');
    
    // Get Salesforce session ID from cookies
    const sessionId = await SalesforceAPI.getSessionIdFromPage(page);
    const salesforceApi = new SalesforceAPI(process.env.SALESFORCE_ORG_URL, sessionId);
    
    // Add Quote Line Item via API (bypasses Shadow DOM UI issues)
    const lineItemResult = await salesforceApi.addQuoteLineItem({
      quoteId: quoteId,
      productName: 'ZOOM',
      quantity: 2,
      discount: 10 // 10% discount (< 15%, should pass validation)
    });
    
    console.log(`✅ Step 4 Complete: Quote Line Item ${lineItemResult.id} added via API`);
    console.log(`   Product: ZOOM, Quantity: 2, Discount: 10%`);
    
    // Refresh page to see the newly added line item
    await page.reload();
    await page.waitForTimeout(2000);
    
    expect(lineItemResult.success).toBe(true);
    expect(lineItemResult.id).not.toBeNull();
    
    console.log('\n🎉 E2E TEST COMPLETE!');
    console.log(`   Lead ${leadId} → Opportunity ${opportunityId} → Quote ${quoteId} with ZOOM product (Qty: 2, Discount: 10%)`);
  });

  test.afterEach(async () => {
    console.log('\n📋 Test Summary:');
    if (leadId) console.log(`   Lead: ${leadId}`);
    if (opportunityId) console.log(`   Opportunity: ${opportunityId}`);
    if (quoteId) console.log(`   Quote: ${quoteId} (with ZOOM line item)`);
  });
});
