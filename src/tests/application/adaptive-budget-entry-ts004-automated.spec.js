const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');

test.describe('[UI] CAP1-1 TS-004: Verify Tab Scrolling Functionality', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-004 TC-001] Verify scroll arrows work correctly when not all tabs are visible', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-3: Login
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await expect(await budgetPage.isHomePageDisplayed()).toBeTruthy();
    
    // Step 4: Resize browser window
    await budgetPage.resizeBrowser(TD.reducedBrowserWidth, TD.reducedBrowserHeight);
    
    // Step 5: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 6: Verify scroll arrows are visible
    await expect(await budgetPage.isLeftScrollArrowVisible()).toBeTruthy();
    await expect(await budgetPage.isRightScrollArrowVisible()).toBeTruthy();
    
    // Step 7: Verify left arrow is disabled initially
    await expect(await budgetPage.isLeftScrollArrowDisabled()).toBeTruthy();
    
    // Step 8: Click right scroll arrow
    await budgetPage.clickRightScrollArrow();
    await expect(await budgetPage.isLeftScrollArrowDisabled()).toBeFalsy();
    
    // Step 9: Continue clicking right arrow until last tab is visible
    let rightArrowDisabled = await budgetPage.isRightScrollArrowDisabled();
    while (!rightArrowDisabled) {
      await budgetPage.clickRightScrollArrow();
      rightArrowDisabled = await budgetPage.isRightScrollArrowDisabled();
    }
    await expect(await budgetPage.isRightScrollArrowDisabled()).toBeTruthy();
    
    // Step 10: Click left scroll arrow
    await budgetPage.clickLeftScrollArrow();
    await expect(await budgetPage.isRightScrollArrowDisabled()).toBeFalsy();
    
    // Step 11: Continue clicking left arrow until first tab is visible
    let leftArrowDisabled = await budgetPage.isLeftScrollArrowDisabled();
    while (!leftArrowDisabled) {
      await budgetPage.clickLeftScrollArrow();
      leftArrowDisabled = await budgetPage.isLeftScrollArrowDisabled();
    }
    await expect(await budgetPage.isLeftScrollArrowDisabled()).toBeTruthy();
  });
});