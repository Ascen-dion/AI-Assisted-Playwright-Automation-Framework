# Salesforce Automation - Quick Reference Guide

**Last Updated:** 2026-07-20  
**Status:** ✅ Production Ready

---

## 🚀 Quick Start

### Run Tests
```powershell
# All Salesforce tests
npx playwright test src/web/salesforce/tests

# Specific scenario
npx playwright test src/web/salesforce/tests/salesforce-s1-lead-conversion.spec.js

# With reporting
npx playwright test src/web/salesforce/tests --reporter=json
```

### Sync Results to TestRail & JIRA
```powershell
node src/web/salesforce/scripts/sync-test-results.js
```

---

## 📋 Test Scenarios

| Scenario | JIRA | Test Script | Test Cases |
|----------|------|-------------|------------|
| **S1: Lead Conversion** | [DZ-1](https://aavademo.atlassian.net/browse/DZ-1) | `salesforce-s1-lead-conversion.spec.js` | C001-C004 (4 tests) |
| **S2: Quote Validation** | [DZ-2](https://aavademo.atlassian.net/browse/DZ-2) | `salesforce-s2-quote-validation.spec.js` | C005-C009 (5 tests) |
| **S3: Single Approval** | [DZ-3](https://aavademo.atlassian.net/browse/DZ-3) | `salesforce-s3-quote-approval.spec.js` | C010-C013 (4 tests) |
| **S4: Two-Level Approval** | [DZ-4](https://aavademo.atlassian.net/browse/DZ-4) | `salesforce-s4-two-level-approval.spec.js` | C014-C020 (7 tests) |

**Total:** 4 scenarios, 20 acceptance criteria, 20 automated tests

---

## 🔗 Links

### JIRA Stories
- [DZ-1](https://aavademo.atlassian.net/browse/DZ-1) - Lead Creation and Conversion
- [DZ-2](https://aavademo.atlassian.net/browse/DZ-2) - Quote Validation Rules
- [DZ-3](https://aavademo.atlassian.net/browse/DZ-3) - Single-Level Approval
- [DZ-4](https://aavademo.atlassian.net/browse/DZ-4) - Two-Level Approval

### TestRail
- **Project:** Salesforce Automation (Project ID: 1)
- **Suite:** Suite 1
- **Section:** Section 9
- **Cases:** C001-C020 ([View](https://aava-testrail.avateam.io))

### Salesforce Org
- **URL:** https://as1783480463162.lightning.force.com
- **Environment:** Lightning Experience

---

## 🗂️ File Locations

### Test Scripts
```
src/web/salesforce/tests/
  ├── salesforce-login.spec.js              Login tests
  ├── salesforce-s1-lead-conversion.spec.js [DZ-1] AC1-AC4
  ├── salesforce-s2-quote-validation.spec.js [DZ-2] AC5-AC9
  ├── salesforce-s3-quote-approval.spec.js   [DZ-3] AC10-AC13
  └── salesforce-s4-two-level-approval.spec.js [DZ-4] AC14-AC20
```

### Page Objects
```
src/web/salesforce/pages/
  ├── salesforce-login.page.js          Login page
  ├── salesforce-home.page.js           Home navigation
  ├── salesforce-record-base.page.js    Base record operations
  ├── salesforce-lead.page.js           Lead creation & conversion
  ├── salesforce-opportunity.page.js    Opportunity management
  └── salesforce-quote.page.js          Quote creation & approval
```

### Locators
```
src/web/salesforce/locators/
  ├── salesforce-login.locators.js
  ├── salesforce-home.locators.js
  └── salesforce-record-base.locators.js
```

### Integration Scripts
```
src/web/salesforce/scripts/
  ├── create-jira-stories.js       Create JIRA user stories via REST API
  ├── create-testrail-cases.js     Create TestRail test cases via REST API
  ├── sync-test-results.js         Sync Playwright results to TestRail & JIRA
  └── create-salesforce-test-suite.js  Initial suite setup
```

### Documentation
```
src/web/salesforce/
  ├── INTEGRATION_GUIDE.md         Complete workflow documentation
  ├── INTEGRATION_COMPLETE.md      Project completion summary
  ├── QUICK_REFERENCE.md           This file
  ├── salesforce-test-mapping.json Master traceability matrix
  ├── jira-mapping.json            JIRA story mappings
  └── testrail-mapping.json        TestRail case mappings
```

### Context Files
```
context/ui&api/
  ├── application.md    Salesforce Lightning app specifics
  ├── domain.md         Business domain knowledge
  ├── framework.md      Testing framework patterns
  └── project-prompt.md AI agent instructions
```

### Agent Configuration
```
.github/agents/
  └── salesforce-automation.agent.md  Custom agent with JIRA/TestRail MCP
```

---

## ⚙️ Environment Variables

All credentials in `.env` file at project root:

```env
# Salesforce Configuration
SALESFORCE_ORG_URL=https://as1783480463162.lightning.force.com
SALESFORCE_USERNAME=your-username
SALESFORCE_PASSWORD=your-password
SALESFORCE_SECURITY_TOKEN=your-token
SALESFORCE_APPROVER1_USERNAME=approver1-username
SALESFORCE_APPROVER1_PASSWORD=approver1-password
SALESFORCE_APPROVER2_USERNAME=approver2-username
SALESFORCE_APPROVER2_PASSWORD=approver2-password

# JIRA Configuration
JIRA_URL=https://aavademo.atlassian.net
JIRA_EMAIL=kiruthika.ganesan@ascendion.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=DZ

# TestRail Configuration
TESTRAIL_URL=https://aava-testrail.avateam.io
TESTRAIL_EMAIL=your-email@domain.com
TESTRAIL_API_KEY=your-testrail-api-key
TESTRAIL_PROJECT_ID=1
TESTRAIL_SUITE_ID=1
TESTRAIL_SECTION_ID=9
```

---

## 📊 Test Case Mapping

### Scenario 1: Lead Conversion (DZ-1)

| Case | AC | Title | Status |
|------|----|-------|--------|
| [C001](https://aava-testrail.avateam.io/index.php?/cases/view/844) | AC1 | Create a New Lead | ✅ Ready |
| [C002](https://aava-testrail.avateam.io/index.php?/cases/view/845) | AC2 | Validate Mandatory Fields | ✅ Ready |
| [C003](https://aava-testrail.avateam.io/index.php?/cases/view/846) | AC3 | Convert Lead to Opportunity | ✅ Ready |
| [C004](https://aava-testrail.avateam.io/index.php?/cases/view/847) | AC4 | Verify Opportunity Creation | ✅ Ready |

### Scenario 2: Quote Validation (DZ-2)

| Case | AC | Title | Status |
|------|----|-------|--------|
| [C005](https://aava-testrail.avateam.io/index.php?/cases/view/848) | AC5 | Create Quote Successfully | ✅ Ready |
| [C006](https://aava-testrail.avateam.io/index.php?/cases/view/849) | AC6 | Prevent Save (>15% discount, no justification) | ✅ Ready |
| [C007](https://aava-testrail.avateam.io/index.php?/cases/view/850) | AC7 | Allow Save (>15% discount, with justification) | ✅ Ready |
| [C008](https://aava-testrail.avateam.io/index.php?/cases/view/851) | AC8 | Prevent Save (quantity ≤0) | ✅ Ready |
| [C009](https://aava-testrail.avateam.io/index.php?/cases/view/852) | AC9 | Allow Save (valid quantity) | ✅ Ready |

### Scenario 3: Single-Level Approval (DZ-3)

| Case | AC | Title | Status |
|------|----|-------|--------|
| [C010](https://aava-testrail.avateam.io/index.php?/cases/view/853) | AC10 | Submit Quote for Approval | ✅ Ready |
| [C011](https://aava-testrail.avateam.io/index.php?/cases/view/854) | AC11 | Manager Approves Quote | ✅ Ready |
| [C012](https://aava-testrail.avateam.io/index.php?/cases/view/855) | AC12 | Manager Rejects Quote | ✅ Ready |
| [C013](https://aava-testrail.avateam.io/index.php?/cases/view/856) | AC13 | No Approval Required (≤20% discount) | ✅ Ready |

### Scenario 4: Two-Level Approval (DZ-4)

| Case | AC | Title | Status |
|------|----|-------|--------|
| [C014](https://aava-testrail.avateam.io/index.php?/cases/view/857) | AC14 | Submit for First-Level Approval | ✅ Ready |
| [C015](https://aava-testrail.avateam.io/index.php?/cases/view/858) | AC15 | L1 Manager Approves | ✅ Ready |
| [C016](https://aava-testrail.avateam.io/index.php?/cases/view/859) | AC16 | L1 Manager Rejects | ✅ Ready |
| [C017](https://aava-testrail.avateam.io/index.php?/cases/view/860) | AC17 | L2 Manager Approves (Final) | ✅ Ready |
| [C018](https://aava-testrail.avateam.io/index.php?/cases/view/861) | AC18 | L2 Manager Rejects (Final) | ✅ Ready |
| [C019](https://aava-testrail.avateam.io/index.php?/cases/view/862) | AC19 | Approval History Tracking | ✅ Ready |
| [C020](https://aava-testrail.avateam.io/index.php?/cases/view/863) | AC20 | No Two-Level Approval (≤50% discount) | ✅ Ready |

---

## 🔄 Common Workflows

### 1. Run Tests and Sync Results

```powershell
# Run tests with JSON reporter
npx playwright test src/web/salesforce/tests --reporter=json

# Sync results to TestRail and JIRA
node src/web/salesforce/scripts/sync-test-results.js
```

### 2. Run Specific Scenario

```powershell
# Lead conversion tests only
npx playwright test src/web/salesforce/tests/salesforce-s1-lead-conversion.spec.js

# Quote validation tests only
npx playwright test src/web/salesforce/tests/salesforce-s2-quote-validation.spec.js
```

### 3. Debug Failing Test

```powershell
# Run in headed mode with slowMo
npx playwright test src/web/salesforce/tests --headed --slow-mo=500

# Run specific test with debug
npx playwright test src/web/salesforce/tests -g "AC1" --debug
```

### 4. View Test Reports

```powershell
# Open HTML report
npx playwright show-report

# View specific TestRail run
# Navigate to: https://aava-testrail.avateam.io
```

### 5. Regenerate JIRA Stories (if needed)

```powershell
node src/web/salesforce/scripts/create-jira-stories.js
```

### 6. Regenerate TestRail Cases (if needed)

```powershell
node src/web/salesforce/scripts/create-testrail-cases.js
```

---

## 🛠️ Troubleshooting

### Test Failures

**Shadow DOM not found:**
- Check if Lightning Web Component has finished rendering
- Increase wait times in page objects
- Use `page.waitForLoadState('networkidle')`

**Validation errors not appearing:**
- Ensure you're checking correct error locator
- Wait for validation message to appear
- Check if validation rules are active in Salesforce

**Approval workflow issues:**
- Verify approver credentials in .env
- Check that approval processes are active
- Ensure Quote discount thresholds are correct

### Sync Script Failures

**TestRail connection failed:**
- Check TESTRAIL_URL, TESTRAIL_EMAIL, TESTRAIL_API_KEY in .env
- Verify TestRail project/suite/section IDs
- Ensure API key has sufficient permissions

**JIRA connection failed:**
- Check JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN in .env
- Verify JIRA project key (DZ)
- Ensure API token has project access

---

## 📈 Metrics

| Metric | Value |
|--------|-------|
| Total Scenarios | 4 |
| Total Acceptance Criteria | 20 |
| Total Test Cases | 20 |
| JIRA Stories Created | 4 (DZ-1 to DZ-4) |
| TestRail Cases Created | 20 (C001-C020) |
| Automation Coverage | 100% |
| Page Objects | 6 |
| Locator Files | 3 |
| Integration Scripts | 4 |

---

## 🎯 Next Steps

1. **Execute Tests:** Run full test suite against Salesforce org
2. **Review Results:** Check TestRail run and JIRA comments
3. **CI/CD Integration:** Add workflow to `.github/workflows/`
4. **Expand Coverage:** Add more scenarios as needed
5. **Maintain:** Keep page objects updated with UI changes

---

## 📞 Support

**Documentation:**
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Detailed workflow
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Project summary

**Mappings:**
- `salesforce-test-mapping.json` - Master traceability
- `jira-mapping.json` - JIRA story details
- `testrail-mapping.json` - TestRail case details

**Agent:**
- Use `@salesforce-automation-agent` in GitHub Copilot for assistance

---

**Version:** 1.0.0  
**Framework:** Playwright + AI-Assisted Testing  
**Integration:** JIRA + TestRail + Playwright  
**Status:** ✅ Production Ready
