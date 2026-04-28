const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-002: Verify Presence and Order of Budget Section Tabs', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are visible in correct order', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);

    // Steps 1-3: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();

    // Step 4-5: Verify tab count
    const tabCount = await budgetPage.getAllTabsCount();
    expect(tabCount).toBe(TD.EXPECTED_TAB_COUNT);

    // Step 6: Verify tab order and names
    const tabNames = await budgetPage.getAllTabNames();
    expect(tabNames).toEqual(TD.EXPECTED_TAB_ORDER);

    // Verify each tab individually
    for (let i = 0; i < TD.EXPECTED_TAB_ORDER.length; i++) {
      expect(tabNames[i]).toBe(TD.EXPECTED_TAB_ORDER[i]);
    }
  });
});