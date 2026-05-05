/**
 * Workday Login Smoke Tests
 * Tests basic login functionality
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Workday Login - Smoke Tests', { tag: ['@smoke', '@workday', '@login'] }, () => {
  let loginPage;
  let dashboardPage;

  test('[WD-001] Verify successful login with valid credentials', async ({ page }) => {
    loginPage = new WorkdayLoginPage(page);
    dashboardPage = new WorkdayDashboardPage(page);

    // Navigate to login page
    await loginPage.goto(TD.urls.login);

    // Perform login
    await loginPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);

    // Verify dashboard is loaded
    await expect(page).toHaveURL(/dashboard/, { timeout: TD.timeouts.navigationWait });
    const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
    expect(isDashboardLoaded).toBeTruthy();
  });

  test('[WD-002] Verify login fails with invalid credentials', async ({ page }) => {
    loginPage = new WorkdayLoginPage(page);

    // Navigate to login page
    await loginPage.goto(TD.urls.login);

    // Attempt login with invalid credentials
    await loginPage.login(TD.credentials.invalidUser.username, TD.credentials.invalidUser.password);

    // Verify error message is displayed
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(TD.expectedValues.loginErrorMessage);
  });

  test('[WD-003] Verify Remember Me checkbox functionality', async ({ page }) => {
    loginPage = new WorkdayLoginPage(page);

    // Navigate to login page
    await loginPage.goto(TD.urls.login);

    // Login with Remember Me checked
    await loginPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password, true);

    // Verify successful login
    await expect(page).toHaveURL(/dashboard/, { timeout: TD.timeouts.navigationWait });
  });
});