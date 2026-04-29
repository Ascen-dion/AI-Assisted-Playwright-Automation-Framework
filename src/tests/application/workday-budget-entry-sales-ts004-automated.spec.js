/**
 * Test Spec: CAP1-1 TS-004 TC-001
 * Verify tab scrolling functionality when browser window is resized
 * @group regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayNavPage = require('../../pages/workday-nav.page');
const WorkdayBudgetTabsPage = require('../../pages/workday-budget-tabs.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-004: Tab Scrolling Functionality', () => {
  test('TC-001: Verify scroll arrows appear and function correctly when tabs overflow', async ({ page }) => {
    console.log('Starting test: CAP1-1 TS-004 TC-001');

    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const navPage = new WorkdayNavPage(page);
    const budgetTabsPage = new WorkdayBudgetTabsPage(page);

    try {
      // Step 1: Launch the application and login as Sales Budget Owner
      console.log('Step 1: Launching application and logging in');
      await loginPage.goto();
      await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
      await dashboardPage.waitForLoad();
      const isDashboardLoaded = await dashboardPage.isLoaded();
      expect(isDashboardLoaded).toBeTruthy();
      console.log('User logged in successfully');

      // Step 2: Navigate to Budget Entry - Sales page
      console.log('Step 2: Navigating to Budget Entry - Sales page');
      await navPage.navigateToBudgetEntrySales();
      await budgetTabsPage.waitForTabStripLoad();
      console.log('Budget Entry - Sales page loaded successfully');

      // Step 3: Resize the browser window to restrict the tab display area
      console.log('Step 3: Resizing browser window to restrict tab display');
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(1000); // Allow UI to adjust
      console.log('Browser window resized and some tabs are hidden from view');

      // Step 4: Verify the presence of left and right scroll arrows
      console.log('Step 4: Verifying presence of scroll arrows');
      const areScrollButtonsVisible = await budgetTabsPage.areScrollButtonsVisible();
      expect(areScrollButtonsVisible).toBeTruthy();
      console.log('Left and right scroll arrows are visible on the tab bar');

      // Step 5: Verify the state of the left arrow when on the first tab
      console.log('Step 5: Verifying left arrow is disabled on first tab');
      const isLeftDisabled = await budgetTabsPage.isScrollLeftDisabled();
      expect(isLeftDisabled).toBeTruthy();
      console.log('Left arrow is greyed out/disabled as the user is already on the first tab (Instructions)');

      // Step 6: Click on the right scroll arrow
      console.log('Step 6: Clicking right scroll arrow');
      await budgetTabsPage.clickScrollRight();
      await page.waitForTimeout(500); // Allow scroll animation
      const isLeftEnabledAfterScroll = await budgetTabsPage.isScrollLeftDisabled();
      expect(isLeftEnabledAfterScroll).toBeFalsy();
      console.log('Tab bar scrolls to the right, revealing hidden tabs, and the left arrow becomes enabled/active');

      // Step 7: Click on the left scroll arrow
      console.log('Step 7: Clicking left scroll arrow');
      await budgetTabsPage.clickScrollLeft();
      await page.waitForTimeout(500); // Allow scroll animation
      console.log('Tab bar scrolls to the left, revealing previously visible tabs');

      // Step 8: Continue clicking left arrow until reaching the first tab
      console.log('Step 8: Scrolling back to first tab');
      let leftDisabled = await budgetTabsPage.isScrollLeftDisabled();
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!leftDisabled && attempts < maxAttempts) {
        await budgetTabsPage.clickScrollLeft();
        await page.waitForTimeout(500);
        leftDisabled = await budgetTabsPage.isScrollLeftDisabled();
        attempts++;
      }
      
      expect(leftDisabled).toBeTruthy();
      console.log('When the first tab (Instructions) is reached, the left arrow becomes greyed out/disabled again');

      console.log('Test CAP1-1 TS-004 TC-001 completed successfully');
    } catch (error) {
      console.error('Test failed with error:', error.message);
      throw error;
    }
  });
});