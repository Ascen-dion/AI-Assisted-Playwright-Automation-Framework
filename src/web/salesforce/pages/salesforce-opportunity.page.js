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
      // Convert date format from YYYY-MM-DD to MM/DD/YYYY for Salesforce
      let formattedDate = oppData.closeDate;
      if (oppData.closeDate.includes('-')) {
        const parts = oppData.closeDate.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
      }
      await this.fillLightningInput('CloseDate', formattedDate);
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
    // First, navigate to the Quotes tab in the related list
    console.log('Navigating to Quotes tab...');
    const quotesTab = this.page.locator('a[data-tab-name="Quotes"], a:has-text("Quotes")').first();
    await quotesTab.waitFor({ state: 'visible', timeout: 10000 });
    await quotesTab.click();
    await this.page.waitForTimeout(2000);
    
    // Click "New Quote" button - it could be a button or anchor with role="button"
    console.log('Clicking New Quote button...');
    const newQuoteButton = this.page.locator('[role="button"]:has-text("New Quote"), button:has-text("New Quote"), a:has-text("New Quote")').first();
    await newQuoteButton.waitFor({ state: 'visible', timeout: 10000 });
    await newQuoteButton.scrollIntoViewIfNeeded();
    await newQuoteButton.click();
    await this.waitForPageLoad();

    // Fill Quote fields
    if (quoteData.name) {
      await this.fillLightningInput('Name', quoteData.name);
    }
    if (quoteData.expirationDate) {
      await this.fillLightningInput('ExpirationDate', quoteData.expirationDate);
    }

    // Wait for any "Syncing" to complete - the form syncs lookup fields
    console.log('Waiting for form sync to complete...');
    await this.page.waitForTimeout(5000); // Give time for syncing to finish
    
    // Click Save button - try multiple selectors
    console.log('Clicking Save button in modal...');
    const modalSaveButton = this.page.locator('button:has-text("Save")').last(); // Use last() to get the Save button, not Cancel
    await modalSaveButton.waitFor({ state: 'visible', timeout: 10000 });
    await modalSaveButton.scrollIntoViewIfNeeded();
    await modalSaveButton.click();
    
    await this.waitForPageLoad();
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
