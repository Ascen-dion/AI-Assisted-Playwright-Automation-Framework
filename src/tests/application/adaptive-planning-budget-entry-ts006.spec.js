const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-006: Verify Budget Input Sheets Load for Budget Entry Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();
  });

  test('[CAP1-1 TS-006 TC-001] Verify Target Revenue budget input sheet loads', async ({ page }) => {
    // Click Target Revenue tab
    await budgetPage.clickTargetRevenueTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_TARGET_REVENUE);

    // Verify budget input sheet is displayed
    const isSheetVisible = await budgetPage.isBudgetInputSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-006 TC-002] Verify Target Expense budget input sheet loads', async ({ page }) => {
    // Click Target Expense tab
    await budgetPage.clickTargetExpenseTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_TARGET_EXPENSE);

    // Verify budget input sheet is displayed
    const isSheetVisible = await budgetPage.isBudgetInputSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-006 TC-003] Verify Workforce budget input sheet loads', async ({ page }) => {
    // Click Workforce tab
    await budgetPage.clickWorkforceTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_WORKFORCE);

    // Verify budget input sheet is displayed
    const isSheetVisible = await budgetPage.isBudgetInputSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-006 TC-004] Verify Product Revenue budget input sheet loads', async ({ page }) => {
    // Click Product Revenue tab
    await budgetPage.clickProductRevenueTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_PRODUCT_REVENUE);

    // Verify budget input sheet is displayed
    const isSheetVisible = await budgetPage.isBudgetInputSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });
});