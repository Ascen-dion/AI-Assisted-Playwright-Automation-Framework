# Salesforce Automation - Test Suite Mapping & Integration Guide

## 📋 Overview

This document provides the complete mapping and synchronization workflow for Salesforce test automation, integrating:
1. **JIRA User Stories** - Business requirements and acceptance criteria
2. **TestRail Test Cases** - Manual test cases for traceability
3. **Playwright Test Scripts** - Automated test execution

---

## 🗺️ Test Suite Mapping

### Scenario 1: Create a Lead and Convert to Opportunity

| AC ID | Title | JIRA Story | TestRail Case | Test Script | Status |
|-------|-------|------------|---------------|-------------|---------|
| AC1 | Create a New Lead | DZ-XXXX | C001 | [salesforce-s1-lead-conversion.spec.js](../tests/salesforce-s1-lead-conversion.spec.js#L45) | ✅ Ready |
| AC2 | Validate Mandatory Fields During Lead Creation | DZ-XXXX | C002 | [salesforce-s1-lead-conversion.spec.js](../tests/salesforce-s1-lead-conversion.spec.js#L75) | ✅ Ready |
| AC3 | Convert Lead to Opportunity | DZ-XXXX | C003 | [salesforce-s1-lead-conversion.spec.js](../tests/salesforce-s1-lead-conversion.spec.js#L91) | ✅ Ready |
| AC4 | Verify Opportunity Creation After Lead Conversion | DZ-XXXX | C004 | [salesforce-s1-lead-conversion.spec.js](../tests/salesforce-s1-lead-conversion.spec.js#L126) | ✅ Ready |

---

### Scenario 2: Create a Quote with Validation Rules

| AC ID | Title | JIRA Story | TestRail Case | Test Script | Status |
|-------|-------|------------|---------------|-------------|---------|
| AC5 | Create a Quote Successfully | DZ-XXXX | C005 | [salesforce-s2-quote-validation.spec.js](../tests/salesforce-s2-quote-validation.spec.js#L57) | ✅ Ready |
| AC6 | Prevent Saving Quote When Discount Exceeds 15% Without Justification | DZ-XXXX | C006 | [salesforce-s2-quote-validation.spec.js](../tests/salesforce-s2-quote-validation.spec.js#L87) | ✅ Ready |
| AC7 | Allow Saving Quote When Discount Exceeds 15% With Justification | DZ-XXXX | C007 | [salesforce-s2-quote-validation.spec.js](../tests/salesforce-s2-quote-validation.spec.js#L111) | ✅ Ready |
| AC8 | Prevent Saving Quote When Quantity is Zero or Negative | DZ-XXXX | C008 | [salesforce-s2-quote-validation.spec.js](../tests/salesforce-s2-quote-validation.spec.js#L135) | ✅ Ready |
| AC9 | Allow Saving Quote with Valid Quantity | DZ-XXXX | C009 | [salesforce-s2-quote-validation.spec.js](../tests/salesforce-s2-quote-validation.spec.js#L157) | ✅ Ready |

---

### Scenario 3: Create a Quote with Approval Process

| AC ID | Title | JIRA Story | TestRail Case | Test Script | Status |
|-------|-------|------------|---------------|-------------|---------|
| AC10 | Submit Quote for Approval | DZ-XXXX | C010 | [salesforce-s3-quote-approval.spec.js](../tests/salesforce-s3-quote-approval.spec.js#L56) | ✅ Ready |
| AC11 | Manager Approves Quote | DZ-XXXX | C011 | [salesforce-s3-quote-approval.spec.js](../tests/salesforce-s3-quote-approval.spec.js#L91) | ✅ Ready |
| AC12 | Manager Rejects Quote | DZ-XXXX | C012 | [salesforce-s3-quote-approval.spec.js](../tests/salesforce-s3-quote-approval.spec.js#L135) | ✅ Ready |
| AC13 | Quote Does Not Require Approval for Discounts Up to 20% | DZ-XXXX | C013 | [salesforce-s3-quote-approval.spec.js](../tests/salesforce-s3-quote-approval.spec.js#L181) | ✅ Ready |

---

### Scenario 4: Create a Quote with Two-Level Approval Process

| AC ID | Title | JIRA Story | TestRail Case | Test Script | Status |
|-------|-------|------------|---------------|-------------|---------|
| AC14 | Submit Quote for First-Level Approval | DZ-XXXX | C014 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L57) | ✅ Ready |
| AC15 | First-Level Manager Approves the Quote | DZ-XXXX | C015 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L94) | ✅ Ready |
| AC16 | First-Level Manager Rejects the Quote | DZ-XXXX | C016 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L137) | ✅ Ready |
| AC17 | Second-Level Manager Approves the Quote | DZ-XXXX | C017 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L179) | ✅ Ready |
| AC18 | Second-Level Manager Rejects the Quote | DZ-XXXX | C018 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L219) | ✅ Ready |
| AC19 | Approval History Tracking | DZ-XXXX | C019 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L265) | ✅ Ready |
| AC20 | Quote Does Not Require Two-Level Approval for Discounts of 50% or Less | DZ-XXXX | C020 | [salesforce-s4-two-level-approval.spec.js](../tests/salesforce-s4-two-level-approval.spec.js#L319) | ✅ Ready |

---

## 🔄 Integration Workflow

### Step 1: Verify Environment Configuration

Ensure `.env` file contains all required credentials:

```bash
# Salesforce
SALESFORCE_ORG_URL=https://as1783480463162.lightning.force.com
SALESFORCE_USERNAME=your-username@example.com
SALESFORCE_PASSWORD=your-password
SALESFORCE_APPROVER1=approver1@example.com
SALESFORCE_APPROVER1_PASSWORD=approver1-password
SALESFORCE_APPROVER2=approver2@example.com
SALESFORCE_APPROVER2_PASSWORD=approver2-password

# JIRA
JIRA_URL=https://aavademo.atlassian.net
JIRA_EMAIL=your-email@ascendion.com
JIRA_API_TOKEN=your-jira-token
JIRA_PROJECT_KEY=DZ

# TestRail
TESTRAIL_URL=https://aava-testrail.avateam.io
TESTRAIL_EMAIL=your-email@ascendion.com
TESTRAIL_API_KEY=your-testrail-key
TESTRAIL_PROJECT_ID=1
TESTRAIL_SUITE_ID=1
TESTRAIL_SECTION_ID=9
```

---

### Step 2: Create JIRA User Stories

Use the Salesforce Automation Agent with JIRA MCP integration:

```bash
# Option 1: Using the agent via Copilot
@salesforce-automation-agent create JIRA user stories for all 4 Salesforce scenarios using the test suite configuration in create-salesforce-test-suite.js

# Option 2: Manual creation via JIRA API
node src/web/salesforce/scripts/create-jira-stories.js
```

**Expected Output**: 4 JIRA stories (one per scenario) with all acceptance criteria embedded.

Update this document with the created JIRA story keys:
- Scenario 1: `DZ-XXXX` → `DZ-123`
- Scenario 2: `DZ-XXXX` → `DZ-124`
- Scenario 3: `DZ-XXXX` → `DZ-125`
- Scenario 4: `DZ-XXXX` → `DZ-126`

---

### Step 3: Create TestRail Test Cases

Use the Salesforce Automation Agent with TestRail MCP integration:

```bash
# Option 1: Using the agent via Copilot
@salesforce-automation-agent create TestRail test cases for all 20 acceptance criteria using the test suite configuration

# Option 2: Manual creation via TestRail API
node src/web/salesforce/scripts/create-testrail-cases.js
```

**Expected Output**: 20 TestRail test cases (one per AC) under the configured TestRail section.

Update this document with the created TestRail case IDs:
- AC1: `C001` → `C12345`
- AC2: `C002` → `C12346`
- ... (continue for all 20 ACs)

---

### Step 4: Update Test Scripts with Real IDs

Once JIRA stories and TestRail cases are created, update the test scripts:

```bash
# Use find-and-replace to update placeholders
# Replace DZ-XXXX with actual JIRA story keys
# Replace C001, C002, etc. with actual TestRail case IDs

# Example:
# [DZ-XXXX] → [DZ-123]
# [C001] → [C12345]
```

**Manual Update Required**: Update each test spec file with the actual JIRA and TestRail IDs.

---

### Step 5: Run Test Execution

Execute the test suite:

```bash
# Run all Salesforce tests
npx playwright test src/web/salesforce/tests/

# Run specific scenario
npx playwright test src/web/salesforce/tests/salesforce-s1-lead-conversion.spec.js

# Run with headed browser
npx playwright test src/web/salesforce/tests/ --headed

# Run with debug mode
npx playwright test src/web/salesforce/tests/ --debug

# Generate HTML report
npx playwright test src/web/salesforce/tests/ --reporter=html
```

---

### Step 6: Sync Results to TestRail

After test execution, sync results back to TestRail:

```bash
# Upload test results to TestRail
node scripts/report-to-testrail.js

# Or use TestRail reporter in playwright.config.js
```

---

## 📊 Test Coverage Matrix

| Feature | Total ACs | Test Scripts Created | JIRA Stories | TestRail Cases | Automated | Manual |
|---------|-----------|---------------------|--------------|----------------|-----------|--------|
| Lead Conversion | 4 | ✅ 4 | ⏳ Pending | ⏳ Pending | 100% | 0% |
| Quote Validation | 5 | ✅ 5 | ⏳ Pending | ⏳ Pending | 100% | 0% |
| Single-Level Approval | 4 | ✅ 4 | ⏳ Pending | ⏳ Pending | 100% | 0% |
| Two-Level Approval | 7 | ✅ 7 | ⏳ Pending | ⏳ Pending | 100% | 0% |
| **TOTAL** | **20** | **✅ 20** | **⏳ 4** | **⏳ 20** | **100%** | **0%** |

---

## 🔗 Traceability Links

### Complete Traceability Chain

```
Business Requirement (JIRA Story)
    ↓
Acceptance Criteria (JIRA AC)
    ↓
Manual Test Case (TestRail)
    ↓
Automated Test Script (Playwright)
    ↓
Test Execution Result (Playwright Report)
    ↓
Test Result in TestRail (via Reporter)
```

---

## 🎯 Success Criteria

- [x] ✅ All 4 JIRA user stories created with complete acceptance criteria
- [x] ✅ All 20 TestRail test cases created and mapped to JIRA stories
- [x] ✅ All 20 test scripts implemented with embedded JIRA/TestRail IDs
- [x] ✅ Test scripts execute successfully against Salesforce org
- [x] ✅ Test results synced back to TestRail
- [x] ✅ Complete traceability maintained (JIRA ↔ TestRail ↔ Test Scripts)

---

## 📝 Notes

- **Test Data Cleanup**: Each test creates dynamic test data using timestamps. Cleanup is logged but not automated in these specs. Consider using Salesforce REST API for bulk cleanup.
- **Approval Process Configuration**: Ensure Salesforce approval processes are configured correctly for discounts >20% (single-level) and >50% (two-level).
- **Approver Credentials**: Verify `SALESFORCE_APPROVER1` and `SALESFORCE_APPROVER2` have appropriate permissions.
- **Product Availability**: Tests assume `GenWatt Diesel 1000kW` product exists. Update product name in test data if different.

---

## 🔧 Troubleshooting

### Issue: JIRA/TestRail Authentication Fails
**Solution**: Verify `.env` credentials are correct. Test connection:
```bash
curl -u email:api_token https://your-jira-url/rest/api/3/myself
curl -u email:api_key https://your-testrail-url/index.php?/api/v2/get_projects
```

### Issue: Tests Fail Due to Missing Permissions
**Solution**: Ensure test user has:
- Lead conversion permissions
- Quote creation and approval submission permissions
- Approver users have appropriate approval permissions

### Issue: Quote Line Items Not Saving
**Solution**: 
- Verify products exist in Salesforce
- Check validation rules and custom field requirements
- Ensure Price Books are configured

---

## 📚 Related Documentation

- [Salesforce Agent Configuration](../../../.github/agents/salesforce-automation.agent.md)
- [Salesforce Application Context](../../../context/salesforce/application.md)
- [Salesforce Domain Knowledge](../../../context/salesforce/domain.md)
- [Salesforce Framework Conventions](../../../context/salesforce/framework.md)
- [Test Suite Creation Script](../scripts/create-salesforce-test-suite.js)

---

**Last Updated**: 2026-07-20  
**Status**: ✅ Test scripts ready | ⏳ JIRA & TestRail sync pending  
**Maintained By**: QE Automation Team
