/**
 * Test Spec: CAP1-1 TS-004 TC-001
 * Description: Verify tab scrolling functionality with left and right arrows
 * Test Scenario: TS-004
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Tab Scrolling Verification', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navPage;
  let dashboardPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-004 TC-001] Verify tab scrolling with left and right arrows', async ({ page }) => {
    // Initialize page objects
    loginPage = new AdaptiveLoginPage(page);
    navPage = new AdaptiveNavigationPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await test.step('Step 1: Login as Sales Budget Owner', async () => {
      await loginPage.goto(TD.urls.baseUrl + TD.urls.loginPage);
      await loginPage.login(TD.users.salesBudgetOwner.username, TD.users.salesBudgetOwner.password);
      await dashboardPage.waitForDashboardToLoad();
      expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
    });

    // Step 2: Navigate to Budget Entry - Sales page
    await test.step('Step 2: Navigate to Budget Entry - Sales page', async () => {
      await navPage.navigateToBudgetEntrySales();
      await budgetTabsPage.waitForTabsToLoad();
    });

    // Step 3: Resize the browser window to restrict tab display area
    await test.step('Step 3: Resize browser to show only 4-5 tabs', async () => {
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(1000); // Wait for resize to take effect
    });

    // Step 4: Verify the presence of left and right scroll arrows
    await test.step('Step 4: Verify scroll arrows are visible', async () => {
      const isLeftScrollVisible = await budgetTabsPage.isLeftScrollVisible();
      const isRightScrollVisible = await budgetTabsPage.isRightScrollVisible();
      // At least one scroll arrow should be visible when tabs overflow
      expect(isLeftScrollVisible || isRightScrollVisible).toBeTruthy();
    });

    // Step 5: Verify the state of the left arrow when on the first tab
    await test.step('Step 5: Verify left arrow is disabled on first tab', async () => {
      // Ensure we're at the beginning
      const activeTab = await budgetTabsPage.getActiveTabName();
      if (activeTab !== 'Instructions') {
        await budgetTabsPage.clickTab('Instructions');
      }
      
      const isLeftScrollDisabled = await budgetTabsPage.isLeftScrollDisabled();
      expect(isLeftScrollDisabled).toBeTruthy();
    });

    // Step 6: Click on the right scroll arrow
    await test.step('Step 6: Click right scroll arrow', async () => {
      await budgetTabsPage.clickRightScroll();
      
      // After scrolling right, left arrow should become enabled
      const isLeftScrollDisabled = await budgetTabsPage.isLeftScrollDisabled();
      expect(isLeftScrollDisabled).toBeFalsy();
    });

    // Step 7: Click on the left scroll arrow
    await test.step('Step 7: Click left scroll arrow', async () => {
      await budgetTabsPage.clickLeftScroll();
    });

    // Step 8: Continue clicking left arrow until reaching the first tab
    await test.step('Step 8: Scroll left until first tab and verify left arrow is disabled', async () => {
      // Click left scroll multiple times to ensure we reach the beginning
      let attempts = 0;
      let isDisabled = await budgetTabsPage.isLeftScrollDisabled();
      
      while (!isDisabled && attempts < 5) {
        await budgetTabsPage.clickLeftScroll();
        isDisabled = await budgetTabsPage.isLeftScrollDisabled();
        attempts++;
      }
      
      // Verify left arrow is now disabled
      expect(await budgetTabsPage.isLeftScrollDisabled()).toBeTruthy();
    });
  });
});