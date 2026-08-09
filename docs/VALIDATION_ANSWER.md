# 📊 Excel/JSON Validation - Complete Answer

## 🎯 Direct Answer to Your Question

**"Where are you considering the excel / json validation?"**

The Excel/JSON validation happens at **TWO critical points** in your workflow:

---

## 1️⃣ **Test Execution Phase** (Main Validation)

```
Test Execution (Playwright)
    ↓
┌─────────────────────────────────────────────────┐
│  FOR EACH TEST CASE:                            │
│                                                  │
│  📥 Read EXPECTED from CSV/JSON                 │
│     ├─ Product, Quantity, Discount              │
│     ├─ Expected Subtotal                        │
│     ├─ Expected Discount Amount                 │
│     ├─ Expected Total                           │
│     └─ Should Pass (true/false)                 │
│                                                  │
│  🌐 Execute in Salesforce                       │
│     ├─ Create Lead                              │
│     ├─ Convert to Opportunity                   │
│     ├─ Create Quote                             │
│     └─ Add Line Item (using CSV/JSON values)    │
│                                                  │
│  📸 Capture ACTUAL from Salesforce UI           │
│     ├─ Actual Subtotal                          │
│     ├─ Actual Discount Amount                   │
│     └─ Actual Total                             │
│                                                  │
│  🔴 VALIDATE: Compare ACTUAL vs EXPECTED        │
│     ├─ expect(actual).toEqual(expected)         │
│     ├─ Assert Subtotal matches                  │
│     ├─ Assert Discount matches                  │
│     └─ Assert Total matches                     │
│                                                  │
│  ✅ Pass/Fail based on comparison               │
└─────────────────────────────────────────────────┘
```

**Code Location:** [src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js](../src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js)

**Lines 90-140:** This is where the validation happens:

```javascript
// Load expected values from JSON/CSV
const expectedSubtotal = testCase.quantity * testCase.calculations.unitPrice;
const expectedDiscount = expectedSubtotal * (testCase.discount / 100);
const expectedTotal = expectedSubtotal - expectedDiscount;

// Capture actual values from Salesforce
const calculations = await quotePage.getQuoteCalculations();
const actualSubtotal = parseFloat(calculations.subtotal);
const actualDiscount = parseFloat(calculations.discountAmount);
const actualTotal = parseFloat(calculations.totalPrice);

// 🔴 VALIDATE - Compare actual vs expected
expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);  // ← VALIDATION HERE
expect(actualDiscount).toBeCloseTo(expectedDiscount, 2);  // ← VALIDATION HERE
expect(actualTotal).toBeCloseTo(expectedTotal, 2);        // ← VALIDATION HERE
```

---

## 2️⃣ **Reporting Phase** (Validation Results Display)

```
HTML Report + TestRail + JIRA Update
    ↓
┌─────────────────────────────────────────────────┐
│  📊 VALIDATION REPORT                            │
│                                                  │
│  Test: [C005] Valid data                        │
│                                                  │
│  Expected (from CSV/JSON) | Actual (Salesforce) │
│  ─────────────────────────┼────────────────────│
│  Subtotal:    $149.90     │  $149.90  ✅       │
│  Discount:    $14.99      │  $14.99   ✅       │
│  Total:       $134.91     │  $134.91  ✅       │
│  Should Pass: TRUE        │  PASSED   ✅       │
│                                                  │
│  Result: ✅ ALL VALIDATIONS PASSED              │
└─────────────────────────────────────────────────┘
```

**Report Locations:**
- **Playwright HTML Report:** `playwright-report/index.html`
- **TestRail:** Case comments show Expected vs Actual
- **JIRA:** Story comments show validation summary

---

## 🔄 Complete Workflow with Validation Highlighted

```
1. Requirements (DZ-1)
   └─ Define: "validate results match excel/json"
        ↓
2. TestRail Cases (15 cases)
   └─ CSV provides test case details
        ↓
3. Salesforce Inspection
   └─ Identify UI elements to capture
        ↓
4. Page Objects (Lead + Quote)
   └─ Methods to capture actual values
        ↓
5. Automated Test Spec (Data-driven)
   └─ Load CSV/JSON test data ✅
        ↓
6. Test Execution (Playwright)
   ├─ Read EXPECTED from CSV/JSON ✅
   ├─ Execute in Salesforce
   ├─ Capture ACTUAL from UI ✅
   └─ 🔴 VALIDATE: ACTUAL === EXPECTED ✅ ← **HERE!**
        ↓
7. HTML Report + TestRail + JIRA Update
   └─ Show Expected vs Actual comparison ✅ ← **AND HERE!**
```

---

## 📁 Files Involved in Validation

### Input Files (Test Data):
1. **[src/shared/data/quote-validation-testcases.csv](../src/shared/data/quote-validation-testcases.csv)**
   - 15 test scenarios
   - Expected values for each field
   
2. **[src/shared/data/salesforce-quote-validation-data.json](../src/shared/data/salesforce-quote-validation-data.json)**
   - Detailed test case definitions
   - Calculations formulas
   - Expected results

### Validation Logic Files:
3. **[src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js](../src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js)** ✨
   - **Lines 28-30:** Load CSV/JSON data
   - **Lines 50-58:** Calculate expected values from JSON
   - **Lines 100-110:** Capture actual values from Salesforce
   - **Lines 120-140:** 🔴 **VALIDATION - Compare actual vs expected**

4. **[src/web/salesforce/pages/salesforce-quote.page.js](../src/web/salesforce/pages/salesforce-quote.page.js)**
   - `getQuoteCalculations()` method to capture actual values

### Output Files (Validation Results):
5. **[test-results/results.json](../test-results/results.json)**
   - Raw test results with pass/fail status
   
6. **[playwright-report/index.html](../playwright-report/index.html)**
   - Visual comparison of expected vs actual

7. **TestRail Case Comments**
   - Detailed validation report for each test

---

## 🎯 Validation Matrix

| Field | Source | Expected From | Actual From | Validation Point |
|-------|--------|---------------|-------------|------------------|
| **Test ID** | CSV | Row 1, Col 1 | Test title | Test case mapping |
| **Product** | JSON | `testCase.product` | Salesforce input | Input validation |
| **Quantity** | JSON | `testCase.quantity` | Salesforce input | Input validation |
| **Discount%** | JSON | `testCase.discount` | Salesforce input | Input validation |
| **Justification** | JSON | `testCase.justification` | Salesforce input | Business rule validation |
| **Subtotal** | CSV/JSON | `quantity × unitPrice` | `getQuoteCalculations().subtotal` | 🔴 **Assertion** |
| **Discount Amount** | CSV/JSON | `subtotal × discount%` | `getQuoteCalculations().discountAmount` | 🔴 **Assertion** |
| **Total Price** | CSV/JSON | `subtotal - discount` | `getQuoteCalculations().totalPrice` | 🔴 **Assertion** |
| **Should Pass** | JSON | `expectedResult.shouldPass` | No validation errors | 🔴 **Assertion** |

---

## 💡 Key Validation Code Snippet

```javascript
// From: src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js

// STEP 1: Get EXPECTED values from JSON/CSV
const expectedSubtotal = testCase.quantity * testCase.calculations.unitPrice;
const expectedDiscount = expectedSubtotal * (testCase.discount / 100);
const expectedTotal = expectedSubtotal - expectedDiscount;

console.log(`Expected Subtotal: $${expectedSubtotal.toFixed(2)}`);
console.log(`Expected Discount: $${expectedDiscount.toFixed(2)}`);
console.log(`Expected Total: $${expectedTotal.toFixed(2)}`);

// STEP 2: Perform actions in Salesforce using JSON/CSV values
await quotePage.addQuoteLineItem({
  product: testCase.product,      // ← from JSON
  quantity: testCase.quantity,    // ← from JSON
  discount: testCase.discount,    // ← from JSON
  justification: testCase.justification  // ← from JSON
});

// STEP 3: Capture ACTUAL values from Salesforce UI
const calculations = await quotePage.getQuoteCalculations();
const actualSubtotal = parseFloat(calculations.subtotal.replace('$', ''));
const actualDiscount = parseFloat(calculations.discountAmount.replace('$', ''));
const actualTotal = parseFloat(calculations.totalPrice.replace('$', ''));

console.log(`Actual Subtotal: $${actualSubtotal.toFixed(2)}`);
console.log(`Actual Discount: $${actualDiscount.toFixed(2)}`);
console.log(`Actual Total: $${actualTotal.toFixed(2)}`);

// STEP 4: 🔴 VALIDATE - Compare ACTUAL vs EXPECTED
console.log('\n🔍 VALIDATING - Comparing ACTUAL vs EXPECTED...');

expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
// ↑ If this fails, test fails with message:
// "Expected $149.90 but got $150.00"

expect(actualDiscount).toBeCloseTo(expectedDiscount, 2);
// ↑ If this fails, test fails with message:
// "Expected $14.99 but got $15.00"

expect(actualTotal).toBeCloseTo(expectedTotal, 2);
// ↑ If this fails, test fails with message:
// "Expected $134.91 but got $135.00"

console.log('✅ ALL VALIDATIONS PASSED');
```

---

## ✅ Summary

**Your Excel/JSON validation happens in the workflow at:**

1. **Test Execution Phase (Step 6):** 
   - Compare Salesforce actual values vs CSV/JSON expected values
   - Use Playwright assertions: `expect(actual).toBeCloseTo(expected)`
   
2. **Reporting Phase (Step 7):**
   - Display Expected vs Actual in reports
   - Show validation pass/fail status

**Files Created:**
- ✅ [salesforce-lead-to-quote-validation.spec.js](../src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js) - Main test spec with validation logic
- ✅ [VALIDATION_FLOW_DIAGRAM.md](./VALIDATION_FLOW_DIAGRAM.md) - Visual diagram of validation flow
- ✅ [SALESFORCE_E2E_WORKFLOW.md](./SALESFORCE_E2E_WORKFLOW.md) - Complete workflow documentation
- ✅ This file - Direct answer to your question

**Test Data Files (Already Exist):**
- ✅ [quote-validation-testcases.csv](../src/shared/data/quote-validation-testcases.csv) - 15 test scenarios
- ✅ [salesforce-quote-validation-data.json](../src/shared/data/salesforce-quote-validation-data.json) - Detailed test data

---

**Next Steps:**
1. Review the test spec: [salesforce-lead-to-quote-validation.spec.js](../src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js)
2. See the validation flow diagram: [VALIDATION_FLOW_DIAGRAM.md](./VALIDATION_FLOW_DIAGRAM.md)
3. Run the tests to see validation in action!

The validation is **fully integrated** into your test execution phase! 🎯
