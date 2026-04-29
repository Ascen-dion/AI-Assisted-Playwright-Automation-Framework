/**
 * Test Spec: CAP1-1 TS-002 TC-001
 * Verify presence and order of all tabs on Budget Entry - Sales page
 * 
 * Test Scenario: TS-002
 * Acceptance Criteria: AC-002
 */

const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetSalesPage = require('../../pages/adaptive-planning-budget-sales.page');
const TD = require('../../data/adaptive-planning-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-002: Tab Presence and Order', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new AdaptivePlanningBudgetSalesPage(page);
    logger.info('Test setup completed');
  });

  test('CAP1-1 TS-002 TC-001: Verify all 12 tabs are present in correct order @smoke @regression', async ({ page }) => {
    try {
      logger.info('Starting test: CAP1-1 TS-002 TC-001');

      // Step 1: Launch the application in a browser
      logger.info('Step 1: Launch the application');
      await budgetSalesPage.navigateToApplication(TD.urls.login);
      await expect(page).toHaveURL(/adaptiveplanning.com/, { timeout: TD.timeouts.pageLoad });
      logger.info('Step 1 completed: Application login page loaded successfully');

      // Step 2: Enter valid Sales Budget Owner credentials and login
      logger.info('Step 2: Enter credentials and login');
      await budgetSalesPage.login(
        TD.users.salesBudgetOwner.username,
        TD.users.salesBudgetOwner.password
      );
      await page.waitForLoadState('domcontentloaded', { timeout: TD.timeouts.pageLoad });
      logger.info('Step 2 completed: User logged in successfully');

      // Step 3: Navigate to Budget Entry - Sales page
      logger.info('Step 3: Navigate to Budget Entry - Sales page');
      await budgetSalesPage.navigateToBudgetEntrySales();
      logger.info('Step 3 completed: Budget Entry - Sales page loaded successfully');

      // Step 4: Verify the presence and order of all tabs
      logger.info('Step 4: Verify presence and order of all tabs');
      const actualTabs = await budgetSalesPage.getAllTabs();
      
      // Verify count
      expect(actualTabs.length).toBe(TD.tabs.expectedOrder.length);
      logger.info(`Found ${actualTabs.length} tabs as expected`);
      
      // Verify order
      const orderMatches = await budgetSalesPage.verifyTabOrder(TD.tabs.expectedOrder);
      expect(orderMatches).toBeTruthy();
      logger.info('Step 4 completed: All 12 tabs are visible in correct order');

      // Step 5: Verify each tab label matches the expected name
      logger.info('Step 5: Verify each tab label');
      for (let i = 0; i < TD.tabs.expectedOrder.length; i++) {
        const expectedTab = TD.tabs.expectedOrder[i];
        const actualTab = actualTabs[i].trim();
        expect(actualTab).toBe(expectedTab);
        logger.info(`Tab ${i + 1} verified: ${actualTab}`);
      }
      logger.info('Step 5 completed: Each tab is labeled correctly');

      logger.info('Test CAP1-1 TS-002 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-002 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});