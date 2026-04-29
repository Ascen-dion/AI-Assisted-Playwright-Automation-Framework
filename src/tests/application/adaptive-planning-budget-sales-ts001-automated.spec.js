/**
 * Test Spec: CAP1-1 TS-001 TC-001
 * Verify default tab selection on Budget Entry - Sales page
 * 
 * Test Scenario: TS-001
 * Acceptance Criteria: AC-001
 */

const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetSalesPage = require('../../pages/adaptive-planning-budget-sales.page');
const TD = require('../../data/adaptive-planning-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-001: Default Tab Selection', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new AdaptivePlanningBudgetSalesPage(page);
    logger.info('Test setup completed');
  });

  test('CAP1-1 TS-001 TC-001: Verify Instructions tab is selected by default @smoke @regression', async ({ page }) => {
    try {
      logger.info('Starting test: CAP1-1 TS-001 TC-001');

      // Step 1: Launch the application in a browser
      logger.info('Step 1: Launch the application');
      await budgetSalesPage.navigateToApplication(TD.urls.login);
      await expect(page).toHaveURL(/adaptiveplanning.com/, { timeout: TD.timeouts.pageLoad });
      logger.info('Step 1 completed: Application login page loaded successfully');

      // Step 2: Enter valid Sales Budget Owner credentials
      logger.info('Step 2: Enter valid credentials');
      await budgetSalesPage.login(
        TD.users.salesBudgetOwner.username,
        TD.users.salesBudgetOwner.password
      );
      logger.info('Step 2 completed: Credentials entered');

      // Step 3: Click on Login button (handled in login method)
      logger.info('Step 3: Login completed');
      await page.waitForLoadState('domcontentloaded', { timeout: TD.timeouts.pageLoad });
      logger.info('Step 3 completed: User logged in and dashboard loaded');

      // Step 4: Navigate to Budget Entry - Sales page
      logger.info('Step 4: Navigate to Budget Entry - Sales page');
      await budgetSalesPage.navigateToBudgetEntrySales();
      logger.info('Step 4 completed: Budget Entry - Sales page loaded successfully');

      // Step 5: Verify the default selected tab
      logger.info('Step 5: Verify default selected tab');
      const isInstructionsActive = await budgetSalesPage.verifyDefaultTab();
      expect(isInstructionsActive).toBeTruthy();
      
      // Additional assertion to verify only one tab is active
      const activeTabCount = await budgetSalesPage.countActiveTabs();
      expect(activeTabCount).toBe(1);
      logger.info('Step 5 completed: Instructions tab is highlighted as active by default');

      // Step 6: Verify the content displayed
      logger.info('Step 6: Verify instructions content is displayed');
      const isContentVisible = await budgetSalesPage.verifyInstructionsContent();
      expect(isContentVisible).toBeTruthy();
      logger.info('Step 6 completed: Instructions section content is displayed');

      logger.info('Test CAP1-1 TS-001 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-001 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});