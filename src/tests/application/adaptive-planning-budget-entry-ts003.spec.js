const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-003: Verify Tab Highlighting Behavior', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test('[CAP1-1 TS-003 TC-001] Verify only one tab is highlighted at any given time', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);

    // Steps 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();

    // Step 3: Verify Instructions tab is highlighted
    let activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_INSTRUCTIONS);

    // Step 4: Click Target Revenue tab
    await budgetPage.clickTargetRevenueTab();
    activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_TARGET_REVENUE);

    // Step 5: Click Workforce tab
    await budgetPage.clickWorkforceTab();
    activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_WORKFORCE);

    // Step 6: Click Pipeline tab
    await budgetPage.clickPipelineTab();
    activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_PIPELINE);

    // Step 7: Click Review tab
    await budgetPage.clickReviewTab();
    activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_REVIEW);

    // Step 8: Verify only Review tab is highlighted
    const isReviewActive = await budgetPage.isTabActive(TD.TAB_REVIEW);
    expect(isReviewActive).toBeTruthy();
  });
});