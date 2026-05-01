const { test, expect } = require('../../fixtures');
const BudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');
const loc = require('../../pages/locators/workday-budget-sales.locators');

test.describe('TS-003 TC-391: Verify Tab Highlighting on Click', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new BudgetSalesPage(page);
  });

  test('@regression @CAP1-1 TS-003 TC-391: Verify only one tab is highlighted at a time when clicking tabs', async ({ page }) => {
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

      // Step 3: Verify Instructions tab is highlighted as active
      await expect(loc.instructionsTab(page)).toBeVisible({ timeout: 15000 });
      let isInstructionsHighlighted = await budgetSalesPage.isTabHighlighted(loc.instructionsTab);
      expect(isInstructionsHighlighted).toBeTruthy();

      // Step 4: Click on Target Revenue tab
      await budgetSalesPage.clickTab(loc.targetRevenueTab);
      await expect(loc.targetRevenueTab(page)).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
      let isTargetRevenueHighlighted = await budgetSalesPage.isTabHighlighted(loc.targetRevenueTab);
      expect(isTargetRevenueHighlighted).toBeTruthy();
      isInstructionsHighlighted = await budgetSalesPage.isTabHighlighted(loc.instructionsTab);
      expect(isInstructionsHighlighted).toBeFalsy();

      // Step 5: Click on Workforce tab
      await budgetSalesPage.clickTab(loc.workforceTab);
      await expect(loc.workforceTab(page)).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
      let isWorkforceHighlighted = await budgetSalesPage.isTabHighlighted(loc.workforceTab);
      expect(isWorkforceHighlighted).toBeTruthy();
      isTargetRevenueHighlighted = await budgetSalesPage.isTabHighlighted(loc.targetRevenueTab);
      expect(isTargetRevenueHighlighted).toBeFalsy();

      // Step 6: Click on Pipeline tab
      await budgetSalesPage.clickTab(loc.pipelineTab);
      await expect(loc.pipelineTab(page)).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
      let isPipelineHighlighted = await budgetSalesPage.isTabHighlighted(loc.pipelineTab);
      expect(isPipelineHighlighted).toBeTruthy();
      isWorkforceHighlighted = await budgetSalesPage.isTabHighlighted(loc.workforceTab);
      expect(isWorkforceHighlighted).toBeFalsy();

      // Step 7: Click on Review tab
      await budgetSalesPage.clickTab(loc.reviewTab);
      await expect(loc.reviewTab(page)).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
      let isReviewHighlighted = await budgetSalesPage.isTabHighlighted(loc.reviewTab);
      expect(isReviewHighlighted).toBeTruthy();
      isPipelineHighlighted = await budgetSalesPage.isTabHighlighted(loc.pipelineTab);
      expect(isPipelineHighlighted).toBeFalsy();

      // Step 8: Verify only one tab is highlighted at any given time
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
        loc.variancesTab
      ];

      let highlightedCount = 0;
      for (const tabLocator of allTabLocators) {
        const isHighlighted = await budgetSalesPage.isTabHighlighted(tabLocator);
        if (isHighlighted) highlightedCount++;
      }
      
      // Only Review tab should be highlighted
      isReviewHighlighted = await budgetSalesPage.isTabHighlighted(loc.reviewTab);
      expect(isReviewHighlighted).toBeTruthy();
      expect(highlightedCount).toBe(0); // None of the other tabs should be highlighted

    } catch (error) {
      throw new Error(`Test failed at verification: ${error.message}`);
    }
  });
});