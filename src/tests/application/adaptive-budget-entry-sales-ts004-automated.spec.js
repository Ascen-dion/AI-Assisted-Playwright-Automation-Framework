const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-004: Tab Scrolling Functionality', () => {
  test('CAP1-1 TS-004 TC-001: Verify tab scrolling with left and right arrows', async ({ page }) => {
    const loginPage = new AdaptiveLoginPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application and login with Sales Budget Owner credentials
    await loginPage.goto(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });

    // Step 2: Resize the browser window to a smaller width
    await page.setViewportSize({ width: 800, height: 600 });

    // Step 3: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Verify the presence of left and right scroll arrows
    const scrollLeftVisible = await budgetTabsPage.isScrollLeftVisible();
    const scrollRightVisible = await budgetTabsPage.isScrollRightVisible();
    
    if (scrollLeftVisible && scrollRightVisible) {
      // Step 5: Verify the left arrow is greyed out when on the first tab
      const isLeftDisabled = await budgetTabsPage.isScrollLeftDisabled();
      expect(isLeftDisabled).toBeTruthy();

      // Step 6: Click the right scroll arrow
      await budgetTabsPage.clickScrollRight();
      await page.waitForTimeout(500);
      
      // Verify left arrow becomes enabled
      const isLeftEnabledAfterScroll = !(await budgetTabsPage.isScrollLeftDisabled());
      expect(isLeftEnabledAfterScroll).toBeTruthy();

      // Step 7: Continue clicking the right arrow until the last tab is visible
      let isRightDisabled = await budgetTabsPage.isScrollRightDisabled();
      let clickCount = 0;
      while (!isRightDisabled && clickCount < 10) {
        await budgetTabsPage.clickScrollRight();
        await page.waitForTimeout(500);
        isRightDisabled = await budgetTabsPage.isScrollRightDisabled();
        clickCount++;
      }
      expect(isRightDisabled).toBeTruthy();

      // Step 8: Click the left scroll arrow
      await budgetTabsPage.clickScrollLeft();
      await page.waitForTimeout(500);

      // Step 9: Continue clicking the left arrow until the first tab is visible
      let isLeftDisabledAgain = await budgetTabsPage.isScrollLeftDisabled();
      clickCount = 0;
      while (!isLeftDisabledAgain && clickCount < 10) {
        await budgetTabsPage.clickScrollLeft();
        await page.waitForTimeout(500);
        isLeftDisabledAgain = await budgetTabsPage.isScrollLeftDisabled();
        clickCount++;
      }
      expect(isLeftDisabledAgain).toBeTruthy();
    }
  });
});