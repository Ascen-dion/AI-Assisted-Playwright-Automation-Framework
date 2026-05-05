---
name: bdd-testing
description: >
  Generate and maintain BDD (Behavior-Driven Development) tests using Gherkin syntax with
  Playwright. Use this skill when a user story, acceptance criteria, or plain English requirement
  needs to be translated into Feature files with Given/When/Then scenarios, step definitions, and
  page object integrations. Produces feature files and step definitions that leverage the existing
  POM layer and follow playwright-bdd conventions.
allowed-tools: read_file Bash(node:*) Bash(npx:*)
---

# BDD Testing Skill

## Purpose

This skill generates BDD test assets (feature files, step definitions, support files) from user
stories or acceptance criteria. It bridges Gherkin business language with the existing Playwright
POM framework via `playwright-bdd`.

---

## Step 1 — Load BDD context

Read the BDD framework context before generating any BDD code:

```
context/bdd-framework.md     → BDD conventions, directory structure, Gherkin rules
context/framework.md          → POM conventions shared with BDD layer
context/project-prompt.md     → Always-on guardrails
```

---

## Step 2 — Parse requirements into Gherkin

Convert each acceptance criterion into a Gherkin Scenario:

**AC format (input):**
```
AC1: User can log in with valid credentials
AC2: Error is shown for invalid credentials
AC3: Login page displays all required form fields
```

**Gherkin format (output):**
```gherkin
@C301
Scenario: User can log in with valid credentials
  Given the user navigates to the login page
  When the user logs in with valid credentials
  Then the user should be on the dashboard page

@C302
Scenario: Error is shown for invalid credentials
  Given the user navigates to the login page
  When the user logs in with "invalid@test.com" and "wrongpassword"
  Then an error message should be displayed
```

**Rules:**
- One Scenario per AC — never combine multiple ACs into one scenario
- Use business language — no selectors, no technical terms
- Parameters use Cucumber expressions: `{string}`, `{int}`, `{float}`
- Each Scenario gets a `@Cxxx` TestRail tag
- Use `Background` for shared preconditions within a Feature
- Use `Scenario Outline` + `Examples` for data-driven tests

---

## Step 3 — Audit existing step definitions

Before creating new step definitions, scan `src/bdd/steps/` for existing patterns:

```
src/bdd/steps/common.steps.js    → shared navigation, login, assertion steps
src/bdd/steps/<domain>/*.steps.js → domain-specific steps
```

**Reuse rules:**
- If an existing step matches the Gherkin phrase exactly → use it, do not recreate
- If a step is close but not exact → adapt the Gherkin phrase to match, OR parameterize the step
- Common steps (navigate, login, verify visible) must stay in `common.steps.js`

---

## Step 4 — Generate step definitions

For each new step that doesn't exist yet, generate the implementation:

```js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Step implementations call page object methods — never raw selectors
Given('the user navigates to the login page', async function () {
  await this.loginPage.gotoLogin();
});
```

**Step definition rules:**
- Import `Given`, `When`, `Then` from `@cucumber/cucumber`
- Access page objects via `this.<pageName>` (injected by BDD World)
- Given steps: set up preconditions (navigate, seed data)
- When steps: perform actions (click, fill, submit)
- Then steps: verify outcomes (assertions only)
- Never put assertions in Given or When steps
- Keep steps thin — one action or one assertion per step
- All assertion values from `TD.*` test data, never hardcoded

---

## Step 5 — Wire up page objects via BDD World

If a step needs a page object not yet available in the World:

```js
// src/bdd/support/world.js — add lazy-loaded page object
get loginPage() {
  if (!this._loginPage) {
    const LoginPage = require('../../pages/adaptive-planning.page');
    this._loginPage = new LoginPage(this.page);
  }
  return this._loginPage;
}
```

---

## Step 6 — Quality checks

Before saving any file:
- [ ] Feature file passes Gherkin linting (proper syntax)
- [ ] No duplicate step definitions across files
- [ ] No raw selectors in step definitions
- [ ] All steps delegate to page objects
- [ ] `Scenario Outline` used where 2+ scenarios differ only in data
- [ ] Each Scenario has a `@Cxxx` TestRail tag
- [ ] Feature-level tags include `@smoke` or `@regression` and `@<domain>`

---

## Step 7 — Generate and run

```bash
# Generate Playwright specs from features
npx bddgen --config config/playwright-bdd.config.js

# Run the BDD tests
npx playwright test --config=config/playwright-bdd.config.js --project=chromium
```

---

## Output Format

Always produce separate code blocks for each file:

1. `// === FILE: src/bdd/features/<domain>/<name>.feature ===`
2. `// === FILE: src/bdd/steps/<domain>/<name>.steps.js ===`
3. `// === FILE: src/pages/<name>.page.js ===` (only if new page object needed)
4. `// === FILE: src/pages/locators/<name>.locators.js ===` (only if new locators needed)
