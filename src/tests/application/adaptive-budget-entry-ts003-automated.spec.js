const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-003: Verify Tab Highlighting and Content Loading', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-003 TC-001] Verify only one tab is highlighted at a time when switching tabs', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Verify Instructions tab is highlighted
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.instructionsTab))).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 6: Click Target Revenue tab
    await budgetPage.clickTargetRevenueTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.targetRevenueTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.instructionsTab))).toBeFalsy();
    await expect(await budgetPage.isTargetRevenueContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 7: Click Target Expense tab
    await budgetPage.clickTargetExpenseTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.targetExpenseTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.targetRevenueTab))).toBeFalsy();
    await expect(await budgetPage.isTargetExpenseContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 8: Click Workforce tab
    await budgetPage.clickWorkforceTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.workforceTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.targetExpenseTab))).toBeFalsy();
    await expect(await budgetPage.isWorkforceContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 9: Click Product Revenue tab
    await budgetPage.clickProductRevenueTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.productRevenueTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.workforceTab))).toBeFalsy();
    await expect(await budgetPage.isProductRevenueContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 10: Click Sensitivity Analysis tab
    await budgetPage.clickSensitivityAnalysisTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.sensitivityAnalysisTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.productRevenueTab))).toBeFalsy();
    await expect(await budgetPage.isSensitivityAnalysisContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 11: Click Pipeline tab
    await budgetPage.clickPipelineTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.pipelineTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.sensitivityAnalysisTab))).toBeFalsy();
    await expect(await budgetPage.isPipelineContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 12: Click Travel tab
    await budgetPage.clickTravelTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.travelTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.pipelineTab))).toBeFalsy();
    await expect(await budgetPage.isTravelContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 13: Click Capital tab
    await budgetPage.clickCapitalTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.capitalTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.travelTab))).toBeFalsy();
    await expect(await budgetPage.isCapitalContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 14: Click Expenses tab
    await budgetPage.clickExpensesTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.expensesTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.capitalTab))).toBeFalsy();
    await expect(await budgetPage.isExpensesContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 15: Click Variances tab
    await budgetPage.clickVariancesTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.variancesTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.expensesTab))).toBeFalsy();
    await expect(await budgetPage.isVariancesContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 16: Click Review tab
    await budgetPage.clickReviewTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.reviewTab))).toBeTruthy();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.variancesTab))).toBeFalsy();
    await expect(await budgetPage.isReviewContentVisible()).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
    
    // Step 17: Verify only Review tab is highlighted
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.reviewTab))).toBeTruthy();
    await expect(await budgetPage.getActiveTabCount()).toBe(1);
  });
});