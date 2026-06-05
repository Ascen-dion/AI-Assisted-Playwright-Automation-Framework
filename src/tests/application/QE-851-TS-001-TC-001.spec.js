const { test, expect } = require('../../fixtures');
const MobileCardManagementPage = require('../../pages/mobile-card-management.page');
const TD = require('../../data/mobile-card-test-data');

test.describe('[Mobile] QE-851 TS-001: View locked card status in mobile app', { tag: ['@smoke', '@regression', '@mobile', '@card-management'] }, () => {
  let cardPage;

  test('[QE-851 TS-001 TC-001] Verify locked card status is displayed in Card Management', async ({ page }) => {
    cardPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await cardPage.launchApp(TD.urls.mobileApp);
    const isLoginDisplayed = await page.locator('#inputEmail').isVisible();
    expect(isLoginDisplayed).toBeTruthy();

    // Step 2: Enter valid credentials and login
    await cardPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    const isHomeDisplayed = await cardPage.isHomeScreenDisplayed();
    expect(isHomeDisplayed).toBeTruthy();

    // Step 3: Navigate to Card Management section
    await cardPage.navigateToCardManagement();
    const isCardManagementDisplayed = await cardPage.isCardManagementScreenDisplayed();
    expect(isCardManagementDisplayed).toBeTruthy();

    // Step 4: View the card status that was locked via Admin Portal
    const isLockedStatusVisible = await cardPage.isLockedStatusVisible();
    expect(isLockedStatusVisible).toBeTruthy();
    
    const cardStatus = await cardPage.getCardStatus();
    expect(cardStatus).toContain(TD.statuses.locked);
  });
});