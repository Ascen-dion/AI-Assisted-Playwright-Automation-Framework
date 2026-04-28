/**
 * Test Spec: CAP1-1 TS-001 - Default Tab Selection
 * Verify Instructions tab is selected by default on Budget Entry - Sales page
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-001 - Default Tab Selection', () => {
  test('CAP1-1 TS-001 TC-001 - Verify Instructions tab is selected by default', async ({ page }) => {
    logger.info('Starting test: CAP1-1 TS-001 TC-001');

    const loginPage = new AdaptiveLoginPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    try {
      // Step 1: Launch the application in a browser
      logger.info('Step 1: Launch the application');
      await loginPage.navigate(TD.urls.login);
      await loginPage.verifyLoginPageLoaded();
      await expect(page).toHaveURL(new RegExp(TD.urls.login));
      logger.info('Step 1 completed: Application login page loaded successfully');

      // Step 2: Enter valid Sales Budget Owner credentials
      logger.info('Step 2: Enter credentials');
      await loginPage.enterUsername(TD.credentials.salesBudgetOwner.username);
      await loginPage.enterPassword(TD.credentials.salesBudgetOwner.password);
      logger.info('Step 2 completed: Credentials entered');

      // Step 3: Click on Login button
      logger.info('Step 3: Click Login button');
      await loginPage.clickSignIn();
      await dashboardPage.waitForDashboard();
      await dashboardPage.verifyDashboardLoaded();
      logger.info('Step 3 completed: User logged in and dashboard loaded');

      // Step 4: Navigate to Budget Entry - Sales page
      logger.info('Step 4: Navigate to Budget Entry - Sales page');
      await navigationPage.navigateToBudgetEntrySales();
      logger.info('Step 4 completed: Budget Entry - Sales page loaded');

      // Step 5: Verify the default selected tab
      logger.info('Step 5: Verify Instructions tab is active by default');
      await budgetTabsPage.verifyTabIsActive(TD.tabs.defaultTab);
      const activeTabText = await budgetTabsPage.getActiveTabText();
      await expect(activeTabText).toBe(TD.tabs.defaultTab);
      logger.info('Step 5 completed: Instructions tab verified as active');

      // Step 6: Verify the content displayed
      logger.info('Step 6: Verify Instructions content is displayed');
      await budgetTabsPage.verifyTabContentDisplayed();
      logger.info('Step 6 completed: Instructions content verified');

      logger.info('Test CAP1-1 TS-001 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-001 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});