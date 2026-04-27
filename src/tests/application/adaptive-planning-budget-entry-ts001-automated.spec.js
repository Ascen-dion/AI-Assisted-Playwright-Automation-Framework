const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-001: Verify Default Active Tab', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is active by default', async ({ page }) => {
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

    // Step 5: Verify Instructions tab is active by default
    const isInstructionsActive = await budgetEntryPage.isInstructionsTabActive();
    expect(isInstructionsActive).toBeTruthy();

    const activeTabText = await budgetEntryPage.getActiveTabText();
    expect(activeTabText).toContain(TD.tabs.instructions);

    // Verify only one tab is highlighted
    const activeTabCount = await budgetEntryPage.getActiveTabCount();
    expect(activeTabCount).toBe(1);

    // Verify Instructions content is displayed
    const isInstructionsContentVisible = await budgetEntryPage.isInstructionsContentVisible();
    expect(isInstructionsContentVisible).toBeTruthy();
  });
});