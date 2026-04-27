const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-010: Back Button Navigation', () => {
  test('CAP1-1 TS-010 TC-001: Verify Back button navigates to previous page', async ({ page }) => {
    const loginPage = new AdaptiveLoginPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);

    // Step 1: Launch the application and login with Sales Budget Owner credentials
    await loginPage.goto(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });

    // Step 2: Note the current page (dashboard or home page)
    const previousUrl = await dashboardPage.getCurrentUrl();

    // Step 3: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Verify the presence of Back button in the toolbar
    await expect(navigationPage.getBackButton()).toBeVisible();

    // Step 5: Click on the Back button in the toolbar
    await navigationPage.clickBackButton();
    await page.waitForLoadState('domcontentloaded');

    // Step 6: Verify the user is on the correct previous page
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });
    const currentUrl = await dashboardPage.getCurrentUrl();
    expect(currentUrl).toContain(previousUrl.split('?')[0]);
  });
});