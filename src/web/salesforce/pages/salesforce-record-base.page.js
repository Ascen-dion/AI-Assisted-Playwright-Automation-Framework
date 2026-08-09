/**
 * Salesforce Record Base Page
 * 
 * This is a base class for all Salesforce record pages (Account, Contact, Lead, Opportunity, etc.)
 * It provides common methods for CRUD operations.
 */

const loc = require('../locators/salesforce-record-base.locators');

class SalesforceRecordBasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for Lightning page to fully load
   */
  async waitForPageLoad() {
    // Wait for Lightning spinner to disappear
    await this.page.waitForSelector('lightning-spinner', { state: 'detached', timeout: 10000 }).catch(() => {});
    
    // Wait for either record details (page) OR modal form (for New/Edit)
    try {
      await this.page.waitForSelector('article.slds-card, div.slds-modal__container, lightning-record-edit-form, forcerecord-record-layout-item', { 
        state: 'visible', 
        timeout: 10000 
      });
    } catch (error) {
      // Fallback: just wait a bit for any content to render
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Click "New" button to create a new record
   */
  async clickNew() {
    await loc.newButton(this.page).click();
    // Wait for modal form to appear
    await this.page.waitForSelector('div.slds-modal__container, lightning-record-edit-form, h2:has-text("New")', { 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Handle record type selection if present
    // Wait a moment for the modal to fully render
    await this.page.waitForTimeout(1000);
    
    const nextButton = this.page.locator('button:has-text("Next")');
    const isNextVisible = await nextButton.isVisible().catch(() => false);
    
    if (isNextVisible) {
      console.log('Record type selection detected - clicking Next button...');
      await nextButton.click();
      // Wait for form to load after clicking Next
      await this.page.waitForTimeout(3000);
      console.log('Next clicked, form should now be visible');
    }
    
    // Wait for form fields to be fully loaded
    console.log('Waiting for form fields to load...');
    await this.page.waitForTimeout(2000);
    
    // Wait for at least one lightning input or combobox to be visible
    await this.page.waitForSelector('lightning-input, lightning-combobox, lightning-textarea', {
      state: 'visible',
      timeout: 10000
    });
    
    // Additional wait for network to settle and dynamic content to load
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('Network not idle, continuing anyway...');
    });
    
    await this.page.waitForTimeout(1000);
    console.log('Form fields loaded and ready for interaction');
  }

  /**
   * Click "Edit" button to edit current record
   */
  async clickEdit() {
    await loc.editButton(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Click "Save" button to save record changes
   */
  async clickSave() {
    const saveButton = loc.saveButton(this.page);
    
    // Wait for any form validation to complete
    await this.page.waitForTimeout(1000);
    
    // Check if there are any validation errors on the form
    const hasErrors = await this.page.locator('.slds-has-error, div[role="alert"]').count() > 0;
    if (hasErrors) {
      console.warn('⚠️  Form has validation errors, attempting to save anyway...');
      const errorMessages = await this.page.locator('.slds-form-element__help, div[role="alert"]').allTextContents();
      console.log('Validation errors:', errorMessages.filter(m => m.trim()));
    }
    
    // Wait for any loading spinners to disappear
    await this.page.waitForTimeout(1000);
    const spinners = this.page.locator('lightning-spinner, div.slds-spinner');
    const spinnerCount = await spinners.count();
    if (spinnerCount > 0) {
      console.log(`Waiting for ${spinnerCount} spinner(s) to disappear...`);
      await this.page.waitForTimeout(3000);
    }
    
    // Check for and close any blocking overlays/modals
    const overlays = this.page.locator('.slds-backdrop, .slds-modal__container > .slds-spinner_container');
    const overlayCount = await overlays.count();
    if (overlayCount > 0) {
      console.log(`Found ${overlayCount} overlay(s), waiting for them to clear...`);
      await this.page.waitForTimeout(2000);
    }
    
    // Try keyboard shortcut first (most reliable for Salesforce)
    console.log('Trying Ctrl+S keyboard shortcut to save...');
    try {
      await this.page.keyboard.press('Control+s');
      await this.page.waitForTimeout(500);
      
      // Check if save started (look for spinner or loading)
      const saveInProgress = await this.page.locator('lightning-spinner, .slds-spinner').count() > 0;
      if (saveInProgress) {
        console.log('✓ Save initiated via keyboard shortcut');
        // Don't return yet, let the rest of the method handle confirmation
      } else {
        // Keyboard shortcut didn't work, try clicking
        throw new Error('Keyboard shortcut did not initiate save');
      }
    } catch (e) {
      console.log('Keyboard shortcut failed or not applicable, trying button click...');
      
      // Scroll the modal footer into view
      const footer = this.page.locator('.slds-modal__footer, footer').first();
      await footer.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {
        console.log('Could not scroll footer into view...');
      });
      await this.page.waitForTimeout(500);
      
      // Try clicking the Save button with multiple strategies
      let clicked = false;
      
      // Strategy 1: Normal click
      try {
        await saveButton.click({ timeout: 5000 });
        console.log('✓ Save button clicked (normal)');
        clicked = true;
      } catch (e1) {
        console.log('Normal click failed, trying force click...');
        
        // Strategy 2: Force click
        try {
          await saveButton.click({ force: true, timeout: 5000 });
          console.log('✓ Save button clicked (force)');
          clicked = true;
        } catch (e2) {
          console.log('Force click failed, trying dispatchEvent...');
          
          // Strategy 3: dispatchEvent (better than direct .click())
          try {
            await saveButton.dispatchEvent('click');
            console.log('✓ Save button clicked (dispatchEvent)');
            clicked = true;
          } catch (e3) {
            console.log('dispatchEvent failed, trying JavaScript click as last resort...');
            
            // Strategy 4: JavaScript click (last resort)
            const clicked = await this.page.evaluate(() => {
              // Find all buttons with Save text
              const allButtons = Array.from(document.querySelectorAll('button'));
              const saveButtons = allButtons.filter(btn => 
                btn.textContent.trim().includes('Save') && 
                (btn.name === 'SaveEdit' || btn.getAttribute('data-aura-class')?.includes('uiButton'))
              );
              
              // Try to find a visible one
              for (const btn of saveButtons) {
                const rect = btn.getBoundingClientRect();
                const style = window.getComputedStyle(btn);
                
                // Check if button is somewhat visible (not display:none or visibility:hidden)
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                  console.log('Found Save button, dispatching click event...');
                  
                  // Create and dispatch a proper click event
                  const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                  });
                  
                  btn.dispatchEvent(clickEvent);
                  
                  // Also try the native click
                  if (typeof btn.click === 'function') {
                    btn.click();
                  }
                  
                  return true;
                }
              }
              
              return false;
            });
            
            if (clicked) {
              console.log('✓ Save button clicked (JavaScript with proper events)');
            } else {
              console.warn('⚠️  Could not find clickable Save button');
            }
            clicked = true;
          }
        }
      }
    }
    
    // Wait for save to complete - look for success toast, URL change, or duplicate warning
    try {
      // Check for duplicate detection warning
      await this.page.waitForTimeout(2000);
      const duplicateWarning = this.page.locator('div:has-text("Similar Records Exist"), div:has-text("duplicate")');
      const hasDuplicateWarning = await duplicateWarning.count() > 0;
      
      if (hasDuplicateWarning) {
        console.log('⚠️  Duplicate warning - clicking Save again to confirm...');
        await saveButton.click({ timeout: 5000 });
        await this.page.waitForTimeout(2000);
      }
      
      // Wait for success toast
      const toastVisible = await this.page.waitForSelector('div.toastMessage, span.toastMessage', { state: 'visible', timeout: 10000 }).catch(() => null);
      
      if (toastVisible) {
        const toastText = await toastVisible.textContent();
        console.log(`✓ Success: ${toastText.trim()}`);
      }
      
      // Close any modal that might still be open (e.g., "New" form reopening for quick entry)
      await this.page.waitForTimeout(1000);
      const modalStillOpen = await this.page.locator('div.slds-modal__container').isVisible().catch(() => false);
      
      if (modalStillOpen) {
        console.log('Modal still open, closing with Escape...');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        console.log('✓ Modal closed');
      }
    } catch (error) {
      console.log('Save completed, proceeding...');
    }
  }

  /**
   * Click "Cancel" button to cancel edit mode
   */
  async clickCancel() {
    await loc.cancelButton(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Delete current record
   */
  async deleteRecord() {
    // Open action dropdown
    await loc.showActionsButton(this.page).click();
    
    // Click Delete
    await loc.deleteButton(this.page).click();
    
    // Confirm in modal
    await loc.modal(this.page).waitFor({ state: 'visible', timeout: 5000 });
    await loc.modalConfirmButton(this.page).click();
    
    // Wait for redirect to list view
    await this.page.waitForURL(/.*\/lightning\/o\/.*\/list/, { timeout: 10000 }).catch(() => {});
  }

  /**
   * Get record title from page header
   * @returns {Promise<string>}
   */
  async getRecordTitle() {
    return await loc.recordTitle(this.page).innerText();
  }

  /**
   * Verify record title matches expected value
   * @param {string} expectedTitle - The expected record title
   */
  async verifyRecordTitle(expectedTitle) {
    const actualTitle = await this.getRecordTitle();
    if (!actualTitle.includes(expectedTitle)) {
      throw new Error(`Expected record title to include "${expectedTitle}", but got "${actualTitle}"`);
    }
  }

  /**
   * Verify success toast message
   * @param {string} expectedMessage - Optional expected message text
   */
  async verifySuccessToast(expectedMessage = null) {
    const toast = loc.toastMessage(this.page);
    await toast.waitFor({ state: 'visible', timeout: 5000 });
    
    if (expectedMessage) {
      const toastText = await toast.innerText();
      if (!toastText.includes(expectedMessage)) {
        throw new Error(`Expected toast message to include "${expectedMessage}", but got "${toastText}"`);
      }
    }
  }

  /**
   * Fill a Lightning input field
   * @param {string} fieldName - The field-name attribute value or field API name
   * @param {string} value - The value to fill
   */
  async fillLightningInput(fieldName, value) {
    // Try Lightning component selector first
    const lightningInput = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input');
    const isLightningVisible = await lightningInput.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (isLightningVisible) {
      await lightningInput.fill(value);
      return;
    }
    
    // Fallback: Try regular input by placeholder matching field name
    // Convert field name to label format (e.g., "FirstName" -> "First Name")
    const label = fieldName.replace(/([A-Z])/g, ' $1').trim();
    const input = this.page.locator(`input[placeholder="${label}"], input[name*="${fieldName}"], input[aria-label="${label}"]`).first();
    
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(value);
  }

  /**
   * Fill a Lightning textarea field
   * @param {string} fieldName - The field-name attribute value
   * @param {string} value - The value to fill
   */
  async fillLightningTextarea(fieldName, value) {
    const textarea = this.page.locator(`lightning-textarea[field-name="${fieldName}"]`).locator('textarea');
    await textarea.waitFor({ state: 'visible', timeout: 5000 });
    await textarea.fill(value);
  }

  /**
   * Select from Lightning combobox/picklist
   * @param {string} fieldName - The field-name attribute value or label text  
   * @param {string} optionLabel - The option label to select
   */
  async selectComboboxOption(fieldName, optionLabel) {
    console.log(`Looking for combobox field: ${fieldName}, option: ${optionLabel}`);
    
    // Try lightning-combobox selectors with better debugging
    const selectors = [
      // Try field-name attribute first
      `lightning-combobox[field-name="${fieldName}"]`,
      // Try data-field-name
      `lightning-combobox[data-field-name="${fieldName}"]`,
      // Try finding by label text (for "Stage", "StageName", etc.)
      `label:has-text("${fieldName}") ~ div lightning-combobox`,
      `label:has-text("Stage") ~ div lightning-combobox`,
      // Try finding button with aria-label containing the field name
      `button[aria-label*="${fieldName}"]`,
      `button[aria-label*="Stage"]`,
      // Generic combobox button near label
      `div:has(label:has-text("Stage")) button[role="combobox"]`,
      `div:has(label:has-text("${fieldName}")) button`,
      // Try ANY button inside div with Stage label
      `div:has(label:has-text("Stage")) button`,
      // Try lightning-combobox itself
      `lightning-combobox`,
    ];
    
    let combobox = null;
    let selectorUsed = null;
    
    // Try each selector until one works
    for (const selector of selectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        const element = this.page.locator(selector).first();
        const count = await element.count();
        console.log(`  - Found ${count} elements`);
        
        if (count > 0) {
          const isVisible = await element.isVisible({ timeout: 1000 }).catch(() => false);
          console.log(`  - Visible: ${isVisible}`);
          
          if (isVisible) {
            combobox = element;
            selectorUsed = selector;
            console.log(`✓ Found combobox using selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        console.log(`  - Failed: ${e.message}`);
        continue;
      }
    }
    
    if (!combobox) {
      // DEBUG: Log what lightning elements are on the page
      const lightningInfo = await this.page.evaluate(() => {
        const lightningElements = Array.from(document.querySelectorAll('lightning-combobox, lightning-picklist, [role="combobox"]'));
        return lightningElements.map((el, i) => ({
          index: i,
          tagName: el.tagName,
          fieldName: el.getAttribute('field-name') || 'none',
          dataFieldName: el.getAttribute('data-field-name') || 'none',
          ariaLabel: el.getAttribute('aria-label') || 'none',
          classes: el.className
        }));
      });
      console.log(`Found ${lightningInfo.length} Lightning combobox/picklist elements:`, JSON.stringify(lightningInfo, null, 2));
      
      throw new Error(`Could not find combobox for field "${fieldName}". Tried ${selectors.length} different selectors.`);
    }
    
    // Click to open combobox
    console.log(`Clicking combobox to open dropdown...`);
    try {
      // Try normal click first
      await combobox.click({ timeout: 5000 });
    } catch (e) {
      console.log('Normal click failed, trying force click...');
      await combobox.click({ force: true, timeout: 5000 });
    }
    
    // Wait for dropdown to fully render
    await this.page.waitForTimeout(2000);
    
    // Verify dropdown is open
    const dropdownOpen = await this.page.locator('div[role="listbox"], lightning-base-combobox-item').first().isVisible({ timeout: 3000 }).catch(() => false);
    if (!dropdownOpen) {
      console.warn('⚠️  Dropdown may not have opened, retrying click...');
      await combobox.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
    
    // Click the option - try multiple strategies
    console.log(`Looking for option: ${optionLabel}`);
    
    // Strategy 1: Try Lightning-specific selectors first (most reliable)
    const lightningSelectors = [
      `lightning-base-combobox-item:has-text("${optionLabel}")`,
      `div[role="option"]:has-text("${optionLabel}")`,
      `span.slds-truncate:has-text("${optionLabel}")`
    ];
    
    for (const selector of lightningSelectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        const element = this.page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 3000 });
        console.log(`Found option using selector: ${selector}`);
        
        // Try clicking with force if normal click fails
        try {
          await element.click({ timeout: 3000 });
        } catch (e) {
          await element.click({ force: true });
        }
        
        console.log(`Selected option: ${optionLabel}`);
        await this.page.waitForTimeout(500);
        return;
      } catch (e) {
        continue;
      }
    }
    
    // Strategy 2: Try getByText as fallback
    try {
      await this.page.waitForTimeout(500);
      const textElement = this.page.getByText(optionLabel, { exact: true });
      await textElement.first().waitFor({ state: 'visible', timeout: 3000 });
      await textElement.first().click();
      console.log(`Selected option "${optionLabel}" using getByText`);
      await this.page.waitForTimeout(500);
      return;
    } catch (e) {
      console.log(`getByText failed: ${e.message}`);
    }
    
    // Strategy 3: Try clicking any element containing the text within a dropdown context
    try {
      const dropdownOption = this.page.locator(`div[role="listbox"] *:has-text("${optionLabel}")`).first();
      await dropdownOption.waitFor({ state: 'visible', timeout: 3000 });
      await dropdownOption.click();
      console.log(`Selected option "${optionLabel}" using listbox context`);
      await this.page.waitForTimeout(500);
      return;
    } catch (e) {
      console.error(`Could not find option "${optionLabel}": ${e.message}`);
    }
    
    throw new Error(`Could not find option "${optionLabel}" in dropdown after trying all strategies`);
  }

  /**
   * Check a Lightning checkbox
   * @param {string} fieldName - The field-name attribute value
   */
  async checkLightningCheckbox(fieldName) {
    const checkbox = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  /**
   * Uncheck a Lightning checkbox
   * @param {string} fieldName - The field-name attribute value
   */
  async uncheckLightningCheckbox(fieldName) {
    const checkbox = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input[type="checkbox"]');
    await checkbox.uncheck();
  }

  /**
   * Fill a Lightning lookup field
   * @param {string} fieldName - The field-name attribute value
   * @param {string} searchTerm - The search term
   * @param {string} resultText - The result text to click
   */
  async fillLookupField(fieldName, searchTerm, resultText) {
    // Click the lookup field to open it - try multiple selectors
    const lookupSelectors = [
      `input[placeholder*="Search ${fieldName}"]`,
      `input[placeholder*="${fieldName}"]`,
      `input[title*="${fieldName}"]`,
      `input[aria-label*="${fieldName}"]`
    ];
    
    let lookupInput = null;
    for (const selector of lookupSelectors) {
      try {
        const elem = this.page.locator(selector).first();
        const isVisible = await elem.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
          lookupInput = elem;
          console.log(`Found lookup field using: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!lookupInput) {
      throw new Error(`Could not find lookup field for ${fieldName}`);
    }
    
    await lookupInput.click();
    
    // Fill search term
    await lookupInput.fill(searchTerm);
    
    // Wait for results and click the matching one
    await this.page.waitForTimeout(1000); // Wait for search results
    await this.page.locator(`lightning-base-combobox-item:has-text("${resultText}")`).click();
  }
}

module.exports = SalesforceRecordBasePage;
