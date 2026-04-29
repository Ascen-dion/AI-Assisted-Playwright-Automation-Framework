/**
 * Test Spec: CAP1-1 TS-005 TC-001
 * Description: Verify context settings and Target Revenue sheet loads
 * @regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayBudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-005: Context Settings and Target Revenue', () => {
  test('CAP1-1 TS-005 TC-001: Verify context settings and Target Revenue sheet loads @regression', async ({ page }) => {
    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const budgetSalesPage = new WorkdayBudgetSalesPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await test.step('Launch application and login', async () => {
      await loginPage.navigateToApp(TD.appUrl);
      await loginPage.verifyLoginPageLoaded();
      await loginPage.login(TD.salesBudgetOwner.username, TD.salesBudgetOwner.password);
      await dashboardPage.verifyUserLoggedIn();
    });

    // Step 2: Navigate to Budget Entry - Sales page
    await test.step('Navigate to Budget Entry - Sales page', async () => {
      await dashboardPage.navigateToBudgetEntrySales();
      await budgetSalesPage.verifyPageLoaded();
    });

    // Step 3: Verify the department context is set
    await test.step('Verify department context is Sales', async () => {
      await budgetSalesPage.verifyDepartmentContext(TD.context.department);
    });

    // Step 4: Verify the time period context is set
    await test.step('Verify time period context is Q1', async () => {
      await budgetSalesPage.verifyTimePeriodContext(TD.context.timePeriod);
    });

    // Step 5: Verify the currency context is set
    await test.step('Verify currency context is USD', async () => {
      await budgetSalesPage.verifyCurrencyContext(TD.context.currency);
    });

    // Step 6: Verify the plan version context is set
    await test.step('Verify plan version context is Initial', async () => {
      await budgetSalesPage.verifyPlanVersionContext(TD.context.planVersion);
    });

    // Step 7: Click on the Target Revenue tab
    await test.step('Click on Target Revenue tab', async () => {
      await budgetSalesPage.clickTab('Target Revenue');
      await budgetSalesPage.verifyTabIsActive('Target Revenue');
    });

    // Step 8: Verify the Target Revenue budget input sheet loads
    await test.step('Verify Target Revenue budget input sheet loads', async () => {
      await budgetSalesPage.verifyBudgetInputSheetLoads();
    });

    // Step 9: Verify the sheet displays data for the correct department
    await test.step('Verify sheet shows data for Sales department', async () => {
      await budgetSalesPage.verifySheetDisplaysDepartmentData(TD.context.department);
    });
  });
});