const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');

test.describe('[UI] CAP1-1 TS-010: Verify Back Button Navigation', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetPage;
  let previousUrl;

  test('[CAP1-1 TS-010 TC-001] Verify Back button navigates to previous page', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-3: Login
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await expect(await budgetPage.isHomePageDisplayed()).toBeTruthy();
    
    // Step 4: Note current page URL
    previousUrl = await budgetPage.getCurrentUrl();
    
    // Step 5: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    
    // Step 6: Verify Budget Entry - Sales page is displayed
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    await expect(await budgetPage.isTabVisible(require('../../pages/locators/adaptive-budget-entry.locators').instructionsTab)).toBeTruthy();
    
    // Step 7: Click Back button
    await budgetPage.clickBackButton();
    
    // Step 8: Verify navigation to previous page
    const currentUrl = await budgetPage.getCurrentUrl();
    await expect(currentUrl).toBe(previousUrl);
    
    // Step 9: Verify previous page is fully loaded and functional
    await expect(await budgetPage.isHomePageDisplayed()).toBeTruthy();
  });
});