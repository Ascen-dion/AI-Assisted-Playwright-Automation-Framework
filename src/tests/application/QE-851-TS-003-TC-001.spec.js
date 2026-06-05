const { test, expect } = require('../../fixtures');
const MobileCardManagementPage = require('../../pages/mobile-card-management.page');
const TD = require('../../data/mobile-card-test-data');

test.describe('[Mobile] QE-851 TS-003: Purchase transaction blocked for locked card', { tag: ['@regression', '@mobile', '@card-management', '@transaction'] }, () => {
  let cardPage;

  test('[QE-851 TS-003 TC-001] Verify purchase transaction is declined for locked card', async ({ page }) => {
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

    // Step 4: Attempt to make a purchase transaction using the locked card
    await cardPage.attemptPurchaseTransaction(
      TD.cardData.lockedCardId,
      TD.cardData.testMerchant,
      TD.cardData.testAmount
    );
    
    const isTransactionDeclined = await cardPage.isTransactionDeclined();
    expect(isTransactionDeclined).toBeTruthy();
    
    const errorMessage = await cardPage.getTransactionErrorMessage();
    expect(errorMessage.toLowerCase()).toContain(TD.expectedMessages.transactionDeclined.toLowerCase());
  });
});