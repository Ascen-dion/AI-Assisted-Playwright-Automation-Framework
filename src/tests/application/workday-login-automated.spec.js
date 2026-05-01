/**
 * Test Specification: Workday Adaptive Planning Login
 * @description Automated tests for login functionality
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdaySharedPage = require('../../pages/workday-shared.page');
const TD = require('../../data/workday-test-data');

test.describe('Workday Adaptive Planning - Login Tests @smoke', () => {
  let loginPage;
  let dashboardPage;
  let sharedPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new WorkdayLoginPage(page);
    dashboardPage = new WorkdayDashboardPage(page);
    sharedPage = new WorkdaySharedPage(page);
    await loginPage.navigate();
  });

  test('TC001 - Verify successful login with valid credentials', async ({ page }) => {
    // Arrange
    const username = TD.credentials.username;
    const password = TD.credentials.password;

    // Act
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickSignIn();
    await sharedPage.waitForLoadingComplete();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('TC002 - Verify login fails with invalid credentials', async ({ page }) => {
    // Arrange
    const invalidUsername = 'invalid@example.com';
    const invalidPassword = 'InvalidPassword123';

    // Act
    await loginPage.fillUsername(invalidUsername);
    await loginPage.fillPassword(invalidPassword);
    await loginPage.clickSignIn();

    // Assert
    await loginPage.verifyErrorMessageDisplayed();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('TC003 - Verify remember username checkbox functionality', async ({ page }) => {
    // Arrange
    const username = TD.credentials.username;

    // Act
    await loginPage.fillUsername(username);
    await loginPage.toggleRememberUsername();

    // Assert
    const checkbox = await page.locator('#rememberUsername');
    await expect(checkbox).toBeChecked();
  });

  test('TC004 - Verify forgot password link is clickable', async ({ page }) => {
    // Act
    await loginPage.clickForgotPassword();

    // Assert
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  test('TC005 - Verify login page elements are visible', async ({ page }) => {
    // Assert
    await expect(page.locator('#inputEmail')).toBeVisible();
    await expect(page.locator('#inputPassword')).toBeVisible();
    await expect(page.locator('#submit')).toBeVisible();
    await expect(page.locator('#rememberUsername')).toBeVisible();
  });
});