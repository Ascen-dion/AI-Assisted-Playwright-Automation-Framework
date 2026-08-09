# 🚀 Quick Start Guide - Salesforce Lead to Quote Validation

## 📋 What We've Set Up

✅ **Environment Configuration** ([.env](../.env))
- JIRA credentials enabled (DZ project)
- TestRail credentials enabled  
- Salesforce URL configured (⚠️ credentials need update)

✅ **Test Data Files**
- [quote-validation-testcases.csv](../src/shared/data/quote-validation-testcases.csv) - 15 test scenarios
- [salesforce-quote-validation-data.json](../src/shared/data/salesforce-quote-validation-data.json) - Detailed test data
- [salesforce-test-data.js](../src/shared/data/salesforce-test-data.js) - Framework module

✅ **Helper Scripts**
- [create-testrail-cases-from-csv.js](../scripts/create-testrail-cases-from-csv.js) - Create TestRail cases
- [report-salesforce-to-testrail.js](../scripts/report-salesforce-to-testrail.js) - Report results to TestRail
- [fetch-jira-issue.js](../scripts/fetch-jira-issue.js) - Fetch JIRA story details

✅ **Documentation**
- [SALESFORCE_E2E_WORKFLOW.md](./SALESFORCE_E2E_WORKFLOW.md) - Complete workflow guide

---

## 🎯 Step-by-Step Execution

### **STEP 1: Update Salesforce Credentials** ⚠️ REQUIRED

Open [.env](../.env) and update:

```env
SALESFORCE_USERNAME=your_actual_salesforce_username
SALESFORCE_PASSWORD=your_actual_salesforce_password
```

### **STEP 2: Create TestRail Test Cases**

Run the helper script to automatically create 15 test cases in TestRail:

```bash
node scripts/create-testrail-cases-from-csv.js
```

**Expected Output:**
```
✅ Created TestRail Case [C005] → Case ID: C123
✅ Created TestRail Case [C006] → Case ID: C124
... (15 total)
```

### **STEP 3: Inspect Salesforce Application** (Optional - Validate Locators)

Use Playwright Inspector to verify UI elements:

```bash
npx playwright codegen https://as1783480463162.lightning.force.com/lightning/page/home
```

**Key Elements to Inspect:**
- Login fields: `input#username`, `input#password`
- App Launcher: `button[title="App Launcher"]`
- New Lead button: `a[title="New"]`
- Lead fields: `input[name="firstName"]`, `input[name="lastName"]`
- Convert button: `button[name="Convert"]`
- Quote fields: Product, Quantity, Discount, Justification

### **STEP 4: Generate Page Object Model Assets**

We need to create the following files (see [SALESFORCE_E2E_WORKFLOW.md](./SALESFORCE_E2E_WORKFLOW.md) Phase 4 for complete code):

**Locator Files:**
- `src/web/salesforce/locators/salesforce-lead.locators.js`
- `src/web/salesforce/locators/salesforce-quote.locators.js`

**Page Object Files:**
- `src/web/salesforce/pages/salesforce-lead.page.js`
- `src/web/salesforce/pages/salesforce-quote.page.js`

**Quick Create Command:**

```bash
# Option 1: Ask Copilot to create these files
# "Create the page objects and locators as specified in SALESFORCE_E2E_WORKFLOW.md Phase 4"

# Option 2: Copy the code from the workflow document manually
```

### **STEP 5: Generate Automated Test Spec**

Create the data-driven test spec (see [SALESFORCE_E2E_WORKFLOW.md](./SALESFORCE_E2E_WORKFLOW.md) Phase 5):

**File:** `src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js`

**Quick Create Command:**

```bash
# Ask Copilot:
# "Create the test spec salesforce-lead-to-quote-validation.spec.js as specified in Phase 5 of the workflow document"
```

### **STEP 6: Run Tests**

Execute the automated tests:

```bash
# Run all tests
npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js --headed

# Run specific test case
npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js -g "C005"

# Run in parallel (faster)
npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js --workers=3
```

### **STEP 7: View Test Report**

```bash
npx playwright show-report
```

### **STEP 8: Report Results to TestRail**

```bash
node scripts/report-salesforce-to-testrail.js
```

**Expected Output:**
```
✅ Created Test Run: Salesforce Quote Validation - 2026-07-28
📊 Reporting Results:
  ✅ Reported Case C123: PASSED
  ✅ Reported Case C124: FAILED (as expected)
... (15 total)

🔗 View Test Run: https://aava-testrail.avateam.io/index.php?/runs/view/456
```

### **STEP 9: Update JIRA Story**

```bash
node scripts/update-salesforce-jira.js DZ-1
```

---

## 📊 Test Scenarios Overview

Your test data includes:

| Category | Test IDs | Count | Description |
|----------|----------|-------|-------------|
| **Valid Cases** | C005, C007, C009, CALC-001, CALC-002, CALC-003, EDGE-001, EDGE-003, EDGE-004, PERF-001 | 10 | Should PASS validation |
| **Invalid Cases** | C006, C008-ZERO, C008-NEGATIVE, EDGE-002 | 4 | Should FAIL validation (expected) |
| **Edge Cases** | EDGE-001, EDGE-002, EDGE-003, EDGE-004 | 4 | Boundary testing (15% discount threshold) |
| **Performance** | PERF-001 | 1 | Large quantity (10,000 items) |

**Total:** 15 test cases

---

## 🔧 Troubleshooting

### Issue: Salesforce login fails
**Solution:** 
1. Verify credentials in `.env`
2. Check if MFA is enabled (you may need to append security token to password)
3. Use: `SALESFORCE_PASSWORD=yourPassword123YourSecurityToken`

### Issue: Locators not found
**Solution:**
1. Run Playwright Inspector to verify locators
2. Salesforce may have updated their UI - check for new selectors
3. Update locator files accordingly

### Issue: TestRail API error
**Solution:**
1. Verify TestRail credentials in `.env`
2. Check TestRail section ID exists
3. Ensure you have permissions to create test cases

### Issue: Test data not loading
**Solution:**
1. Verify JSON/CSV files exist in `src/shared/data/`
2. Check file paths in test spec
3. Ensure Node.js can read the files

---

## 📁 Project Structure

```
AI-Assisted-Test-Automation-Framework/
├── .env (✅ JIRA & TestRail configured)
├── docs/
│   ├── SALESFORCE_E2E_WORKFLOW.md (✅ Complete workflow guide)
│   └── QUICK_START_SALESFORCE.md (✅ This file)
├── scripts/
│   ├── create-testrail-cases-from-csv.js (✅ Created)
│   ├── report-salesforce-to-testrail.js (✅ Created)
│   └── fetch-jira-issue.js (existing)
├── src/
│   ├── shared/
│   │   └── data/
│   │       ├── quote-validation-testcases.csv (✅ 15 scenarios)
│   │       ├── salesforce-quote-validation-data.json (✅ Test data)
│   │       └── salesforce-test-data.js (✅ Framework module)
│   └── web/
│       └── salesforce/
│           ├── locators/ (⏳ To be created - Step 4)
│           │   ├── salesforce-lead.locators.js
│           │   └── salesforce-quote.locators.js
│           ├── pages/ (⏳ To be created - Step 4)
│           │   ├── salesforce-lead.page.js
│           │   └── salesforce-quote.page.js
│           └── tests/ (⏳ To be created - Step 5)
│               └── salesforce-lead-to-quote-validation.spec.js
```

---

## 🎯 Success Checklist

- [ ] **STEP 1:** Salesforce credentials updated in `.env`
- [ ] **STEP 2:** TestRail test cases created (15 cases)
- [ ] **STEP 3:** Salesforce application inspected (optional)
- [ ] **STEP 4:** Page objects and locators created (4 files)
- [ ] **STEP 5:** Test spec created (1 file)
- [ ] **STEP 6:** Tests executed successfully
- [ ] **STEP 7:** HTML report reviewed
- [ ] **STEP 8:** Results reported to TestRail
- [ ] **STEP 9:** JIRA story DZ-1 updated

---

## 🚀 Next Steps

**Ready to start?**

1. **Update Salesforce credentials** in `.env` (STEP 1)
2. **Run:** `node scripts/create-testrail-cases-from-csv.js` (STEP 2)
3. **Ask me:** "Create the Salesforce page objects and test spec as documented in SALESFORCE_E2E_WORKFLOW.md"
4. **Run tests:** `npx playwright test src/web/salesforce/tests/salesforce-lead-to-quote-validation.spec.js`
5. **Report results:** `node scripts/report-salesforce-to-testrail.js`

---

**Need Help?**

- 📖 Full workflow details: [SALESFORCE_E2E_WORKFLOW.md](./SALESFORCE_E2E_WORKFLOW.md)
- 📋 Test data: [quote-validation-testcases.csv](../src/shared/data/quote-validation-testcases.csv)
- 🤖 Ask Copilot: "Help me with [specific step from the workflow]"

**Document Created:** 2026-07-28  
**JIRA Story:** DZ-1  
**Test Scenarios:** 15 (10 positive, 5 negative)  
