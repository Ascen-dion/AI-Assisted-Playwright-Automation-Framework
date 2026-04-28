const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-004: Verify Tab Scrolling Functionality', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test('[CAP1-1 TS-004 TC-001] Verify scroll arrows appear and function on small screens', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);

    // Steps 1-2: Login
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);

    // Step 3: Resize browser window
    await budgetPage.resizeBrowserWindow(TD.SMALL_WINDOW_WIDTH, TD.SMALL_WINDOW_HEIGHT);

    // Navigate to Budget Entry page
    await budgetPage.navigateToBudgetEntrySales();

    // Step 4: Verify scroll arrows are visible
    const isLeftArrowVisible = await budgetPage.isScrollLeftButtonVisible();
    const isRightArrowVisible = await budgetPage.isScrollRightButtonVisible();
    expect(isRightArrowVisible).toBeTruthy();

    // Step 5: Click right scroll arrow
    await budgetPage.clickScrollRightButton();
    await page.waitForTimeout(1000);

    // Step 6: Click left scroll arrow
    await budgetPage.clickScrollLeftButton();
    await page.waitForTimeout(1000);

    // Step 7: Continue clicking right arrow until last tab
    let isDisabled = false;
    let attempts = 0;
    while (!isDisabled && attempts < 15) {
      try {
        await budgetPage.clickScrollRightButton();
        await page.waitForTimeout(500);
        isDisabled = await budgetPage.isScrollRightButtonDisabled();
        attempts++;
      } catch (error) {
        isDisabled = true;
      }
    }

    // Verify right arrow is disabled at the end
    const isFinallyDisabled = await budgetPage.isScrollRightButtonDisabled();
    expect(isFinallyDisabled).toBeTruthy();
  });
});