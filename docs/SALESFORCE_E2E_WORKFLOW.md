# 🚀 Salesforce Test Automation - End-to-End Workflow Guide

**Project:** Lead → Opportunity → Quote Validation  
**JIRA Story:** DZ-1  
**Test Data:** CSV + JSON (quote-validation-testcases.csv, salesforce-quote-validation-data.json)  
**Framework:** Playwright + Page Object Model (POM)  
**Integrations:** JIRA + TestRail + Salesforce Lightning  

---

## 📋 **Table of Contents**
1. [Prerequisites & Configuration](#prerequisites--configuration)
2. [Phase 1: Requirements Analysis](#phase-1-requirements-analysis)
3. [Phase 2: JIRA Story & TestRail Setup](#phase-2-jira-story--testrail-setup)
4. [Phase 3: Salesforce Application Inspection](#phase-3-salesforce-application-inspection)
5. [Phase 4: Page Object Model Development](#phase-4-page-object-model-development)
6. [Phase 5: Automated Test Spec Creation](#phase-5-automated-test-spec-creation)
7. [Phase 6: Test Execution & Reporting](#phase-6-test-execution--reporting)
8. [Phase 7: Continuous Integration](#phase-7-continuous-integration)

---

## ✅ **Prerequisites & Configuration**

### **Environment Variables** (`.env`)
All required credentials are configured in `.env`:

```bash
# ✅ JIRA Configuration (ACTIVE)
JIRA_HOST=https://aavademo.atlassian.net
JIRA_EMAIL=kiruthika.ganesan@ascendion.com
JIRA_API_TOKEN=ATATT3xFfGF03byS6QmCsBhVF8_goX0i_F87m3KhezA5ANU9wnPPOzKvIZlzesmvhGvXAFd0lCxvxALQxmLQxyMhg00tgDEoIKudQfGIjQktUPP_jseLRboueQu3BZoNZeXiI7Ue4W6lHE2arJkoHN-XBxMJGdwtGR2T0IgzjK2YhwzaiN5xnu0=CB56E5AE
JIRA_PROJECT_KEY=DZ

# ✅ TestRail Configuration (ACTIVE)
TESTRAIL_HOST=https://aava-testrail.avateam.io
TESTRAIL_USER=hariharan.krishnaraj@ascendion.com
TESTRAIL_API_KEY=9.qMAhgq5FO7ERvYU4.F-jB7kSFudblCb6lQnJTCX
TESTRAIL_PROJECT_ID=1
TESTRAIL_SUITE_ID=1
TESTRAIL_SECTION_ID=9

# ⚠️ Salesforce Configuration (UPDATE REQUIRED)
SALESFORCE_ORG_URL=https://as1783480463162.lightning.force.com
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
```

**Action Required:** Update Salesforce credentials in `.env`

### **Test Data Files**
- ✅ `src/shared/data/quote-validation-testcases.csv` — 15 test scenarios
- ✅ `src/shared/data/salesforce-quote-validation-data.json` — Detailed test cases
- ✅ `src/shared/data/salesforce-test-data.js` — Framework test data module

---

## 📝 **Phase 1: Requirements Analysis**

### **User Story (JIRA: DZ-1)**

**Title:** Lead to Opportunity Quote Validation  
**Description:**
```
As a Sales User
I want to create a Lead, convert it to an Opportunity, create a Quote, and validate the results
So that I can ensure accurate pricing and discount validation in Salesforce
```

**Acceptance Criteria:**
1. ✅ **AC1:** Create a new Lead with valid data (First Name, Last Name, Company, Email, Phone)
2. ✅ **AC2:** Convert Lead to Account, Contact, and Opportunity
3. ✅ **AC3:** Create a Quote associated with the Opportunity
4. ✅ **AC4:** Add Quote Line Items with product, quantity, discount, and justification
5. ✅ **AC5:** Validate quote calculations: Subtotal, Discount, Total
6. ✅ **AC6:** Validate business rules:
   - Discount ≤15% → No justification required
   - Discount >15% → Justification REQUIRED (validation should fail without it)
7. ✅ **AC7:** Validate results match expected values from Excel/JSON test data

### **Test Scenarios (15 Total)**
| Test ID | Scenario | Product | Qty | Discount% | Justification | Expected Result |
|---------|----------|---------|-----|-----------|---------------|-----------------|
| C005 | Valid data - all fields correct | ZOOM | 10 | 10 | Standard volume discount | PASS |
| C006 | Discount >15% without justification | ZOOM | 5 | 20 | (empty) | FAIL - Validation error |
| C006-WITH | Discount >15% with justification | ZOOM | 5 | 20 | Strategic partnership | PASS |
| C007 | Discount >15% with justification | ZOOM | 5 | 20 | Enterprise deal | PASS |
| C008-ZERO | Zero quantity | ZOOM | 0 | 5 | | FAIL - Quantity validation |
| C008-NEGATIVE | Negative quantity | ZOOM | -5 | 5 | | FAIL - Quantity validation |
| C009 | Valid quantity - high volume | ZOOM | 100 | 5 | | PASS |
| CALC-001 | No discount calculation | ZOOM | 20 | 0 | | PASS |
| CALC-002 | 15% discount calculation | ZOOM | 10 | 15 | Volume discount | PASS |
| CALC-003 | High quantity + high discount | ZOOM | 100 | 25 | Enterprise contract | PASS |
| EDGE-001 | Exactly 15% discount - no justification | ZOOM | 10 | 15 | | PASS |
| EDGE-002 | Discount 15.01% without justification | ZOOM | 10 | 15.01 | | FAIL |
| EDGE-003 | Quantity = 1 (minimum valid) | ZOOM | 1 | 5 | | PASS |
| EDGE-004 | Very high discount with justification | ZOOM | 50 | 90 | Liquidation sale | PASS |
| PERF-001 | Large quantity performance test | ZOOM | 10000 | 10 | Bulk order | PASS |

---

## 🎯 **Phase 2: JIRA Story & TestRail Setup**

### **Step 2.1: Fetch JIRA Story Details**

Run the helper script to fetch JIRA story details:

```bash
node scripts/fetch-jira-issue.js DZ-1
```

**Expected Output:**
```json
{
  "key": "DZ-1",
  "summary": "Lead to Opportunity Quote Validation",
  "description": "...",
  "acceptanceCriteria": ["AC1: Create Lead", "AC2: Convert Lead", ...]
}
```

### **Step 2.2: Create TestRail Manual Test Cases**

For each test scenario (C005, C006, etc.), create a manual test case in TestRail:

**Manual Test Case Template:**

```
Title: [C005] Valid Quote Line Item - All Fields Correct
Section: Quote Validation (ID: 9)
Priority: High
Type: Functional
Steps:
1. Navigate to Salesforce and log in
2. Create a new Lead: First Name="Test", Last Name="Lead", Company="Test Corp", Email="test@example.com"
3. Convert Lead to Account, Contact, Opportunity
4. Create a Quote for the Opportunity
5. Add Quote Line Item: Product=ZOOM, Quantity=10, Discount=10%, Justification="Standard volume discount"
6. Save the Quote Line Item
Expected Result:
- Subtotal = 149.90 (10 * 14.99)
- Discount Amount = 14.99 (10% of 149.90)
- Total Price = 134.91 (149.90 - 14.99)
- Validation passes without errors
```

**Automated Script:**

```bash
# Create all TestRail cases from CSV
node scripts/create-testrail-cases-from-csv.js src/shared/data/quote-validation-testcases.csv
```

**Expected Output:**
```
✅ Created TestRail Case C005 → ID: 123
✅ Created TestRail Case C006 → ID: 124
✅ Created TestRail Case C007 → ID: 125
... (15 total)
```

---

## 🔍 **Phase 3: Salesforce Application Inspection**

### **Step 3.1: Launch Salesforce Lightning**

```bash
npx playwright codegen https://as1783480463162.lightning.force.com/lightning/page/home
```

### **Step 3.2: Identify Key UI Elements**

**Login Page:**
- Username field: `input#username`
- Password field: `input#password`
- Login button: `input#Login`

**App Launcher:**
- App Launcher button: `button[title="App Launcher"]`
- Search input: `input[placeholder="Search apps and items..."]`

**Lead Creation:**
- New Lead button: `a[title="New"]`
- First Name: `input[name="firstName"]`
- Last Name: `input[name="lastName"]`
- Company: `input[name="Company"]`
- Email: `input[name="Email"]`
- Save button: `button[title="Save"]`

**Lead Conversion:**
- Convert button: `button[name="Convert"]`
- Opportunity Name: `input[name="opportunityName"]`
- Converted Status: `span[title="Converted"]`

**Quote Creation:**
- Related tab: `a[data-tab-value="related"]`
- New Quote button: `a[title="New" and contains text "Quote"]`
- Quote Name: `input[name*="Name"]`
- Expiration Date: `input[name*="ExpirationDate"]`

**Quote Line Item:**
- Product: `lightning-combobox input[name="Product2Id"]`
- Quantity: `input[name="Quantity"]`
- Discount: `input[name="Discount"]`
- Justification: `textarea[name="Discount_Justification__c"]`

### **Step 3.3: Document Locator Strategy**

| Element Type | Preferred Locator | Fallback |
|--------------|-------------------|----------|
| Lightning Buttons | `button[title="..."]` | `button[name="..."]` |
| Lightning Input | `input[name="..."]` | `lightning-input[field-name="..."]` |
| Lightning Combobox | `lightning-combobox[field-name="..."]` | `button[aria-label="..."]` |
| Lightning Modal | `div.slds-modal` | `article.slds-card` |
| Save Button | `button[name="SaveEdit"]` | `button[title="Save"]` |

---

## 🏗️ **Phase 4: Page Object Model Development**

### **Step 4.1: Create Locator Files**

**File:** `src/web/salesforce/locators/salesforce-lead.locators.js`

```javascript
const leadLocators = {
  // Navigation
  appLauncher: (page) => page.locator('button[title="App Launcher"]').first(),
  searchApps: (page) => page.locator('input[placeholder="Search apps and items..."]').first(),
  
  // Lead List View
  newLeadButton: (page) => page.locator('a[title="New"]').first(),
  
  // Lead Creation Form
  firstName: (page) => page.locator('input[name="firstName"]').first(),
  lastName: (page) => page.locator('input[name="lastName"]').first(),
  company: (page) => page.locator('input[name="Company"]').first(),
  email: (page) => page.locator('input[name="Email"]').first(),
  phone: (page) => page.locator('input[name="Phone"]').first(),
  saveButton: (page) => page.locator('button[name="SaveEdit"]').first(),
  
  // Lead Conversion
  convertButton: (page) => page.locator('button[name="Convert"]').first(),
  opportunityName: (page) => page.locator('input[name="opportunityName"]').first(),
  convertLeadButton: (page) => page.locator('button[title="Convert"]').first(),
  
  // Validation
  leadStatus: (page) => page.locator('span[title="Converted"]').first(),
};

module.exports = leadLocators;
```

**File:** `src/web/salesforce/locators/salesforce-quote.locators.js`

```javascript
const quoteLocators = {
  // Quote Navigation
  relatedTab: (page) => page.locator('a[data-tab-value="related"]').first(),
  newQuoteButton: (page) => page.locator('a[title*="New"][title*="Quote"]').first(),
  
  // Quote Form
  quoteName: (page) => page.locator('input[name*="Name"]').first(),
  expirationDate: (page) => page.locator('input[name*="ExpirationDate"]').first(),
  saveButton: (page) => page.locator('button[name="SaveEdit"]').first(),
  
  // Quote Line Item
  newLineItemButton: (page) => page.locator('a[title="Add Products"]').first(),
  productSearch: (page) => page.locator('lightning-combobox input[placeholder*="Search Products"]').first(),
  productOption: (page, productName) => page.locator(`span[title="${productName}"]`).first(),
  quantity: (page) => page.locator('input[name="Quantity"]').first(),
  discount: (page) => page.locator('input[name="Discount"]').first(),
  justification: (page) => page.locator('textarea[name="Discount_Justification__c"]').first(),
  
  // Validation Fields
  subtotal: (page) => page.locator('span[data-field="Subtotal"]').first(),
  discountAmount: (page) => page.locator('span[data-field="TotalDiscountAmount"]').first(),
  totalPrice: (page) => page.locator('span[data-field="TotalPrice"]').first(),
  
  // Error Messages
  validationError: (page) => page.locator('div.slds-form-element__help').first(),
};

module.exports = quoteLocators;
```

### **Step 4.2: Create Page Object Classes**

**File:** `src/web/salesforce/pages/salesforce-lead.page.js`

```javascript
const loc = require('../locators/salesforce-lead.locators');
const TD = require('../../../shared/data/salesforce-test-data');

class SalesforceLeadPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToLeads() {
    await loc.appLauncher(this.page).click();
    await loc.searchApps(this.page).fill('Leads');
    await this.page.locator('text=Leads').first().click();
    await this.page.waitForURL(TD.urlPatterns.leadList);
  }

  async createLead(leadData) {
    await loc.newLeadButton(this.page).click();
    await loc.firstName(this.page).fill(leadData.firstName);
    await loc.lastName(this.page).fill(leadData.lastName);
    await loc.company(this.page).fill(leadData.company);
    await loc.email(this.page).fill(leadData.email);
    if (leadData.phone) {
      await loc.phone(this.page).fill(leadData.phone);
    }
    await loc.saveButton(this.page).click();
    await this.page.waitForURL(TD.urlPatterns.leadDetail);
  }

  async convertLead(opportunityName) {
    await loc.convertButton(this.page).click();
    await loc.opportunityName(this.page).fill(opportunityName);
    await loc.convertLeadButton(this.page).click();
    await this.page.waitForSelector('text=Your lead has been converted');
  }

  async verifyLeadConverted() {
    return await loc.leadStatus(this.page).isVisible();
  }
}

module.exports = SalesforceLeadPage;
```

**File:** `src/web/salesforce/pages/salesforce-quote.page.js`

```javascript
const loc = require('../locators/salesforce-quote.locators');

class SalesforceQuotePage {
  constructor(page) {
    this.page = page;
  }

  async createQuote(quoteData) {
    await loc.relatedTab(this.page).click();
    await loc.newQuoteButton(this.page).click();
    await loc.quoteName(this.page).fill(quoteData.name);
    await loc.expirationDate(this.page).fill(quoteData.expirationDate);
    await loc.saveButton(this.page).click();
  }

  async addQuoteLineItem(lineItemData) {
    await loc.newLineItemButton(this.page).click();
    
    // Select product
    await loc.productSearch(this.page).fill(lineItemData.product);
    await loc.productOption(this.page, lineItemData.product).click();
    
    // Fill quantity and discount
    await loc.quantity(this.page).fill(lineItemData.quantity.toString());
    await loc.discount(this.page).fill(lineItemData.discount.toString());
    
    // Fill justification if provided
    if (lineItemData.justification) {
      await loc.justification(this.page).fill(lineItemData.justification);
    }
    
    await loc.saveButton(this.page).click();
  }

  async getQuoteCalculations() {
    return {
      subtotal: await loc.subtotal(this.page).textContent(),
      discountAmount: await loc.discountAmount(this.page).textContent(),
      totalPrice: await loc.totalPrice(this.page).textContent(),
    };
  }

  async getValidationError() {
    return await loc.validationError(this.page).textContent();
  }
}

module.exports = SalesforceQuotePage;
```

---

## 🧪 **Phase 5: Automated Test Spec Creation**

### **Step 5.1: Create Data-Driven Test Spec**

**File:** `src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js`

```javascript
const { test, expect } = require('../../../shared/fixtures');
const SalesforceLeadPage = require('../pages/salesforce-lead.page');
const SalesforceQuotePage = require('../pages/salesforce-quote.page');
const TD = require('../../../shared/data/salesforce-test-data');
const fs = require('fs');
const path = require('path');

// Load test data from JSON
const testDataPath = path.join(__dirname, '../../../shared/data/salesforce-quote-validation-data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

test.describe('Salesforce Lead to Quote Validation [JIRA: DZ-1]', () => {
  let leadPage;
  let quotePage;

  test.beforeEach(async ({ page }) => {
    leadPage = new SalesforceLeadPage(page);
    quotePage = new SalesforceQuotePage(page);
    
    // Login to Salesforce
    await page.goto(TD.urls.login);
    // Login steps...
  });

  // Loop through test data
  testData.testCases.forEach((testCase) => {
    test(`[${testCase.testId}] ${testCase.scenario}`, async ({ page }) => {
      // Step 1: Create Lead
      const leadData = {
        firstName: 'Test',
        lastName: `Lead_${Date.now()}`,
        company: 'Test Corp',
        email: `test${Date.now()}@example.com`,
      };
      await leadPage.navigateToLeads();
      await leadPage.createLead(leadData);

      // Step 2: Convert Lead to Opportunity
      const opportunityName = `Opp_${Date.now()}`;
      await leadPage.convertLead(opportunityName);

      // Step 3: Create Quote
      const quoteData = {
        name: `Quote_${Date.now()}`,
        expirationDate: '12/31/2026',
      };
      await quotePage.createQuote(quoteData);

      // Step 4: Add Quote Line Item
      const lineItemData = {
        product: testCase.product,
        quantity: testCase.quantity,
        discount: testCase.discount,
        justification: testCase.justification,
      };
      await quotePage.addQuoteLineItem(lineItemData);

      // Step 5: Validate Results
      if (testCase.expectedResult.shouldPass) {
        // Should pass validation
        const calculations = await quotePage.getQuoteCalculations();
        
        // Calculate expected values
        const unitPrice = testCase.calculations.unitPrice;
        const expectedSubtotal = testCase.quantity * unitPrice;
        const expectedDiscount = expectedSubtotal * (testCase.discount / 100);
        const expectedTotal = expectedSubtotal - expectedDiscount;

        // Assert calculations
        expect(parseFloat(calculations.subtotal.replace('$', ''))).toBeCloseTo(expectedSubtotal, 2);
        expect(parseFloat(calculations.discountAmount.replace('$', ''))).toBeCloseTo(expectedDiscount, 2);
        expect(parseFloat(calculations.totalPrice.replace('$', ''))).toBeCloseTo(expectedTotal, 2);
      } else {
        // Should fail validation
        const errorMessage = await quotePage.getValidationError();
        expect(errorMessage).toContain(testCase.expectedResult.validationErrors[0]);
      }
    });
  });
});
```

---

## ▶️ **Phase 6: Test Execution & Reporting**

### **Step 6.1: Run Tests**

```bash
# Run all Salesforce quote validation tests
npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js --headed

# Run specific test case
npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js -g "C005"

# Run in parallel
npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js --workers=3
```

### **Step 6.2: View HTML Report**

```bash
npx playwright show-report
```

### **Step 6.3: Report Results to TestRail**

```bash
# Report test results to TestRail
node scripts/report-to-testrail.js --test-results=test-results/results.json
```

**Expected Output:**
```
✅ Reported C005 → TestRail Case 123: PASSED
❌ Reported C006 → TestRail Case 124: FAILED (Expected - validation error)
✅ Reported C007 → TestRail Case 125: PASSED
... (15 total)
```

### **Step 6.4: Update JIRA Story**

```bash
# Update JIRA story with test execution summary
node scripts/update-salesforce-jira.js DZ-1
```

**JIRA Comment Added:**
```
✅ Test Execution Complete - Lead to Quote Validation

Summary:
- Total Tests: 15
- Passed: 10
- Failed (Expected): 5
- Coverage: 100%

Test Details:
✅ C005: Valid data - PASSED
✅ C006: Discount >15% without justification - FAILED AS EXPECTED
✅ C007: Discount >15% with justification - PASSED
... (see full report)

Report: https://playwright-report-url
TestRail Run: https://aava-testrail.avateam.io/index.php?/runs/view/123
```

---

## 🔄 **Phase 7: Continuous Integration**

### **Step 7.1: GitHub Actions Workflow**

Create `.github/workflows/salesforce-tests.yml`:

```yaml
name: Salesforce Quote Validation Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Salesforce tests
        env:
          SALESFORCE_USERNAME: ${{ secrets.SALESFORCE_USERNAME }}
          SALESFORCE_PASSWORD: ${{ secrets.SALESFORCE_PASSWORD }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
          TESTRAIL_API_KEY: ${{ secrets.TESTRAIL_API_KEY }}
        run: npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
      
      - name: Report to TestRail
        if: always()
        run: node scripts/report-to-testrail.js
```

---

## 📊 **Success Criteria Checklist**

- [ ] ✅ JIRA story DZ-1 has acceptance criteria documented
- [ ] ✅ 15 TestRail manual test cases created with IDs (C005-PERF-001)
- [ ] ✅ Salesforce application inspected and locators documented
- [ ] ✅ Page Object Model assets created:
  - [ ] `salesforce-lead.locators.js`
  - [ ] `salesforce-quote.locators.js`
  - [ ] `salesforce-lead.page.js`
  - [ ] `salesforce-quote.page.js`
- [ ] ✅ Automated test spec created: `salesforce-lead-to-quote-validation.spec.js`
- [ ] ✅ All 15 test cases execute successfully
- [ ] ✅ Test results match expected values from CSV/JSON
- [ ] ✅ Results reported to TestRail
- [ ] ✅ JIRA story updated with test execution summary
- [ ] ✅ CI/CD pipeline configured for automated execution

---

## 🎯 **Next Steps**

1. **Update Salesforce Credentials**: Add your Salesforce username/password to `.env`
2. **Run the Helper Scripts**:
   ```bash
   node scripts/fetch-jira-issue.js DZ-1
   node scripts/create-testrail-cases-from-csv.js src/shared/data/quote-validation-testcases.csv
   ```
3. **Inspect Salesforce Application**: Use Playwright Codegen to validate locators
4. **Create Page Objects**: Implement locators and page classes as documented above
5. **Generate Test Spec**: Create data-driven test spec
6. **Execute Tests**: Run tests and validate results
7. **Report Results**: Update TestRail and JIRA

---

**Document Created:** 2026-07-28  
**Last Updated:** 2026-07-28  
**Author:** Salesforce Automation Agent  
