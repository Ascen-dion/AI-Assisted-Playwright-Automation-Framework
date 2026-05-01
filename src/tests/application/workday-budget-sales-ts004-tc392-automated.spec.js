const { test, expect } = require('../../fixtures');
const BudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');
const loc = require('../../pages/locators/workday-budget-sales.locators');

test.describe('TS-004 TC-392: Verify Tab Scroll Arrows Functionality', () => {
  let budgetSalesPage;

  test.beforeEach(async ({ page }) => {
    budgetSalesPage = new BudgetSalesPage(page);
  });

  test('@regression @CAP1-1 TS-004 TC-392: Verify scroll arrows appear and function when tabs overflow', async ({ page }) => {
    try {
      // Step 1: Launch the application and login as Sales Budget Owner
      await budgetSalesPage.goto();
      const username = process.env.ADAPTIVE_USERNAME;
      const password = process.env.ADAPTIVE_PASSWORD;
      await budgetSalesPage.login(username, password);
      await expect(page).toHaveURL(/app/, { timeout: 60000 });

      // Step 2: Navigate to Budget Entry - Sales page
      await budgetSalesPage.navigateToBudgetEntrySales();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });

      // Step 3: Resize the browser window to restrict the tab display area
      await budgetSalesPage.resizeBrowserWindow(TD.REDUCED_WINDOW_WIDTH, TD.REDUCED_WINDOW_HEIGHT);
      await page.waitForTimeout(1000);

      // Step 4: Verify the presence of left and right scroll arrows
      const isRightArrowVisible = await budgetSalesPage.isRightScrollArrowVisible();
      expect(isRightArrowVisible).toBeTruthy();
      await expect(loc.leftScrollArrow(page)).toBeVisible({ timeout: 15000 });
      await expect(loc.rightScrollArrow(page)).toBeVisible({ timeout: 15000 });

      // Step 5: Verify the state of the left arrow when on the first tab
      const isLeftArrowDisabled = await budgetSalesPage.isLeftScrollArrowDisabled();
      expect(isLeftArrowDisabled).toBeTruthy();

      // Step 6: Click on the right scroll arrow
      await budgetSalesPage.clickRightScrollArrow();
      await page.waitForTimeout(500);
      
      // Verify left arrow becomes enabled
      const isLeftArrowEnabledAfterScroll = await budgetSalesPage.isLeftScrollArrowDisabled();
      expect(isLeftArrowEnabledAfterScroll).toBeFalsy();

      // Step 7: Click on the left scroll arrow
      await budgetSalesPage.clickLeftScrollArrow();
      await page.waitForTimeout(500);

      // Step 8: Continue clicking left arrow until reaching the first tab
      let leftArrowDisabled = await budgetSalesPage.isLeftScrollArrowDisabled();
      let maxClicks = 10;
      let clickCount = 0;
      
      while (!leftArrowDisabled && clickCount < maxClicks) {
        await budgetSalesPage.clickLeftScrollArrow();
        await page.waitForTimeout(500);
        leftArrowDisabled = await budgetSalesPage.isLeftScrollArrowDisabled();
        clickCount++;
      }

      // Verify left arrow is disabled when at first tab
      const isFinalLeftArrowDisabled = await budgetSalesPage.isLeftScrollArrowDisabled();
      expect(isFinalLeftArrowDisabled).toBeTruthy();

    } catch (error) {
      throw new Error(`Test failed at verification: ${error.message}`);
    }
  });
});