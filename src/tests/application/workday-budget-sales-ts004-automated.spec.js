/**
 * Test Spec: CAP1-1 TS-004 TC-001
 * Description: Verify tab scroll arrows functionality
 * @regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayBudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-004: Tab Scroll Arrows', () => {
  test('CAP1-1 TS-004 TC-001: Verify tab scroll arrows functionality @regression', async ({ page }) => {
    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const budgetSalesPage = new WorkdayBudgetSalesPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await test.step('Launch application and login', async () => {
      await loginPage.navigateToApp(TD.appUrl);
      await loginPage.verifyLoginPageLoaded();
      await loginPage.login(TD.salesBudgetOwner.username, TD.salesBudgetOwner.password);
      await dashboardPage.verifyUserLoggedIn();
    });

    // Step 2: Navigate to Budget Entry - Sales page
    await test.step('Navigate to Budget Entry - Sales page', async () => {
      await dashboardPage.navigateToBudgetEntrySales();
      await budgetSalesPage.verifyPageLoaded();
    });

    // Step 3: Resize the browser window to restrict tab display area
    await test.step('Resize browser window to show only 4-5 tabs', async () => {
      await budgetSalesPage.resizeBrowserWindow(TD.windowSizes.reduced.width, TD.windowSizes.reduced.height);
    });

    // Step 4: Verify the presence of left and right scroll arrows
    await test.step('Verify scroll arrows are visible', async () => {
      await budgetSalesPage.verifyScrollArrowsVisible();
    });

    // Step 5: Verify the state of the left arrow when on the first tab
    await test.step('Verify left arrow is disabled on first tab', async () => {
      await budgetSalesPage.verifyLeftArrowDisabled();
    });

    // Step 6: Click on the right scroll arrow
    await test.step('Click right scroll arrow', async () => {
      await budgetSalesPage.clickRightScrollArrow();
      await budgetSalesPage.verifyLeftArrowEnabled();
    });

    // Step 7: Click on the left scroll arrow
    await test.step('Click left scroll arrow', async () => {
      await budgetSalesPage.clickLeftScrollArrow();
    });

    // Step 8: Continue clicking left arrow until reaching the first tab
    await test.step('Scroll back to first tab and verify left arrow disabled', async () => {
      // Click left arrow multiple times to ensure we're at the beginning
      for (let i = 0; i < 3; i++) {
        try {
          await budgetSalesPage.clickLeftScrollArrow();
        } catch (error) {
          // Arrow might be disabled, which is expected
          break;
        }
      }
      await budgetSalesPage.verifyLeftArrowDisabled();
    });
  });
});