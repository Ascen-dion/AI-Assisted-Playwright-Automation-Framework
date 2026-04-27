const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-007: Verify Cost Planning Sheets Load Correctly', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-007 TC-001] Verify Travel cost planning sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Travel tab
    await budgetEntryPage.clickTravelTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.travel);

    // Step 6: Verify cost planning sheet is visible
    const isCostPlanningSheetVisible = await budgetEntryPage.isCostPlanningSheetVisible();
    expect(isCostPlanningSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-007 TC-002] Verify Capital cost planning sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Capital tab
    await budgetEntryPage.clickCapitalTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.capital);

    // Step 6: Verify cost planning sheet is visible
    const isCostPlanningSheetVisible = await budgetEntryPage.isCostPlanningSheetVisible();
    expect(isCostPlanningSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-007 TC-003] Verify Expenses cost planning sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Expenses tab
    await budgetEntryPage.clickExpensesTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.expenses);

    // Step 6: Verify cost planning sheet is visible
    const isCostPlanningSheetVisible = await budgetEntryPage.isCostPlanningSheetVisible();
    expect(isCostPlanningSheetVisible).toBeTruthy();
  });
});