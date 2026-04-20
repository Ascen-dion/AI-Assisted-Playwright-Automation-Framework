# Domain Context — Workday Finance (Capital One)

## Business Domain Overview

Capital One is implementing **Workday Financials** across its Finance organisation. The primary
module in scope for QE is **Workday Accounting** which covers:

- General Ledger (Journal Entries, GL Balance Report)
- Accounts Payable (Supplier Invoices, Payment Runs)
- Budget Management (Budget vs Actual reporting)
- Payroll (Payroll outputs, period-end reconciliation)

There are approximately **100 upstream interfaces** feeding data into Workday and multiple
**downstream data products** consuming Workday outputs (regulatory reporting, reconciliation systems).

---

## Core Business Rules

### Journal Entry Rules
1. A Journal Entry **must balance** — total debits must equal total credits. Workday enforces this
   and will reject a Post request if the entry is out of balance.
2. Valid GL Account codes follow the pattern: **`XXXX-CostCentre-Period`**
   (e.g., `5001-Finance-Q2`). Invalid GL codes produce an "Account not found" validation error.
3. Accounting Date must be within the **open accounting period**. Posting to a closed period is
   blocked at the form level with error: "Period is closed for journal entries".
4. Journal Entries have a defined state machine:
   ```
   Draft → (submit) → In Progress → (approve) → Approved → (post) → Posted
                                                           ↘ (reverse) → Reversed
   ```
5. The Journal Source field identifies the originating system (e.g., "Manual", "Interface", "Payroll").
6. A Posted journal entry appears in the GL Balance Report within the same session (no batch delay
   in the sandbox environment).

### Supplier Invoice Rules
1. Invoice Number must be unique per supplier — duplicate invoice numbers trigger a warning.
2. Payment terms default to the supplier's configured terms (Net 30, Net 60, etc.).
3. Invoice approval routing follows the configured spend authority matrix.
4. Invoice status flow: `Draft → Matched → Approved → Paid`

### Budget Rules
1. Budget vs Actual variance is calculated as: `Budget - Actual`
   - Positive variance = under budget (favourable)
   - Negative variance = over budget (unfavourable)
2. Budget figures are loaded from Workday's Budget module — not calculated dynamically.
3. Reports filter by: Company, Fiscal Year, Cost Centre, Ledger Account range.

### Payroll Rules
1. Payroll results are read-only outputs — automation validates, never modifies.
2. Payroll outputs must reconcile with the source payroll calculation system.
3. Period-end payroll totals must match the corresponding Journal Entry batch.

---

## Acceptance Criteria Patterns

Capital One's Finance QE stories typically use this AC format:

```
GIVEN [I am logged in as a Finance Analyst / Payroll Manager / Budget Owner]
WHEN [I perform action X with valid/invalid data Y]
THEN [the system shows result Z / status changes to S / error message M appears]
```

---

## Key GL Account Codes (Demo Test Data)

| Code | Description | Type |
|---|---|---|
| `5001` | Salaries & Wages | Expense (Debit) |
| `5002` | Employee Benefits | Expense (Debit) |
| `6001` | Travel & Entertainment | Expense (Debit) |
| `6002` | Professional Services | Expense (Debit) |
| `1000` | Cash & Cash Equivalents | Asset (Credit) |
| `2000` | Accounts Payable | Liability (Credit) |
| `3000` | Retained Earnings | Equity (Credit) |

---

## Cost Centres (Demo)

| Code | Name | Entity |
|---|---|---|
| `CC-FIN-001` | Corporate Finance | Capital One Financial |
| `CC-FIN-002` | Finance Operations | Capital One Financial |
| `CC-HR-001` | Human Resources | Capital One Financial |
| `CC-TECH-001` | Technology | Capital One Financial |

---

## Validation Error Messages (exact strings from Workday)

| Scenario | Expected Error Text |
|---|---|
| Out-of-balance entry | `"Journal Entry does not balance"` |
| Invalid GL code | `"The value entered is not a valid account"` |
| Closed period | `"The selected period is closed for journal entry"` |
| Missing required field | `"This field is required"` |
| Duplicate invoice number | `"Duplicate Supplier Invoice Number"` |

---

## Test Data Management Rules

1. All test data **must be deterministic** — use fixed GL codes, amounts, and dates
2. Memo/Description field must include a unique test run identifier to allow cleanup:
   `"[AAVA-TEST] <story-ref> <timestamp>"`
3. Test journal entries must be **reversed after each test run** to avoid polluting the GL balance
4. In the sandbox (impl tenant), posted transactions can be reversed by the service account

---

## Downstream System Contracts

| System | Type | Contract |
|---|---|---|
| GL Reconciliation System | REST API | `GET /api/v1/transactions?glCode={code}&period={period}` returns array with `amount`, `status`, `workdayRef` |
| Regulatory Reporting Platform | Web UI | Report grid displays the transaction within 5 minutes of posting in Workday |
| Audit Log System | REST API | `GET /api/v1/audit?entityId={journalId}` returns all state changes with timestamps |

---

## Bi-Annual Release Impact Assessment

Workday releases (March and September) may:
- Rename `data-automation-id` attributes on key form fields
- Change the URL routing pattern for tasks
- Introduce new required fields in forms
- Reorder workflow steps

**AAVA mitigation**: Self-healing runtime detects broken selectors and regenerates them using the
AI engine. The healing history prevents the same failure on subsequent runs.
