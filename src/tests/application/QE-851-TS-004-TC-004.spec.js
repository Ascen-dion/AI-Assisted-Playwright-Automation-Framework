const { test, expect } = require('../../fixtures');
const MobileCardManagementPage = require('../../pages/mobile-card-management.page');
const TD = require('../../data/mobile-card-test-data');

test.describe('[Mobile] QE-851 TS-004: Card management buttons disabled for locked card', { tag: ['@regression', '@mobile', '@card-management'] }, () => {
  let cardPage;

  test('[QE-851 TS-004 TC-004] Verify disabled Transaction Limits button does not respond to tap', async ({ page }) => {
    cardPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await cardPage.launchApp(TD.urls.mobileApp);
    await expect(page.locator('#inputEmail')).toBeVisible();

    // Step 2: Enter valid credentials and login
    await cardPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
    const isHomeDisplayed = await cardPage.isHomeScreenDisplayed();
    expect(isHomeDisplayed).toBeTruthy();

    // Step 3: Navigate to Card Management section
    await cardPage.navigateToCardManagement();
    const isCardManagementDisplayed = await cardPage.isCardManagementScreenDisplayed();
    expect(isCardManagementDisplayed).toBeTruthy();

    // Step 4: Select and view the locked card details
    await cardPage.selectLockedCard();
    const isCardDetailsDisplayed = await cardPage.isCardDetailsScreenDisplayed();
    expect(isCardDetailsDisplayed).toBeTruthy();
    
    const isTransactionLimitsDisabled = await cardPage.isTransactionLimitsButtonDisabled();
    expect(isTransactionLimitsDisabled).toBeTruthy();

    // Step 5: Attempt to tap on the greyed out Transaction Limits button
    const staysOnSameScreen = await cardPage.attemptClickTransactionLimitsButton();
    expect(staysOnSameScreen).toBeTruthy();
  });
});