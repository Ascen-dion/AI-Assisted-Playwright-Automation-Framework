const { test, expect } = require('../../fixtures');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-004: Verify Tab Scrolling Functionality', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetEntryPage;

  test('[CAP1-1 TS-004 TC-001] Verify scroll arrows functionality with reduced browser width', async ({ page }) => {
    budgetEntryPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1-3: Login
    await budgetEntryPage.goto(TD.urls.loginPage);
    await budgetEntryPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);

    // Step 4: Resize browser window
    await budgetEntryPage.resizeBrowserWindow(TD.browserDimensions.reduced.width, TD.browserDimensions.reduced.height);

    // Step 5: Navigate to Budget Entry - Sales page
    await budgetEntryPage.navigateToBudgetEntrySales();

    // Step 6: Verify scroll arrows are visible
    const areScrollArrowsVisible = await budgetEntryPage.areScrollArrowsVisible();
    expect(areScrollArrowsVisible).toBeTruthy();

    // Step 7: Verify left arrow is disabled at first tab
    const isLeftArrowDisabled = await budgetEntryPage.isLeftScrollArrowDisabled();
    expect(isLeftArrowDisabled).toBeTruthy();

    // Step 8: Click right scroll arrow
    await budgetEntryPage.clickRightScrollArrow();
    await page.waitForTimeout(500); // Wait for scroll animation

    // Verify left arrow is now enabled
    const isLeftArrowEnabledAfterScroll = await budgetEntryPage.isLeftScrollArrowDisabled();
    expect(isLeftArrowEnabledAfterScroll).toBeFalsy();

    // Step 9: Continue clicking right arrow until last tab
    let isRightDisabled = await budgetEntryPage.isRightScrollArrowDisabled();
    while (!isRightDisabled) {
      await budgetEntryPage.clickRightScrollArrow();
      await page.waitForTimeout(500);
      isRightDisabled = await budgetEntryPage.isRightScrollArrowDisabled();
    }

    // Verify right arrow is disabled at last tab
    expect(isRightDisabled).toBeTruthy();

    // Step 10: Click left scroll arrow
    await budgetEntryPage.clickLeftScrollArrow();
    await page.waitForTimeout(500);

    // Verify right arrow is now enabled
    const isRightArrowEnabledAfterScroll = await budgetEntryPage.isRightScrollArrowDisabled();
    expect(isRightArrowEnabledAfterScroll).toBeFalsy();

    // Step 11: Continue clicking left arrow until first tab
    let isLeftDisabled = await budgetEntryPage.isLeftScrollArrowDisabled();
    while (!isLeftDisabled) {
      await budgetEntryPage.clickLeftScrollArrow();
      await page.waitForTimeout(500);
      isLeftDisabled = await budgetEntryPage.isLeftScrollArrowDisabled();
    }

    // Verify left arrow is disabled again at first tab
    expect(isLeftDisabled).toBeTruthy();
  });
});