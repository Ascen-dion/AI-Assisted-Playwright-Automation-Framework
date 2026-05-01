/**
 * Test Specification: Workday Adaptive Planning Dashboard
 * @description Automated tests for dashboard functionality
 */

const { test, expect } = require('../../fixtures');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdaySharedPage = require('../../pages/workday-shared.page');
const TD = require('../../data/workday-test-data');

test.describe('Workday Adaptive Planning - Dashboard Tests @smoke', () => {
  let dashboardPage;
  let sharedPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new WorkdayDashboardPage(page);
    sharedPage = new WorkdaySharedPage(page);
    await page.goto(TD.urls.dashboard);
    await sharedPage.waitForLoadingComplete();
  });

  test('TC021 - Verify dashboard loads successfully', async ({ page }) => {
    // Assert
    await dashboardPage.verifyDashboardLoaded();
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
  });

  test('TC022 - Verify welcome message is displayed', async ({ page }) => {
    // Assert
    await dashboardPage.verifyWelcomeMessageDisplayed();
  });

  test('TC023 - Verify user is on dashboard page', async ({ page }) => {
    // Assert
    await dashboardPage.verifyOnDashboard();
  });

  test('TC024 - Verify dashboard container is visible', async ({ page }) => {
    // Act
    const welcomeMsg = await dashboardPage.getWelcomeMessage();

    // Assert
    expect(welcomeMsg).toBeTruthy();
    await dashboardPage.verifyDashboardLoaded();
  });

  test('TC025 - Verify page URL matches dashboard pattern', async ({ page }) => {
    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
    await dashboardPage.verifyDashboardLoaded();
  });
});