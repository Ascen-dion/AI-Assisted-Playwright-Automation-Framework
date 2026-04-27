const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-005: Verify Budget Input Sheets Load Correctly', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-005 TC-001] Verify Target Revenue budget sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Target Revenue tab
    await budgetEntryPage.clickTargetRevenueTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.targetRevenue);

    // Step 6: Verify budget sheet is visible
    const isBudgetSheetVisible = await budgetEntryPage.isBudgetSheetVisible();
    expect(isBudgetSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-005 TC-002] Verify Target Expense budget sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Target Expense tab
    await budgetEntryPage.clickTargetExpenseTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.targetExpense);

    // Step 6: Verify budget sheet is visible
    const isBudgetSheetVisible = await budgetEntryPage.isBudgetSheetVisible();
    expect(isBudgetSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-005 TC-003] Verify Workforce budget sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Workforce tab
    await budgetEntryPage.clickWorkforceTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.workforce);

    // Step 6: Verify budget sheet is visible
    const isBudgetSheetVisible = await budgetEntryPage.isBudgetSheetVisible();
    expect(isBudgetSheetVisible).toBeTruthy();
  });

  test('[CAP1-1 TS-005 TC-004] Verify Product Revenue budget sheet loads', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-4: Login and navigate
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 5: Click Product Revenue tab
    await budgetEntryPage.clickProductRevenueTab();

    // Verify tab is highlighted
    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.productRevenue);

    // Step 6: Verify budget sheet is visible
    const isBudgetSheetVisible = await budgetEntryPage.isBudgetSheetVisible();
    expect(isBudgetSheetVisible).toBeTruthy();
  });
});