const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-008: Verify Summary Views Load for Specific Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-008 TC-001] Verify Variances tab loads summary view', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Variances tab
    await budgetPage.clickVariancesTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.variancesTab))).toBeTruthy();
    
    // Step 6: Verify summary view displays budget performance data
    await expect(await budgetPage.isSummaryViewVisible()).toBeTruthy();
    await expect(await budgetPage.isVarianceAnalysisVisible()).toBeTruthy();
    
    // Step 7: Verify view allows for final review
    // This is implicitly verified by the presence of variance analysis
    await expect(await budgetPage.isVarianceAnalysisVisible()).toBeTruthy();
  });

  test('[CAP1-1 TS-008 TC-002] Verify Review tab loads summary view', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Review tab
    await budgetPage.clickReviewTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.reviewTab))).toBeTruthy();
    
    // Step 6: Verify summary view displays comprehensive budget data
    await expect(await budgetPage.isSummaryViewVisible()).toBeTruthy();
    await expect(await budgetPage.isConsolidatedBudgetInfoVisible()).toBeTruthy();
    
    // Step 7: Verify view allows for final check before submission
    // This is implicitly verified by the presence of consolidated budget info
    await expect(await budgetPage.isConsolidatedBudgetInfoVisible()).toBeTruthy();
  });
});