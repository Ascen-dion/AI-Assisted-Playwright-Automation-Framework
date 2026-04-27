const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-005: Verify Budget Input Sheets Load for Specific Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-005 TC-001] Verify Target Revenue tab loads budget input sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Target Revenue tab
    await budgetPage.clickTargetRevenueTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.targetRevenueTab))).toBeTruthy();
    
    // Step 6: Verify budget input sheet displays correct context
    await expect(await budgetPage.isBudgetInputSheetVisible()).toBeTruthy();
    const department = await budgetPage.getDepartmentContext();
    await expect(department).toContain(TD.defaultContext.department);
  });

  test('[CAP1-1 TS-005 TC-002] Verify Target Expense tab loads budget input sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Target Expense tab
    await budgetPage.clickTargetExpenseTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.targetExpenseTab))).toBeTruthy();
    
    // Step 6: Verify budget input sheet displays correct context
    await expect(await budgetPage.isBudgetInputSheetVisible()).toBeTruthy();
    const department = await budgetPage.getDepartmentContext();
    await expect(department).toContain(TD.defaultContext.department);
  });

  test('[CAP1-1 TS-005 TC-003] Verify Workforce tab loads budget input sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Workforce tab
    await budgetPage.clickWorkforceTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.workforceTab))).toBeTruthy();
    
    // Step 6: Verify budget input sheet displays correct context
    await expect(await budgetPage.isBudgetInputSheetVisible()).toBeTruthy();
    const department = await budgetPage.getDepartmentContext();
    await expect(department).toContain(TD.defaultContext.department);
  });

  test('[CAP1-1 TS-005 TC-004] Verify Product Revenue tab loads budget input sheet', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Product Revenue tab
    await budgetPage.clickProductRevenueTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.productRevenueTab))).toBeTruthy();
    
    // Step 6: Verify budget input sheet displays correct context
    await expect(await budgetPage.isBudgetInputSheetVisible()).toBeTruthy();
    const department = await budgetPage.getDepartmentContext();
    await expect(department).toContain(TD.defaultContext.department);
  });
});