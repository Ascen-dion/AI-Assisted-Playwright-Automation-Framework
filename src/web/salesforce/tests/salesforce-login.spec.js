/**
 * Salesforce Login Smoke Test
 * 
 * This spec validates the Salesforce login functionality.
 * 
 * Prerequisites:
 * - Set SALESFORCE_USERNAME and SALESFORCE_PASSWORD environment variables
 * - Or use saved storageState for authenticated tests
 */

const { test, expect } = require('../../../shared/fixtures');
const TD = require('../../../shared/data/salesforce-test-data');
const SalesforceLoginPage = require('../pages/salesforce-login.page');
const SalesforceHomePage = require('../pages/salesforce-home.page');

test.describe('Salesforce Login Tests', () => {
  let loginPage;
  let homePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new SalesforceLoginPage(page);
    homePage = new SalesforceHomePage(page);
  });

  test('[C00001] Should successfully log in with valid credentials', async ({ page }) => {
    // Get credentials from environment variables
    const username = process.env.SALESFORCE_USERNAME || 'your-username@example.com';
    const password = process.env.SALESFORCE_PASSWORD || 'your-password';

    // Navigate to login page
    await loginPage.navigateTo(TD.urls.login);
    await loginPage.verifyLoginPage();

    // Perform login
    await loginPage.login(username, password);

    // Verify home page loads successfully
    await expect(page).toHaveURL(TD.urlPatterns.home, { timeout: 30000 });
    await homePage.verifyHomePage();
  });

  test('[C00002] Should display error message with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await loginPage.navigateTo(TD.urls.login);
    await loginPage.verifyLoginPage();

    // Attempt login with invalid credentials
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Verify error message is displayed
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBe(true);
  });
});
