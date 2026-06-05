const loc = require('./locators/mobile-card-management.locators');
const logger = require('../helpers/logger');

class MobileCardManagementPage {
  constructor(page) {
    this.page = page;
  }

  async launchApp(url) {
    logger.info('Launching mobile application');
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await loc.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.usernameField(this.page).fill(username);
    await loc.passwordField(this.page).fill(password);
    await loc.signInButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async isHomeScreenDisplayed() {
    await loc.homeScreen(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.homeScreen(this.page).isVisible();
  }

  async navigateToCardManagement() {
    logger.info('Navigating to Card Management section');
    await loc.cardManagementMenuItem(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.cardManagementMenuItem(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async isCardManagementScreenDisplayed() {
    await loc.cardList(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.cardList(this.page).isVisible();
  }

  async selectLockedCard() {
    logger.info('Selecting locked card');
    await loc.lockedCardStatus(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const lockedCard = loc.cardItem(this.page).filter({ has: loc.lockedCardStatus(this.page) }).first();
    await lockedCard.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async isCardDetailsScreenDisplayed() {
    await loc.cardDetailsScreen(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.cardDetailsScreen(this.page).isVisible();
  }

  async isLockedStatusVisible() {
    await loc.lockedCardStatus(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.lockedCardStatus(this.page).isVisible();
  }

  async getCardStatus() {
    await loc.cardStatusIndicator(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.cardStatusIndicator(this.page).textContent();
  }

  async clickUnlockCardButton() {
    logger.info('Clicking Unlock Card button');
    await loc.unlockCardButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.unlockCardButton(this.page).click();
    await this.page.waitForTimeout(1000);
  }

  async isPromptDisplayed() {
    await loc.promptModal(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.promptModal(this.page).isVisible();
  }

  async getPromptMessage() {
    await loc.promptMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.promptMessage(this.page).textContent();
  }

  async clickPromptOkButton() {
    logger.info('Clicking OK button on prompt');
    await loc.promptOkButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.promptOkButton(this.page).click();
    await this.page.waitForTimeout(1000);
  }

  async isPromptClosed() {
    try {
      await loc.promptModal(this.page).waitFor({ state: 'hidden', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async attemptPurchaseTransaction(cardId, merchant, amount) {
    logger.info(`Attempting purchase transaction: Merchant=${merchant}, Amount=${amount}`);
    // This is a placeholder - actual implementation depends on transaction flow
    // Typically would involve API call or separate transaction screen
    await this.page.waitForTimeout(2000);
  }

  async isTransactionDeclined() {
    await loc.transactionDeclinedMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.transactionDeclinedMessage(this.page).isVisible();
  }

  async getTransactionErrorMessage() {
    await loc.transactionDeclinedMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.transactionDeclinedMessage(this.page).textContent();
  }

  async isTransactionLimitsButtonDisabled() {
    await loc.transactionLimitsButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const isDisabled = await loc.transactionLimitsButton(this.page).isDisabled();
    const hasGreyedClass = await loc.transactionLimitsButton(this.page).evaluate(el => 
      el.classList.contains('disabled') || el.classList.contains('greyed-out') || 
      el.getAttribute('aria-disabled') === 'true'
    );
    return isDisabled || hasGreyedClass;
  }

  async isTransactionChannelsButtonDisabled() {
    await loc.transactionChannelsButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const isDisabled = await loc.transactionChannelsButton(this.page).isDisabled();
    const hasGreyedClass = await loc.transactionChannelsButton(this.page).evaluate(el => 
      el.classList.contains('disabled') || el.classList.contains('greyed-out') || 
      el.getAttribute('aria-disabled') === 'true'
    );
    return isDisabled || hasGreyedClass;
  }

  async isReportCardIssueButtonDisabled() {
    await loc.reportCardIssueButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const isDisabled = await loc.reportCardIssueButton(this.page).isDisabled();
    const hasGreyedClass = await loc.reportCardIssueButton(this.page).evaluate(el => 
      el.classList.contains('disabled') || el.classList.contains('greyed-out') || 
      el.getAttribute('aria-disabled') === 'true'
    );
    return isDisabled || hasGreyedClass;
  }

  async attemptClickTransactionLimitsButton() {
    logger.info('Attempting to click Transaction Limits button');
    const initialUrl = this.page.url();
    await loc.transactionLimitsButton(this.page).click({ force: true });
    await this.page.waitForTimeout(2000);
    const currentUrl = this.page.url();
    return initialUrl === currentUrl;
  }

  async isUnlockCardButtonEnabled() {
    await loc.unlockCardButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const isDisabled = await loc.unlockCardButton(this.page).isDisabled();
    const hasGreyedClass = await loc.unlockCardButton(this.page).evaluate(el => 
      el.classList.contains('disabled') || el.classList.contains('greyed-out') || 
      el.getAttribute('aria-disabled') === 'true'
    );
    return !isDisabled && !hasGreyedClass;
  }

  async isUnlockCardButtonClickable() {
    await loc.unlockCardButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.unlockCardButton(this.page).isEnabled();
  }

  async verifyStaysOnSameScreen(initialUrl) {
    await this.page.waitForTimeout(2000);
    const currentUrl = this.page.url();
    return initialUrl === currentUrl;
  }
}

module.exports = MobileCardManagementPage;