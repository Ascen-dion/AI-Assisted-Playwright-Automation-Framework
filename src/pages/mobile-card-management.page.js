/**
 * Page Object for Mobile Card Management Module
 * Handles login, navigation, and card management operations
 */

const loc = require('./locators/mobile-card-management.locators');

class MobileCardManagementPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Launch the mobile application
   * @param {string} appUrl - Mobile app URL or package identifier
   */
  async launchApp(appUrl) {
    await this.page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Verify login screen is displayed
   * @returns {boolean} - True if login screen is visible
   */
  async isLoginScreenDisplayed() {
    try {
      await loc.loginScreen(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.loginScreen(this.page).isVisible();
    } catch (error) {
      console.error('Login screen not displayed:', error.message);
      return false;
    }
  }

  /**
   * Login to the mobile application
   * @param {string} username - User email/username
   * @param {string} password - User password
   */
  async login(username, password) {
    await loc.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.usernameField(this.page).fill(username);
    await loc.passwordField(this.page).fill(password);
    await loc.loginButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Verify home screen is displayed after login
   * @returns {boolean} - True if home screen is visible
   */
  async isHomeScreenDisplayed() {
    try {
      await loc.homeScreen(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.homeScreen(this.page).isVisible();
    } catch (error) {
      console.error('Home screen not displayed:', error.message);
      return false;
    }
  }

  /**
   * Navigate to Card Management section
   */
  async navigateToCardManagement() {
    await loc.cardManagementMenu(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cardManagementMenu(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Verify Card Management screen is displayed
   * @returns {boolean} - True if card management screen is visible
   */
  async isCardManagementScreenDisplayed() {
    try {
      await loc.cardManagementScreen(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.cardManagementScreen(this.page).isVisible();
    } catch (error) {
      console.error('Card Management screen not displayed:', error.message);
      return false;
    }
  }

  /**
   * Verify card list is displayed
   * @returns {boolean} - True if card list is visible
   */
  async isCardListDisplayed() {
    try {
      await loc.cardList(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.cardList(this.page).isVisible();
    } catch (error) {
      console.error('Card list not displayed:', error.message);
      return false;
    }
  }

  /**
   * Get card status indicator
   * @returns {string} - Card status text
   */
  async getCardStatus() {
    await loc.cardStatusIndicator(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.cardStatusIndicator(this.page).textContent();
  }

  /**
   * Verify locked status badge is visible
   * @returns {boolean} - True if locked status is visible
   */
  async isLockedStatusVisible() {
    try {
      await loc.lockedStatusBadge(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.lockedStatusBadge(this.page).isVisible();
    } catch (error) {
      console.error('Locked status not visible:', error.message);
      return false;
    }
  }

  /**
   * Select and view locked card details
   * @param {string} cardId - Card identifier
   */
  async selectLockedCard(cardId) {
    const cardSelector = cardId ? loc.cardById(this.page, cardId) : loc.cardByStatus(this.page, 'Locked');
    await cardSelector.waitFor({ state: 'visible', timeout: 15000 });
    await cardSelector.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Verify card details screen is displayed
   * @returns {boolean} - True if card details screen is visible
   */
  async isCardDetailsScreenDisplayed() {
    try {
      await loc.cardDetailsScreen(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.cardDetailsScreen(this.page).isVisible();
    } catch (error) {
      console.error('Card details screen not displayed:', error.message);
      return false;
    }
  }

  /**
   * Verify locked card status is displayed in details
   * @returns {boolean} - True if locked status is visible
   */
  async isLockedCardStatusDisplayed() {
    try {
      await loc.lockedCardStatus(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.lockedCardStatus(this.page).isVisible();
    } catch (error) {
      console.error('Locked card status not displayed:', error.message);
      return false;
    }
  }

  /**
   * Tap on Unlock Card button
   */
  async tapUnlockCardButton() {
    await loc.unlockCardButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.unlockCardButton(this.page).click();
    await this.page.waitForTimeout(1000); // Wait for prompt animation
  }

  /**
   * Verify unlock prompt is displayed
   * @returns {boolean} - True if unlock prompt is visible
   */
  async isUnlockPromptDisplayed() {
    try {
      await loc.unlockPrompt(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.unlockPrompt(this.page).isVisible();
    } catch (error) {
      console.error('Unlock prompt not displayed:', error.message);
      return false;
    }
  }

  /**
   * Get unlock prompt message text
   * @returns {string} - Prompt message content
   */
  async getUnlockPromptMessage() {
    await loc.unlockPromptMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.unlockPromptMessage(this.page).textContent();
  }

  /**
   * Verify OK button is present in unlock prompt
   * @returns {boolean} - True if OK button is visible
   */
  async isOkButtonPresent() {
    try {
      await loc.unlockPromptOkButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.unlockPromptOkButton(this.page).isVisible();
    } catch (error) {
      console.error('OK button not present:', error.message);
      return false;
    }
  }

  /**
   * Attempt purchase transaction with locked card
   * @param {string} cardId - Card identifier
   * @param {string} merchant - Merchant name
   * @param {string} amount - Transaction amount
   * @returns {string} - Error message if transaction is declined
   */
  async attemptPurchaseTransaction(cardId, merchant, amount) {
    // Note: This is a placeholder - actual implementation depends on app flow
    // This method should trigger a transaction attempt in the app
    console.log(`Attempting transaction: Card=${cardId}, Merchant=${merchant}, Amount=${amount}`);
    await this.page.waitForTimeout(2000); // Wait for transaction processing
    
    try {
      await loc.transactionErrorMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.transactionErrorMessage(this.page).textContent();
    } catch (error) {
      console.error('Transaction error message not found:', error.message);
      return null;
    }
  }

  /**
   * Get transaction error message
   * @returns {string} - Error message text
   */
  async getTransactionErrorMessage() {
    await loc.transactionErrorMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.transactionErrorMessage(this.page).textContent();
  }

  /**
   * Verify transaction is declined/blocked
   * @returns {boolean} - True if error message is visible
   */
  async isTransactionDeclined() {
    try {
      await loc.transactionErrorMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.transactionErrorMessage(this.page).isVisible();
    } catch (error) {
      console.error('Transaction error not displayed:', error.message);
      return false;
    }
  }

  /**
   * Check Transaction Limits button state
   * @returns {object} - Object containing isVisible and isEnabled properties
   */
  async getTransactionLimitsButtonState() {
    try {
      await loc.transactionLimitsButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await loc.transactionLimitsButton(this.page).isVisible();
      const isEnabled = await loc.transactionLimitsButton(this.page).isEnabled();
      const isDisabled = await loc.transactionLimitsButton(this.page).isDisabled();
      
      return {
        isVisible,
        isEnabled,
        isDisabled
      };
    } catch (error) {
      console.error('Transaction Limits button not found:', error.message);
      return {
        isVisible: false,
        isEnabled: false,
        isDisabled: true
      };
    }
  }

  /**
   * Verify Transaction Limits button is disabled
   * @returns {boolean} - True if button is disabled/greyed out
   */
  async isTransactionLimitsButtonDisabled() {
    try {
      await loc.transactionLimitsButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.transactionLimitsButton(this.page).isDisabled();
    } catch (error) {
      console.error('Transaction Limits button state check failed:', error.message);
      return false;
    }
  }

  /**
   * Verify Transaction Limits button is not clickable
   * @returns {boolean} - True if button is not clickable
   */
  async isTransactionLimitsButtonNotClickable() {
    try {
      const buttonState = await this.getTransactionLimitsButtonState();
      return buttonState.isDisabled || !buttonState.isEnabled;
    } catch (error) {
      console.error('Transaction Limits button clickability check failed:', error.message);
      return false;
    }
  }
}

module.exports = MobileCardManagementPage;