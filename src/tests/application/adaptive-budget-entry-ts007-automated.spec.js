const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-007: Verify Cost Planning Sheets Load for Specific Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-007 TC-001] Verify Travel tab loads cost planning sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Travel tab
    await budgetPage.clickTravelTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.travelTab))).toBeTruthy();
    
    // Step 6: Verify cost planning sheet displays travel expense fields
    await expect(await budgetPage.isCostPlanningSheetVisible()).toBeTruthy();
    await expect(await budgetPage.isExpenseFieldsVisible()).toBeTruthy();
  });

  test('[CAP1-1 TS-007 TC-002] Verify Capital tab loads cost planning sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Capital tab
    await budgetPage.clickCapitalTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.capitalTab))).toBeTruthy();
    
    // Step 6: Verify cost planning sheet displays capital expense fields
    await expect(await budgetPage.isCostPlanningSheetVisible()).toBeTruthy();
    await expect(await budgetPage.isExpenseFieldsVisible()).toBeTruthy();
  });

  test('[CAP1-1 TS-007 TC-003] Verify Expenses tab loads cost planning sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Expenses tab
    await budgetPage.clickExpensesTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.expensesTab))).toBeTruthy();
    
    // Step 6: Verify cost planning sheet displays general expense fields
    await expect(await budgetPage.isCostPlanningSheetVisible()).toBeTruthy();
    await expect(await budgetPage.isExpenseFieldsVisible()).toBeTruthy();
  });
});