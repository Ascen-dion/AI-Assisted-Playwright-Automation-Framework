const { test, expect } = require('../../fixtures');
const BudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');
const loc = require('../../pages/locators/workday-budget-sales.locators');

test.describe('TS-005 TC-393: Verify Context and Target Revenue Tab', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new BudgetSalesPage(page);
  });

  test('@regression @CAP1-1 TS-005 TC-393: Verify department context and Target Revenue budget sheet loads correctly', async ({ page }) => {
    try {
      // Step 1: Launch the application and login as Sales Budget Owner
      await budgetSalesPage.goto();
      const username = process.env.ADAPTIVE_USERNAME;
      const password = process.env.ADAPTIVE_PASSWORD;
      await budgetSalesPage.login(username, password);
      await expect(page).toHaveURL(/app/, { timeout: 60000 });

      // Step 2: Navigate to Budget Entry - Sales page
      await budgetSalesPage.navigateToBudgetEntrySales();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      await expect(loc.instructionsTab(page)).toBeVisible({ timeout: 15000 });

      // Step 3: Verify the department context is set
      await expect(loc.departmentContext(page)).toBeVisible({ timeout: 15000 });
      const department = await budgetSalesPage.getDepartmentContext();
      expect(department).toContain(TD.EXPECTED_DEPARTMENT);

      // Step 4: Verify the time period context is set
      await expect(loc.timePeriodContext(page)).toBeVisible({ timeout: 15000 });
      const timePeriod = await budgetSalesPage.getTimePeriodContext();
      expect(timePeriod).toContain(TD.EXPECTED_TIME_PERIOD);

      // Step 5: Verify the currency context is set
      await expect(loc.currencyContext(page)).toBeVisible({ timeout: 15000 });
      const currency = await budgetSalesPage.getCurrencyContext();
      expect(currency).toContain(TD.EXPECTED_CURRENCY);

      // Step 6: Verify the plan version context is set
      await expect(loc.planVersionContext(page)).toBeVisible({ timeout: 15000 });
      const planVersion = await budgetSalesPage.getPlanVersionContext();
      expect(planVersion).toContain(TD.EXPECTED_PLAN_VERSION);

      // Step 7: Click on the Target Revenue tab
      await budgetSalesPage.clickTab(loc.targetRevenueTab);
      await expect(loc.targetRevenueTab(page)).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
      const isTargetRevenueHighlighted = await budgetSalesPage.isTabHighlighted(loc.targetRevenueTab);
      expect(isTargetRevenueHighlighted).toBeTruthy();

      // Step 8: Verify the Target Revenue budget input sheet loads
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      const isBudgetSheetVisible = await budgetSalesPage.isBudgetInputSheetVisible();
      expect(isBudgetSheetVisible).toBeTruthy();
      await expect(loc.budgetInputSheet(page)).toBeVisible({ timeout: 15000 });

      // Step 9: Verify the sheet displays data for the correct department
      const departmentInSheet = await budgetSalesPage.getDepartmentContext();
      expect(departmentInSheet).toContain(TD.EXPECTED_DEPARTMENT);

    } catch (error) {
      throw new Error(`Test failed at verification: ${error.message}`);
    }
  });
});