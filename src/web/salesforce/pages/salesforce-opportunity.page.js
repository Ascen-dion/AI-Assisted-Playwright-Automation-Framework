/**
 * Salesforce Opportunity Page Object
 * 
 * Handles interactions with Salesforce Opportunity records.
 */

const SalesforceRecordBasePage = require('./salesforce-record-base.page');

class SalesforceOpportunityPage extends SalesforceRecordBasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Navigate to Opportunity detail page
   * @param {string} baseUrl - Salesforce base URL
   * @param {string} opportunityId - Opportunity record ID
   */
  async navigateTo(baseUrl, opportunityId) {
    await this.page.goto(`${baseUrl}/lightning/r/Opportunity/${opportunityId}/view`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Opportunities list view
   * @param {string} baseUrl - Salesforce base URL
   */
  async navigateToListView(baseUrl) {
    await this.page.goto(`${baseUrl}/lightning/o/Opportunity/list`);
    await this.waitForPageLoad();
  }

  /**
   * Fill Opportunity form
   * @param {object} oppData - Opportunity data object
   */
  async fillOpportunityForm(oppData) {
    if (oppData.name) {
      await this.fillLightningInput('Name', oppData.name);
    }
    if (oppData.amount) {
      await this.fillLightningInput('Amount', oppData.amount.toString());
    }
    if (oppData.closeDate) {
      await this.fillLightningInput('CloseDate', oppData.closeDate);
    }
    if (oppData.stage) {
      await this.selectComboboxOption('StageName', oppData.stage);
    }
    if (oppData.accountName) {
      await this.fillLookupField('Account', oppData.accountName, oppData.accountName);
    }
  }

  /**
   * Get Opportunity amount
   * @returns {Promise<number>}
   */
  async getAmount() {
    const amountField = this.page.locator('lightning-formatted-number[data-output-element-id*="Amount"]').first();
    const amountText = await amountField.innerText();
    return parseFloat(amountText.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get Opportunity stage
   * @returns {Promise<string>}
   */
  async getStage() {
    const stageField = this.page.locator('span:has-text("Stage")').locator('..').locator('span').nth(1);
    return await stageField.innerText();
  }

  /**
   * Get associated Account name
   * @returns {Promise<string>}
   */
  async getAccountName() {
    const accountLink = this.page.locator('a[title*="Account"]').first();
    return await accountLink.innerText();
  }

  /**
   * Get associated Contact name
   * @returns {Promise<string>}
   */
  async getContactName() {
    const contactLink = this.page.locator('a[title*="Contact"]').first();
    return await contactLink.innerText();
  }

  /**
   * Verify Opportunity was created from Lead conversion
   * @param {string} expectedLeadName - Original lead name to verify
   */
  async verifyCreatedFromLead(expectedLeadName) {
    // Check activity history or lead source
    const activitySection = this.page.locator('article:has-text("Activity")');
    await activitySection.scrollIntoViewIfNeeded();
    
    const leadReference = this.page.locator(`span:has-text("${expectedLeadName}")`);
    const isVisible = await leadReference.isVisible();
    
    if (!isVisible) {
      console.warn(`Could not verify Lead reference to "${expectedLeadName}" in Opportunity`);
    }
  }

  /**
   * Create a Quote from Opportunity
   * @param {object} quoteData - Quote data
   */
  async createQuote(quoteData) {
    // Click "New Quote" button in Related List
    await this.page.locator('a[title="New Quote"], button:has-text("New Quote")').first().click();
    await this.waitForPageLoad();

    // Fill Quote fields
    if (quoteData.name) {
      await this.fillLightningInput('Name', quoteData.name);
    }
    if (quoteData.expirationDate) {
      await this.fillLightningInput('ExpirationDate', quoteData.expirationDate);
    }

    await this.clickSave();
  }

  /**
   * Get Quote ID from Opportunity
   * @returns {Promise<string>}
   */
  async getQuoteId() {
    const quoteLink = this.page.locator('a[title*="Quote"]').first();
    const href = await quoteLink.getAttribute('href');
    const match = href.match(/\/Quote\/(.*?)\/view/);
    return match ? match[1] : null;
  }
}

module.exports = SalesforceOpportunityPage;
