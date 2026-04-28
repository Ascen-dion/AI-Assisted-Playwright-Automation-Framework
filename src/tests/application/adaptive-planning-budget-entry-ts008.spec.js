const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-008: Verify Cost Planning Sheets Load for Expense Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();
  });

  test('[CAP1-1 TS-008 TC-001] Verify Travel cost planning sheet loads', async ({ page }) => {
    // Click Travel tab
    await budgetPage.clickTravelTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_TRAVEL);

    // Verify cost planning sheet is displayed
    const isSheetVisible = await budgetPage.isCostPlanningSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-008 TC-002] Verify Capital cost planning sheet loads', async ({ page }) => {
    // Click Capital tab
    await budgetPage.clickCapitalTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_CAPITAL);

    // Verify cost planning sheet is displayed
    const isSheetVisible = await budgetPage.isCostPlanningSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-008 TC-003] Verify Expenses cost planning sheet loads', async ({ page }) => {
    // Click Expenses tab
    await budgetPage.clickExpensesTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_EXPENSES);

    // Verify cost planning sheet is displayed
    const isSheetVisible = await budgetPage.isCostPlanningSheetVisible();
    expect(isSheetVisible).toBeTruthy();
  });
});