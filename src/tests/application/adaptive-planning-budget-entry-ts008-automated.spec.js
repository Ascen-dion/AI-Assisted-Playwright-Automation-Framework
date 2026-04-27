const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-008: Verify Summary Views Load Correctly', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-008 TC-001] Verify Variances summary view loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Variances tab
    await budgetEntryPage.clickVariancesTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.variances);

    // Step 6-7: Verify summary view is visible
    const isSummaryViewVisible = await budgetEntryPage.isSummaryViewVisible();
    expect(isSummaryViewVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-008 TC-002] Verify Review summary view loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Review tab
    await budgetEntryPage.clickReviewTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.review);

    // Step 6-7: Verify summary view is visible
    const isSummaryViewVisible = await budgetEntryPage.isSummaryViewVisible();
    expect(isSummaryViewVisible).toBeTruthy();
  });
});