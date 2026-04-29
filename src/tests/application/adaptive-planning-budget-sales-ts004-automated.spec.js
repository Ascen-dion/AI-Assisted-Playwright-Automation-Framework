/**
 * Test Spec: CAP1-1 TS-004 TC-001
 * Verify tab scroll arrows functionality when browser window is resized
 * 
 * Test Scenario: TS-004
 * Acceptance Criteria: AC-004
 */

const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetSalesPage = require('../../pages/adaptive-planning-budget-sales.page');
const TD = require('../../data/adaptive-planning-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-004: Tab Scroll Arrows Functionality', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new AdaptivePlanningBudgetSalesPage(page);
    logger.info('Test setup completed');
  });

  test('CAP1-1 TS-004 TC-001: Verify scroll arrows appear and function correctly @regression', async ({ page }) => {
    try {
      logger.info('Starting test: CAP1-1 TS-004 TC-001');

      // Step 1: Launch the application and login as Sales Budget Owner
      logger.info('Step 1: Launch and login');
      await budgetSalesPage.navigateToApplication(TD.urls.login);
      await budgetSalesPage.login(
        TD.users.salesBudgetOwner.username,
        TD.users.salesBudgetOwner.password
      );
      await page.waitForLoadState('domcontentloaded', { timeout: TD.timeouts.pageLoad });
      logger.info('Step 1 completed: User logged in successfully');

      // Step 2: Navigate to Budget Entry - Sales page
      logger.info('Step 2: Navigate to Budget Entry - Sales page');
      await budgetSalesPage.navigateToBudgetEntrySales();
      logger.info('Step 2 completed: Budget Entry - Sales page loaded successfully');

      // Step 3: Resize the browser window to restrict the tab display area
      logger.info('Step 3: Resize browser window');
      await budgetSalesPage.resizeBrowserWindow(
        TD.windowSizes.restricted.width,
        TD.windowSizes.restricted.height
      );
      logger.info('Step 3 completed: Browser window resized, some tabs are hidden from view');

      // Step 4: Verify the presence of left and right scroll arrows
      logger.info('Step 4: Verify scroll arrows are present');
      const arrowsStatus = await budgetSalesPage.verifyScrollArrows();
      expect(arrowsStatus.leftVisible || arrowsStatus.rightVisible).toBeTruthy();
      logger.info('Step 4 completed: Scroll arrows are visible on the tab bar');

      // Step 5: Verify the state of the left arrow when on the first tab
      logger.info('Step 5: Verify left arrow is disabled on first tab');
      const isLeftDisabled = await budgetSalesPage.isLeftArrowDisabled();
      expect(isLeftDisabled).toBeTruthy();
      logger.info('Step 5 completed: Left arrow is greyed out/disabled on first tab');

      // Step 6: Click on the right scroll arrow
      logger.info('Step 6: Click right scroll arrow');
      await budgetSalesPage.clickRightScrollArrow();
      
      // Verify left arrow becomes enabled after scrolling right
      await page.waitForTimeout(1000); // Wait for scroll animation
      const isLeftEnabledAfterScroll = !(await budgetSalesPage.isLeftArrowDisabled());
      expect(isLeftEnabledAfterScroll).toBeTruthy();
      logger.info('Step 6 completed: Tab bar scrolled right, left arrow is now enabled');

      // Step 7: Click on the left scroll arrow
      logger.info('Step 7: Click left scroll arrow');
      await budgetSalesPage.clickLeftScrollArrow();
      await page.waitForTimeout(1000); // Wait for scroll animation
      logger.info('Step 7 completed: Tab bar scrolled left');

      // Step 8: Continue clicking left arrow until reaching the first tab
      logger.info('Step 8: Scroll back to first tab');
      let clickCount = 0;
      const maxClicks = 5; // Safety limit
      
      while (clickCount < maxClicks) {
        const isDisabled = await budgetSalesPage.isLeftArrowDisabled();
        if (isDisabled) {
          logger.info('Reached first tab, left arrow is disabled');
          break;
        }
        await budgetSalesPage.clickLeftScrollArrow();
        await page.waitForTimeout(500);
        clickCount++;
      }
      
      const finalLeftDisabled = await budgetSalesPage.isLeftArrowDisabled();
      expect(finalLeftDisabled).toBeTruthy();
      logger.info('Step 8 completed: Left arrow is greyed out/disabled at first tab');

      logger.info('Test CAP1-1 TS-004 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-004 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});