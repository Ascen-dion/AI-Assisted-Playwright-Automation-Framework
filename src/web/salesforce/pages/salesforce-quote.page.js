/**
 * Salesforce Quote Page Object
 * 
 * Handles interactions with Salesforce Quote records and Quote Line Items.
 */

const SalesforceRecordBasePage = require('./salesforce-record-base.page');

class SalesforceQuotePage extends SalesforceRecordBasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Navigate to Quote detail page
   * @param {string} baseUrl - Salesforce base URL
   * @param {string} quoteId - Quote record ID
   */
  async navigateTo(baseUrl, quoteId) {
    await this.page.goto(`${baseUrl}/lightning/r/Quote/${quoteId}/view`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Quotes list view
   * @param {string} baseUrl - Salesforce base URL
   */
  async navigateToListView(baseUrl) {
    await this.page.goto(`${baseUrl}/lightning/o/Quote/list`);
    await this.waitForPageLoad();
  }

  /**
   * Fill Quote form fields
   * @param {object} quoteData - Quote data object
   */
  async fillQuoteForm(quoteData) {
    if (quoteData.name) {
      await this.fillLightningInput('Name', quoteData.name);
    }
    if (quoteData.expirationDate) {
      await this.fillLightningInput('ExpirationDate', quoteData.expirationDate);
    }
    if (quoteData.status) {
      await this.selectComboboxOption('Status', quoteData.status);
    }
  }

  /**
   * Add a Quote Line Item
   * @param {object} lineItemData - Line item data
   */
  async addQuoteLineItem(lineItemData) {
    // Click "Add Products" or "New" button in Related List
    await this.page.locator('a[title="Add Products"], button:has-text("Add Products")').first().click();
    await this.waitForPageLoad();

    // Search for product
    if (lineItemData.product) {
      const searchInput = this.page.locator('input[placeholder*="Search Products"]').first();
      await searchInput.fill(lineItemData.product);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
      
      // Select product from results
      await this.page.locator(`tr:has-text("${lineItemData.product}") input[type="checkbox"]`).first().check();
      await this.page.locator('button:has-text("Next")').click();
    }

    // Fill quantity
    if (lineItemData.quantity) {
      await this.fillLightningInput('Quantity', lineItemData.quantity.toString());
    }

    // Fill discount
    if (lineItemData.discount !== undefined) {
      await this.fillLightningInput('Discount', lineItemData.discount.toString());
    }

    // Fill justification if provided
    if (lineItemData.justification) {
      await this.fillLightningTextarea('Justification__c', lineItemData.justification);
    }

    // Click Save
    await this.clickSave();
  }

  /**
   * Edit Quote Line Item
   * @param {string} productName - Product name to identify the line item
   * @param {object} updates - Fields to update
   */
  async editQuoteLineItem(productName, updates) {
    // Find the line item row and click Edit
    const rowLocator = this.page.locator(`tr:has-text("${productName}")`);
    await rowLocator.locator('a[title="Edit"]').click();
    await this.waitForPageLoad();

    // Update fields
    if (updates.quantity !== undefined) {
      await this.fillLightningInput('Quantity', updates.quantity.toString());
    }
    if (updates.discount !== undefined) {
      await this.fillLightningInput('Discount', updates.discount.toString());
    }
    if (updates.justification) {
      await this.fillLightningTextarea('Justification__c', updates.justification);
    }

    await this.clickSave();
  }

  /**
   * Submit Quote for Approval
   */
  async submitForApproval() {
    // Click "Submit for Approval" button
    await this.page.locator('button:has-text("Submit for Approval")').click();
    
    // Handle any confirmation modal
    const modal = this.page.locator('div.slds-modal');
    if (await modal.isVisible()) {
      await this.page.locator('div.slds-modal button:has-text("Submit")').click();
    }
    
    await this.waitForPageLoad();
    await this.verifySuccessToast('submitted for approval');
  }

  /**
   * Get Quote approval status
   * @returns {Promise<string>}
   */
  async getApprovalStatus() {
    const statusField = this.page.locator('lightning-formatted-text:has-text("Approval Status")').locator('..').locator('span').nth(1);
    return await statusField.innerText();
  }

  /**
   * Approve Quote (as approver)
   */
  async approveQuote() {
    await this.page.locator('button:has-text("Approve")').click();
    await this.waitForPageLoad();
    await this.verifySuccessToast('approved');
  }

  /**
   * Reject Quote (as approver)
   * @param {string} comments - Rejection comments
   */
  async rejectQuote(comments) {
    await this.page.locator('button:has-text("Reject")').click();
    
    // Fill rejection comments
    const commentsField = this.page.locator('textarea[placeholder*="Comments"]').first();
    await commentsField.fill(comments);
    
    await this.page.locator('button:has-text("Reject")').nth(1).click();
    await this.waitForPageLoad();
    await this.verifySuccessToast('rejected');
  }

  /**
   * Verify validation error message
   * @param {string} expectedError - Expected error message text
   */
  async verifyValidationError(expectedError) {
    const errorElement = this.page.locator('div.slds-form-element__help, ul.errorsList').first();
    await errorElement.waitFor({ state: 'visible', timeout: 5000 });
    const errorText = await errorElement.innerText();
    
    if (!errorText.includes(expectedError)) {
      throw new Error(`Expected validation error to include "${expectedError}", but got "${errorText}"`);
    }
  }

  /**
   * Get total discount percentage for Quote
   * @returns {Promise<number>}
   */
  async getTotalDiscount() {
    const discountField = this.page.locator('span:has-text("Total Discount")').locator('..').locator('span').nth(1);
    const discountText = await discountField.innerText();
    return parseFloat(discountText.replace('%', ''));
  }

  /**
   * Verify Quote is in approval process
   * @param {string} expectedStatus - Expected approval status
   */
  async verifyApprovalStatus(expectedStatus) {
    const actualStatus = await this.getApprovalStatus();
    if (!actualStatus.includes(expectedStatus)) {
      throw new Error(`Expected approval status to include "${expectedStatus}", but got "${actualStatus}"`);
    }
  }

  /**
   * View approval history
   * @returns {Promise<Array>} - Array of approval history entries
   */
  async getApprovalHistory() {
    // Navigate to approval history related list
    const approvalHistorySection = this.page.locator('article:has-text("Approval History")');
    await approvalHistorySection.scrollIntoViewIfNeeded();
    
    // Get all rows
    const rows = await this.page.locator('article:has-text("Approval History") table tbody tr').all();
    const history = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').allInnerTexts();
      history.push({
        date: cells[0],
        status: cells[1],
        approver: cells[2],
        comments: cells[3] || ''
      });
    }
    
    return history;
  }
}

module.exports = SalesforceQuotePage;
