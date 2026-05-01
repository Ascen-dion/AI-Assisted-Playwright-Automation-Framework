/**
 * Test Specification: Workday Adaptive Planning Navigation
 * @description Automated tests for navigation functionality
 */

const { test, expect } = require('../../fixtures');
const WorkdayNavPage = require('../../pages/workday-nav.page');
const WorkdaySharedPage = require('../../pages/workday-shared.page');
const TD = require('../../data/workday-test-data');

test.describe('Workday Adaptive Planning - Navigation Tests @smoke', () => {
  let navPage;
  let sharedPage;

  test.beforeEach(async ({ page }) => {
    navPage = new WorkdayNavPage(page);
    sharedPage = new WorkdaySharedPage(page);
    // Assumes authentication is handled by globalSetup
    await page.goto(TD.urls.dashboard);
    await sharedPage.waitForLoadingComplete();
  });

  test('TC006 - Verify sidebar navigation is visible', async ({ page }) => {
    // Assert
    await navPage.verifySidebarVisible();
  });

  test('TC007 - Verify navigation to Sheets section', async ({ page }) => {
    // Act
    await navPage.navigateToSection(TD.navigation.sheets);
    await sharedPage.waitForLoadingComplete();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.sheets);
  });

  test('TC008 - Verify navigation to Reports section', async ({ page }) => {
    // Act
    await navPage.navigateToSection(TD.navigation.reports);
    await sharedPage.waitForLoadingComplete();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.reports);
  });

  test('TC009 - Verify navigation to Modeling section', async ({ page }) => {
    // Act
    await navPage.navigateToSection(TD.navigation.modeling);
    await sharedPage.waitForLoadingComplete();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.modeling);
  });

  test('TC010 - Verify back button functionality', async ({ page }) => {
    // Arrange
    await navPage.navigateToSection(TD.navigation.sheets);
    await sharedPage.waitForLoadingComplete();
    const previousUrl = page.url();

    // Act
    await navPage.clickBack();
    await sharedPage.waitForLoadingComplete();

    // Assert
    const currentUrl = page.url();
    expect(currentUrl).not.toBe(previousUrl);
  });
});