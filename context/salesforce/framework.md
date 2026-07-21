# Framework Knowledge — AI-Assisted Playwright Salesforce Automation

## Test Structure Rules for Salesforce
- All tests MUST follow Page Object Model (POM) pattern
- Locators live in: `src/web/salesforce/locators/<feature>.locators.js`
- Page objects live in: `src/web/salesforce/pages/<feature>.page.js`
- Test specs live in: `src/web/salesforce/tests/<feature>.spec.js`
- Never put raw selectors directly inside spec files — always use the page object
- Never duplicate a selector string across files

---

## File Naming Convention
- Locator file: `<feature-name>.locators.js` (e.g. `salesforce-lead.locators.js`)
- Page file: `<feature-name>.page.js` (e.g. `salesforce-lead.page.js`)
- Spec file: `<feature-name>.spec.js` (e.g. `salesforce-lead.spec.js`)

---

## Require Paths (from spec files)
When writing specs in `src/web/salesforce/tests/`, require paths are:
```js
const Page = require('../pages/my-page.page');        // Salesforce page object
const TD   = require('../../../shared/data/salesforce-test-data');   // Salesforce test data module
const { test, expect } = require('../../../shared/fixtures');  // Extended Playwright fixture
```

---

## Test Data Module — `src/shared/data/salesforce-test-data.js`
All hardcoded assertion values, URLs, and object names must come from the Salesforce test data module. Never hardcode them in specs.
```js
const TD = require('../../../shared/data/salesforce-test-data');
// TD.urls.*            — Salesforce URLs (home, login, objects)
// TD.objects.*         — Standard object names (Account, Contact, Lead, etc.)
// TD.fields.*          — Common field names
// TD.statuses.*        — Picklist values for Status fields
// TD.stages.*          — Opportunity stage values
```
Add new entries to `src/shared/data/salesforce-test-data.js` for any new assertion strings, URLs, or Salesforce-specific values.

---

## Locator File Structure
```js
const locators = {
  // Use functions that return locators scoped to the page
  elementName: (page) => page.locator('selector').first(),
  
  // Example: App Launcher button
  appLauncher: (page) => page.locator('button.slds-icon-waffle'),
  
  // Example: Global search input
  globalSearch: (page) => page.locator('input[placeholder*="Search"]').first(),
  
  // Example: New button
  newButton: (page) => page.locator('div[title="New"]').first(),
  
  // Example: Save button (multiple selectors)
  saveButton: (page) => page.locator('button[name="SaveEdit"], button:has-text("Save")').first(),
};
module.exports = locators;
```

---

## Page Object Structure
```js
const loc = require('../locators/<feature>.locators');

class SalesforceFeaturePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the feature page
   */
  async navigateTo() {
    await this.page.goto('URL_FROM_TEST_DATA');
    await this.waitForPageLoad();
  }

  /**
   * Wait for Lightning page to fully load
   */
  async waitForPageLoad() {
    // Wait for Lightning spinner to disappear
    await this.page.waitForSelector('lightning-spinner', { state: 'detached', timeout: 10000 }).catch(() => {});
    // Wait for main content
    await this.page.waitForSelector('article.slds-card, div.slds-page-header', { state: 'visible', timeout: 10000 });
  }

  /**
   * Click an element using locator
   */
  async clickElement() {
    await loc.elementName(this.page).click();
  }

  /**
   * Fill a Lightning input field
   * @param {string} fieldName - The field-name attribute value
   * @param {string} value - The value to fill
   */
  async fillLightningInput(fieldName, value) {
    const input = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input');
    await input.fill(value);
  }

  /**
   * Select from Lightning combobox/picklist
   * @param {string} dataId - The data-id attribute value
   * @param {string} optionValue - The option value to select
   */
  async selectComboboxOption(dataId, optionValue) {
    await this.page.locator(`lightning-combobox[data-id="${dataId}"]`).click();
    await this.page.locator(`lightning-base-combobox-item[data-value="${optionValue}"]`).click();
  }

  /**
   * Verify success toast appears
   */
  async verifySuccessToast() {
    const toast = this.page.locator('div.forceVisualMessageQueue div.toastMessage');
    await toast.waitFor({ state: 'visible', timeout: 5000 });
    await expect(toast).toBeVisible();
  }
}

module.exports = SalesforceFeaturePage;
```

---

## Test Spec Structure
```js
const { test, expect } = require('../../../shared/fixtures');
const TD = require('../../../shared/data/salesforce-test-data');
const FeaturePage = require('../pages/salesforce-feature.page');

test.describe('Salesforce Feature Tests', () => {
  let featurePage;

  test.beforeEach(async ({ page }) => {
    featurePage = new FeaturePage(page);
    
    // Login to Salesforce (use saved storageState or login flow)
    await page.goto(TD.urls.login);
    // ... login logic ...
    
    // Navigate to feature
    await featurePage.navigateTo();
  });

  test('[C12345] Should create a new record', async ({ page }) => {
    // Test implementation using page object methods
    await featurePage.clickNewButton();
    await featurePage.fillForm({
      name: `Test Record ${Date.now()}`,
      status: 'New'
    });
    await featurePage.saveRecord();
    await featurePage.verifySuccessToast();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: delete test records
    // ... cleanup logic ...
  });
});
```

---

## Salesforce-Specific Locator Strategies

### 1. Lightning Buttons
```js
// By title attribute (most stable)
buttonByTitle: (page) => page.locator('button[title="New"]'),

// By text content
buttonByText: (page) => page.locator('button:has-text("Save")'),

// By class combination
buttonByClass: (page) => page.locator('button.slds-button.slds-button--brand'),
```

### 2. Lightning Input Fields
```js
// By field-name attribute (most stable)
inputByFieldName: (page, fieldName) => page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input'),

// By label text
inputByLabel: (page, label) => page.locator(`lightning-input:has(label:text("${label}"))`).locator('input'),
```

### 3. Lightning Combobox/Picklist
```js
// Combobox trigger
comboboxTrigger: (page, dataId) => page.locator(`lightning-combobox[data-id="${dataId}"]`),

// Combobox option
comboboxOption: (page, value) => page.locator(`lightning-base-combobox-item[data-value="${value}"]`),
```

### 4. Shadow DOM Elements
```js
// Using pierce combinator
shadowElement: (page) => page.locator('component-name >> inner-element'),

// Or using .shadow() method
shadowElement: (page) => page.locator('component-name').shadow().locator('inner-element'),
```

### 5. List View Rows
```js
// Table row by record name
listViewRow: (page, recordName) => page.locator(`table.slds-table tbody tr:has-text("${recordName}")`),

// Action menu for row
rowActionMenu: (page, recordName) => page.locator(`table.slds-table tbody tr:has-text("${recordName}") a[title="Show Actions"]`),
```

---

## Common Salesforce Page Objects to Create

### 1. Salesforce Login Page
- `src/web/salesforce/pages/salesforce-login.page.js`
- Methods: `login(username, password)`, `handleMFA()`, `saveSession()`

### 2. Salesforce Home Page
- `src/web/salesforce/pages/salesforce-home.page.js`
- Methods: `navigateToObject(objectName)`, `useGlobalSearch(query)`, `verifyHomePage()`

### 3. Salesforce App Launcher Page
- `src/web/salesforce/pages/salesforce-app-launcher.page.js`
- Methods: `openAppLauncher()`, `searchApp(appName)`, `selectApp(appName)`

### 4. Salesforce Record Page (Base)
- `src/web/salesforce/pages/salesforce-record-base.page.js`
- Methods: `clickNew()`, `clickEdit()`, `clickSave()`, `clickDelete()`, `verifyRecordTitle(title)`

### 5. Object-Specific Pages (Extend Base)
- `src/web/salesforce/pages/salesforce-account.page.js`
- `src/web/salesforce/pages/salesforce-contact.page.js`
- `src/web/salesforce/pages/salesforce-lead.page.js`
- `src/web/salesforce/pages/salesforce-opportunity.page.js`

---

## Waiting Strategies

### Wait for Lightning Spinner to Disappear
```js
await page.waitForSelector('lightning-spinner', { state: 'detached', timeout: 10000 }).catch(() => {});
```

### Wait for Element Visibility
```js
await page.waitForSelector('article.slds-card', { state: 'visible', timeout: 10000 });
```

### Wait for Navigation
```js
await page.waitForURL(/.*\/lightning\/r\/Account\/.*\/view/, { timeout: 10000 });
```

### Wait for Toast Message
```js
const toast = page.locator('div.forceVisualMessageQueue div.toastMessage');
await toast.waitFor({ state: 'visible', timeout: 5000 });
```

---

## Authentication & Session Management

### Login Flow (First Time)
```js
async login(username, password) {
  await this.page.goto(TD.urls.login);
  await this.page.locator('input#username').fill(username);
  await this.page.locator('input#password').fill(password);
  await this.page.locator('input#Login').click();
  await this.page.waitForURL(/.*\/lightning\/page\/home/, { timeout: 30000 });
}
```

### Save Session State
```js
// In global setup
await page.context().storageState({ path: 'salesforce-auth.json' });
```

### Reuse Session State
```js
// In playwright.config.js
use: {
  storageState: 'salesforce-auth.json',
}
```

---

## Dynamic Test Data Generation

### Generate Unique Record Names
```js
const timestamp = Date.now();
const accountName = `Test Account ${timestamp}`;
const leadEmail = `test.lead.${timestamp}@example.com`;
```

### Use UUID for Global Uniqueness
```js
const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();
const opportunityName = `Test Opp ${uniqueId}`;
```

---

## Cleanup Strategies

### UI-Based Cleanup (in afterEach)
```js
test.afterEach(async ({ page }) => {
  // Navigate to record
  await page.goto(`${TD.urls.base}/lightning/r/Account/${recordId}/view`);
  
  // Click dropdown menu
  await page.locator('button[title="Show Actions"]').click();
  
  // Click Delete
  await page.locator('a[title="Delete"]').click();
  
  // Confirm in modal
  await page.locator('button[title="Delete"]').click();
  
  // Verify redirect to list view
  await page.waitForURL(/.*\/lightning\/o\/Account\/list/);
});
```

### API-Based Cleanup (Salesforce REST API)
```js
// Use Salesforce REST API to delete records in bulk
// Requires Salesforce connection and authentication
```

---

## Error Handling

### Handle Common Errors Gracefully
```js
try {
  await featurePage.saveRecord();
} catch (error) {
  // Check for validation error toast
  const errorToast = page.locator('div.forceVisualMessageQueue div.toastMessage:has-text("error")');
  if (await errorToast.isVisible()) {
    const errorText = await errorToast.innerText();
    throw new Error(`Salesforce validation error: ${errorText}`);
  }
  throw error;
}
```

---

## Best Practices

### 1. Always Use Stable Locators
- Prefer: `data-id`, `aria-label`, `title`, `field-name`
- Avoid: Dynamic IDs, brittle class names

### 2. Wait for Page Load
- Always wait for Lightning spinners to disappear
- Always wait for main content visibility

### 3. Reuse Page Objects
- Audit existing page objects before creating new ones
- Extend base page objects for common functionality

### 4. Embed TestRail Case IDs
- Every test title must include `[C12345]` format

### 5. Never Hardcode Values
- All URLs, object names, field values from test data module

### 6. Clean Up Test Data
- Delete test records in `afterEach` to avoid clutter

### 7. Handle Dynamic Content
- Use dynamic waits (`waitForSelector`, `waitForURL`)
- Never use fixed `page.waitForTimeout()`

---

## TestRail Integration

### Test Title Format
```js
test('[C12345] Should verify lead creation', async ({ page }) => {
  // ...
});
```

### Multiple Case IDs
```js
test('[C12345][C12346] Should verify account and contact creation', async ({ page }) => {
  // ...
});
```

---

## Quality Checklist
- [ ] All locators in separate locator file
- [ ] All page interactions in page object methods
- [ ] Test spec uses page object methods only
- [ ] TestRail case ID embedded in test title
- [ ] All URLs and assertions from test data module
- [ ] Dynamic test data generation (timestamps, UUIDs)
- [ ] Cleanup logic in `afterEach`
- [ ] Proper wait strategies (no fixed timeouts)
- [ ] Error handling for Salesforce validation errors
- [ ] Comments and JSDoc for complex methods

---

**Remember**: Quality over speed. Deterministic over flaky. Reusable over duplicated. Traceable over ad-hoc.
