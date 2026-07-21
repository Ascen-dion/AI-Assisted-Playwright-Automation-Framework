# Salesforce Lightning Automation

This directory contains Page Object Model (POM) assets for Salesforce Lightning Experience automation using Playwright with complete JIRA and TestRail integration.

## 📁 Directory Structure

```
src/web/salesforce/
├── locators/           # Locator modules (element selectors)
│   ├── salesforce-login.locators.js
│   ├── salesforce-home.locators.js
│   ├── salesforce-record-base.locators.js
├── pages/              # Page object classes
│   ├── salesforce-login.page.js
│   ├── salesforce-home.page.js
│   ├── salesforce-record-base.page.js
│   ├── salesforce-lead.page.js
│   ├── salesforce-opportunity.page.js
│   └── salesforce-quote.page.js
├── tests/              # Test specifications
│   ├── salesforce-login.spec.js (sample)
│   ├── salesforce-s1-lead-conversion.spec.js (4 ACs)
│   ├── salesforce-s2-quote-validation.spec.js (5 ACs)
│   ├── salesforce-s3-quote-approval.spec.js (4 ACs)
│   └── salesforce-s4-two-level-approval.spec.js (7 ACs)
├── scripts/            # Integration scripts
│   └── create-salesforce-test-suite.js
├── INTEGRATION_GUIDE.md   # Complete integration workflow
├── salesforce-test-mapping.json   # Test suite mapping
└── README.md           # This file
```

---

## 🚀 Quick Start

### 1. Configure Environment

Update `.env` in project root with your Salesforce, JIRA, and TestRail credentials:

```bash
# Salesforce Configuration
SALESFORCE_ORG_URL=https://as1783480463162.lightning.force.com
SALESFORCE_USERNAME=your-username@example.com
SALESFORCE_PASSWORD=your-password
SALESFORCE_APPROVER1=approver1@example.com
SALESFORCE_APPROVER1_PASSWORD=approver1-password
SALESFORCE_APPROVER2=approver2@example.com
SALESFORCE_APPROVER2_PASSWORD=approver2-password

# JIRA Configuration (read by salesforce-automation-agent)
JIRA_URL=https://aavademo.atlassian.net
JIRA_EMAIL=your-email@ascendion.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=DZ

# TestRail Configuration (read by salesforce-automation-agent)
TESTRAIL_URL=https://aava-testrail.avateam.io
TESTRAIL_EMAIL=your-email@ascendion.com
TESTRAIL_API_KEY=your-testrail-api-key
TESTRAIL_PROJECT_ID=1
TESTRAIL_SUITE_ID=1
TESTRAIL_SECTION_ID=9
```

### 2. Run Tests

```bash
# Run all Salesforce tests
npx playwright test src/web/salesforce/tests/

# Run specific scenario
npx playwright test src/web/salesforce/tests/salesforce-s1-lead-conversion.spec.js

# Run with headed browser
npx playwright test src/web/salesforce/tests/ --headed

# Debug mode
npx playwright test src/web/salesforce/tests/ --debug

# Generate HTML report
npx playwright test src/web/salesforce/tests/ --reporter=html
```

---

## 📋 Test Suite Overview

### Complete Test Coverage: 4 Scenarios, 20 Acceptance Criteria

| Scenario | ACs | Test Script | Status |
|----------|-----|-------------|--------|
| **S1: Lead Conversion** | 4 | [salesforce-s1-lead-conversion.spec.js](tests/salesforce-s1-lead-conversion.spec.js) | ✅ Ready |
| **S2: Quote Validation** | 5 | [salesforce-s2-quote-validation.spec.js](tests/salesforce-s2-quote-validation.spec.js) | ✅ Ready |
| **S3: Single-Level Approval** | 4 | [salesforce-s3-quote-approval.spec.js](tests/salesforce-s3-quote-approval.spec.js) | ✅ Ready |
| **S4: Two-Level Approval** | 7 | [salesforce-s4-two-level-approval.spec.js](tests/salesforce-s4-two-level-approval.spec.js) | ✅ Ready |

**Total**: 20 automated test cases with 100% coverage

---

## 🔗 JIRA & TestRail Integration

### Agent Configuration

The `salesforce-automation-agent` (located in `.github/agents/salesforce-automation.agent.md`) automatically reads credentials from `.env` and provides:

- **JIRA MCP Integration**: Create and manage user stories
- **TestRail MCP Integration**: Create and manage test cases
- **Automated Mapping**: Links JIRA stories ↔ TestRail cases ↔ Test scripts

### Create JIRA Stories & TestRail Cases

Use the agent via Copilot:

```
@salesforce-automation-agent create JIRA user stories and TestRail test cases for all Salesforce scenarios
```

Or use the integration script:

```bash
node src/web/salesforce/scripts/create-salesforce-test-suite.js
```

### Test Suite Mapping

All mappings are tracked in:
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete workflow and traceability
- **[salesforce-test-mapping.json](salesforce-test-mapping.json)** - Machine-readable mapping

---

## 🎯 Test Scenarios

### Scenario 1: Create a Lead and Convert to Opportunity
- **AC1**: Create a new Lead
- **AC2**: Validate mandatory fields during Lead creation
- **AC3**: Convert Lead to Opportunity
- **AC4**: Verify Opportunity creation after Lead conversion

### Scenario 2: Create a Quote with Validation Rules
- **AC5**: Create a Quote successfully
- **AC6**: Prevent saving Quote when discount >15% without justification
- **AC7**: Allow saving Quote when discount >15% with justification
- **AC8**: Prevent saving Quote when quantity is zero or negative
- **AC9**: Allow saving Quote with valid quantity

### Scenario 3: Create a Quote with Approval Process
- **AC10**: Submit Quote for approval (discount >20%)
- **AC11**: Manager approves Quote
- **AC12**: Manager rejects Quote
- **AC13**: Quote does not require approval for discounts ≤20%

### Scenario 4: Create a Quote with Two-Level Approval Process
- **AC14**: Submit Quote for first-level approval (discount >50%)
- **AC15**: First-level manager approves, routes to Level 2
- **AC16**: First-level manager rejects, routes to Level 2
- **AC17**: Second-level manager approves (final approval)
- **AC18**: Second-level manager rejects (final rejection)
- **AC19**: Approval history tracking
- **AC20**: Quote does not require two-level approval for discounts ≤50%

---

## 📖 Page Objects Reference

### SalesforceLoginPage
```js
await loginPage.navigateTo(loginUrl);
await loginPage.login(username, password);
```

### SalesforceHomePage
```js
await homePage.navigateToObject('Leads');
await homePage.useGlobalSearch('Account Name');
await homePage.verifySuccessToast();
```

### SalesforceLeadPage
```js
await leadPage.fillLeadForm(leadData);
await leadPage.convertLead(conversionOptions);
await leadPage.isLeadConverted();
```

### SalesforceOpportunityPage
```js
await opportunityPage.fillOpportunityForm(oppData);
await opportunityPage.createQuote(quoteData);
await opportunityPage.getQuoteId();
```

### SalesforceQuotePage
```js
await quotePage.addQuoteLineItem(lineItemData);
await quotePage.submitForApproval();
await quotePage.approveQuote();
await quotePage.rejectQuote(comments);
await quotePage.getApprovalHistory();
```

---

## 🔐 Authentication

### Option 1: Login in Each Test
```js
const loginPage = new SalesforceLoginPage(page);
await loginPage.navigateTo(TD.urls.login);
await loginPage.login(username, password);
```

### Option 2: Save Storage State (Recommended)
```js
// After first login, save session
await page.context().storageState({ path: 'salesforce-auth.json' });

// Reuse in playwright.config.js
use: {
  storageState: 'salesforce-auth.json',
}
```

---

## 🧪 Locator Strategies

### Recommended (most stable first)
1. **Data Attributes**: `[data-id="..."]`, `[data-target="..."]`
2. **ARIA Labels**: `[aria-label="..."]`, `[role="..."]`
3. **Title Attributes**: `[title="..."]`
4. **Component Names**: `lightning-input[field-name="FirstName"]`

### Avoid
- Dynamic IDs (they change on every render)
- Brittle class names without stable prefixes

---

## 📊 Test Data Management

All test data must be imported from `src/shared/data/salesforce-test-data.js`:

```js
const TD = require('../../../shared/data/salesforce-test-data');

// URLs
await page.goto(TD.urls.accounts);

// Field names
await recordPage.fillLightningInput(TD.fields.accountName, 'Acme Corp');

// Picklist values
await recordPage.selectComboboxOption(TD.fields.leadStatus, TD.statuses.leadQualified);
```

**Dynamic Test Data** (avoid conflicts):
```js
const accountName = `Test Account ${Date.now()}`;
const leadEmail = `test.${Date.now()}@example.com`;
```

---

## ✅ Best Practices

1. **Always wait for page load** after navigation
   ```js
   await recordPage.waitForPageLoad();
   ```

2. **Wait for Lightning spinners** to disappear
   ```js
   await page.waitForSelector('lightning-spinner', { state: 'detached' });
   ```

3. **Use dynamic test data** to avoid conflicts
   ```js
   const timestamp = Date.now();
   ```

4. **Clean up test records** in `afterEach`
   ```js
   test.afterEach(async ({ page }) => {
     console.log(`Created records: ${leadId}, ${quoteId}`);
   });
   ```

5. **Embed TestRail and JIRA IDs** in test titles
   ```js
   test('[C12345][AC1] Should create an account', async ({ page }) => {
     // ...
   });
   ```

6. **Handle Shadow DOM** correctly
   ```js
   const element = page.locator('lightning-button >> button');
   ```

---

## 🛠️ Troubleshooting

### Tests are flaky
- Ensure proper wait strategies (no fixed timeouts)
- Wait for Lightning spinners to disappear
- Use `waitForSelector` with `state: 'visible'`

### Elements not found
- Check if element is in Shadow DOM
- Use Playwright Inspector: `npx playwright test --debug`
- Verify locator stability (avoid dynamic IDs)

### Authentication issues
- Verify credentials in environment variables
- Check for MFA prompts (handle manually or use API tokens)
- Verify IP restrictions in Salesforce org

### Validation errors not appearing
- Verify validation rules are configured in Salesforce org
- Check custom field `Justification__c` exists on Quote Line Item
- Ensure approval processes are active

---

## 📚 Documentation

- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete JIRA & TestRail integration workflow
- **[salesforce-test-mapping.json](salesforce-test-mapping.json)** - Test suite mapping
- **[.github/agents/salesforce-automation.agent.md](../../../.github/agents/salesforce-automation.agent.md)** - Agent configuration
- **[context/salesforce/application.md](../../../context/salesforce/application.md)** - Lightning application structure
- **[context/salesforce/domain.md](../../../context/salesforce/domain.md)** - Business domain knowledge
- **[context/salesforce/framework.md](../../../context/salesforce/framework.md)** - Framework conventions

---

## 🤝 Contributing

When adding new test assets:
1. Follow the POM pattern (locators → pages → tests)
2. Add test data to `salesforce-test-data.js`
3. Embed JIRA story and TestRail case IDs in test titles
4. Document complex locators with JSDoc comments
5. Update mapping files and documentation

---

## 📞 Support

For questions or issues:
- Review the [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed workflow
- Use the `@salesforce-automation-agent` in Copilot for assistance
- Check context files in `context/salesforce/` for Salesforce-specific guidance

---

**Last Updated**: 2026-07-20  
**Status**: ✅ All 20 test scripts ready | ⏳ JIRA & TestRail sync pending  
**Maintained By**: QE Automation Team

