/**
 * Test Spec: CAP1-1 TS-002 - Tab Presence and Order
 * Verify all 12 tabs are present in correct order
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-002 - Tab Presence and Order', () => {
  test('CAP1-1 TS-002 TC-001 - Verify all tabs are present in correct order', async ({ page }) => {
    logger.info('Starting test: CAP1-1 TS-002 TC-001');

    const loginPage = new AdaptiveLoginPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    try {
      // Step 1: Launch the application in a browser
      logger.info('Step 1: Launch the application');
      await loginPage.navigate(TD.urls.login);
      await loginPage.verifyLoginPageLoaded();
      logger.info('Step 1 completed: Application login page loaded');

      // Step 2: Enter valid Sales Budget Owner credentials and login
      logger.info('Step 2: Login with Sales Budget Owner credentials');
      await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
      await dashboardPage.waitForDashboard();
      await dashboardPage.verifyDashboardLoaded();
      logger.info('Step 2 completed: User logged in successfully');

      // Step 3: Navigate to Budget Entry - Sales page
      logger.info('Step 3: Navigate to Budget Entry - Sales page');
      await navigationPage.navigateToBudgetEntrySales();
      logger.info('Step 3 completed: Budget Entry - Sales page loaded');

      // Step 4: Verify the presence and order of all tabs
      logger.info('Step 4: Verify all 12 tabs are present in correct order');
      const tabCount = await budgetTabsPage.getTabCount();
      await expect(tabCount).toBe(12);
      logger.info(`Verified tab count: ${tabCount}`);

      // Step 5: Verify each tab label matches the expected name
      logger.info('Step 5: Verify each tab label in order');
      await budgetTabsPage.verifyTabsInOrder(TD.tabs.expectedTabsOrder);
      logger.info('Step 5 completed: All tabs verified in correct order');

      logger.info('Test CAP1-1 TS-002 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-002 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});