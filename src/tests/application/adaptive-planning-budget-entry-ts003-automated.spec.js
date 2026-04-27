const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-003: Verify Tab Highlighting on Click', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-003 TC-001] Verify only clicked tab is highlighted', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Verify Instructions tab is highlighted
    let activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.instructions);
    let activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 6: Click Target Revenue tab
    await budgetEntryPage.clickTargetRevenueTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.targetRevenue);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 7: Click Target Expense tab
    await budgetEntryPage.clickTargetExpenseTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.targetExpense);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 8: Click Workforce tab
    await budgetEntryPage.clickWorkforceTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.workforce);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 9: Click Product Revenue tab
    await budgetEntryPage.clickProductRevenueTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.productRevenue);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 10: Click Sensitivity Analysis tab
    await budgetEntryPage.clickSensitivityAnalysisTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.sensitivityAnalysis);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 11: Click Pipeline tab
    await budgetEntryPage.clickPipelineTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.pipeline);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 12: Click Travel tab
    await budgetEntryPage.clickTravelTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.travel);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 13: Click Capital tab
    await budgetEntryPage.clickCapitalTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.capital);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 14: Click Expenses tab
    await budgetEntryPage.clickExpensesTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.expenses);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 15: Click Variances tab
    await budgetEntryPage.clickVariancesTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.variances);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 16: Click Review tab
    await budgetEntryPage.clickReviewTab();
    activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.review);
    activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Step 17: Verify only Review tab is highlighted
    expect(activeTabText).toContain(TD.tabs.review);
    expect(activeTabCount).toBe(1);
  });
});