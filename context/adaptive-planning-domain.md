# Domain Context — Workday Adaptive Planning (FP&A)

## Business Domain Overview

Workday Adaptive Planning is an enterprise **Financial Planning & Analysis (FP&A)** platform
used by finance teams for budgeting, forecasting, reporting, and financial modelling.

The primary modules in scope for QE include:

- **Planning Sheets** — Budget entry, forecast updates, workforce planning grids
- **Reporting** — Financial reports, dashboards, variance analysis (Budget vs Actual)
- **Modeling** — Custom models, what-if scenarios, formula-driven calculations
- **Process Management** — Workflow approvals, version control, plan submissions
- **Data Integration** — Import/export, ERP connections, API data feeds
- **Administration** — User management, dimension setup, security roles

---

## Core Business Rules

### Planning & Budgeting Rules
1. Budget data is entered into **planning sheets** organised by dimensions (Account, Department, Time Period).
2. Planning sheets support both **manual entry** and **formula-driven cells** — formula cells are read-only.
3. Versions track different planning scenarios (e.g., "Budget 2026", "Forecast Q2", "What-If Scenario A").
4. A plan version can be in states: **Working → Submitted → Approved → Locked**.
5. Locked versions are read-only — no edits allowed without unlocking by an administrator.
6. Data entry supports multiple currencies with configurable exchange rates.

### Reporting Rules
1. Reports pull data from planning sheets and actual data sources.
2. Variance analysis: `Budget - Actual` — positive = favourable, negative = unfavourable.
3. Reports can be filtered by any dimension (Account, Department, Time, Custom dimensions).
4. Report outputs include tables, charts, and exportable formats (Excel, PDF, CSV).

### Modeling Rules
1. Models use custom formulas and assumptions to project financial outcomes.
2. What-if scenarios allow changing assumptions and seeing downstream impact.
3. Models can reference data across multiple sheets and versions.
4. Formula syntax uses Adaptive Planning's proprietary formula language.

### Process / Workflow Rules
1. Plan submission follows a configurable approval workflow.
2. Approvers can approve, reject, or send back submissions with comments.
3. Status flow: `Draft → Submitted → In Review → Approved / Rejected`.
4. Notifications are sent at each state transition.

### Integration Rules
1. Actuals data is imported from ERP/GL systems (e.g., Workday Financials, SAP, Oracle).
2. Imports can be scheduled or triggered manually.
3. Import validation checks for dimension mismatches and data type errors.
4. API integrations use REST endpoints for programmatic data access.

---

## Acceptance Criteria Patterns

Adaptive Planning QE stories typically use this AC format:

```
GIVEN [I am logged in as a Planner / Finance Manager / Admin]
WHEN [I perform action X on sheet/report/model Y]
THEN [the system shows result Z / data updates to V / status changes to S]
```

---

## Key Dimensions (Typical Configuration)

| Dimension | Examples | Purpose |
|---|---|---|
| **Account** | Revenue, COGS, SG&A, EBITDA | Chart of accounts hierarchy |
| **Department** | Sales, Marketing, Engineering, Finance | Organisational structure |
| **Time** | Jan-2026, Q1-2026, FY2026 | Temporal periods |
| **Version** | Budget 2026, Forecast Q2, Actuals | Planning scenarios |
| **Currency** | USD, EUR, GBP | Multi-currency support |
| **Custom** | Product, Region, Project | Client-specific dimensions |

---

## Validation Error Messages (Common Patterns)

| Scenario | Expected Behaviour |
|---|---|
| Invalid data type in cell | Cell highlights red; tooltip shows type mismatch error |
| Edit locked version | Warning: "This version is locked and cannot be edited" |
| Missing required dimension | "Required dimension value is missing" |
| Circular formula reference | "Circular reference detected in formula" |
| Import dimension mismatch | "Dimension value not found: [value]" |
| Session expired | Redirect to login page with session timeout message |
| Insufficient permissions | "You do not have permission to perform this action" |
