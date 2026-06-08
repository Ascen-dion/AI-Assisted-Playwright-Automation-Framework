/**
 * Mobile Card Management - Automated Test Suite
 * Test Scenarios: QE-851 TS-001 to TS-004
 * Module: Card Management - Locked Card Functionality
 */

const { test, expect } = require('../../fixtures');
const MobileCardManagementPage = require('../../pages/mobile-card-management.page');
const TD = require('../../data/mobile-card-test-data');

test.describe('[Mobile] QE-851: Card Management - Locked Card Verification', { tag: ['@regression', '@mobile', '@card-management'] }, () => {
  let cardManagementPage;

  /**
   * Test Case: QE-851 TS-001 TC-001
   * Verify locked card status is displayed in Card Management section
   */
  test('[QE-851 TS-001 TC-001] Verify locked card status is displayed in mobile app', async ({ page }) => {
    cardManagementPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await test.step('Step 1: Launch the mobile application', async () => {
      await cardManagementPage.launchApp(TD.urls.mobileAppUrl);
      const isLoginScreenDisplayed = await cardManagementPage.isLoginScreenDisplayed();
      expect(isLoginScreenDisplayed).toBeTruthy();
    });

    // Step 2: Enter valid credentials and login
    await test.step('Step 2: Enter valid credentials and login to the mobile app', async () => {
      await cardManagementPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
      const isHomeScreenDisplayed = await cardManagementPage.isHomeScreenDisplayed();
      expect(isHomeScreenDisplayed).toBeTruthy();
    });

    // Step 3: Navigate to Card Management section
    await test.step('Step 3: Navigate to Card Management section', async () => {
      await cardManagementPage.navigateToCardManagement();
      const isCardManagementScreenDisplayed = await cardManagementPage.isCardManagementScreenDisplayed();
      expect(isCardManagementScreenDisplayed).toBeTruthy();
      
      const isCardListDisplayed = await cardManagementPage.isCardListDisplayed();
      expect(isCardListDisplayed).toBeTruthy();
    });

    // Step 4: View the card status that was locked via Admin Portal
    await test.step('Step 4: View the card status that was locked via Admin Portal', async () => {
      const isLockedStatusVisible = await cardManagementPage.isLockedStatusVisible();
      expect(isLockedStatusVisible).toBeTruthy();
      
      const cardStatus = await cardManagementPage.getCardStatus();
      expect(cardStatus).toContain(TD.statuses.locked);
    });
  });

  /**
   * Test Case: QE-851 TS-002 TC-001
   * Verify unlock prompt appears when attempting to unlock locked card
   */
  test('[QE-851 TS-002 TC-001] Verify unlock prompt appears with message to file in-app ticket', async ({ page }) => {
    cardManagementPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await test.step('Step 1: Launch the mobile application', async () => {
      await cardManagementPage.launchApp(TD.urls.mobileAppUrl);
      const isLoginScreenDisplayed = await cardManagementPage.isLoginScreenDisplayed();
      expect(isLoginScreenDisplayed).toBeTruthy();
    });

    // Step 2: Enter valid credentials and login
    await test.step('Step 2: Enter valid credentials and login to the mobile app', async () => {
      await cardManagementPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
      const isHomeScreenDisplayed = await cardManagementPage.isHomeScreenDisplayed();
      expect(isHomeScreenDisplayed).toBeTruthy();
    });

    // Step 3: Navigate to Card Management section
    await test.step('Step 3: Navigate to Card Management section', async () => {
      await cardManagementPage.navigateToCardManagement();
      const isCardManagementScreenDisplayed = await cardManagementPage.isCardManagementScreenDisplayed();
      expect(isCardManagementScreenDisplayed).toBeTruthy();
    });

    // Step 4: Select and view the locked card details
    await test.step('Step 4: Select and view the locked card details', async () => {
      await cardManagementPage.selectLockedCard(TD.cards.lockedCard.cardId);
      const isCardDetailsScreenDisplayed = await cardManagementPage.isCardDetailsScreenDisplayed();
      expect(isCardDetailsScreenDisplayed).toBeTruthy();
      
      const isLockedCardStatusDisplayed = await cardManagementPage.isLockedCardStatusDisplayed();
      expect(isLockedCardStatusDisplayed).toBeTruthy();
    });

    // Step 5: Tap on the Unlock Card button
    await test.step('Step 5: Tap on the Unlock Card button', async () => {
      await cardManagementPage.tapUnlockCardButton();
      const isUnlockPromptDisplayed = await cardManagementPage.isUnlockPromptDisplayed();
      expect(isUnlockPromptDisplayed).toBeTruthy();
    });
  });

  /**
   * Test Case: QE-851 TS-002 TC-002
   * Verify unlock prompt message content and OK button presence
   */
  test('[QE-851 TS-002 TC-002] Verify unlock prompt message content and OK button', async ({ page }) => {
    cardManagementPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await test.step('Step 1: Launch the mobile application', async () => {
      await cardManagementPage.launchApp(TD.urls.mobileAppUrl);
      const isLoginScreenDisplayed = await cardManagementPage.isLoginScreenDisplayed();
      expect(isLoginScreenDisplayed).toBeTruthy();
    });

    // Step 2: Enter valid credentials and login
    await test.step('Step 2: Enter valid credentials and login to the mobile app', async () => {
      await cardManagementPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
      const isHomeScreenDisplayed = await cardManagementPage.isHomeScreenDisplayed();
      expect(isHomeScreenDisplayed).toBeTruthy();
    });

    // Step 3: Navigate to Card Management section
    await test.step('Step 3: Navigate to Card Management section', async () => {
      await cardManagementPage.navigateToCardManagement();
      const isCardManagementScreenDisplayed = await cardManagementPage.isCardManagementScreenDisplayed();
      expect(isCardManagementScreenDisplayed).toBeTruthy();
    });

    // Step 4: Select and view the locked card details
    await test.step('Step 4: Select and view the locked card details', async () => {
      await cardManagementPage.selectLockedCard(TD.cards.lockedCard.cardId);
      const isCardDetailsScreenDisplayed = await cardManagementPage.isCardDetailsScreenDisplayed();
      expect(isCardDetailsScreenDisplayed).toBeTruthy();
      
      const isLockedCardStatusDisplayed = await cardManagementPage.isLockedCardStatusDisplayed();
      expect(isLockedCardStatusDisplayed).toBeTruthy();
    });

    // Step 5: Tap on the Unlock Card button
    await test.step('Step 5: Tap on the Unlock Card button', async () => {
      await cardManagementPage.tapUnlockCardButton();
      const isUnlockPromptDisplayed = await cardManagementPage.isUnlockPromptDisplayed();
      expect(isUnlockPromptDisplayed).toBeTruthy();
    });

    // Step 6: Verify the prompt message content
    await test.step('Step 6: Verify the prompt message content', async () => {
      const promptMessage = await cardManagementPage.getUnlockPromptMessage();
      expect(promptMessage).toContain(TD.messages.unlockPrompt);
      
      const isOkButtonPresent = await cardManagementPage.isOkButtonPresent();
      expect(isOkButtonPresent).toBeTruthy();
    });
  });

  /**
   * Test Case: QE-851 TS-003 TC-001
   * Verify purchase transaction is declined for locked card
   */
  test('[QE-851 TS-003 TC-001] Verify purchase transaction is declined for locked card', async ({ page }) => {
    cardManagementPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await test.step('Step 1: Launch the mobile application', async () => {
      await cardManagementPage.launchApp(TD.urls.mobileAppUrl);
      const isLoginScreenDisplayed = await cardManagementPage.isLoginScreenDisplayed();
      expect(isLoginScreenDisplayed).toBeTruthy();
    });

    // Step 2: Enter valid credentials and login
    await test.step('Step 2: Enter valid credentials and login to the mobile app', async () => {
      await cardManagementPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
      const isHomeScreenDisplayed = await cardManagementPage.isHomeScreenDisplayed();
      expect(isHomeScreenDisplayed).toBeTruthy();
    });

    // Step 3: Navigate to Card Management section
    await test.step('Step 3: Navigate to Card Management section', async () => {
      await cardManagementPage.navigateToCardManagement();
      const isCardManagementScreenDisplayed = await cardManagementPage.isCardManagementScreenDisplayed();
      expect(isCardManagementScreenDisplayed).toBeTruthy();
    });

    // Step 4: Attempt to make a purchase transaction using the locked card
    await test.step('Step 4: Attempt to make a purchase transaction using the locked card', async () => {
      const errorMessage = await cardManagementPage.attemptPurchaseTransaction(
        TD.cards.lockedCard.cardId,
        TD.transactions.purchaseAttempt.merchant,
        TD.transactions.purchaseAttempt.amount
      );
      
      const isTransactionDeclined = await cardManagementPage.isTransactionDeclined();
      expect(isTransactionDeclined).toBeTruthy();
      
      if (errorMessage) {
        expect(errorMessage.toLowerCase()).toContain(TD.messages.cardLockedError.toLowerCase());
      }
    });
  });

  /**
   * Test Case: QE-851 TS-004 TC-001
   * Verify Transaction Limits button is disabled for locked card
   */
  test('[QE-851 TS-004 TC-001] Verify Transaction Limits button is disabled for locked card', async ({ page }) => {
    cardManagementPage = new MobileCardManagementPage(page);

    // Step 1: Launch the mobile application
    await test.step('Step 1: Launch the mobile application', async () => {
      await cardManagementPage.launchApp(TD.urls.mobileAppUrl);
      const isLoginScreenDisplayed = await cardManagementPage.isLoginScreenDisplayed();
      expect(isLoginScreenDisplayed).toBeTruthy();
    });

    // Step 2: Enter valid credentials and login
    await test.step('Step 2: Enter valid credentials and login to the mobile app', async () => {
      await cardManagementPage.login(TD.credentials.validUser.username, TD.credentials.validUser.password);
      const isHomeScreenDisplayed = await cardManagementPage.isHomeScreenDisplayed();
      expect(isHomeScreenDisplayed).toBeTruthy();
    });

    // Step 3: Navigate to Card Management section
    await test.step('Step 3: Navigate to Card Management section', async () => {
      await cardManagementPage.navigateToCardManagement();
      const isCardManagementScreenDisplayed = await cardManagementPage.isCardManagementScreenDisplayed();
      expect(isCardManagementScreenDisplayed).toBeTruthy();
    });

    // Step 4: Select and view the locked card details
    await test.step('Step 4: Select and view the locked card details', async () => {
      await cardManagementPage.selectLockedCard(TD.cards.lockedCard.cardId);
      const isCardDetailsScreenDisplayed = await cardManagementPage.isCardDetailsScreenDisplayed();
      expect(isCardDetailsScreenDisplayed).toBeTruthy();
    });

    // Step 5: Check the state of Transaction Limits button
    await test.step('Step 5: Check the state of Transaction Limits button', async () => {
      const buttonState = await cardManagementPage.getTransactionLimitsButtonState();
      expect(buttonState.isVisible).toBeTruthy();
      expect(buttonState.isDisabled).toBeTruthy();
      
      const isNotClickable = await cardManagementPage.isTransactionLimitsButtonNotClickable();
      expect(isNotClickable).toBeTruthy();
    });
  });
});