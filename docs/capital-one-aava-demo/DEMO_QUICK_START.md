# Capital One AAVA Demo — Quick Start Guide

## Prerequisites

1. Node packages installed: `npm install`
2. Playwright browsers installed: `npm run install:browsers`
3. `.env` file at project root with Workday credentials:

```env
# Workday Sandbox
WORKDAY_BASE_URL=https://impl.workday.com/capitaloneimpl1
WORKDAY_USERNAME=finance.analyst@capitalone.com
WORKDAY_PASSWORD=<password>
WORKDAY_TENANT=capitaloneimpl1

# Downstream systems (UC4 only — can be skipped if not available)
RECON_API_BASE_URL=https://recon.capitalone-demo.internal
REG_REPORT_URL=https://reporting.capitalone-demo.internal
AUDIT_API_BASE_URL=https://audit.capitalone-demo.internal

# AI Engine (already configured — self-healing uses this)
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=<key>
```

---

## Demo Run Order

### UC1 — Show AI generating test cases from business requirements

Show the `workday-test-cases.json` file (pre-populated):
```bash
cat src/integrations/workday-test-cases.json
```

Push cases to TestRail:
```bash
JIRA_REF=CAP-101 node src/integrations/push-to-testrail.js
```

Open TestRail and show the cases that were just created → **live traceability from requirements to test cases in < 60 seconds**.

---

### UC2 — Run the Workday Finance Regression Suite (headed for demo)

```bash
npx playwright test src/tests/application/workday-finance-regression.spec.js \
  --config=config/playwright.config.js --headed --project=chromium
```

After the run:
```bash
npx playwright show-report
```

---

### UC3 — Self-Healing Demo (3 steps)

**Step 1 — Show the broken selector test failing:**
```bash
npx playwright test src/tests/application/workday-self-healing-demo.spec.js \
  --config=config/playwright.config.js --headed \
  --grep "UC3-B" --project=chromium
```

**Step 2 — Run AI healer:**
```bash
node src/helpers/self-healing.js --queue test-results/healing-queue.json
```
Show the terminal output — AI suggests the replacement selector.
Show `test-results/healing-history.json` — healing recorded.

**Step 3 — Re-run with healed selector:**
```bash
npx playwright test src/tests/application/workday-self-healing-demo.spec.js \
  --config=config/playwright.config.js --headed \
  --grep "UC3-C|UC3-D" --project=chromium
```
All tests pass ✓

---

### UC4 — End-to-End Journey (with downstream systems)

```bash
npx playwright test src/tests/application/workday-e2e-journey.spec.js \
  --config=config/playwright.config.js --headed --project=chromium
```

*Steps 3–5 are skipped if downstream env vars are not set — they are labelled clearly in the report.*

---

### Full Regression Suite (all use cases)

```bash
npx playwright test \
  src/tests/application/workday-finance-regression.spec.js \
  src/tests/application/workday-e2e-journey.spec.js \
  --config=config/playwright.config.js --project=chromium
```

---

## Demo Talking Points Per Slide

| Slide | Action | Talking point |
|---|---|---|
| UC1 | Run push-to-testrail.js | "We read your business story and generated 14 test cases — with traceability to TestRail — in under 60 seconds. No manual test design." |
| UC2 | Run regression spec headed | "These are the same test cases, now automated. They run in 45 minutes. Your team used to do this over 3–5 days manually." |
| UC3 | Break selector → heal → re-run | "Workday just shipped a release. One selector broke. AAVA detected it, sent the broken HTML to AI, got a replacement selector back, patched itself, and the test is green again. Zero engineer time." |
| UC4 | Run E2E spec | "This single test proves that a Journal Entry created in Workday flows correctly all the way to your regulatory report. If any system in the chain breaks the data, you know immediately and you know exactly where." |

---

## File Map

```
docs/capital-one-aava-demo/
  PRESENTATION.md            ← Slide deck (14 slides)
  DEMO_QUICK_START.md        ← This file

context/
  workday-application.md     ← Workday app context for AAVA
  workday-domain.md          ← Capital One Finance domain rules

src/data/
  workday-test-data.js       ← Single source of truth for all values

src/pages/locators/
  workday-finance.locators.js ← All Workday Finance selectors

src/pages/
  workday-finance.page.js    ← Page object: Journal Entry, Invoice, Budget, Payroll

src/tests/application/
  workday-finance-regression.spec.js    ← UC1/UC2: 14 functional regression tests
  workday-self-healing-demo.spec.js     ← UC3: Self-healing (broken → healed → passing)
  workday-e2e-journey.spec.js           ← UC4: Cross-system E2E journey
```

---

## TestRail Case Reference

| Case ID | Spec Title | Story |
|---|---|---|
| C201 | Journal Entry form loads with Draft status | CAP-101 |
| C202 | Rejects out-of-balance journal entry | CAP-101 |
| C203 | Successfully post a balanced journal entry | CAP-101 |
| C204 | Posted entry appears in GL Balance Report | CAP-101 |
| C205 | Invalid GL code shows correct error | CAP-101 |
| C206 | Closed period date is rejected | CAP-101 |
| C207 | Supplier Invoice form loads | CAP-102 |
| C208 | Submit a supplier invoice | CAP-102 |
| C209 | Duplicate invoice number warning | CAP-102 |
| C210 | Budget vs Actual report page loads | CAP-103 |
| C211 | Report grid renders with data | CAP-103 |
| C212 | Variance column present in report | CAP-103 |
| C213 | Payroll Results page loads | CAP-104 |
| C214 | Payroll grid renders for current period | CAP-104 |
| C215 | Status selector works pre-release | Self-Healing UC3-A |
| C216 | Broken selector fails (expected) | Self-Healing UC3-B |
| C217 | Healed selector passes | Self-Healing UC3-C |
| C218 | Healing history validates the fix | Self-Healing UC3-D |
| C219–C224 | E2E: Journal Entry to Regulatory Report | CAP-201 |
| C225–C226 | E2E: Invoice to Payment | CAP-202 |
