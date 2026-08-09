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
    
    // Status and LeadSource are optional - only fill if visible (reduced timeout)
    if (leadData.status) {
      try {
        const statusCombobox = this.page.locator('lightning-combobox[field-name="Status"]');
        const isVisible = await statusCombobox.isVisible({ timeout: 1000 });
        if (isVisible) {
          await this.selectComboboxOption('Status', leadData.status);
        }
      } catch (error) {
        console.log('Status field not available, skipping...');
      }
    }
    if (leadData.leadSource) {
      try {
        const leadSourceCombobox = this.page.locator('lightning-combobox[field-name="LeadSource"]');
        const isVisible = await leadSourceCombobox.isVisible({ timeout: 1000 });
        if (isVisible) {
          await this.selectComboboxOption('LeadSource', leadData.leadSource);
        }
      } catch (error) {
        console.log('LeadSource field not available, skipping...');
      }
    }
  }

  /**
   * Convert Lead to Opportunity
   * @param {object} conversionOptions - Conversion options
   */
  async convertLead(conversionOptions = {}) {
    console.log('Clicking Convert button...');
    await this.page.locator('button:has-text("Convert")').first().click();
    
    // Wait for modal container to appear (30 seconds for slow loading)
    console.log('Waiting for conversion modal to load...');
    await this.page.waitForSelector('div.slds-modal__container', { state: 'visible', timeout: 30000 });
    console.log('✓ Modal container detected');
    
    // Wait a bit for modal content to fully render
    await this.page.waitForTimeout(2000);
    
    // Verify modal is the Convert Lead modal by checking for any heading
    const modalHeading = await this.page.locator('div.slds-modal__container h2').first().textContent().catch(() => 'NOT_FOUND');
    console.log(`Modal heading: "${modalHeading}"`);
    
    // DEBUG: List all checkboxes in the modal
    const checkboxes = await this.page.locator('div.slds-modal__container input[type="checkbox"]').evaluateAll(elements => 
      elements.map(el => ({
        id: el.id,
        name: el.name,
        class: el.className,
        parentLabel: el.closest('label')?.textContent?.trim() || el.closest('lightning-input')?.getAttribute('field-name') || 'NO_LABEL',
        checked: el.checked
      }))
    );
    console.log('Checkboxes in modal:', JSON.stringify(checkboxes, null, 2));
    
    // Wait for modal to be fully interactive
    await this.page.waitForLoadState('domcontentloaded');
    console.log('✓ Convert Lead modal ready');

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

    // Create Opportunity option - try multiple selectors
    if (conversionOptions.createOpportunity !== false) {
      console.log('Enabling Opportunity creation...');
      
      // Try different checkbox selectors
      const opportunityCheckbox = await this.page.locator('input[type="checkbox"]').evaluateAll(elements => {
        for (const el of elements) {
          const label = el.closest('label')?.textContent?.toLowerCase() || '';
          const parentText = el.parentElement?.textContent?.toLowerCase() || '';
          if (label.includes('opportunity') || parentText.includes('opportunity')) {
            return el.id || el.name || true;
          }
        }
        return null;
      });
      
      console.log('Found opportunity checkbox:', opportunityCheckbox);
      
      if (opportunityCheckbox && typeof opportunityCheckbox === 'string') {
        // Lightning Web Components require JavaScript interaction to properly toggle checkboxes
        console.log('Using JavaScript to toggle checkbox...');
        await this.page.evaluate((checkboxId) => {
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            checkbox.checked = true;
            // Dispatch change event to trigger LWC listeners
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, opportunityCheckbox);
        
        // Wait a bit for the change to propagate
        await this.page.waitForTimeout(1000);
      } else {
        // Fallback: try clicking the label which should toggle the checkbox
        await this.page.locator('label:has-text("Opportunity")').click();
      }
      
      // Opportunity Name is auto-generated from Lead name by Salesforce - no need to fill
      console.log('Opportunity Name will be auto-generated from Lead name');
    } else {
      await this.uncheckLightningCheckbox('CreateOpportunity');
    }

    // Click the final Convert button at bottom of modal
    console.log('Clicking final Convert button...');
    const convertButtons = await this.page.locator('button:has-text("Convert")').count();
    console.log(`Found ${convertButtons} Convert button(s)`);
    
    // Click the last Convert button (the one in modal footer)
    await this.page.locator('button:has-text("Convert")').last().click();
    
    // Wait longer for success modal to appear (conversion takes time)
    console.log('Waiting for success confirmation modal...');
    await this.page.waitForTimeout(5000);
    
    // Check for the success modal heading
    const modalHeadings = await this.page.locator('h2, h1, h3').allInnerTexts();
    console.log('Modal headings on page:', modalHeadings);
    
    // Look for success indicators (either success message or the three section headings)
    const successMessage = modalHeadings.some(h => h.toLowerCase().includes('your lead has been converted'));
    const hasAccountHeading = modalHeadings.some(h => h.toLowerCase() === 'account');
    const hasContactHeading = modalHeadings.some(h => h.toLowerCase() === 'contact');
    const hasOpportunityHeading = modalHeadings.some(h => h.toLowerCase() === 'opportunity');
    const hasAllSections = hasAccountHeading && hasContactHeading && hasOpportunityHeading;
    
    if (successMessage || hasAllSections) {
      console.log('Success modal detected');
      
      // The modal has 3 sections with headings that may be in different cases
      // Wait for the Opportunity section to appear (it loads after the modal shows)
      console.log('Waiting for Opportunity section to load...');
      await this.page.waitForTimeout(2000); // Give time for section content to render
      
      // Find the section containing "OPPORTUNITY" or "Opportunity" (case-insensitive)
      console.log('Looking for Opportunity link in modal...');
      const oppSectionHeading = this.page.locator('h3, h2, h1').filter({ hasText: /opportunity/i }).first();
      const headingExists = await oppSectionHeading.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
      
      if (headingExists) {
        // Navigate up to the parent container, then find the first link
        const parentContainer = oppSectionHeading.locator('..').locator('..');
        const opportunityLink = parentContainer.locator('a').first();
        
        const linkText = await opportunityLink.innerText();
        console.log(`Clicking Opportunity link: "${linkText}"`);
        await opportunityLink.click();
        await this.page.waitForTimeout(3000);
        
        const currentUrl = this.page.url();
        console.log('Navigated to Opportunity:', currentUrl);
      } else {
        console.log('Could not find Opportunity section heading');
      }
    } else {
      console.log('Success modal not detected');
      const currentUrl = this.page.url();
      console.log('Current URL:', currentUrl);
    }
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
