# Samsung Galaxy A57 5G Purchase Journey - Test Suite Documentation

## 📋 Overview

This document describes the automated test suite for the Samsung Galaxy A57 5G purchase journey on the StarHub website. The test suite validates the complete user flow from browsing mobile devices to initiating the checkout process.

**Target URL:** https://www.starhub.com/personal.html  
**Test File:** `src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js`

---

## 🎯 Acceptance Criteria Coverage

### AC1: Navigate to Mobile Devices Listing
- **TestRail Case ID:** C309
- **Description:** User navigates from homepage → Mobile dropdown → All Phones
- **Validates:**
  - Mobile dropdown opens successfully
  - "All Phones" link is clickable
  - Device listing page loads with correct URL
  - Device listing heading is visible
  - At least one device is shown in the listing

### AC2: Select Mobile Device
- **TestRail Case ID:** C310
- **Description:** User selects Samsung Galaxy A57 5G from the device listing
- **Validates:**
  - Galaxy A57 5G device card is clickable
  - Product detail page (PDP) loads with correct URL
  - Device breadcrumb/title is visible on PDP

### AC3: Verify Default Device Configuration
- **TestRail Case ID:** C311
- **Description:** Validates default selections on the device PDP
- **Validates:**
  - **Colour:** Default colour is displayed (Note: Live app shows "Awesome Navy", not "Black" as per AC)
  - **Storage:** Default storage is 256GB and visible
  - **Payment:** Default payment option is 24-month installment
  - All selections are clearly visible to the user

> ⚠️ **Important Note:** The acceptance criteria specify "Black" as default colour, but the live application (as of April 2026) shows "Awesome Navy" as the default. Tests currently assert against the actual application behavior. Please consult with Product Owner if "Black" should be the intended default.

### AC4: Proceed to Next Step
- **TestRail Case ID:** C312
- **Description:** User clicks the "Next" button to proceed with purchase
- **Validates:**
  - Next button is visible and clickable
  - Clicking Next initiates the next step (confirmed by auth popup appearance)
  - No full-page redirect occurs (stays on same URL)

### AC5: Display Login / Sign-Up Popup
- **TestRail Case ID:** C313
- **Description:** Authentication gate popup is displayed for unauthenticated users
- **Validates:**
  - Popup/overlay modal becomes visible
  - Popup message contains: "Please log in or create an account to continue with your purchase"
  - "Log in with Hub ID" button is visible
  - "Don't have an account? Sign up here" button is visible

### E2E: Complete Purchase Journey
- **TestRail Case ID:** C314
- **Description:** End-to-end validation of all 5 acceptance criteria in sequence
- **Validates:** Complete flow from homepage to authentication gate in a single test run

---

## 🔗 Integration Status

### ✅ TestRail Integration
**Status:** ✅ **SYNCED**

All test cases have been successfully pushed to TestRail:
- **Project ID:** 3
- **Suite ID:** 9  
- **Section ID:** 46
- **Case IDs:** C309 - C314

**Verification:**
- View test cases at: https://aavastage.testrail.io/
- Navigate to: Project 3 → Suite 9 → Section 46
- All 6 test cases should be visible with proper preconditions, steps, and expected results

**Case Mapping:**
```
C309 → AC1: Navigate to Mobile Devices Listing
C310 → AC2: Select Samsung Galaxy A57 5G
C311 → AC3: Verify Default Device Configuration
C312 → AC4: Proceed to Next Step
C313 → AC5: Display Login / Sign-Up Popup
C314 → E2E: Complete Purchase Journey
```

### ⏳ JIRA Integration
**Status:** ⏳ **PENDING TICKET CREATION**

**Action Required:**
1. Create a JIRA ticket in the STAR project (or appropriate project) with the acceptance criteria
2. Update the test spec file with the JIRA ticket key
3. Re-push test cases to TestRail with JIRA reference
4. Run tests and update JIRA with results

**JIRA Configuration:**
- **Host:** https://ascendionconfluence.atlassian.net
- **Project Key:** STAR
- **Default Reference:** STAR-TBD (update after ticket creation)

---

## 🚀 Running the Tests

### Prerequisites
1. Node.js installed (v14+ recommended)
2. Playwright installed: `npm install`
3. Environment variables configured (see `.env` file)
4. TestRail credentials set in `.env`
5. JIRA credentials set in `.env`

### Run All Galaxy A57 Purchase Tests
```powershell
# Run all tests in the suite
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js

# Run with UI mode (interactive)
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js --ui

# Run specific test by TestRail case ID
npx playwright test -g "C309"

# Run only E2E test
npx playwright test -g "C314"
```

### Run with Different Browsers
```powershell
# Chrome/Chromium (default)
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js

# Firefox
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js --project=firefox

# WebKit (Safari)
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js --project=webkit

# All browsers
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js --project=chromium --project=firefox --project=webkit
```

### Generate Test Report
```powershell
# Run tests and generate HTML report
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js --reporter=html

# Open the report
npx playwright show-report
```

---

## 🔄 Sync Process: TestRail ↔ JIRA ↔ Test Scripts

### Initial Setup (One-time)

#### Step 1: Create JIRA Ticket
1. Go to JIRA: https://ascendionconfluence.atlassian.net
2. Create a new Story/Task in the STAR project
3. Add the 5 acceptance criteria in the description:
   - AC1: Navigate to Mobile Devices Listing
   - AC2: Select Mobile Device
   - AC3: Verify Default Device Configuration
   - AC4: Proceed to Next Step
   - AC5: Display Login / Sign-Up Popup
4. Note the JIRA ticket key (e.g., STAR-123)

#### Step 2: Update Test Cases with JIRA Reference
Update `src/integrations/testrail-test-cases.json`:
```json
{
  "specTitle": "AC1: Navigate to Mobile Devices Listing via Mobile dropdown",
  "title": "Galaxy A57 5G Purchase - AC1: Navigate to Mobile Devices Listing",
  "preconditions": "...",
  "steps": "...",
  "expected": "...",
  "jiraRef": "STAR-123"  // ← Update this
}
```

Repeat for all 6 test cases (AC1-AC5 + E2E).

#### Step 3: Re-push to TestRail with JIRA Link
```powershell
# Set JIRA reference and re-push
$env:JIRA_REF="STAR-123"
node src/integrations/push-to-testrail.js
```

This will update all TestRail test cases with the JIRA ticket reference.

#### Step 4: Update Test Spec File
Update the JIRA reference in the test file header:
```javascript
/**
 * JIRA Ticket: STAR-123  // ← Update this line
 * TestRail Section: Mobile Purchase Journey
 */
```

---

### Continuous Integration Flow

#### Automated Test Execution → TestRail → JIRA

```
┌─────────────┐       ┌──────────────┐       ┌──────────┐
│   Run Test  │  ───→ │   TestRail   │  ───→ │   JIRA   │
│   (CI/CD)   │       │   (Results)  │       │ (Update) │
└─────────────┘       └──────────────┘       └──────────┘
```

**1. Execute Tests:**
```powershell
npx playwright test src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js --reporter=json
```

**2. Push Results to TestRail:**
The TestRail reporter (configured in `playwright.config.js`) automatically:
- Creates a new test run in TestRail
- Updates test case results (Passed/Failed)
- Adds execution time and failure details

**3. Update JIRA with Test Status:**
```powershell
# After test execution, update JIRA
node src/integrations/update-jira-results.js STAR-123 src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js
```

This script:
- Posts a comment on the JIRA ticket with test results
- Updates the ticket status (optional)
- Links test execution evidence

---

## 📊 TestRail Reporter Configuration

To enable automatic TestRail reporting, ensure your `playwright.config.js` includes:

```javascript
reporter: [
  ['list'],
  ['html'],
  ['./src/integrations/testrail-reporter.js', {
    projectId: 3,
    suiteId: 9,
    runName: 'Galaxy A57 5G Purchase - Automated Run'
  }]
]
```

The reporter will:
- Extract TestRail case IDs from test titles (e.g., `[C309]`)
- Create a new test run in TestRail
- Update results for each test case
- Close the run after execution

---

## 🔍 Manual Verification Steps

### TestRail Verification
1. Log in to TestRail: https://aavastage.testrail.io/
2. Navigate to: Project 3 → Suite 9 → Section 46
3. Verify all 6 test cases (C309-C314) are present
4. Check each test case has:
   - Correct title matching acceptance criteria
   - Preconditions filled
   - Steps documented
   - Expected results documented
   - JIRA reference in "refs" field

### JIRA Verification
1. Log in to JIRA: https://ascendionconfluence.atlassian.net
2. Open the JIRA ticket (e.g., STAR-123)
3. Verify:
   - Acceptance criteria are documented
   - TestRail test cases are linked (in "refs" or comments)
   - Test execution comments are posted after test runs
   - Status is updated appropriately

### Test Execution Verification
1. Run the tests locally or in CI/CD
2. Check Playwright HTML report for results
3. Verify TestRail test run is created with correct results
4. Verify JIRA ticket is updated with test execution summary

---

## 🛠️ Troubleshooting

### Issue: TestRail API Authentication Fails
**Solution:** Verify environment variables in `.env`:
```
TESTRAIL_HOST=https://aavastage.testrail.io/
TESTRAIL_USER=your-email@ascendion.com
TESTRAIL_API_KEY=your-api-key
```

### Issue: JIRA API Authentication Fails
**Solution:** Verify JIRA credentials in `.env`:
```
JIRA_HOST=https://ascendionconfluence.atlassian.net
JIRA_EMAIL=your-email@ascendion.com
JIRA_API_TOKEN=your-api-token
```

### Issue: Test Case IDs Don't Match in TestRail
**Solution:** Re-run the push script:
```powershell
node src/integrations/push-to-testrail.js
```
Then update test spec file with new case IDs from the output.

### Issue: Tests Fail Due to Application Changes
**Solution:**
1. Update test data in `src/data/test-data.js`
2. Update locators in `src/pages/locators/starhub-mobile-purchase.locators.js`
3. Update page object methods in `src/pages/starhub-mobile-purchase.page.js`
4. Re-run tests to verify fixes

### Issue: Colour Default Mismatch (Black vs Awesome Navy)
**Status:** Known issue - see AC3 notes above  
**Solution:** Consult with Product Owner to confirm intended default colour. Update test data accordingly.

---

## 📝 Test Data Reference

All test data is centralized in `src/data/test-data.js`:

```javascript
galaxyA57: {
  defaultColour: 'Awesome Navy',      // Update if PO confirms "Black"
  defaultStorage: '256GB',
  defaultPaymentPeriod: '24-month',
  colourLabelPrefix: 'Colour:',
  storageLabelPrefix: 'Storage:',
}
```

---

## 🎯 Success Criteria

The test suite is considered successfully synced when:

✅ All 6 test cases (C309-C314) exist in TestRail  
✅ JIRA ticket is created with acceptance criteria  
✅ TestRail test cases reference the JIRA ticket  
✅ Test spec file includes correct TestRail case IDs  
✅ Tests execute successfully and pass all assertions  
✅ TestRail test run is created automatically after execution  
✅ JIRA ticket is updated with test results  

---

## 📞 Support

For issues or questions:
- **TestRail Admin:** navneet.bhargavan@ascendion.com
- **JIRA Admin:** viplove.bisen@ascendion.com
- **Test Automation Lead:** (Update with your contact)

---

## 📚 Related Documentation

- [TestRail Integration Guide](../src/integrations/testrail-integration.js)
- [JIRA Integration Guide](../src/integrations/jira-integration.js)
- [Page Object Model](../src/pages/starhub-mobile-purchase.page.js)
- [Test Data](../src/data/test-data.js)
- [Playwright Configuration](../config/playwright.config.js)

---

**Last Updated:** 2026-07-06  
**Version:** 1.0  
**Status:** TestRail ✅ SYNCED | JIRA ⏳ PENDING
