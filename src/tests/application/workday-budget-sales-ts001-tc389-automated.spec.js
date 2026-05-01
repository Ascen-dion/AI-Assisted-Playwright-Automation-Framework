const { test, expect } = require('../../fixtures');
const BudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');
const loc = require('../../pages/locators/workday-budget-sales.locators');

test.describe('TS-001 TC-389: Verify Instructions Tab Default Selection', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new BudgetSalesPage(page);
  });

  test('@regression @CAP1-1 TS-001 TC-389: Verify Instructions tab is highlighted by default and displays content', async ({ page }) => {
    try {
      // Step 1: Launch the application in a browser
      await budgetSalesPage.goto();
      await expect(page).toHaveURL(/adaptiveplanning\.com/, { timeout: 15000 });

      // Step 2: Enter valid Sales Budget Owner credentials
      const username = process.env.ADAPTIVE_USERNAME;
      const password = process.env.ADAPTIVE_PASSWORD;
      await budgetSalesPage.login(username, password);

      // Step 3: Click on Login button - User is logged in and dashboard/home page loads
      await expect(page).toHaveURL(/app/, { timeout: 60000 });

      // Step 4: Navigate to Budget Entry - Sales page
      await budgetSalesPage.navigateToBudgetEntrySales();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });

      // Step 5: Verify the default selected tab
      await expect(loc.instructionsTab(page)).toBeVisible({ timeout: 15000 });
      const isInstructionsHighlighted = await budgetSalesPage.isTabHighlighted(loc.instructionsTab);
      expect(isInstructionsHighlighted).toBeTruthy();

      const activeTabName = await budgetSalesPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.DEFAULT_ACTIVE_TAB);

      // Step 6: Verify the content displayed
      const isContentVisible = await budgetSalesPage.isInstructionsContentVisible();
      expect(isContentVisible).toBeTruthy();
      await expect(loc.instructionsContent(page)).toBeVisible({ timeout: 15000 });

    } catch (error) {
      throw new Error(`Test failed at verification: ${error.message}`);
    }
  });
});