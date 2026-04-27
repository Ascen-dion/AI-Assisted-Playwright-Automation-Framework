const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-009: Verify Context Retention Across Tab Switches', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-009 TC-001] Verify context is retained when switching between tabs', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate with specific context
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Verify initial context (Note: Context verification depends on actual UI implementation)
    // This is a placeholder - actual implementation may vary based on how context is displayed
    const initialUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(initialUrl).toContain('budget-entry');

    // Step 6-7: Click Target Revenue tab and verify context
    await budgetEntryPage.clickTargetRevenueTab();
    let currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toContain('budget-entry');

    // Step 8-9: Click Workforce tab and verify context
    await budgetEntryPage.clickWorkforceTab();
    currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toContain('budget-entry');

    // Step 10-11: Click Sensitivity Analysis tab and verify context
    await budgetEntryPage.clickSensitivityAnalysisTab();
    currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toContain('budget-entry');

    // Step 12-13: Click Travel tab and verify context
    await budgetEntryPage.clickTravelTab();
    currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toContain('budget-entry');

    // Step 14-15: Click Variances tab and verify context
    await budgetEntryPage.clickVariancesTab();
    currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toContain('budget-entry');

    // Step 16-17: Click Review tab and verify context is retained
    await budgetEntryPage.clickReviewTab();
    currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toContain('budget-entry');

    // Verify we're still on the same page context
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.review);
  });
});