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
    console.log('Looking for Add Products button...');
    const addProductsButton = this.page.locator('a[title="Add Products"], button:has-text("Add Products")').first();
    await addProductsButton.waitFor({ state: 'visible', timeout: 15000 });
    await addProductsButton.click();
    console.log('Clicked Add Products button');
    
    // Wait for "Choose Price Book" modal to appear
    await this.page.waitForTimeout(3000);
    console.log('Looking for Price Book modal...');
    
    // The Price Book modal always appears - wait for it and click Save
    const saveButton = this.page.locator('div.slds-modal__footer button:has-text("Save"), button:has-text("Save")').last();
    const saveVisible = await saveButton.isVisible({ timeout: 10000 });
    
    if (saveVisible) {
      console.log('Found Save button in modal, clicking...');
      await saveButton.click();
      console.log('Clicked Save button for Price Book');
      await this.page.waitForTimeout(5000); // Wait for product selection page to load
    } else {
      console.log('Save button not found, modal may not have appeared');
    }
    
    console.log('Waiting for product search interface...');

    // Search for product
    if (lineItemData.product) {
      console.log(`Searching for product: ${lineItemData.product}`);
      const searchInput = this.page.locator('input[placeholder*="Search Products"], input[placeholder*="Search"]').first();
      await searchInput.waitFor({ state: 'visible', timeout: 15000 });
      await searchInput.click(); // Click to focus
      await searchInput.fill(lineItemData.product);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(3000); // Wait for search results to load in table
      
      // Select product from table using checkbox (use JavaScript like Lead conversion)
      console.log(`Selecting product from table: ${lineItemData.product}`);
      
      // Try force click first as it might trigger the UI properly
      const checkboxLocator = this.page.locator(`tr:has-text("${lineItemData.product}") input[type="checkbox"]`).first();
      const checkboxVisible = await checkboxLocator.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (checkboxVisible) {
        try {
          await checkboxLocator.check({ force: true });
          console.log('Product checkbox checked with force');
        } catch (e) {
          // Fallback to JavaScript if force doesn't work
          console.log('Force click failed, using JavaScript...');
          await this.page.evaluate((productName) => {
            const xpath = `//tr[contains(., "${productName}")]//input[@type="checkbox"]`;
            const checkbox = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (checkbox) {
              checkbox.checked = true;
              checkbox.dispatchEvent(new Event('change', { bubbles: true }));
              checkbox.dispatchEvent(new Event('input', { bubbles: true }));
              checkbox.dispatchEvent(new Event('click', { bubbles: true }));
            }
          }, lineItemData.product);
          console.log('Product checkbox checked via JavaScript');
        }
      } else {
        console.log('Checkbox not visible, using JavaScript...');
        await this.page.evaluate((productName) => {
          const xpath = `//tr[contains(., "${productName}")]//input[@type="checkbox"]`;
          const checkbox = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (checkbox) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new Event('click', { bubbles: true }));
          }
        }, lineItemData.product);
        console.log('Product checkbox checked via JavaScript');
      }
      
      console.log('Product checkbox checked');
      await this.page.waitForTimeout(2000); // Wait for UI to react to checkbox change
      
      // Click Next button (wait for it to become enabled after checkbox selection)
      console.log('Waiting for Next button to become enabled...');
      const nextButton = this.page.locator('button:has-text("Next"):not([disabled])').last();
      await nextButton.waitFor({ state: 'visible', timeout: 15000 });
      console.log('Next button is now enabled, clicking...');
      await nextButton.click();
      console.log('Clicked Next button');
      
      // Wait for quantity/discount form to load
      await this.page.waitForTimeout(5000); // Increased wait
      
      // Wait for the edit form to load after Next button
      await this.page.waitForTimeout(3000);
      
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'quote-line-item-form.png', fullPage: true });
      console.log('Screenshot saved: quote-line-item-form.png');
    }

    // INTELLIGENT MULTI-STRATEGY APPROACH for Shadow DOM components
    if (lineItemData.quantity || lineItemData.discount) {
      console.log('\n🔍 Searching for Quantity/Discount fields using multiple strategies...');
      
      // Strategy 1: Skip - >>> combinator is deprecated in Playwright
      console.log('Strategy 1: Skipped (>>> combinator no longer supported)');
      
      // Strategy 2: Deep query all Shadow DOMs
      console.log('Strategy 2: Deep Shadow DOM inspection...');
      const deepShadowData = await this.page.evaluate(() => {
        function findAllInputsInShadowDOM(root, depth = 0) {
          const inputs = [];
          
          // Get inputs in current root
          const currentInputs = root.querySelectorAll('input');
          currentInputs.forEach((input, idx) => {
            if (input.type !== 'checkbox' && input.type !== 'range' && input.type !== 'hidden') {
              const rect = input.getBoundingClientRect();
              inputs.push({
                depth,
                type: input.type,
                visible: rect.width > 0 && rect.height > 0,
                placeholder: input.placeholder,
                ariaLabel: input.getAttribute('aria-label'),
                name: input.name,
                value: input.value,
                tagPath: input.tagName
              });
            }
          });
          
          // Recursively search Shadow DOMs
          const elementsWithShadow = root.querySelectorAll('*');
          elementsWithShadow.forEach(el => {
            if (el.shadowRoot) {
              inputs.push(...findAllInputsInShadowDOM(el.shadowRoot, depth + 1));
            }
          });
          
          return inputs;
        }
        
        return findAllInputsInShadowDOM(document);
      });
      
      console.log(`Found ${deepShadowData.length} inputs in Shadow DOM:`, JSON.stringify(deepShadowData, null, 2));
      
      // Strategy 3: Look for Lightning components and their inputs
      console.log('Strategy 3: Lightning component search...');
      const lightningData = await this.page.evaluate(() => {
        const results = [];
        
        // Find all lightning-input elements
        document.querySelectorAll('lightning-input').forEach((el, idx) => {
          const input = el.shadowRoot?.querySelector('input');
          if (input) {
            const rect = input.getBoundingClientRect();
            results.push({
              index: idx,
              type: 'lightning-input',
              visible: rect.width > 0 && rect.height > 0,
              label: el.getAttribute('label'),
              fieldName: el.getAttribute('field-name'),
              value: input.value
            });
          }
        });
        
        // Find all force-record-edit-form-element
        document.querySelectorAll('force-record-edit-form-element').forEach((el, idx) => {
          const input = el.querySelector('input') || el.shadowRoot?.querySelector('input');
          if (input) {
            results.push({
              index: idx,
              type: 'force-record-edit',
              fieldName: el.getAttribute('field-name')
            });
          }
        });
        
        return results;
      });
      
      console.log(`Found ${lightningData.length} Lightning components:`, JSON.stringify(lightningData, null, 2));
      
      // Strategy 4: Use Playwright's >> Shadow Piercing + Click approach
      console.log('Strategy 4: Playwright Shadow Piercing (>>) approach...');
      
      if (lineItemData.quantity || lineItemData.discount) {
        try {
          // Wait for modal to settle
          await this.page.waitForTimeout(1000);
          
          // Try Playwright's standard selectors first (they might pierce Shadow DOM automatically in newer versions)
          const allInputs = this.page.locator('input[type="text"], input[type="number"], input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="range"])');
          const inputCount = await allInputs.count();
          console.log(`  Found ${inputCount} inputs using standard selectors`);
          
          if (inputCount > 0) {
            // Try using the found inputs
            console.log('  Attempting to fill using standard selectors...');
            
            // Get bounding boxes of ALL inputs with details
            const inputs = [];
            for (let i = 0; i < inputCount; i++) {
              const input = allInputs.nth(i);
              const box = await input.boundingBox();
              const attrs = await input.evaluate(el => ({
                type: el.type,
                name: el.name,
                placeholder: el.placeholder,
                id: el.id,
                readOnly: el.readOnly,
                disabled: el.disabled,
                tagName: el.tagName
              }));
              
              console.log(`  Input[${i}]: type="${attrs.type}", name="${attrs.name}", placeholder="${attrs.placeholder}", readOnly=${attrs.readOnly}, disabled=${attrs.disabled}, y=${box?.y || 'hidden'}`);
              
              if (box && box.y > 100 && !attrs.readOnly && !attrs.disabled) { // Only editable inputs in modal area
                inputs.push({ index: i, ...box, ...attrs });
              }
            }
            
            console.log(`  Found ${inputs.length} EDITABLE visible inputs in modal area (y > 100)`);
            
            if (inputs.length >= 1 && lineItemData.quantity) {
              const input = inputs[0];
              console.log(`  ➡ Filling QUANTITY in input[${input.index}] (type="${input.type}", name="${input.name}")...`);
              try {
                await allInputs.nth(input.index).click({ timeout: 3000 });
                await this.page.waitForTimeout(300);
                await allInputs.nth(input.index).fill(''); // Clear first
                await this.page.waitForTimeout(200);
                await allInputs.nth(input.index).fill(lineItemData.quantity.toString());
                await this.page.waitForTimeout(200);
                await this.page.keyboard.press('Tab'); // Move focus to trigger any onChange events
                console.log(`  ✅ Quantity ${lineItemData.quantity} entered successfully!`);
              } catch (e) {
                console.error(`  ❌ Failed to fill quantity: ${e.message}`);
              }
              await this.page.waitForTimeout(300);
            }
            
            if (inputs.length >= 2 && lineItemData.discount !== undefined) {
              const input = inputs[1];
              console.log(`  ➡ Filling DISCOUNT in input[${input.index}] (type="${input.type}", name="${input.name}")...`);
              try {
                await allInputs.nth(input.index).click({ timeout: 3000 });
                await this.page.waitForTimeout(300);
                await allInputs.nth(input.index).fill(''); // Clear first
                await this.page.waitForTimeout(200);
                await allInputs.nth(input.index).fill(lineItemData.discount.toString());
                await this.page.waitForTimeout(200);
                await this.page.keyboard.press('Tab'); // Move focus
                console.log(`  ✅ Discount ${lineItemData.discount} entered successfully!`);
              } catch (e) {
                console.error(`  ❌ Failed to fill discount: ${e.message}`);
              }
              await this.page.waitForTimeout(300);
            }
          } else {
            // Fallback: Try deep Shadow DOM search with page.evaluate
            console.log('  No inputs found with standard selectors, trying deep Shadow DOM search...');
            
            const fieldInfo = await this.page.evaluate(() => {
              const fields = [];
              
              // Recursive function to search all Shadow DOMs
              function searchShadowDOM(root, depth = 0) {
                const allElements = root.querySelectorAll('*');
                
                allElements.forEach((el) => {
                  if (el.shadowRoot) {
                    const inputs = el.shadowRoot.querySelectorAll('input');
                    inputs.forEach(input => {
                      if (input.type !== 'hidden' && input.type !== 'checkbox' && 
                          input.type !== 'radio' && input.type !== 'range') {
                        const rect = input.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && rect.y > 100) {
                          fields.push({
                            type: input.type,
                            x: rect.x + rect.width / 2,
                            y: rect.y + rect.height / 2,
                            depth: depth
                          });
                        }
                      }
                    });
                    searchShadowDOM(el.shadowRoot, depth + 1);
                  }
                });
              }
              
              searchShadowDOM(document);
              return fields;
            });
            
            console.log(`  Found ${fieldInfo.length} inputs in Shadow DOM`);
            
            if (fieldInfo.length >= 1 && lineItemData.quantity) {
              const field = fieldInfo[0];
              console.log(`  Clicking first field (Quantity) at (${field.x}, ${field.y})...`);
              await this.page.mouse.click(field.x, field.y);
              await this.page.waitForTimeout(200);
              await this.page.keyboard.press('Control+A');
              await this.page.keyboard.type(lineItemData.quantity.toString(), { delay: 50 });
              console.log(`  ✓ Quantity ${lineItemData.quantity} entered`);
              await this.page.waitForTimeout(300);
            }
            
            if (fieldInfo.length >= 2 && lineItemData.discount !== undefined) {
              const field = fieldInfo[1];
              console.log(`  Clicking second field (Discount) at (${field.x}, ${field.y})...`);
              await this.page.mouse.click(field.x, field.y);
              await this.page.waitForTimeout(200);
              await this.page.keyboard.press('Control+A');
              await this.page.keyboard.type(lineItemData.discount.toString(), { delay: 50 });
              console.log(`  ✓ Discount ${lineItemData.discount} entered`);
              await this.page.waitForTimeout(300);
            }
          }
          
          // Take screenshot AFTER filling
          await this.page.waitForTimeout(500);
          await this.page.screenshot({ path: 'quote-line-item-filled.png' });
          console.log('📸 Screenshot saved: quote-line-item-filled.png');
        } catch (e) {
          console.error('❌ Shadow piercing failed:', e.message);
        }
      }
      
      // Strategy 5: Direct Lightning component manipulation via JavaScript
      console.log('Strategy 5: Direct Lightning component manipulation...');
      const lightningFillResult = await this.page.evaluate((data) => {
        const results = { quantity: false, discount: false };
        
        // Try to find and fill via Lightning components
        const lightningInputs = document.querySelectorAll('lightning-input');
        let filledCount = 0;
        
        lightningInputs.forEach(el => {
          const label = (el.getAttribute('label') || '').toLowerCase();
          const fieldName = (el.getAttribute('field-name') || '').toLowerCase();
          const input = el.shadowRoot?.querySelector('input');
          
          if (input && (label.includes('quantity') || fieldName.includes('quantity')) && data.quantity) {
            input.value = data.quantity;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            results.quantity = true;
            filledCount++;
          }
          
          if (input && (label.includes('discount') || fieldName.includes('discount')) && data.discount !== undefined) {
            input.value = data.discount;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            results.discount = true;
            filledCount++;
          }
        });
        
        results.filledCount = filledCount;
        return results;
      }, { quantity: lineItemData.quantity, discount: lineItemData.discount });
      
      console.log('Lightning component fill result:', lightningFillResult);
      
      if (lightningFillResult.quantity) console.log('✓ Quantity filled via Lightning component');
      if (lightningFillResult.discount) console.log('✓ Discount filled via Lightning component');
    }

    // Click Save button in modal footer
    console.log('\n💾 Saving quote line item...');
    await this.page.waitForTimeout(1000);
    const lineSaveButton = this.page.locator('div.slds-modal__footer button:has-text("Save"), div[role="dialog"] button:has-text("Save")').last();
    await lineSaveButton.click();
    console.log('✓ Clicked Save button');
    
    // Wait for modal to close
    await this.page.waitForTimeout(3000);
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
