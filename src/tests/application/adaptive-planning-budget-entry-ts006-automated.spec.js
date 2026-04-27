const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-006: Verify Planning Views Load Correctly', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-006 TC-001] Verify Sensitivity Analysis planning view loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Sensitivity Analysis tab
    await budgetEntryPage.clickSensitivityAnalysisTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.sensitivityAnalysis);

    // Step 6: Verify planning view is visible
    const isPlanningViewVisible = await budgetEntryPage.isPlanningViewVisible();
    expect(isPlanningViewVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-006 TC-002] Verify Pipeline planning view loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Pipeline tab
    await budgetEntryPage.clickPipelineTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.pipeline);

    // Step 6: Verify planning view is visible
    const isPlanningViewVisible = await budgetEntryPage.isPlanningViewVisible();
    expect(isPlanningViewVisible).toBeTruthy();
  });
});