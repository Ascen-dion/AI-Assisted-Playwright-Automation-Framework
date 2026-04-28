/**
 * Test Spec: CAP1-1 TS-003 - Tab Highlighting Behavior
 * Verify only one tab is highlighted at a time when switching tabs
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-003 - Tab Highlighting Behavior', () => {
  test('CAP1-1 TS-003 TC-001 - Verify only one tab is highlighted at a time', async ({ page }) => {
    logger.info('Starting test: CAP1-1 TS-003 TC-001');

    const loginPage = new AdaptiveLoginPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    try {
      // Step 1: Launch the application and login as Sales Budget Owner
      logger.info('Step 1: Launch and login');
      await loginPage.navigate(TD.urls.login);
      await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
      await dashboardPage.waitForDashboard();
      logger.info('Step 1 completed: User logged in successfully');

      // Step 2: Navigate to Budget Entry - Sales page
      logger.info('Step 2: Navigate to Budget Entry - Sales page');
      await navigationPage.navigateToBudgetEntrySales();
      logger.info('Step 2 completed: Budget Entry - Sales page loaded with Instructions tab active');

      // Step 3: Verify Instructions tab is highlighted as active
      logger.info('Step 3: Verify Instructions tab is highlighted');
      await budgetTabsPage.verifyTabIsActive('Instructions');
      await budgetTabsPage.verifyOnlyOneTabIsActive();
      logger.info('Step 3 completed: Instructions tab verified as active');

      // Step 4: Click on Target Revenue tab
      logger.info('Step 4: Click Target Revenue tab');
      await budgetTabsPage.clickTab('Target Revenue');
      await budgetTabsPage.verifyTabIsActive('Target Revenue');
      await budgetTabsPage.verifyTabIsNotActive('Instructions');
      await budgetTabsPage.verifyOnlyOneTabIsActive();
      await budgetTabsPage.verifyTabContentDisplayed();
      logger.info('Step 4 completed: Target Revenue tab is now active');

      // Step 5: Click on Workforce tab
      logger.info('Step 5: Click Workforce tab');
      await budgetTabsPage.clickTab('Workforce');
      await budgetTabsPage.verifyTabIsActive('Workforce');
      await budgetTabsPage.verifyTabIsNotActive('Target Revenue');
      await budgetTabsPage.verifyOnlyOneTabIsActive();
      await budgetTabsPage.verifyTabContentDisplayed();
      logger.info('Step 5 completed: Workforce tab is now active');

      // Step 6: Click on Pipeline tab
      logger.info('Step 6: Click Pipeline tab');
      await budgetTabsPage.clickTab('Pipeline');
      await budgetTabsPage.verifyTabIsActive('Pipeline');
      await budgetTabsPage.verifyTabIsNotActive('Workforce');
      await budgetTabsPage.verifyOnlyOneTabIsActive();
      await budgetTabsPage.verifyTabContentDisplayed();
      logger.info('Step 6 completed: Pipeline tab is now active');

      // Step 7: Click on Review tab
      logger.info('Step 7: Click Review tab');
      await budgetTabsPage.clickTab('Review');
      await budgetTabsPage.verifyTabIsActive('Review');
      await budgetTabsPage.verifyTabIsNotActive('Pipeline');
      await budgetTabsPage.verifyOnlyOneTabIsActive();
      await budgetTabsPage.verifyTabContentDisplayed();
      logger.info('Step 7 completed: Review tab is now active');

      // Step 8: Verify only one tab is highlighted at any given time
      logger.info('Step 8: Final verification - only Review tab is highlighted');
      await budgetTabsPage.verifyTabIsActive('Review');
      await budgetTabsPage.verifyOnlyOneTabIsActive();
      logger.info('Step 8 completed: Verified only one tab is highlighted');

      logger.info('Test CAP1-1 TS-003 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-003 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});