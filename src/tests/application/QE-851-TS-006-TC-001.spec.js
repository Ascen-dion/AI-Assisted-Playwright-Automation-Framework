const { test, expect } = require('../../fixtures');
const MobileCardManagementPage = require('../../pages/mobile-card-management.page');
const TD = require('../../data/mobile-card-test-data');

test.describe('[Mobile] QE-851 TS-006: Prompt closes without changing card status', { tag: ['@regression', '@mobile', '@card-management'] }, () => {
  let cardPage;

  test('[QE-851 TS-006 TC-001] Verify OK button closes prompt and stays on card details screen', async ({ page }) => {
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

    // Step 5: Tap on the Unlock Card button
    await cardPage.clickUnlockCardButton();
    const isPromptDisplayed = await cardPage.isPromptDisplayed();
    expect(isPromptDisplayed).toBeTruthy();

    // Step 6: Tap on the OK button on the prompt
    const initialUrl = page.url();
    await cardPage.clickPromptOkButton();
    
    const isPromptClosed = await cardPage.isPromptClosed();
    expect(isPromptClosed).toBeTruthy();
    
    const staysOnSameScreen = await cardPage.verifyStaysOnSameScreen(initialUrl);
    expect(staysOnSameScreen).toBeTruthy();
  });
});