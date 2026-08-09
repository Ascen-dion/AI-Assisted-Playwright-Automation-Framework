/**
 * Salesforce Test Helpers
 * 
 * Common utility functions for Salesforce tests using hybrid UI+API approach
 */

const SalesforceAPI = require('../integrations/salesforce-api');

/**
 * Add Quote Line Item via API (bypasses Shadow DOM)
 * This is a test helper that wraps the API call for easier use in tests
 * 
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} quoteId - Quote ID
 * @param {object} lineItemData - Line item data
 * @param {string} lineItemData.product - Product name
 * @param {number} lineItemData.quantity - Quantity
 * @param {number} lineItemData.discount - Discount percentage
 * @param {string} [lineItemData.justification] - Justification (not used by API, for validation only)
 * @returns {Promise<{id: string, success: boolean}>}
 */
async function addQuoteLineItemViaAPI(page, quoteId, lineItemData) {
  console.log(`📦 Adding Quote Line Item via API (bypassing Shadow DOM)...`);
  console.log(`   Product: ${lineItemData.product}, Quantity: ${lineItemData.quantity}, Discount: ${lineItemData.discount}%`);
  
  // Get Salesforce session ID from cookies
  const sessionId = await SalesforceAPI.getSessionIdFromPage(page);
  const salesforceApi = new SalesforceAPI(process.env.SALESFORCE_ORG_URL, sessionId);
  
  // Add Quote Line Item via API
  const result = await salesforceApi.addQuoteLineItem({
    quoteId: quoteId,
    productName: lineItemData.product,
    quantity: lineItemData.quantity,
    discount: lineItemData.discount
  });
  
  console.log(`✅ Quote Line Item ${result.id} added successfully via API`);
  
  // Refresh page to see changes
  await page.reload();
  await page.waitForTimeout(1000);
  
  return result;
}

/**
 * Extract Quote ID from current URL
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {Promise<string|null>} Quote ID or null
 */
async function getQuoteIdFromUrl(page) {
  const currentUrl = page.url();
  const match = currentUrl.match(/\/Quote\/([^\/]+)\/view/);
  return match ? match[1] : null;
}

/**
 * Extract Opportunity ID from current URL
 * @param {import('@playwright/test').Page} page - Playwright page
 * @returns {Promise<string|null>} Opportunity ID or null
 */
async function getOpportunityIdFromUrl(page) {
  const currentUrl = page.url();
  const match = currentUrl.match(/\/Opportunity\/([^\/]+)\/view/);
  return match ? match[1] : null;
}

/**
 * Navigate to Quote page
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {string} quoteId - Quote ID
 */
async function navigateToQuote(page, quoteId) {
  const baseUrl = process.env.SALESFORCE_ORG_URL;
  await page.goto(`${baseUrl}/lightning/r/Quote/${quoteId}/view`);
  await page.waitForTimeout(2000);
}

module.exports = {
  addQuoteLineItemViaAPI,
  getQuoteIdFromUrl,
  getOpportunityIdFromUrl,
  navigateToQuote
};
