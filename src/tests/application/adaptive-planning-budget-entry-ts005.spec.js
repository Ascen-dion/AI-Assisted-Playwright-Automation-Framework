const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-005: Verify Left Scroll Arrow Disabled State', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test('[CAP1-1 TS-005 TC-001] Verify left scroll arrow is disabled at first tab', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);

    // Steps 1-2: Login
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);

    // Step 3: Resize window
    await budgetPage.resizeBrowserWindow(TD.SMALL_WINDOW_WIDTH, TD.SMALL_WINDOW_HEIGHT);

    // Navigate to Budget Entry page
    await budgetPage.navigateToBudgetEntrySales();

    // Step 4: Verify on first tab (Instructions)
    const activeTab = await budgetPage.getActiveTabName();
    expect(activeTab).toBe(TD.TAB_INSTRUCTIONS);

    // Step 5: Verify left arrow is disabled
    const isLeftDisabled = await budgetPage.isScrollLeftButtonDisabled();
    expect(isLeftDisabled).toBeTruthy();

    // Step 6: Attempt to click disabled left arrow (should not scroll)
    const initialActiveTab = await budgetPage.getActiveTabName();
    try {
      await budgetPage.clickScrollLeftButton();
    } catch (error) {
      // Expected to fail or do nothing
    }
    const afterClickActiveTab = await budgetPage.getActiveTabName();
    expect(afterClickActiveTab).toBe(initialActiveTab);

    // Step 7: Click right arrow to enable left arrow
    await budgetPage.clickScrollRightButton();
    await page.waitForTimeout(1000);
    const isLeftEnabledNow = await budgetPage.isScrollLeftButtonDisabled();
    expect(isLeftEnabledNow).toBeFalsy();
  });
});