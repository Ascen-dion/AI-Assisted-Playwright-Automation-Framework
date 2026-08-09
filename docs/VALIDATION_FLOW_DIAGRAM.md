# 📊 Excel/JSON Validation Flow - Visual Diagram

## 🎯 Where Validation Happens in the E2E Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PHASE 1: TEST DATA PREPARATION                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  📄 CSV File: quote-validation-testcases.csv                  │
    │  ─────────────────────────────────────────────────            │
    │  Test ID | Scenario | Product | Qty | Discount | Expected... │
    │  C005    | Valid    | ZOOM    | 10  | 10       | 149.9       │
    │  C006    | Invalid  | ZOOM    | 5   | 20       | FAIL        │
    │  ...     | ...      | ...     | ... | ...      | ...         │
    │                                                                │
    │  📄 JSON File: salesforce-quote-validation-data.json          │
    │  ─────────────────────────────────────────────────            │
    │  {                                                             │
    │    "testId": "C005",                                          │
    │    "product": "ZOOM",                                         │
    │    "quantity": 10,                                            │
    │    "discount": 10,                                            │
    │    "expectedResult": { "shouldPass": true },                  │
    │    "calculations": { "unitPrice": 14.99, ... }                │
    │  }                                                             │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: TEST SPEC GENERATION                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  🧪 Test Spec: salesforce-lead-to-quote-validation.spec.js   │
    │  ─────────────────────────────────────────────────            │
    │  const testData = JSON.parse(                                 │
    │    fs.readFileSync('salesforce-quote-validation-data.json')   │
    │  );                                                            │
    │                                                                │
    │  testData.testCases.forEach((testCase) => {                   │
    │    test(`[${testCase.testId}] ...`, async () => {             │
    │      // Test logic using testCase data                        │
    │    });                                                         │
    │  });                                                           │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    PHASE 3: TEST EXECUTION & VALIDATION                 │
└─────────────────────────────────────────────────────────────────────────┘

    FOR EACH TEST CASE FROM JSON/CSV:
    
    ┌───────────────────────────────────────────────────────────────┐
    │  STEP 1: Read EXPECTED values from JSON/CSV                   │
    │  ───────────────────────────────────────────                  │
    │  ✅ expectedSubtotal = quantity × unitPrice                   │
    │  ✅ expectedDiscount = subtotal × (discount / 100)            │
    │  ✅ expectedTotal = subtotal - discount                       │
    │  ✅ expectedResult = shouldPass (true/false)                  │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  STEP 2: Input values into Salesforce                         │
    │  ───────────────────────────────────────────                  │
    │  → Create Lead (firstName, lastName, company, email)          │
    │  → Convert Lead to Opportunity                                │
    │  → Create Quote                                               │
    │  → Add Quote Line Item:                                       │
    │     • Product: testCase.product      ← from JSON              │
    │     • Quantity: testCase.quantity    ← from JSON              │
    │     • Discount: testCase.discount    ← from JSON              │
    │     • Justification: testCase.justification ← from JSON       │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  STEP 3: Capture ACTUAL values from Salesforce UI             │
    │  ───────────────────────────────────────────────              │
    │  const calculations = await quotePage.getQuoteCalculations(); │
    │  ✅ actualSubtotal = calculations.subtotal                    │
    │  ✅ actualDiscount = calculations.discountAmount              │
    │  ✅ actualTotal = calculations.totalPrice                     │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  STEP 4: 🔴 VALIDATION - Compare ACTUAL vs EXPECTED 🔴        │
    │  ───────────────────────────────────────────────              │
    │                                                                │
    │  ╔═══════════════════════════════════════════════════════╗   │
    │  ║  VALIDATION #1: Subtotal                              ║   │
    │  ║  ─────────────────────                                ║   │
    │  ║  Expected: $149.90 (from JSON/CSV)                    ║   │
    │  ║  Actual:   $149.90 (from Salesforce)                  ║   │
    │  ║  Result:   ✅ MATCH                                   ║   │
    │  ╚═══════════════════════════════════════════════════════╝   │
    │                                                                │
    │  ╔═══════════════════════════════════════════════════════╗   │
    │  ║  VALIDATION #2: Discount Amount                       ║   │
    │  ║  ─────────────────────────                            ║   │
    │  ║  Expected: $14.99 (from JSON/CSV)                     ║   │
    │  ║  Actual:   $14.99 (from Salesforce)                   ║   │
    │  ║  Result:   ✅ MATCH                                   ║   │
    │  ╚═══════════════════════════════════════════════════════╝   │
    │                                                                │
    │  ╔═══════════════════════════════════════════════════════╗   │
    │  ║  VALIDATION #3: Total Price                           ║   │
    │  ║  ─────────────────────────                            ║   │
    │  ║  Expected: $134.91 (from JSON/CSV)                    ║   │
    │  ║  Actual:   $134.91 (from Salesforce)                  ║   │
    │  ║  Result:   ✅ MATCH                                   ║   │
    │  ╚═══════════════════════════════════════════════════════╝   │
    │                                                                │
    │  ╔═══════════════════════════════════════════════════════╗   │
    │  ║  VALIDATION #4: Business Rules                        ║   │
    │  ║  ─────────────────────────                            ║   │
    │  ║  Expected: PASS (shouldPass = true from JSON)         ║   │
    │  ║  Actual:   PASS (no validation errors)                ║   │
    │  ║  Result:   ✅ MATCH                                   ║   │
    │  ╚═══════════════════════════════════════════════════════╝   │
    │                                                                │
    │  expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);     │
    │  expect(actualDiscount).toBeCloseTo(expectedDiscount, 2);     │
    │  expect(actualTotal).toBeCloseTo(expectedTotal, 2);           │
    │                                                                │
    │  🎯 FINAL RESULT: ✅ TEST PASSED                              │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    PHASE 4: REPORTING                                   │
└─────────────────────────────────────────────────────────────────────────┘
    ┌───────────────────────────────────────────────────────────────┐
    │  📊 HTML Report (Playwright)                                   │
    │  ───────────────────────────────────────────                  │
    │  Test: [C005] Valid data - all fields correct                 │
    │  Status: ✅ PASSED                                            │
    │  Duration: 45.2s                                              │
    │                                                                │
    │  Validations:                                                  │
    │    ✅ Subtotal: Expected $149.90 = Actual $149.90            │
    │    ✅ Discount: Expected $14.99 = Actual $14.99              │
    │    ✅ Total: Expected $134.91 = Actual $134.91               │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  📋 TestRail Report                                            │
    │  ───────────────────────────────────────────                  │
    │  Case C123: [C005] Valid data - all fields correct            │
    │  Status: ✅ PASSED                                            │
    │  Comment:                                                      │
    │    Automated validation passed                                │
    │    - Subtotal: $149.90 ✅                                    │
    │    - Discount: $14.99 ✅                                     │
    │    - Total: $134.91 ✅                                       │
    │    - All values matched CSV/JSON expected results            │
    └───────────────────────────────────────────────────────────────┘
                                    ↓
    ┌───────────────────────────────────────────────────────────────┐
    │  📌 JIRA Story Update (DZ-1)                                   │
    │  ───────────────────────────────────────────                  │
    │  Comment:                                                      │
    │    ✅ Test Execution Complete                                 │
    │    Total Tests: 15                                            │
    │    Passed: 10 ✅                                              │
    │    Failed (Expected): 5 ❌                                    │
    │    All calculations validated against CSV/JSON test data      │
    │                                                                │
    │    TestRail Run: https://aava-testrail.../runs/view/456       │
    │    HTML Report: https://playwright-report-url                 │
    └───────────────────────────────────────────────────────────────┘
```

---

## 🔍 Detailed Validation Example

### Test Case: C005 - Valid Data

```
┌─────────────────────────────────────────────────────────────────┐
│  📥 INPUT (from JSON/CSV)                                        │
├─────────────────────────────────────────────────────────────────┤
│  Test ID:        C005                                            │
│  Scenario:       "Valid data - all fields correct"              │
│  Product:        ZOOM                                            │
│  Quantity:       10                                              │
│  Unit Price:     $14.99                                          │
│  Discount:       10%                                             │
│  Justification:  "Standard volume discount"                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  📊 EXPECTED CALCULATIONS (from JSON/CSV)                        │
├─────────────────────────────────────────────────────────────────┤
│  Expected Subtotal:  10 × $14.99 = $149.90                      │
│  Expected Discount:  $149.90 × 10% = $14.99                     │
│  Expected Total:     $149.90 - $14.99 = $134.91                 │
│  Should Pass:        TRUE ✅                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  🌐 SALESFORCE ACTIONS                                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Create Lead                                                  │
│  2. Convert to Opportunity                                       │
│  3. Create Quote                                                 │
│  4. Add Quote Line Item:                                         │
│     - Product: ZOOM                                              │
│     - Quantity: 10                                               │
│     - Discount: 10%                                              │
│     - Justification: "Standard volume discount"                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  📥 ACTUAL RESULTS (captured from Salesforce UI)                 │
├─────────────────────────────────────────────────────────────────┤
│  Actual Subtotal:    $149.90                                     │
│  Actual Discount:    $14.99                                      │
│  Actual Total:       $134.91                                     │
│  Validation Errors:  None                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  🔴 VALIDATION - COMPARISON                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Subtotal:                                                       │
│    Expected (CSV/JSON): $149.90                                  │
│    Actual (Salesforce): $149.90                                  │
│    Result: ✅ MATCH                                             │
│                                                                  │
│  Discount:                                                       │
│    Expected (CSV/JSON): $14.99                                   │
│    Actual (Salesforce): $14.99                                   │
│    Result: ✅ MATCH                                             │
│                                                                  │
│  Total:                                                          │
│    Expected (CSV/JSON): $134.91                                  │
│    Actual (Salesforce): $134.91                                  │
│    Result: ✅ MATCH                                             │
│                                                                  │
│  Business Rule (Discount ≤15% → No justification required):     │
│    Expected (CSV/JSON): Should PASS                              │
│    Actual (Salesforce): PASSED (no errors)                       │
│    Result: ✅ MATCH                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    ✅ TEST PASSED
```

---

## 📋 Summary: Where Validation Happens

| Phase | Activity | Excel/JSON Role |
|-------|----------|----------------|
| **1. Test Data Loading** | Load CSV/JSON files | ✅ **Source of truth** for expected values |
| **2. Test Generation** | Create test cases | ✅ **Loop through each row** in CSV/JSON |
| **3. Test Input** | Fill Salesforce forms | ✅ **Input values from** CSV/JSON |
| **4. Calculation** | Compute expected results | ✅ **Calculate from** CSV/JSON values |
| **5. Execution** | Perform actions in Salesforce | Uses values from CSV/JSON |
| **6. Capture** | Get actual results from UI | Salesforce calculates and displays |
| **7. 🔴 VALIDATION** | **Compare Actual vs Expected** | ✅ **CRITICAL STEP - Assert actual Salesforce values match CSV/JSON expected values** |
| **8. Reporting** | Generate reports | ✅ **Show comparison** (Expected vs Actual) |

---

## 🎯 Key Insight

**The Excel/JSON validation happens in TWO places:**

1. **During Test Execution (Step 7):**
   - Read EXPECTED values from CSV/JSON
   - Capture ACTUAL values from Salesforce
   - **Assert ACTUAL === EXPECTED**

2. **In Test Reports (Step 8):**
   - Show side-by-side comparison
   - Expected (from CSV/JSON) vs Actual (from Salesforce)
   - Visual indication of matches/mismatches

This ensures that **every calculation and business rule in Salesforce matches exactly what's defined in your CSV/JSON test data**, providing complete data-driven validation! ✅
