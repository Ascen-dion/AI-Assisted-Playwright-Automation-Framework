/**
 * Test Spec: CAP1-1 TS-005 TC-001
 * Verify context-specific budget input sheet loads for Target Revenue tab
 * 
 * Test Scenario: TS-005
 * Acceptance Criteria: AC-005
 */

const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetSalesPage = require('../../pages/adaptive-planning-budget-sales.page');
const TD = require('../../data/adaptive-planning-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-005: Context-Specific Budget Input Sheet', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new AdaptivePlanningBudgetSalesPage(page);
    logger.info('Test setup completed');
  });

  test('CAP1-1 TS-005 TC-001: Verify Target Revenue sheet loads with correct context @regression', async ({ page }) => {
    try {
      logger.info('Starting test: CAP1-1 TS-005 TC-001');

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

      // Step 3: Verify the department context is set
      logger.info('Step 3: Verify department context');
      const context = await budgetSalesPage.getContextValues();
      expect(context.department).toContain(TD.context.department);
      logger.info(`Step 3 completed: Department is set to ${context.department}`);

      // Step 4: Verify the time period context is set
      logger.info('Step 4: Verify time period context');
      expect(context.timePeriod).toContain(TD.context.timePeriod);
      logger.info(`Step 4 completed: Time period is set to ${context.timePeriod}`);

      // Step 5: Verify the currency context is set
      logger.info('Step 5: Verify currency context');
      expect(context.currency).toContain(TD.context.currency);
      logger.info(`Step 5 completed: Currency is set to ${context.currency}`);

      // Step 6: Verify the plan version context is set
      logger.info('Step 6: Verify plan version context');
      expect(context.planVersion).toContain(TD.context.planVersion);
      logger.info(`Step 6 completed: Plan version is set to ${context.planVersion}`);

      // Step 7: Click on the Target Revenue tab
      logger.info('Step 7: Click on Target Revenue tab');
      await budgetSalesPage.clickTab('Target Revenue');
      
      const isActive = await budgetSalesPage.isTabActive('Target Revenue');
      expect(isActive).toBeTruthy();
      logger.info('Step 7 completed: Target Revenue tab is active and highlighted');

      // Step 8: Verify the Target Revenue budget input sheet loads
      logger.info('Step 8: Verify budget input sheet loads');
      const isSheetVisible = await budgetSalesPage.verifyBudgetInputSheet();
      expect(isSheetVisible).toBeTruthy();
      logger.info('Step 8 completed: Target Revenue budget input sheet is displayed');

      // Step 9: Verify the sheet displays data for the correct department
      logger.info('Step 9: Verify sheet shows correct department data');
      // Re-verify context after tab switch
      const updatedContext = await budgetSalesPage.getContextValues();
      expect(updatedContext.department).toContain(TD.context.department);
      logger.info(`Step 9 completed: Budget input sheet shows data for ${updatedContext.department} department`);

      logger.info('Test CAP1-1 TS-005 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-005 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});