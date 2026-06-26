# AVVA Console Framework Conventions

This document defines the technical conventions, patterns, and rules for test automation of the
AVVA Console application using Playwright.

---

## Tech Stack

- **Framework:** Playwright 1.58+
- **Language:** JavaScript (Node.js)
- **Pattern:** Page Object Model (POM)
- **Test Runner:** Playwright Test Runner
- **Reporter:** HTML + JSON + TestRail + Logging
- **Config:** `config/playwright.config.js`

---

## Project Structure

```
src/
  web/
    pages/
      avva/                          ← AVVA-specific page objects
        locators/                    ← Locator files
          agent-builder.locators.js
          dashboard.locators.js
          ...
        agent-builder.page.js        ← Page object classes
        dashboard.page.js
        auth.page.js
        base.page.js                 ← Shared base (one level up)
    tests/
      avva/                          ← AVVA test specs
        agent-builder.spec.js
        dashboard.spec.js
        ...
  shared/
    data/
      test-data-avva.js              ← AVVA test data constants
    fixtures/
      avva-fixture.js                ← AVVA-specific fixtures
    traceability/
      testrail-case-map.json         ← TestRail case mapping
```

---

## File Naming Conventions

### Locators
- **Pattern:** `<feature>.locators.js`
- **Examples:** `agent-builder.locators.js`, `dashboard.locators.js`
- **Location:** `src/web/pages/avva/locators/`

### Page Objects
- **Pattern:** `<feature>.page.js`
- **Examples:** `agent-builder.page.js`, `dashboard.page.js`
- **Location:** `src/web/pages/avva/`

### Specs
- **Pattern:** `avva-<feature>.spec.js`
- **Examples:** `avva-agent-builder.spec.js`, `avva-dashboard.spec.js`
- **Location:** `src/web/tests/avva/`
- **Tags:** Always include `@avva` tag

---

## Locator File Structure

```javascript
// === FILE: src/web/pages/avva/locators/agent-builder.locators.js ===

/**
 * Locators for AVVA Agent Builder page
 * URL: https://int-ai.aava.ai/launchpad/build/agent
 */

const locators = {
  // Primary elements
  agentCanvas: (page) => page.locator('[data-testid="agent-canvas"]').first(),
  toolPalette: (page) => page.locator('[data-testid="tool-palette"]').first(),
  
  // Action buttons
  saveAgentBtn: (page) => page.locator('[data-testid="save-agent"]').first(),
  runAgentBtn: (page) => page.locator('[data-testid="run-agent"]').first(),
  
  // Form inputs
  agentNameInput: (page) => page.locator('[data-testid="agent-name-input"]').first(),
  modelSelect: (page) => page.locator('[data-testid="model-select"]').first(),
  
  // Dynamic selectors (use functions for parameterized locators)
  toolCheckbox: (page, toolName) => page.locator(`[data-testid="tool-${toolName}"]`).first(),
  agentListItem: (page, agentName) => page.locator(`[data-testid="agent-item"][data-name="${agentName}"]`).first(),
};

module.exports = locators;
```

**Rules:**
- Every locator returns `.first()` to avoid ambiguity
- Use `data-testid` as primary selector strategy
- Group logically: primary elements, buttons, inputs, dynamic selectors
- Document with JSDoc comments
- Parameterized locators use arrow functions

---

## Page Object Structure

```javascript
// === FILE: src/web/pages/avva/agent-builder.page.js ===

const BasePage = require('../base.page');
const loc = require('./locators/agent-builder.locators');

const URL = 'https://int-ai.aava.ai/launchpad/build/agent';

class AgentBuilderPage extends BasePage {
  /**
   * Navigate to Agent Builder page
   */
  async goto() {
    await super.goto(URL);
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    await loc.agentCanvas(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Get agent canvas visibility
   * @returns {Promise<boolean>}
   */
  async isCanvasVisible() {
    await loc.agentCanvas(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.agentCanvas(this.page).isVisible();
  }

  /**
   * Enter agent name
   * @param {string} name - Agent name
   */
  async enterAgentName(name) {
    await loc.agentNameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.agentNameInput(this.page).fill(name);
  }

  /**
   * Click Save Agent button
   */
  async clickSave() {
    await loc.saveAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.saveAgentBtn(this.page).click();
  }

  /**
   * Select a tool by name
   * @param {string} toolName - Tool identifier (e.g., 'browser')
   */
  async selectTool(toolName) {
    await loc.toolCheckbox(this.page, toolName).waitFor({ state: 'visible', timeout: 15000 });
    await loc.toolCheckbox(this.page, toolName).check();
  }

  /**
   * Get success message after save
   * @returns {Promise<string>}
   */
  async getSuccessMessage() {
    const toast = this.page.locator('[data-testid="success-toast"]').first();
    await toast.waitFor({ state: 'visible', timeout: 15000 });
    return await toast.textContent();
  }
}

module.exports = AgentBuilderPage;
```

**Rules:**
- Extend `BasePage` for common methods (`goto`, `getPageUrl`, `getPageTitle`)
- One method = one action (no complex workflows in page objects)
- **Never assert in page objects** — return values for spec assertions
- Always use explicit waits with timeouts (15000ms standard)
- Document with JSDoc (params, returns)
- Methods return values (text, boolean, element) — specs do assertions

---

## Spec File Structure

```javascript
// === FILE: src/web/tests/avva/avva-agent-builder.spec.js ===

const { test, expect } = require('../../../shared/fixtures');
const AgentBuilderPage = require('../../pages/avva/agent-builder.page');
const TD = require('../../../shared/data/test-data-avva');

test.describe('[UI] AVVA Agent Builder', { tag: ['@smoke', '@avva'] }, () => {
  let agentPage;

  test.beforeEach(async ({ page }) => {
    agentPage = new AgentBuilderPage(page);
    await agentPage.goto();
  });

  test('[C123] Test Case 1: User creates a new agent successfully', async ({ page }) => {
    // Arrange
    const agentName = `Test Agent ${Date.now()}`;

    // Act
    await agentPage.enterAgentName(agentName);
    await agentPage.selectTool('browser');
    await agentPage.clickSave();

    // Assert
    const successMsg = await agentPage.getSuccessMessage();
    expect(successMsg).toContain(TD.avva.messages.agentSavedSuccess);
    
    await expect(page).toHaveURL(/\/agents\/\d+/, { timeout: 15000 });
  });

  test('[C124] Test Case 2: Canvas is visible on page load', async ({ page }) => {
    // Assert
    const isVisible = await agentPage.isCanvasVisible();
    expect(isVisible).toBe(true);
  });
});
```

**Rules:**
- Use `test.describe()` with descriptive name and tags
- Always include `@avva` tag + `@smoke` or `@regression`
- Instantiate page object in `beforeEach`
- Call `goto()` in `beforeEach` for navigation tests
- Test titles: `[Cxxx] Test Case N: <description>` format
- Organize: Arrange → Act → Assert
- Use test data constants from `TD.avva.*`
- Never hardcode URLs, text, or numbers

---

## Test Data Module

```javascript
// === FILE: src/shared/data/test-data-avva.js ===

module.exports = {
  avva: {
    urls: {
      base: 'https://int-ai.aava.ai',
      launchpad: 'https://int-ai.aava.ai/launchpad',
      agentBuilder: 'https://int-ai.aava.ai/launchpad/build/agent',
      dashboard: 'https://int-ai.aava.ai/dashboard',
      testCases: 'https://int-ai.aava.ai/testcases',
    },
    
    urlPatterns: {
      agentDetail: /\/agents\/\d+/,
      testCaseDetail: /\/testcases\/\d+/,
    },
    
    auth: {
      email: process.env.AVVA_EMAILID || 'mohan.r@ascendion.com',
      storageStatePath: 'playwright/.auth/avva-storageState.json',
    },
    
    messages: {
      agentSavedSuccess: 'Agent saved successfully',
      agentDeletedSuccess: 'Agent deleted successfully',
      validationErrorName: 'Agent name is required',
    },
    
    pageTitles: {
      dashboard: /AVVA.*Dashboard/,
      launchpad: /AVVA.*Launchpad/,
      agentBuilder: /AVVA.*Agent Builder/,
    },
  },
};
```

**Rules:**
- All URLs, text, patterns go here — never hardcoded in specs
- Nested structure: `TD.avva.<category>.<constant>`
- Use `process.env` for environment-specific values
- URL patterns use regex for flexible matching

---

## Assertion Patterns

### URL Assertions
```javascript
await expect(page).toHaveURL(TD.avva.urls.agentBuilder, { timeout: 15000 });
await expect(page).toHaveURL(TD.avva.urlPatterns.agentDetail, { timeout: 15000 });
```

### Text Assertions
```javascript
expect(successMsg).toContain(TD.avva.messages.agentSavedSuccess);
expect(errorMsg).toBe(TD.avva.messages.validationErrorName);
```

### Visibility Assertions
```javascript
const isVisible = await pageObj.isElementVisible();
expect(isVisible).toBe(true);

// Alternative: direct Playwright assertion
await expect(page.locator('[data-testid="element"]')).toBeVisible({ timeout: 15000 });
```

### Title Assertions
```javascript
await expect(page).toHaveTitle(TD.avva.pageTitles.dashboard, { timeout: 15000 });
```

---

## Wait Strategy

### Standard Waits
```javascript
// Element visibility
await element.waitFor({ state: 'visible', timeout: 15000 });

// Element hidden (for spinners)
await spinner.waitFor({ state: 'hidden', timeout: 15000 });

// Network idle (for SPA navigation)
await page.waitForLoadState('networkidle', { timeout: 30000 });
```

### NEVER Use
```javascript
// ❌ BANNED — non-deterministic
await page.waitForTimeout(3000);
```

---

## Authentication Setup

### Global Setup (One-time per test run)

```javascript
// config/globalSetup.js
async function globalSetup(config) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to AVVA login
  await page.goto('https://int-ai.aava.ai/');
  
  // Handle Microsoft SSO (manual intervention or env-based auth)
  // ... login flow ...
  
  // Save authenticated state
  await context.storageState({ path: 'playwright/.auth/avva-storageState.json' });
  await browser.close();
}
module.exports = globalSetup;
```

### Reuse in Tests

```javascript
// config/playwright.config.js
use: {
  storageState: 'playwright/.auth/avva-storageState.json',
}
```

---

## Tagging Strategy

| Tag | Purpose | When to Run |
|-----|---------|-------------|
| `@avva` | All AVVA tests | Always include for AVVA specs |
| `@smoke` | Critical paths | Every push, PR |
| `@regression` | Full coverage | Nightly, weekly |
| `@auth` | Authentication flows | Pre-deployment |

**Run Examples:**
```bash
npx playwright test --grep "@avva" --grep "@smoke"
npx playwright test src/web/tests/avva/ --grep "@regression"
```

---

## Reporting

### TestRail Integration
- **Reporter:** `src/shared/integrations/testrail-reporter.js`
- **Config:** `config/playwright.config.js` reporters array
- **Case IDs:** Embedded in test titles as `[Cxxx]`
- **Auto-post:** Results posted automatically after test run

### Logging
- **Reporter:** `src/shared/integrations/logging-reporter.js`
- **Logs:** `logs/combined.log`, `logs/error.log`
- **Level:** INFO for passes, ERROR for failures
- **Flaky detection:** Automatic flagging of tests passing after retry

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: AVVA Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-avva:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --grep "@avva" --grep "@smoke"
        env:
          AVVA_TOKEN: ${{ secrets.AVVA_TOKEN }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: avva-test-results
          path: playwright-report/
```

---

## Performance Targets

- **Test execution:** < 30 seconds per spec (average)
- **Page load:** < 3 seconds (initial), < 1 second (SPA navigation)
- **Element wait:** < 15 seconds (max timeout)
- **Full suite:** < 10 minutes (smoke), < 1 hour (regression)

---

## Debugging

### Local Debugging
```bash
# Headed mode
npx playwright test src/web/tests/avva/ --headed

# Debug mode (step through)
npx playwright test src/web/tests/avva/avva-agent-builder.spec.js --debug

# UI mode (interactive)
npx playwright test --ui
```

### Trace Viewer
```bash
# Enable tracing in config
trace: 'on-first-retry',

# View trace
npx playwright show-trace test-results/<test-name>/trace.zip
```

---

## Code Quality Checklist

Before committing AVVA test code:

- [ ] All selectors go through locator files (no raw selectors in specs)
- [ ] Page object methods return values, never assert
- [ ] Test titles have `[Cxxx]` TestRail case ID
- [ ] All assertions use `TD.avva.*` constants
- [ ] Explicit waits with timeouts (no `waitForTimeout`)
- [ ] Tests tagged with `@avva` + `@smoke` or `@regression`
- [ ] JSDoc comments on all page object methods
- [ ] Tests pass locally before push
- [ ] No `console.log` or debug code left in
- [ ] File names follow convention

---

## Common Pitfalls & Solutions

### Pitfall 1: Stale Element Reference
**Problem:** Element located before DOM update, becomes stale  
**Solution:** Re-locate element after dynamic update

### Pitfall 2: Race Conditions
**Problem:** Click on element before it's interactive  
**Solution:** Use `waitFor({ state: 'visible' })` + Playwright auto-wait

### Pitfall 3: Flaky Selectors
**Problem:** Selector works sometimes, fails others  
**Solution:** Use stable `data-testid` attributes; avoid index-based, XPath

### Pitfall 4: Hardcoded Waits
**Problem:** `waitForTimeout(3000)` makes tests slow and unreliable  
**Solution:** Use explicit waits for specific conditions

---

## Version History

- **v1.0** (2026-06-26): Initial AVVA framework conventions established
