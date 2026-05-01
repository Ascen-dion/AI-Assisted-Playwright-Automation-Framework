const { test, expect } = require('../../fixtures');
const BudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');
const loc = require('../../pages/locators/workday-budget-sales.locators');

test.describe('TS-002 TC-390: Verify All 12 Tabs Presence and Order', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new BudgetSalesPage(page);
  });

  test('@regression @CAP1-1 TS-002 TC-390: Verify all 12 tabs are visible in correct order', async ({ page }) => {
    try {
      // Step 1: Launch the application in a browser
      await budgetSalesPage.goto();
      await expect(page).toHaveURL(/adaptiveplanning\.com/, { timeout: 15000 });

      // Step 2: Enter valid Sales Budget Owner credentials and login
      const username = process.env.ADAPTIVE_USERNAME;
      const password = process.env.ADAPTIVE_PASSWORD;
      await budgetSalesPage.login(username, password);
      await expect(page).toHaveURL(/app/, { timeout: 60000 });

      // Step 3: Navigate to Budget Entry - Sales page
      await budgetSalesPage.navigateToBudgetEntrySales();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });

      // Step 4 & 5: Verify the presence and order of all tabs
      const allTabLocators = [
        loc.instructionsTab,
        loc.targetRevenueTab,
        loc.targetExpenseTab,
        loc.workforceTab,
        loc.productRevenueTab,
        loc.sensitivityAnalysisTab,
        loc.pipelineTab,
        loc.travelTab,
        loc.capitalTab,
        loc.expensesTab,
        loc.variancesTab,
        loc.reviewTab
      ];

      // Verify all tabs are visible
      for (const tabLocator of allTabLocators) {
        await expect(tabLocator(page)).toBeVisible({ timeout: 15000 });
      }

      // Get all tab names and verify order
      const actualTabNames = await budgetSalesPage.getAllTabNames();
      expect(actualTabNames.length).toBe(12);

      // Verify each tab label matches expected name
      for (let i = 0; i < TD.EXPECTED_TAB_ORDER.length; i++) {
        expect(actualTabNames[i]).toBe(TD.EXPECTED_TAB_ORDER[i]);
      }

    } catch (error) {
      throw new Error(`Test failed at verification: ${error.message}`);
    }
  });
});