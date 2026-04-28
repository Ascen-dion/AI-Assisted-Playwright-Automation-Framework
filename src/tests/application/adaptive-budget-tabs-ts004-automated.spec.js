/**
 * Test Spec: CAP1-1 TS-004 - Tab Scroll Arrows
 * Verify scroll arrows functionality when tabs overflow
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-004 - Tab Scroll Arrows', () => {
  test('CAP1-1 TS-004 TC-001 - Verify scroll arrows functionality', async ({ page }) => {
    logger.info('Starting test: CAP1-1 TS-004 TC-001');

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
      logger.info('Step 2 completed: Budget Entry - Sales page loaded');

      // Step 3: Resize the browser window to restrict tab display area
      logger.info('Step 3: Resize browser window to show only 4-5 tabs');
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(1000); // Wait for resize to take effect
      logger.info('Step 3 completed: Browser window resized');

      // Step 4: Verify the presence of left and right scroll arrows
      logger.info('Step 4: Verify scroll arrows are visible');
      await budgetTabsPage.verifyScrollArrowsVisible();
      logger.info('Step 4 completed: Scroll arrows verified as visible');

      // Step 5: Verify the state of the left arrow when on the first tab
      logger.info('Step 5: Verify left arrow is disabled on first tab');
      await budgetTabsPage.verifyLeftArrowDisabled();
      logger.info('Step 5 completed: Left arrow verified as disabled');

      // Step 6: Click on the right scroll arrow
      logger.info('Step 6: Click right scroll arrow');
      await budgetTabsPage.clickScrollRight();
      await budgetTabsPage.verifyLeftArrowEnabled();
      logger.info('Step 6 completed: Scrolled right, left arrow now enabled');

      // Step 7: Click on the left scroll arrow
      logger.info('Step 7: Click left scroll arrow');
      await budgetTabsPage.clickScrollLeft();
      logger.info('Step 7 completed: Scrolled left');

      // Step 8: Continue clicking left arrow until reaching the first tab
      logger.info('Step 8: Continue scrolling left until first tab');
      let attempts = 0;
      const maxAttempts = 5;
      while (attempts < maxAttempts) {
        try {
          await budgetTabsPage.verifyLeftArrowDisabled();
          logger.info('Reached first tab - left arrow is disabled');
          break;
        } catch (error) {
          await budgetTabsPage.clickScrollLeft();
          attempts++;
        }
      }
      await budgetTabsPage.verifyLeftArrowDisabled();
      logger.info('Step 8 completed: Left arrow disabled at first tab');

      logger.info('Test CAP1-1 TS-004 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-004 TC-001 failed: ${error.message}`);
      throw error;
    } finally {
      // Restore viewport size
      await page.setViewportSize({ width: 1280, height: 720 });
    }
  });
});