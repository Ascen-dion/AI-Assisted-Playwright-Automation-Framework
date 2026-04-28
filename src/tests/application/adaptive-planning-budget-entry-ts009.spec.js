const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-009: Verify Summary Views Load for Review Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();
  });

  test('[CAP1-1 TS-009 TC-001] Verify Variances summary view loads', async ({ page }) => {
    // Click Variances tab
    await budgetPage.clickVariancesTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_VARIANCES);

    // Verify summary view is displayed
    const isViewVisible = await budgetPage.isSummaryViewVisible();
    expect(isViewVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-009 TC-002] Verify Review summary view loads', async ({ page }) => {
    // Click Review tab
    await budgetPage.clickReviewTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_REVIEW);

    // Verify summary view is displayed
    const isViewVisible = await budgetPage.isSummaryViewVisible();
    expect(isViewVisible).toBeTruthy();
  });
});