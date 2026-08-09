/**
 * Quick test to validate Stage combobox selector
 */

const { test } = require('@playwright/test');
const SalesforceLoginPage = require('../pages/salesforce-login.page');
const SalesforceHomePage = require('../pages/salesforce-home.page');
const SalesforceOpportunityPage = require('../pages/salesforce-opportunity.page');

test.describe('Test Opportunity Stage Selector', () => {
  test('Should be able to select Stage field', async ({ page }) => {
    const loginPage = new SalesforceLoginPage(page);
    const homePage = new SalesforceHomePage(page);
    const opportunityPage = new SalesforceOpportunityPage(page);

    const baseUrl = process.env.SALESFORCE_ORG_URL;
    
    // Login
    await loginPage.navigateTo(`${baseUrl}/login`);
    await loginPage.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD
    );
    await homePage.verifyHomePage();

    // Navigate to Opportunities
    await homePage.navigateToObject('Opportunities');
    
    // Click New
    await opportunityPage.clickNew();
    
    // Try to fill Opportunity form with Stage
    const timestamp = Date.now();
    await opportunityPage.fillOpportunityForm({
      name: `Test Opp ${timestamp}`,
      amount: '50000',
      closeDate: '2026-12-31',
      stage: 'Discovery'
    });
    
    console.log('✅ Stage field found and selected successfully!');
  });
});
