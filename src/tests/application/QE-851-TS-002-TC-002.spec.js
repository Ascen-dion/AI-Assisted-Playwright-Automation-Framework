const { test, expect } = require('../../fixtures');
const MobileCardManagementPage = require('../../pages/mobile-card-management.page');
const TD = require('../../data/mobile-card-test-data');

test.describe('[Mobile] QE-851 TS-002: Unlock card prompt displays advisory message', { tag: ['@regression', '@mobile', '@card-management'] }, () => {
  let cardPage;

  test('[QE-851 TS-002 TC-002] Verify prompt message content and OK button', async ({ page }) => {
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
    
    const isLockedStatusVisible = await cardPage.isLockedStatusVisible();
    expect(isLockedStatusVisible).toBeTruthy();

    // Step 5: Tap on the Unlock Card button
    await cardPage.clickUnlockCardButton();
    const isPromptDisplayed = await cardPage.isPromptDisplayed();
    expect(isPromptDisplayed).toBeTruthy();

    // Step 6: Verify the prompt message content
    const promptMessage = await cardPage.getPromptMessage();
    expect(promptMessage).toContain(TD.expectedMessages.unlockPrompt);
    
    await expect(page.locator('[role="dialog"] button:has-text("OK"), .modal button:has-text("OK")')).toBeVisible();
  });
});