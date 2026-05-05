# BDD Framework — Playwright + Gherkin (playwright-bdd)

> **Target Application:** [StarHub Personal](https://www.starhub.com/personal.html)
>
> **Branch:** `starhub_poc_bdd`

This document describes the BDD (Behavior-Driven Development) test automation architecture
built on top of the existing AI-Assisted Playwright Automation Framework. The BDD layer uses
Gherkin `.feature` files and `playwright-bdd` to bridge human-readable scenarios with the
Playwright Test runner — without replacing the existing POM-based spec layer.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Quick Start](#quick-start)
4. [Writing Feature Files](#writing-feature-files)
5. [Writing Step Definitions](#writing-step-definitions)
6. [BDD World & Page Object Integration](#bdd-world--page-object-integration)
7. [Hooks — Browser Lifecycle](#hooks--browser-lifecycle)
8. [Configuration](#configuration)
9. [Running BDD Tests](#running-bdd-tests)
10. [Tag Strategy](#tag-strategy)
11. [TestRail Traceability](#testrail-traceability)
12. [BDD Agent & Skill](#bdd-agent--skill)
13. [Relationship with POM Tests](#relationship-with-pom-tests)
14. [Adding a New Feature](#adding-a-new-feature)
15. [Troubleshooting](#troubleshooting)
16. [File Reference](#file-reference)

---

## Architecture Overview

The BDD layer is an **overlay** on the existing Page Object Model framework. It adds a
Gherkin-based authoring surface that stakeholders (BAs, POs, QA leads) can read and validate,
while reusing all existing page objects, locators, and test data modules.

```
┌─────────────────────────────────────────────────────────────┐
│  Feature Files (.feature)                                   │
│  Human-readable Gherkin scenarios                           │
│  src/bdd/features/<domain>/<name>.feature                   │
├─────────────────────────────────────────────────────────────┤
│  Step Definitions (.steps.js)                               │
│  Thin glue code — delegates to page objects                 │
│  src/bdd/steps/common.steps.js (shared)                     │
│  src/bdd/steps/<domain>/<name>.steps.js (feature-specific)  │
├─────────────────────────────────────────────────────────────┤
│  BDD World (world.js) + Hooks (hooks.js)                    │
│  Injects Playwright Page + page objects into steps          │
│  src/bdd/support/                                           │
├─────────────────────────────────────────────────────────────┤
│  Page Objects (shared with POM specs)                       │
│  src/pages/<name>.page.js                                   │
│  src/pages/locators/<name>.locators.js                      │
├─────────────────────────────────────────────────────────────┤
│  Test Data (shared)                                         │
│  src/data/<name>-test-data.js                               │
├─────────────────────────────────────────────────────────────┤
│  Playwright Test Runner                                     │
│  config/playwright-bdd.config.js                            │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| `playwright-bdd` over CucumberJS standalone | Native Playwright parallelism, fixtures, reporters, and trace/video support |
| Step definitions call page objects | Thin steps, no selector duplication, single source of truth for DOM interaction |
| Common steps in one file | Navigation, login, and generic assertions reused across all features |
| `@Cxxx` tags for TestRail | Same traceability model as POM specs — every Scenario maps to a TestRail case |
| Lazy-loaded page objects via World | Only instantiate page objects that a scenario actually needs |

---

## Directory Structure

```
src/bdd/
├── features/                       # Gherkin feature files
│   └── auth/
│       └── login.feature           # Login scenarios
├── steps/                          # Step definitions
│   ├── common.steps.js             # Shared Given/When/Then steps
│   └── auth/
│       └── login.steps.js          # Login-specific steps
└── support/                        # BDD infrastructure
    ├── world.js                    # Custom World — page object injection
    └── hooks.js                    # Before/After — browser lifecycle

config/
└── playwright-bdd.config.js        # BDD-specific Playwright configuration

context/
└── bdd-framework.md                # BDD conventions documentation

.github/agents/
└── bdd-automation.agent.md          # BDD agent for Copilot

.claude/skills/bdd-testing/
└── SKILL.md                         # BDD skill for AI code generation
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Playwright browsers installed (`npx playwright install`)

### 1. Install Dependencies

```bash
npm install
```

This installs `playwright-bdd` and `@cucumber/cucumber` alongside existing dependencies.

### 2. Set Environment Variables

Create a `.env` file in the project root:

```env
# Target application
BASE_URL=https://www.starhub.com/personal.html

# (Optional) Authentication credentials
ADAPTIVE_USERNAME=your-username
ADAPTIVE_PASSWORD=your-password

# (Optional) TestRail integration
TESTRAIL_HOST=https://your-instance.testrail.io
TESTRAIL_USER=your-email
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=1
```

### 3. Generate & Run BDD Tests

```bash
# Generate Playwright spec files from .feature files
npm run bdd:generate

# Run all BDD tests
npm run bdd:test

# Run only @smoke tagged scenarios
npm run bdd:test:smoke
```

---

## Writing Feature Files

Feature files live in `src/bdd/features/<domain>/` and use standard Gherkin syntax.

### Example: `src/bdd/features/auth/login.feature`

```gherkin
@auth @smoke @regression
Feature: User Authentication
  As an application user
  I want to log into the system with my credentials
  So that I can access the dashboard and perform my tasks

  Background:
    Given the user navigates to the login page

  @C0
  Scenario: Login page displays all required form fields
    Then the login form should be visible
    And the sign in button should be visible

  @C0
  Scenario: Successful login navigates to dashboard
    When the user logs in with valid credentials
    Then the user should be on the dashboard page

  @C0
  Scenario Outline: Login with various invalid credentials
    When the user logs in with "<username>" and "<password>"
    Then an error message should be displayed

    Examples:
      | username         | password      |
      | invalid@test.com | wrongpassword |
      | admin@test.com   | 123           |
```

### Gherkin Best Practices

| Rule | Example |
|---|---|
| **Business language only** | "the user logs in" not "fill #email-input" |
| **One Scenario = one AC** | Don't combine multiple acceptance criteria |
| **3–7 steps per Scenario** | Keep scenarios short and focused |
| **Background for shared setup** | Common `Given` steps go in `Background` |
| **Scenario Outline for data** | Use `Examples` table when only data changes |
| **Tags for filtering** | `@smoke`, `@regression`, `@Cxxx` on each Scenario |

---

## Writing Step Definitions

Step definitions are thin glue functions that delegate to page objects.

### Location Rules

| Step type | File |
|---|---|
| Navigation, login, generic assertions | `src/bdd/steps/common.steps.js` |
| Feature-specific steps | `src/bdd/steps/<domain>/<feature>.steps.js` |

### Example: Common Steps

```js
// src/bdd/steps/common.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('the user navigates to the login page', async function () {
  await this.loginPage.gotoLogin();
});

When('the user logs in with valid credentials', async function () {
  await this.loginPage.loginWithDefaults();
});

Then('the page title should contain {string}', async function (expectedTitle) {
  await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
});
```

### Example: Feature-Specific Steps

```js
// src/bdd/steps/auth/login.steps.js
const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('the login form should be visible', async function () {
  const visible = await this.loginPage.isLoginFormVisible();
  expect(visible).toBe(true);
});
```

### Step Definition Rules

1. **Import** `Given`, `When`, `Then` from `@cucumber/cucumber`
2. **Access page objects** via `this.loginPage`, `this.adaptivePlanningPage`, etc.
3. **Access raw page** via `this.page` for direct Playwright assertions
4. **Given** = set up preconditions (navigate, seed data)
5. **When** = perform actions (click, fill, submit)
6. **Then** = verify outcomes (assertions only — never in Given/When)
7. **Parameters** — use Cucumber expressions: `{string}`, `{int}`, `{float}`
8. **No raw selectors** — always call page object methods
9. **Test data** — use `TD.*` values, never hardcode strings

---

## BDD World & Page Object Integration

The BDD World (`src/bdd/support/world.js`) is a custom Cucumber World class that bridges
step definitions with Playwright page objects.

### How It Works

1. **Before each Scenario**, the `hooks.js` creates a fresh Playwright `page` and sets it on the World
2. **Step definitions** access page objects via `this.<pageName>` (e.g. `this.loginPage`)
3. **Page objects are lazy-loaded** — only instantiated on first access
4. **Page object cache resets** per Scenario, ensuring test isolation

### Adding a New Page Object

To make a new page object available in step definitions:

```js
// In src/bdd/support/world.js — add a getter:
get myNewPage() {
  const MyNewPage = require('../../pages/my-new.page');
  return this._getPage('myNew', MyNewPage);
}
```

Then use it in step definitions:

```js
Given('the user is on the products page', async function () {
  await this.myNewPage.gotoProducts();
});
```

---

## Hooks — Browser Lifecycle

`src/bdd/support/hooks.js` manages the Playwright browser lifecycle for BDD scenarios:

| Hook | Purpose |
|---|---|
| `Before` | Launch browser (if needed), create fresh context + page, load storage state |
| `After` | Capture screenshot on failure, attach to report, close context |
| `AfterAll` | Close browser after all scenarios complete |

### Key Behaviors

- **Test isolation**: each Scenario gets its own browser context and page
- **Auth reuse**: loads saved storage state from `playwright/.auth/` if available
- **Failure evidence**: screenshots captured and attached automatically on failure
- **Headless mode**: controlled by `HEADLESS=true` env var or `CI=true`

---

## Configuration

### `config/playwright-bdd.config.js`

This is the dedicated Playwright config for BDD tests. It uses `defineBddConfig()` from
`playwright-bdd` to specify where feature files and step definitions live.

Key settings:

| Setting | Value |
|---|---|
| `features` | `src/bdd/features/**/*.feature` |
| `steps` | `src/bdd/steps/common.steps.js` + `src/bdd/steps/**/*.steps.js` |
| `baseURL` | `process.env.BASE_URL` or `https://www.starhub.com/personal.html` |
| `timeout` | 60s per test |
| `retries` | 2 on CI, 1 locally |
| `reporters` | HTML, JSON, Blob, TestRail, Logging, HTML Evidence |
| `video` | Always on |
| `screenshot` | On failure |

---

## Running BDD Tests

### NPM Scripts

```bash
# Generate Playwright specs from feature files (required after editing .feature files)
npm run bdd:generate

# Run all BDD tests
npm run bdd:test

# Run @smoke scenarios only
npm run bdd:test:smoke

# Run @regression scenarios only
npm run bdd:test:regression

# Run with visible browser
npm run bdd:test:headed

# Run in debug mode (step through with Playwright Inspector)
npm run bdd:test:debug
```

### Direct Commands

```bash
# Run a specific feature file
npx playwright test --config=config/playwright-bdd.config.js src/bdd/features/auth/login.feature

# Run by tag
npx playwright test --config=config/playwright-bdd.config.js --grep @auth

# Run excluding WIP
npx playwright test --config=config/playwright-bdd.config.js --grep-invert @wip
```

### Viewing Reports

```bash
# Open HTML report
npx playwright show-report

# Open evidence report
npm run report:evidence
```

---

## Tag Strategy

Tags control which scenarios run in different contexts:

| Tag | Purpose | When to Run |
|---|---|---|
| `@smoke` | Critical path — login, navigation | Every PR, every push |
| `@regression` | Full coverage | Nightly, pre-release |
| `@wip` | Work in progress | Excluded from CI |
| `@skip` | Temporarily disabled | Never (with documented reason) |
| `@Cxxx` | TestRail case ID | Always present on every Scenario |
| `@auth` | Authentication domain | When testing login flows |
| `@planning` | Planning domain | When testing planning features |
| `@api` | API-only (no browser) | Headless API validation |
| `@e2e` | End-to-end journeys | Cross-domain integration |

### Combining Tags

```bash
# Run smoke AND auth
npx playwright test --config=config/playwright-bdd.config.js --grep "(?=.*@smoke)(?=.*@auth)"

# Run regression but NOT wip
npx playwright test --config=config/playwright-bdd.config.js --grep @regression --grep-invert @wip
```

---

## TestRail Traceability

The BDD framework maintains the same AC → TestRail → Spec traceability chain as POM tests:

```
Acceptance Criteria  →  @Cxxx tag on Scenario  →  TestRail case (auto-created)  →  TestRail run (auto-reported)
```

### How It Works

1. **Each Scenario** gets a `@Cxxx` tag (e.g. `@C301`) mapping to a TestRail case
2. **`push-to-testrail.js`** creates cases in TestRail before automation
3. **`testrail-reporter.js`** parses `@Cxxx` from test titles and posts pass/fail results
4. **`testrail-case-map.json`** tracks which ACs already have TestRail case IDs

### Creating TestRail Cases from BDD Scenarios

```bash
JIRA_REF=STAR-101 node src/integrations/push-to-testrail.js
```

---

## BDD Agent & Skill

### BDD Automation Agent

The agent at `.github/agents/bdd-automation.agent.md` automates the entire BDD workflow:

| Phase | What Happens |
|---|---|
| 1 — Load Context | Reads `bdd-framework.md`, `framework.md`, `project-prompt.md` |
| 2 — Audit Assets | Scans existing features, steps, page objects for reuse |
| 3 — TestRail | Creates manual test cases, embeds `@Cxxx` tags |
| 4 — Inspect | Navigates the live app, snapshots DOM for selectors |
| 5 — Generate | Produces `.feature`, `.steps.js`, and page object files |
| 6 — Quality Gates | Validates Gherkin syntax, no duplication, no raw selectors |
| 7 — Run & Verify | Generates specs, runs tests, fixes failures |

**Invoke in Copilot Chat:**

```
@bdd-automation-agent Create BDD scenarios for the StarHub personal page navigation.
AC1: User can see the main navigation menu
AC2: User can navigate to Mobile plans
AC3: User can navigate to Broadband plans
```

### BDD Skill

The skill at `.claude/skills/bdd-testing/SKILL.md` handles individual tasks:

- Converting ACs to Gherkin
- Creating step definitions
- Wiring up page objects via World

---

## Relationship with POM Tests

BDD and POM tests coexist in the same repository and share the same page objects:

| Aspect | POM Specs | BDD Features |
|---|---|---|
| **Location** | `src/tests/` | `src/bdd/features/` |
| **Format** | JavaScript test functions | Gherkin plain text |
| **Audience** | Developers, QA engineers | Stakeholders, BA, PO, QA |
| **Config** | `config/playwright.config.js` | `config/playwright-bdd.config.js` |
| **Page Objects** | Direct usage in specs | Via step defs + World |
| **Test Data** | `require('../../data/...')` | Via step defs `require('../../../data/...')` |
| **Tags** | `{ tag: ['@smoke'] }` | `@smoke` in Gherkin |
| **TestRail ID** | `[Cxxx]` in test title | `@Cxxx` tag on Scenario |
| **Run command** | `npm test` | `npm run bdd:test` |

Both approaches:
- Use the same page objects and locators
- Report to the same TestRail project
- Generate HTML evidence reports
- Support self-healing via the fixture layer

---

## Adding a New Feature

### Step-by-Step Walkthrough

**1. Create the feature file:**

```bash
# Create domain directory if needed
mkdir -p src/bdd/features/navigation
```

```gherkin
# src/bdd/features/navigation/main-menu.feature
@navigation @smoke
Feature: Main Navigation Menu
  As a visitor to StarHub
  I want to use the main navigation menu
  So that I can find the products and services I need

  Background:
    Given the user navigates to "https://www.starhub.com/personal.html"

  @C0
  Scenario: Main navigation menu is visible
    Then the "Mobile" link should be visible
    And the "Broadband" link should be visible
```

**2. Check `common.steps.js` for existing steps:**

The `Given the user navigates to {string}` step already exists in `common.steps.js`.
The `Then the {string} link should be visible` step also exists.

No new step definitions needed — full reuse!

**3. Create feature-specific steps (only if needed):**

```js
// src/bdd/steps/navigation/main-menu.steps.js
const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('the user hovers over the {string} menu item', async function (menuItem) {
  await this.page.getByRole('link', { name: menuItem }).hover();
});

Then('the {string} submenu should appear', async function (submenu) {
  await expect(this.page.getByText(submenu)).toBeVisible({ timeout: 15000 });
});
```

**4. Generate and run:**

```bash
npm run bdd:generate
npm run bdd:test
```

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---|---|
| `Step "..." is not defined` | Add the step to `common.steps.js` or a feature-specific steps file |
| `Duplicate step definition` | Search all `*.steps.js` files — each pattern must be unique across all files |
| `this.loginPage is undefined` | Add a getter for the page object in `src/bdd/support/world.js` |
| `Cannot find module 'playwright-bdd'` | Run `npm install` — the package is in `devDependencies` |
| Tests not discovered | Run `npm run bdd:generate` first to generate spec files from features |
| `page` is null in steps | Ensure `hooks.js` `Before` hook is running — check for import errors |
| Flaky due to timing | Add `waitFor({ state: 'visible', timeout: 15000 })` in the page object method |

### Debugging

```bash
# Run with Playwright Inspector (step through)
npm run bdd:test:debug

# Run with visible browser
npm run bdd:test:headed

# Run a single scenario by title
npx playwright test --config=config/playwright-bdd.config.js --grep "Login page displays"

# Generate trace for failed scenarios (auto-enabled on retry)
npx playwright test --config=config/playwright-bdd.config.js --trace on
```

---

## File Reference

| File | Purpose |
|---|---|
| [`config/playwright-bdd.config.js`](config/playwright-bdd.config.js) | Playwright config for BDD test execution |
| [`context/bdd-framework.md`](context/bdd-framework.md) | BDD conventions, Gherkin rules, directory structure |
| [`src/bdd/support/world.js`](src/bdd/support/world.js) | Custom Cucumber World with lazy page object injection |
| [`src/bdd/support/hooks.js`](src/bdd/support/hooks.js) | Before/After hooks — browser lifecycle + failure screenshots |
| [`src/bdd/steps/common.steps.js`](src/bdd/steps/common.steps.js) | Shared Given/When/Then steps (navigation, login, assertions) |
| [`src/bdd/steps/auth/login.steps.js`](src/bdd/steps/auth/login.steps.js) | Login-specific step definitions |
| [`src/bdd/features/auth/login.feature`](src/bdd/features/auth/login.feature) | Sample login feature in Gherkin |
| [`.github/agents/bdd-automation.agent.md`](.github/agents/bdd-automation.agent.md) | BDD agent definition for Copilot |
| [`.claude/skills/bdd-testing/SKILL.md`](.claude/skills/bdd-testing/SKILL.md) | BDD skill for AI-assisted code generation |
| [`src/pages/base.page.js`](src/pages/base.page.js) | BasePage — all page objects extend this |
| [`src/pages/adaptive-planning.page.js`](src/pages/adaptive-planning.page.js) | Application page object (reused by BDD steps) |
| [`src/data/adaptive-planning-test-data.js`](src/data/adaptive-planning-test-data.js) | Centralised test data (URLs, credentials, expected values) |
