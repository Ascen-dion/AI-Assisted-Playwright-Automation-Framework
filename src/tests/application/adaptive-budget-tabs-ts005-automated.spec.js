/**
 * Test Spec: CAP1-1 TS-005 - Context and Sheet Loading
 * Verify department context and budget sheet loading
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const AdaptiveBudgetHeaderPage = require('../../pages/adaptive-budget-header.page');
const TD = require('../../data/adaptive-test-data');
const logger = require('../../helpers/logger');

test.describe('CAP1-1 TS-005 - Context and Sheet Loading', () => {
  test('CAP1-1 TS-005 TC-001 - Verify context and Target Revenue sheet loading', async ({ page }) => {
    logger.info('Starting test: CAP1-1 TS-005 TC-001');

    const loginPage = new AdaptiveLoginPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);
    const budgetHeaderPage = new AdaptiveBudgetHeaderPage(page);

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
      await budgetTabsPage.verifyTabIsActive('Instructions');
      logger.info('Step 2 completed: Budget Entry - Sales page loaded with Instructions tab active');

      // Step 3: Verify the department context is set
      logger.info('Step 3: Verify department context is Sales');
      await budgetHeaderPage.verifyDepartmentContext(TD.context.department);
      logger.info('Step 3 completed: Department context verified');

      // Step 4: Verify the time period context is set
      logger.info('Step 4: Verify time period context is Q1');
      await budgetHeaderPage.verifyTimePeriodContext(TD.context.timePeriod);
      logger.info('Step 4 completed: Time period context verified');

      // Step 5: Verify the currency context is set
      logger.info('Step 5: Verify currency context is USD');
      await budgetHeaderPage.verifyCurrencyContext(TD.context.currency);
      logger.info('Step 5 completed: Currency context verified');

      // Step 6: Verify the plan version context is set
      logger.info('Step 6: Verify plan version context is Initial');
      await budgetHeaderPage.verifyPlanVersionContext(TD.context.planVersion);
      logger.info('Step 6 completed: Plan version context verified');

      // Step 7: Click on the Target Revenue tab
      logger.info('Step 7: Click Target Revenue tab');
      await budgetTabsPage.clickTab('Target Revenue');
      await budgetTabsPage.verifyTabIsActive('Target Revenue');
      logger.info('Step 7 completed: Target Revenue tab is active and highlighted');

      // Step 8: Verify the Target Revenue budget input sheet loads
      logger.info('Step 8: Verify Target Revenue budget input sheet loads');
      await budgetTabsPage.verifyTabContentDisplayed();
      logger.info('Step 8 completed: Target Revenue budget input sheet displayed');

      // Step 9: Verify the sheet displays data for the correct department
      logger.info('Step 9: Verify sheet shows data for Sales department');
      await budgetHeaderPage.verifyDepartmentContext(TD.context.department);
      logger.info('Step 9 completed: Sheet verified for correct department');

      logger.info('Test CAP1-1 TS-005 TC-001 completed successfully');
    } catch (error) {
      logger.error(`Test CAP1-1 TS-005 TC-001 failed: ${error.message}`);
      throw error;
    }
  });
});