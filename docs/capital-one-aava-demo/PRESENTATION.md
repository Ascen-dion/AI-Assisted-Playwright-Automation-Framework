# AAVA Demo — Capital One QE Modernization
## AI-Assisted Validation & Automation for Workday Finance

---

## SLIDE 1 — Title

**AAVA: AI-Assisted Validation & Automation**
*Solving Capital One's Workday QE Challenges*

Presented by Ascendion QE Practice
April 2026

---

## SLIDE 2 — The Problem We Heard

> *"Functional testing within Workday is manual. Business users manually check outputs. No regression suite exists. Workday is a black box."*

| Challenge | Today | With AAVA |
|---|---|---|
| Functional test creation | Manual, undocumented | AI-generated from ACs in minutes |
| Regression coverage | None | Full suite, version-stamped |
| Selector stability | N/A (manual) | AI self-heals on Workday releases |
| Cross-system validation | Ad-hoc, error-prone | Automated E2E journey tests |
| Time to test a release | Days–weeks | Hours (automated regression run) |

---

## SLIDE 3 — What is AAVA?

**A three-layer AI-assisted test automation platform built on Playwright.**

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1 — AI Test Case Generator                               │
│  Reads business requirements → generates TestRail-linked cases  │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2 — Playwright Automation Engine                         │
│  POM-structured specs · zero hardcoded selectors · CI-ready     │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3 — Self-Healing Runtime                                 │
│  Detects broken selectors → AI regenerates → commits fix        │
└─────────────────────────────────────────────────────────────────┘
```

**Supported AI providers**: OpenRouter (free models), Anthropic Claude, Groq, GitHub Copilot, Local LLM (offline/air-gapped)

---

## SLIDE 4 — Demo Agenda (4 Use Cases)

| # | Use Case | What you will see |
|---|---|---|
| UC1 | Functional Test Case Generation | AI reads a Finance business story → produces a full regression suite in < 60 seconds |
| UC2 | Playwright Test Automation | The generated suite runs against Workday — Journal Entry, Supplier Invoice, Budget Check, Payroll |
| UC3 | Self-Healing | We break a Workday UI selector (simulating a bi-annual release). AAVA detects, heals, and re-runs — zero human intervention |
| UC4 | End-to-End Journey Testing | Journal Entry created in Workday → validated in downstream GL reconciliation → confirmed in regulatory reporting system |

---

## SLIDE 5 — Architecture for Capital One Workday

```
Capital One Environment
┌─────────────────────────────────────────────────────────┐
│  Workday Finance Tenant (capitalone.wd12.myworkdayjobs.com)│
│  ├── Journal Entry          ← UC2, UC4                   │
│  ├── Supplier Invoice       ← UC2                        │
│  ├── Budget vs Actual       ← UC2                        │
│  └── Payroll Output         ← UC2                        │
└────────────────────┬────────────────────────────────────┘
                     │ downstream data products
┌────────────────────▼────────────────────────────────────┐
│  GL Reconciliation System / Regulatory Reporting         │
│  └── API + UI validation                ← UC4            │
└─────────────────────────────────────────────────────────┘
              ↕ AAVA Framework
┌─────────────────────────────────────────────────────────┐
│  TestRail ← test case traceability + run reporting       │
│  GitHub Actions / Azure DevOps CI pipeline               │
│  HTML Report + structured logs (Winston)                 │
└─────────────────────────────────────────────────────────┘
```

---

## SLIDE 6 — UC1: AI Test Case Generation

**Input**: Plain English business requirement (or Jira story)

```
"As a Capital One Finance Analyst, I need to create a Journal Entry
 in Workday with valid GL codes, cost centre, and period so that
 the transaction posts correctly and appears in the GL balance report."
```

**AAVA output** (generated in < 60 seconds):

| Case ID | Title | Steps | Expected Result |
|---|---|---|---|
| C201 | Navigate to Create Journal Entry | 1. Login 2. Go to Accounting → Journal Entries 3. Click Create | Journal Entry form loads with Status = Draft |
| C202 | Validate required field enforcement | Enter debit line, leave credit blank, click Post | Validation error: "Journal Entry does not balance" |
| C203 | Post a balanced journal entry | Enter balanced debit/credit, valid GL, click Post | Status changes to Posted; GL balance updated |
| C204 | Verify journal appears in GL Report | Run GL Balance report for same period | Entry is visible with correct amount and GL code |

Cases are **pushed to TestRail automatically** and IDs are **embedded in every Playwright test title**.

---

## SLIDE 7 — UC2: Playwright Automation

**Test structure** (Page Object Model):

```
src/
├── pages/
│   ├── locators/
│   │   └── workday-finance.locators.js   ← zero hardcoded strings in specs
│   ├── workday-finance.page.js           ← Journal Entry, Invoice, Budget actions
│   └── workday-reports.page.js           ← GL Report, Payroll Report actions
├── tests/
│   └── application/
│       └── workday-finance-regression.spec.js  ← full regression suite
└── data/
    └── workday-test-data.js              ← single source of truth for all values
```

**Run command**:
```bash
npx playwright test src/tests/application/workday-finance-regression.spec.js \
  --config=config/playwright.config.js --reporter=html
```

---

## SLIDE 8 — UC3: Self-Healing in Action

**Scenario**: Workday's bi-annual release (March / September) renames a DOM attribute.

```
Before release:  [data-automation-id="journalEntryStatus"]
After release:   [data-automation-id="jelStatus"]       ← selector breaks
```

**What happens without AAVA**: Test fails. Engineer spends hours locating the new selector across 40+ spec files.

**What happens with AAVA**:

```
1. Test runs → selector lookup fails
2. Fixture catches the error → writes to healing-queue.json
3. AI Engine reads page HTML + failed selector
4. AI suggests ranked alternative selectors
5. Framework tries each; finds working selector
6. Healing recorded → selector auto-patched in locator file
7. Test re-runs and passes ✓
8. Healing history prevents same failure on next run
```

**Time saved**: ~4 hours of manual triage → **< 2 minutes automated recovery**

---

## SLIDE 9 — UC4: End-to-End Journey Testing

**Journey**: Finance Period Close — data flows from source → Workday → reporting

```
Step 1: [Workday]          Create Journal Entry (GL: 5001-Finance-Q2)
Step 2: [Workday]          Post journal; verify Status = Posted
Step 3: [Workday]          Run GL Balance Report; verify entry appears
Step 4: [Reconciliation]   Downstream system API: confirm transaction received
Step 5: [Reg Reporting]    Validate regulatory report includes the transaction
Step 6: [Workday]          Verify Audit Trail shows all steps with timestamps
```

Each step is an independent Playwright assertion — failure is pinpointed to the exact system where data integrity broke.

---

## SLIDE 10 — Bi-Annual Release Safety Net

Capital One's **primary risk**: Workday releases twice a year. Tests break. Nobody knows what changed.

**AAVA regression cadence**:

```
Workday Release Available (staging/sandbox)
    ↓
npm run test:workday-regression   (30–60 min full run)
    ↓
HTML Report + TestRail run created
    ↓
Failed tests → healing-queue.json
    ↓
node src/helpers/self-healing.js --queue   (AI batch repair, ~5 min)
    ↓
Re-run: all previously-failing tests → green
    ↓
Regression delta report: "14 selectors healed, 2 new failures need human review"
```

---

## SLIDE 11 — Workday as a Black Box — Solved

**Challenge**: Business processes inside Workday are opaque. You cannot instrument them.

**AAVA approach**: Test **at the boundary** — inputs, outputs, and state transitions.

```
Input boundary:   Form submissions, API payloads sent to Workday
Output boundary:  Reports, status fields, confirmation messages
State boundary:   Draft → In Progress → Approved → Posted
```

No Workday internals access needed. AAVA validates what matters: **does the right output appear for the right input?**

---

## SLIDE 12 — ROI Summary

| Metric | Manual Today | With AAVA |
|---|---|---|
| Time to create regression suite | 2–3 weeks | < 1 day |
| Regression run duration | 3–5 days (manual) | 45 minutes (automated) |
| Selector fix after release | 4–8 hours per engineer | < 5 minutes (AI heals) |
| Test traceability to requirements | None | Full: Jira → TestRail → Playwright → CI |
| Cross-system E2E coverage | 0% | 100% of defined journeys |

---

## SLIDE 13 — What We Need from Capital One to Go Live

| Item | Owner | Notes |
|---|---|---|
| Workday sandbox/impl tenant URL | Capital One | `WORKDAY_BASE_URL` in `.env` |
| Service account credentials | Capital One | Read-only Finance user sufficient for most tests |
| 2–3 business stories to start | Capital One QE | We generate test cases from these on Day 1 |
| TestRail project access | Capital One / Ascendion | Existing or new project |
| CI pipeline (GitHub Actions / ADO) | Capital One | AAVA ships with ready-to-use pipeline YAML |

**Proposed timeline**:
- Week 1: Environment setup + first regression suite (20 test cases)
- Week 2–3: Full Finance module coverage (Journal Entry, Supplier Invoice, Budget, Payroll)
- Week 4: E2E journey tests + CI integration

---

## SLIDE 14 — Live Demo Flow

1. **[Terminal]** Show the `workday-test-data.js` — single source of truth for all values
2. **[AI Generation]** Run `node src/integrations/push-to-testrail.js` — watch test cases appear in TestRail live
3. **[Playwright Run]** `npx playwright test workday-finance-regression.spec.js --headed`
4. **[Self-Healing]** Introduce a broken selector, run tests, show healing in action
5. **[E2E Run]** `npx playwright test workday-e2e-journey.spec.js --headed`
6. **[Report]** `npx playwright show-report` — HTML report with TestRail links

---

*AAVA — built by Ascendion QE Practice. Powered by Playwright + Claude.*
