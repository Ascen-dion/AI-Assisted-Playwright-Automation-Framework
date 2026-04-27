const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-002: Verify All Tabs Visibility and Order', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are visible in correct order', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1: Launch the application
    await budgetEntryPage.goto(TD.urls.loginPage);
    await expect(page).toHaveURL(new RegExp(TD.urls.loginPage));

    // Step 2-3: Login
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await page.waitForLoadState('networkidle');

    // Step 4: Navigate to Budget Entry - Sales page
    await budgetEntryPage.navigateToBudgetEntrySales();
    await page.waitForLoadState('domcontentloaded');

    // Step 5: Verify all 12 tabs are visible
    const allTabs = await budgetEntryPage.getAllTabsText();
    expect(allTabs.length).toBe(12);

    // Step 6: Verify tab order
    for (let i = 0; i < TD.expectedTabOrder.length; i++) {
      expect(allTabs[i]).toContain(TD.expectedTabOrder[i]);
    }
  });
});