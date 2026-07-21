# Salesforce Lightning Automation - Project Prompt

## Overview
This project provides comprehensive Playwright-based test automation for Salesforce Lightning Experience applications. It uses the Page Object Model (POM) pattern with AI-assisted test generation capabilities.

## Quick Context

### Instance Details
- **URL**: https://as1783480463162.lightning.force.com/lightning/page/home
- **Platform**: Salesforce Lightning Experience
- **Framework**: Playwright + Node.js
- **Pattern**: Page Object Model (POM)

### Key Directories
```
src/web/salesforce/
  ├── locators/       # Element selectors
  ├── pages/          # Page object classes
  └── tests/          # Test specifications

context/salesforce/
  ├── application.md  # Lightning component structure
  ├── domain.md       # Business domain knowledge
  └── framework.md    # Framework conventions
```

## Agent Usage

### When to Use salesforce-automation-agent
Invoke the **salesforce-automation-agent** when you need to:
- Generate new Salesforce Lightning test cases
- Create page objects for Salesforce objects (Account, Contact, Lead, etc.)
- Extend existing Salesforce test coverage
- Transform Jira stories into automated Salesforce tests
- Create TestRail manual cases and automated specs

### Agent Workflow
The agent follows this workflow:
1. Read project context files (`application.md`, `domain.md`, `framework.md`)
2. Audit existing page objects and locators
3. Create manual test cases in TestRail
4. Inspect live Salesforce application using Playwright
5. Generate locators, page objects, and test specs
6. Embed TestRail case IDs in test titles
7. Validate and report results

## Working with This Project

### Authentication
Set environment variables before running tests:
```bash
export SALESFORCE_USERNAME="your-username@example.com"
export SALESFORCE_PASSWORD="your-password"
```

Or use saved storage state:
```js
await page.context().storageState({ path: 'salesforce-auth.json' });
```

### Running Tests
```bash
# All Salesforce tests
npx playwright test src/web/salesforce/tests/

# Specific test
npx playwright test src/web/salesforce/tests/salesforce-login.spec.js

# Debug mode
npx playwright test src/web/salesforce/tests/ --debug
```

### Creating New Tests

#### 1. Create Locator File
`src/web/salesforce/locators/salesforce-feature.locators.js`
```js
const locators = {
  elementName: (page) => page.locator('selector').first(),
};
module.exports = locators;
```

#### 2. Create Page Object
`src/web/salesforce/pages/salesforce-feature.page.js`
```js
const loc = require('../locators/salesforce-feature.locators');
class SalesforceFeaturePage {
  constructor(page) { this.page = page; }
  async methodName() { await loc.elementName(this.page).click(); }
}
module.exports = SalesforceFeaturePage;
```

#### 3. Create Test Spec
`src/web/salesforce/tests/salesforce-feature.spec.js`
```js
const { test, expect } = require('../../../shared/fixtures');
const TD = require('../../../shared/data/salesforce-test-data');
const FeaturePage = require('../pages/salesforce-feature.page');

test('[C12345] Should verify feature', async ({ page }) => {
  // Test implementation
});
```

## Salesforce-Specific Patterns

### Lightning Component Locators
```js
// Lightning Input
lightningInput: (page, fieldName) => 
  page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input'),

// Lightning Combobox
combobox: (page, fieldName) => 
  page.locator(`lightning-combobox[field-name="${fieldName}"]`),

// Lightning Button
button: (page, title) => 
  page.locator(`button[title="${title}"]`),
```

### Shadow DOM Navigation
```js
// Use pierce combinator
const element = page.locator('lightning-button >> button');

// Or .shadow() method
const element = page.locator('lightning-button').shadow().locator('button');
```

### Wait for Page Load
```js
// Wait for Lightning spinner
await page.waitForSelector('lightning-spinner', { state: 'detached' });

// Wait for main content
await page.waitForSelector('article.slds-card', { state: 'visible' });
```

## Test Data Strategy

All URLs and assertion values must come from test data module:
```js
const TD = require('../../../shared/data/salesforce-test-data');

// Use test data URLs
await page.goto(TD.urls.accounts);

// Use test data field names
await page.fillLightningInput(TD.fields.accountName, 'Acme Corp');

// Use test data picklist values
await page.selectComboboxOption(TD.fields.leadStatus, TD.statuses.leadQualified);
```

### Dynamic Test Data
Generate unique records to avoid conflicts:
```js
const accountName = `Test Account ${Date.now()}`;
const leadEmail = `test.${Date.now()}@example.com`;
```

## TestRail Integration

Every test must include a TestRail case ID:
```js
test('[C12345] Should create an account', async ({ page }) => {
  // Test implementation
});
```

## Common Tasks

### Navigate to Object
```js
const homePage = new SalesforceHomePage(page);
await homePage.navigateToObject('Accounts');
```

### Create a Record
```js
const recordPage = new SalesforceRecordBasePage(page);
await recordPage.clickNew();
await recordPage.fillLightningInput('Name', 'Test Account');
await recordPage.clickSave();
await recordPage.verifySuccessToast();
```

### Edit a Record
```js
await recordPage.clickEdit();
await recordPage.fillLightningInput('Name', 'Updated Name');
await recordPage.clickSave();
```

### Delete a Record
```js
await recordPage.deleteRecord();
```

## Best Practices

1. **Use Stable Locators**: Prefer `data-*`, `aria-label`, `title`, `field-name`
2. **Avoid Dynamic IDs**: Never use selectors like `#input-123`
3. **Wait for Spinners**: Always wait for Lightning spinners to disappear
4. **Reuse Page Objects**: Audit existing assets before creating new ones
5. **Clean Up Data**: Delete test records in `afterEach`
6. **No Hardcoded Values**: All data from `salesforce-test-data.js`
7. **Embed Case IDs**: Include `[C12345]` in every test title

## Troubleshooting

### Element Not Found
- Check if element is in Shadow DOM
- Use Playwright Inspector: `npx playwright test --debug`
- Verify locator is stable (not using dynamic IDs)

### Flaky Tests
- Use proper wait strategies (no `waitForTimeout`)
- Wait for Lightning spinners: `await page.waitForSelector('lightning-spinner', { state: 'detached' })`
- Use `waitForSelector` with `state: 'visible'`

### Authentication Issues
- Verify environment variables are set
- Check for MFA prompts
- Verify IP restrictions in Salesforce org

## Resources

- **Context Files**: `context/salesforce/`
- **Agent Config**: `.github/agents/salesforce-automation.agent.md`
- **Test Data**: `src/shared/data/salesforce-test-data.js`
- **Playwright Docs**: https://playwright.dev/

## Next Steps

1. Set up environment variables for authentication
2. Run the smoke test: `npx playwright test src/web/salesforce/tests/salesforce-login.spec.js`
3. Use the salesforce-automation-agent to generate additional tests
4. Create TestRail test cases for traceability
5. Extend page objects for your specific Salesforce objects
