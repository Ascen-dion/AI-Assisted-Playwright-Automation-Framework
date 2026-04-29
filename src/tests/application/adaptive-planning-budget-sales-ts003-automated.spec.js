/**
 * Test Spec: CAP1-1 TS-003 TC-001
 * Verify tab highlighting behavior when switching between tabs
 * 
 * Test Scenario: TS-003
 * Acceptance Criteria: AC-003
 */

const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetSalesPage = require('../../pages/adaptive-planning-budget-sales.page');
const TD = require('../../data/adaptive-planning-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-003: Tab Highlighting Behavior', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new AdaptivePlanningBudgetSalesPage(page);
    logger.info('Test setup completed');
  });

  test('CAP1-1 TS-003 TC-001: Verify only one tab is highlighted at a time @regression', async ({ page }) => {
    try {
      logger.info('Starting test: CAP1-1 TS-003 TC-001');

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
      logger.info('Step 2 completed: Budget Entry - Sales page loads with Instructions tab active');

      // Step 3: Verify Instructions tab is highlighted as active
      logger.info('Step 3: Verify Instructions tab is highlighted');
      let isActive = await budgetSalesPage.isTabActive('Instructions');
      expect(isActive).toBeTruthy();
      let activeCount = await budgetSalesPage.countActiveTabs();
      expect(activeCount).toBe(1);
      logger.info('Step 3 completed: Instructions tab is visually highlighted and only this tab is highlighted');

      // Step 4: Click on Target Revenue tab
      logger.info('Step 4: Click on Target Revenue tab');
      await budgetSalesPage.clickTab('Target Revenue');
      
      isActive = await budgetSalesPage.isTabActive('Target Revenue');
      expect(isActive).toBeTruthy();
      
      const instructionsNotActive = !(await budgetSalesPage.isTabActive('Instructions'));
      expect(instructionsNotActive).toBeTruthy();
      
      activeCount = await budgetSalesPage.countActiveTabs();
      expect(activeCount).toBe(1);
      logger.info('Step 4 completed: Target Revenue tab is highlighted, Instructions tab is not');

      // Step 5: Click on Workforce tab
      logger.info('Step 5: Click on Workforce tab');
      await budgetSalesPage.clickTab('Workforce');
      
      isActive = await budgetSalesPage.isTabActive('Workforce');
      expect(isActive).toBeTruthy();
      
      const targetRevenueNotActive = !(await budgetSalesPage.isTabActive('Target Revenue'));
      expect(targetRevenueNotActive).toBeTruthy();
      
      activeCount = await budgetSalesPage.countActiveTabs();
      expect(activeCount).toBe(1);
      logger.info('Step 5 completed: Workforce tab is highlighted, Target Revenue tab is not');

      // Step 6: Click on Pipeline tab
      logger.info('Step 6: Click on Pipeline tab');
      await budgetSalesPage.clickTab('Pipeline');
      
      isActive = await budgetSalesPage.isTabActive('Pipeline');
      expect(isActive).toBeTruthy();
      
      const workforceNotActive = !(await budgetSalesPage.isTabActive('Workforce'));
      expect(workforceNotActive).toBeTruthy();
      
      activeCount = await budgetSalesPage.countActiveTabs();
      expect(activeCount).toBe(1);
      logger.info('Step 6 completed: Pipeline tab is highlighted, Workforce tab is not');

      // Step 7: Click on Review tab
      logger.info('Step 7: Click on Review tab');
      await budgetSalesPage.clickTab('Review');
      
      isActive = await budgetSalesPage.isTabActive('Review');
      expect(isActive).toBeTruthy();
      
      const pipelineNotActive = !(await budgetSalesPage.isTabActive('Pipeline'));
      expect(pipelineNotActive).toBeTruthy();
      
      activeCount = await budgetSalesPage.countActiveTabs();
      expect(activeCount).toBe(1);
      logger.info('Step 7 completed: Review tab is highlighted, Pipeline tab is not');

      // Step 8: Verify only one tab is highlighted at any given time
      logger.info('Step 8: Final verification of single tab highlight');
      activeCount = await budgetSalesPage.countActiveTabs();
      expect(activeCount).toBe(1);
      
      isActive = await budgetSalesPage.isTabActive('Review');
      expect(isActive).toBeTruthy();
      logger.info('Step 8 completed: Only Review tab is highlighted, all other tabs are not highlighted');

      logger.info('Test CAP1-1 TS-003 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-003 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});