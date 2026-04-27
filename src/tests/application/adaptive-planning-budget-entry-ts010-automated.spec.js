const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-010: Verify Back Button Navigation', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-010 TC-001] Verify Back button navigates to previous page', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-3: Login
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    await page.waitForLoadState('networkidle');

    // Step 4: Note current page URL
    const previousPageUrl = await budgetEntryPage.getCurrentPageUrl();

    // Step 5: Navigate to Budget Entry - Sales page
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 6: Verify Budget Entry page is displayed
    const budgetEntryUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(budgetEntryUrl).not.toBe(previousPageUrl);

    const isInstructionsTabActive = await budgetEntryPage.isInstructionsTabActive();
    expect(isInstructionsTabActive).toBeTruthy();

    // Step 7: Click Back button
    await budgetEntryPage.clickBackButton();

    // Step 8-9: Verify navigation to previous page
    const currentUrl = await budgetEntryPage.getCurrentPageUrl();
    expect(currentUrl).toBe(previousPageUrl);

    // Verify page is functional
    await page.waitForLoadState('domcontentloaded');
    const pageState = await page.evaluate(() => document.readyState);
    expect(pageState).toBe('complete');
  });
});