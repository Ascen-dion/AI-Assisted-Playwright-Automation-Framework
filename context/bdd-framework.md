# BDD Framework Knowledge — playwright-bdd Integration

## Architecture Overview

The BDD layer is an **overlay** on the existing POM framework. It does NOT replace
Page Object Model tests — it provides an alternative Gherkin-based authoring surface
that stakeholders can read and validate.

```
┌─────────────────────────────────────────────────────┐
│  Feature Files (Gherkin)                            │
│  src/bdd/features/<domain>/<name>.feature           │
├─────────────────────────────────────────────────────┤
│  Step Definitions                                   │
│  src/bdd/steps/<domain>/<name>.steps.js             │
│  src/bdd/steps/common.steps.js (shared steps)       │
├─────────────────────────────────────────────────────┤
│  BDD World / Fixtures                               │
│  src/bdd/support/world.js                           │
├─────────────────────────────────────────────────────┤
│  Page Objects (shared with POM tests)               │
│  src/pages/<name>.page.js                           │
│  src/pages/locators/<name>.locators.js              │
├─────────────────────────────────────────────────────┤
│  Test Data (shared)                                 │
│  src/data/<name>-test-data.js                       │
├─────────────────────────────────────────────────────┤
│  Playwright Test Runner                             │
│  config/playwright-bdd.config.js                    │
└─────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/bdd/
├── features/                   # Gherkin feature files
│   ├── auth/                   # Authentication domain
│   │   └── login.feature
│   ├── planning/               # Planning domain
│   │   └── budget-sheet.feature
│   └── reporting/              # Reporting domain
│       └── dashboard.feature
├── steps/                      # Step definitions
│   ├── common.steps.js         # Shared Given/When/Then steps
│   ├── auth/
│   │   └── login.steps.js
│   ├── planning/
│   │   └── budget-sheet.steps.js
│   └── reporting/
│       └── dashboard.steps.js
└── support/                    # BDD support files
    └── world.js                # Custom World with page object injection
```

## File Naming Convention

| Asset | Convention | Example |
|---|---|---|
| Feature file | `<area>.feature` | `login.feature`, `budget-sheet.feature` |
| Step definition | `<area>.steps.js` | `login.steps.js`, `budget-sheet.steps.js` |
| Common steps | `common.steps.js` | Always one file for shared steps |
| BDD World | `world.js` | Always `src/bdd/support/world.js` |
| BDD Config | `playwright-bdd.config.js` | Always `config/playwright-bdd.config.js` |

## Gherkin Syntax Rules

### Feature File Structure
```gherkin
@domain-tag @smoke
Feature: Feature Title
  As a <role>
  I want to <capability>
  So that <business benefit>

  Background:
    Given <shared precondition>

  @Cxxx
  Scenario: Descriptive scenario name
    Given <precondition>
    When <action>
    Then <expected outcome>
    And <additional assertion>

  @Cxxx
  Scenario Outline: Parameterized scenario
    Given <precondition>
    When the user enters "<input>"
    Then the result should be "<output>"

    Examples:
      | input | output |
      | a     | x      |
      | b     | y      |
```

### Tag Strategy
- `@smoke` — critical path scenarios, run on every PR
- `@regression` — full coverage, run nightly
- `@wip` — work in progress, excluded from CI (`--grep-invert @wip`)
- `@skip` — temporarily disabled with documented reason
- `@Cxxx` — TestRail case ID (exactly one per Scenario)
- `@<domain>` — domain tag: `@auth`, `@planning`, `@finance`, `@reporting`
- `@api` — API-only scenarios that don't need a browser
- `@e2e` — end-to-end journey spanning multiple domains

### Writing Guidelines
- **Business language only** — no selectors, CSS, DOM references in features
- **One assertion focus per Scenario** — test one thing well
- **Consistent step phrasing** — reuse exact Given/When/Then phrases across features
- **Background for shared setup** — avoid repeating Given steps in every Scenario
- **Scenario Outline for data variations** — when 2+ scenarios differ only in data
- **3-7 steps per Scenario** — shorter is better

## Step Definition Rules

### Location
- Shared/common steps → `src/bdd/steps/common.steps.js`
- Feature-specific steps → `src/bdd/steps/<domain>/<feature>.steps.js`
- Never define the same step pattern in two files

### Implementation Pattern
```js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const TD = require('../../data/test-data');

// Given: set up preconditions — navigate, seed data, configure state
Given('the user navigates to the login page', async function () {
  await this.loginPage.gotoLogin();
});

// When: perform actions — click, fill, submit, interact
When('the user logs in with valid credentials', async function () {
  await this.loginPage.loginWithDefaults();
});

// Then: verify outcomes — assertions ONLY
Then('the user should be on the dashboard page', async function () {
  await expect(this.page).toHaveURL(TD.urlPatterns.dashboard, { timeout: 30000 });
});
```

### Rules
- **Thin steps** — delegate all DOM interaction to page objects
- **No raw selectors** — step definitions must call page object methods
- **Given = setup, When = action, Then = assertion** — never mix concerns
- **Cucumber expressions** — use `{string}`, `{int}`, `{float}` not regex
- **Assertions in Then only** — Given and When must not assert
- **Test data from TD module** — never hardcode assertion values

## BDD World Configuration

The World object (`src/bdd/support/world.js`) provides:
- `this.page` — Playwright Page instance
- `this.<pageName>` — Lazy-loaded page objects (e.g. `this.loginPage`)
- Access to test data via requires

```js
class BDDWorld {
  constructor({ page }) {
    this.page = page;
  }
  // Lazy-loaded page objects
  get loginPage() { ... }
}
```

## Require Paths (from step definition files)

```js
// From src/bdd/steps/<domain>/<step>.steps.js
const PageObject = require('../../../pages/<name>.page');
const TD = require('../../../data/<name>-test-data');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
```

## Running BDD Tests

```bash
# Generate Playwright specs from feature files
npx bddgen --config config/playwright-bdd.config.js

# Run all BDD tests
npx playwright test --config=config/playwright-bdd.config.js

# Run by tag
npx playwright test --config=config/playwright-bdd.config.js --grep @smoke

# Run specific feature domain
npx playwright test --config=config/playwright-bdd.config.js src/bdd/features/auth/

# Debug a specific feature
npx playwright test --config=config/playwright-bdd.config.js --debug src/bdd/features/auth/login.feature
```

## Relationship with POM Tests

| Aspect | POM Specs (`src/tests/`) | BDD Features (`src/bdd/features/`) |
|---|---|---|
| Format | JavaScript test functions | Gherkin plain text |
| Audience | Developers, QA engineers | Stakeholders, BA, PO, QA |
| Runner Config | `config/playwright.config.js` | `config/playwright-bdd.config.js` |
| Page Objects | Direct usage in specs | Accessed via step defs + World |
| Test Data | `require('../../data/...')` | Via step defs → `require('../../../data/...')` |
| Tags | `{ tag: ['@smoke'] }` | `@smoke` in Gherkin |
| TestRail ID | `[Cxxx]` in test title | `@Cxxx` tag on Scenario |
