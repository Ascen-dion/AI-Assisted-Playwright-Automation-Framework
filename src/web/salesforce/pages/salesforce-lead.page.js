/**
 * Salesforce Lead Page Object
 * 
 * Handles interactions with Salesforce Lead records.
 */

const SalesforceRecordBasePage = require('./salesforce-record-base.page');

class SalesforceLeadPage extends SalesforceRecordBasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Navigate to Lead detail page
   * @param {string} baseUrl - Salesforce base URL
   * @param {string} leadId - Lead record ID
   */
  async navigateTo(baseUrl, leadId) {
    await this.page.goto(`${baseUrl}/lightning/r/Lead/${leadId}/view`);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Leads list view
   * @param {string} baseUrl - Salesforce base URL
   */
  async navigateToListView(baseUrl) {
    await this.page.goto(`${baseUrl}/lightning/o/Lead/list`);
    await this.waitForPageLoad();
  }

  /**
   * Fill Lead form with required fields
   * @param {object} leadData - Lead data object
   */
  async fillLeadForm(leadData) {
    if (leadData.firstName) {
      await this.fillLightningInput('FirstName', leadData.firstName);
    }
    if (leadData.lastName) {
      await this.fillLightningInput('LastName', leadData.lastName);
    }
    if (leadData.company) {
      await this.fillLightningInput('Company', leadData.company);
    }
    if (leadData.email) {
      await this.fillLightningInput('Email', leadData.email);
    }
    if (leadData.phone) {
      await this.fillLightningInput('Phone', leadData.phone);
    }
    if (leadData.status) {
      await this.selectComboboxOption('Status', leadData.status);
    }
    if (leadData.leadSource) {
      await this.selectComboboxOption('LeadSource', leadData.leadSource);
    }
  }

  /**
   * Convert Lead to Opportunity
   * @param {object} conversionOptions - Conversion options
   */
  async convertLead(conversionOptions = {}) {
    // Click Convert button
    await this.page.locator('button:has-text("Convert")').first().click();
    await this.waitForPageLoad();

    // Wait for conversion modal
    await this.page.waitForSelector('h2:has-text("Convert Lead")', { state: 'visible', timeout: 10000 });

    // Select or create Account
    if (conversionOptions.createNewAccount === false) {
      // Choose existing account
      if (conversionOptions.accountName) {
        await this.fillLookupField('Account', conversionOptions.accountName, conversionOptions.accountName);
      }
    }

    // Select or create Contact
    if (conversionOptions.createNewContact === false) {
      // Choose existing contact
      if (conversionOptions.contactName) {
        await this.fillLookupField('Contact', conversionOptions.contactName, conversionOptions.contactName);
      }
    }

    // Create Opportunity option
    if (conversionOptions.createOpportunity !== false) {
      await this.checkLightningCheckbox('CreateOpportunity');
      
      if (conversionOptions.opportunityName) {
        await this.fillLightningInput('OpportunityName', conversionOptions.opportunityName);
      }
    } else {
      await this.uncheckLightningCheckbox('CreateOpportunity');
    }

    // Convert
    await this.page.locator('button:has-text("Convert")').nth(1).click();
    await this.waitForPageLoad();
    await this.verifySuccessToast('converted');
  }

  /**
   * Verify Lead is converted
   * @returns {Promise<boolean>}
   */
  async isLeadConverted() {
    try {
      const convertedBanner = this.page.locator('div:has-text("This lead has been converted")');
      return await convertedBanner.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get converted Opportunity ID
   * @returns {Promise<string>}
   */
  async getConvertedOpportunityId() {
    const oppLink = this.page.locator('a[title*="Opportunity"]').first();
    const href = await oppLink.getAttribute('href');
    const match = href.match(/\/Opportunity\/(.*?)\/view/);
    return match ? match[1] : null;
  }

  /**
   * Verify mandatory field validation error
   * @param {string} fieldName - Field name that triggered validation
   */
  async verifyMandatoryFieldError(fieldName) {
    const errorElement = this.page.locator(`lightning-input[field-name="${fieldName}"] div.slds-form-element__help`);
    await errorElement.waitFor({ state: 'visible', timeout: 5000 });
    const errorText = await errorElement.innerText();
    
    if (!errorText.includes('Complete this field') && !errorText.includes('required')) {
      throw new Error(`Expected mandatory field error for "${fieldName}", but got "${errorText}"`);
    }
  }
}

module.exports = SalesforceLeadPage;
