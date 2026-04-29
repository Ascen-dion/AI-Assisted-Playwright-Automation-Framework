const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1 TS-004: Verify tab scrolling functionality', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let dashboardPage;
  let navigationPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-004 TC-001] Verify scroll arrows behavior when tabs overflow', async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    navigationPage = new AdaptiveNavigationPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await loginPage.goto();
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await dashboardPage.waitForDashboardLoad();

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await budgetTabsPage.waitForTabsLoad();

    // Step 3: Resize the browser window to restrict the tab display area
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(1000); // Allow UI to adjust

    // Step 4: Verify the presence of left and right scroll arrows
    const isScrollLeftVisible = await budgetTabsPage.isScrollLeftVisible();
    const isScrollRightVisible = await budgetTabsPage.isScrollRightVisible();
    
    // At least one scroll arrow should be visible if tabs overflow
    expect(isScrollLeftVisible || isScrollRightVisible).toBe(true);

    // Step 5: Verify the state of the left arrow when on the first tab
    if (isScrollLeftVisible) {
      const isLeftEnabled = await budgetTabsPage.isScrollLeftEnabled();
      // Left arrow should be disabled when at the start
      expect(isLeftEnabled).toBe(false);
    }

    // Step 6: Click on the right scroll arrow
    if (isScrollRightVisible) {
      await budgetTabsPage.clickScrollRight();
      
      // After scrolling right, left arrow should become enabled
      if (isScrollLeftVisible) {
        const isLeftEnabled = await budgetTabsPage.isScrollLeftEnabled();
        expect(isLeftEnabled).toBe(true);
      }
    }

    // Step 7: Click on the left scroll arrow
    if (isScrollLeftVisible) {
      await budgetTabsPage.clickScrollLeft();
    }

    // Step 8: Continue clicking left arrow until reaching the first tab
    if (isScrollLeftVisible) {
      // Click multiple times to ensure we're at the start
      for (let i = 0; i < 5; i++) {
        const isEnabled = await budgetTabsPage.isScrollLeftEnabled();
        if (!isEnabled) break;
        await budgetTabsPage.clickScrollLeft();
      }
      
      // Verify left arrow is disabled when at the first tab
      const isLeftEnabled = await budgetTabsPage.isScrollLeftEnabled();
      expect(isLeftEnabled).toBe(false);
    }

    // Restore viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});