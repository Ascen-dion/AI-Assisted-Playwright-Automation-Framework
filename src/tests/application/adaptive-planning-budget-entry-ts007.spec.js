const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-007: Verify Planning Views Load for Analysis Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();
  });

  test('[CAP1-1 TS-007 TC-001] Verify Sensitivity Analysis planning view loads', async ({ page }) => {
    // Click Sensitivity Analysis tab
    await budgetPage.clickSensitivityAnalysisTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_SENSITIVITY_ANALYSIS);

    // Verify planning view is displayed
    const isViewVisible = await budgetPage.isPlanningViewVisible();
    expect(isViewVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-007 TC-002] Verify Pipeline planning view loads', async ({ page }) => {
    // Click Pipeline tab
    await budgetPage.clickPipelineTab();

    // Verify tab is active
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_PIPELINE);

    // Verify planning view is displayed
    const isViewVisible = await budgetPage.isPlanningViewVisible();
    expect(isViewVisible).toBeTruthy();
  });
});