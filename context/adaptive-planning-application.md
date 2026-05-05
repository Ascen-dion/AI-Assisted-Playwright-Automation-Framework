# Application Context — Workday Adaptive Planning

## Base Configuration

**Target Application URL**: `https://www.starhub.com/personal.html`

**Home URL**: `https://www.starhub.com/personal.html`
**Application Type**: Enterprise Cloud Planning — Workday Adaptive Planning (FP&A)
**Environment**: Trial tenant (ptrial-ascendion)

> **Credentials**: Set in `.env` as `ADAPTIVE_USERNAME` and `ADAPTIVE_PASSWORD`.
> Never hardcode credentials in test files.

---

## Authentication

Workday Adaptive Planning uses a standard username/password login form at `/app`.
After successful authentication, the session redirects to the planning dashboard.
`globalSetup.js` can handle login once and save storage state to
`playwright/.auth/adaptive-storageState.json`.

**Login selectors** (from DOM inspection):
| Element | Selector |
|---|---|
| Username/Email field | `input[name="emailAddress"], #login-email, input[type="email"]` |
| Password field | `input[name="password"], #login-password, input[type="password"]` |
| Remember Username checkbox | `input[type="checkbox"], #rememberUsername` |
| Sign In button | `button[type="submit"], #login-button, button:has-text("Sign In")` |
| Forgot Password link | `a:has-text("Forgot Password")` |
| Error message | `.error-message, .login-error, [role="alert"]` |

> **Note**: Exact selectors should be confirmed via live DOM inspection on first run.
> Update this file with confirmed `data-testid` or stable attributes after inspection.

---

## Workday Adaptive Planning Modules — Key Areas

Adaptive Planning is a cloud-based Financial Planning & Analysis (FP&A) platform covering:

| Module | Description |
|---|---|
| **Planning** | Budgets, forecasts, rolling plans, workforce planning |
| **Reporting** | Financial reports, dashboards, variance analysis |
| **Modeling** | What-if scenarios, multi-dimensional models, custom calculations |
| **Consolidation** | Multi-entity financial consolidation, intercompany eliminations |
| **Integration** | Data imports/exports, ERP connectors, API integrations |
| **Administration** | Users, roles, permissions, dimensions, structure management |

---

## Navigation Patterns

Adaptive Planning uses a sidebar/menu-based navigation:

| Area | Expected Navigation |
|---|---|
| Dashboard/Home | Main landing page after login |
| Sheets (Planning) | Sidebar → Sheets → select sheet type |
| Reports | Sidebar → Reports → report builder/viewer |
| Modeling | Sidebar → Modeling → model management |
| Process | Sidebar → Process → workflow management |
| Integration | Sidebar → Integration → data connectors |
| Administration | Sidebar → Admin → system settings |

---

## Key UI Patterns

### Sheets (Planning Grids)
Adaptive Planning uses spreadsheet-like grids for data entry:
- Row headers (dimensions: accounts, departments, etc.)
- Column headers (time periods: months, quarters, years)
- Editable cells for data input
- Formula cells (calculated, read-only)
- Cell-level comments and annotations

### Reports
- Report builder with drag-and-drop dimensions
- Chart and table views
- Export to Excel/PDF
- Scheduled report delivery

### Data Entry Patterns
- Click cell → enter value → Tab/Enter to move
- Right-click context menus for cell operations
- Inline validation on data type (numeric, text, date)
- Auto-save or explicit save depending on sheet configuration

---

## Environment Notes

- **Cold start**: First page load after login may take 10-15 seconds
- **Session timeout**: Sessions may expire after extended inactivity
- **waitUntil strategy**: Use `'domcontentloaded'` for initial load, then `'networkidle'` for data grids
- **Standard timeout**: 15000ms for element waits; 60000ms for page navigation
- **Grid rendering**: Planning sheets may take additional time to render large datasets
- **SSL**: Corporate environments may require `NODE_TLS_REJECT_UNAUTHORIZED=0`

---

## Selector Strategy Priority

1. `data-testid` or `data-automation-id` — most stable if available
2. ARIA role + accessible name — `getByRole('button', { name: 'Save' })`
3. Visible text — `getByText(...)`, `getByLabel(...)`
4. Stable CSS classes/IDs — avoid positional or index-based selectors
5. Never use: XPath as primary locators

> **Important**: Confirm actual selectors via live DOM inspection. Adaptive Planning's DOM
> structure should be verified and this file updated with confirmed stable selectors.
