# AVVA Console Project Prompt

This file contains always-on guardrails that are injected into every test generation request for
the AVVA Console application. These rules override generic patterns and enforce AVVA-specific
best practices.

---

## MANDATORY RULES

### 1. Authentication Handling
- **NEVER** implement login flow in individual specs
- **ALWAYS** use `storageState` from `playwright/.auth/avva-storageState.json`
- **ALWAYS** configure `globalSetup` to handle Microsoft SSO once per test run
- If token expires mid-run, fail fast with clear error message

### 2. Selector Priority (AVVA-specific)
1. `data-testid` — AVVA uses this extensively, always check first
2. `aria-label` — AVVA is WCAG compliant, ARIA labels are reliable
3. Visible text via `getByText()` — fallback for dynamic content
4. Stable CSS classes — last resort, avoid if possible
5. **NEVER** use XPath, index-based, or positional selectors

### 3. URL Handling
- **ALWAYS** use `TD.avva.urls.*` constants from `test-data-avva.js`
- **NEVER** hardcode `https://int-ai.aava.ai/...` in specs
- For regex patterns, use `TD.avva.urlPatterns.*`

### 4. Test Data
- **ALL** assertion strings MUST come from `test-data-avva.js`
- **NO** hardcoded text in `expect()` statements
- **NO** magic numbers — use named constants

### 5. Page Object Methods
- **RETURN** values (text, boolean, element) — never assert
- **ONE** action per method — no complex workflows
- **ALWAYS** include explicit waits with 15000ms timeout
- **DOCUMENT** with JSDoc (params, returns, description)

### 6. Test Structure
- **TITLE FORMAT:** `[Cxxx] Test Case N: <description>`
- **TAGS:** Always `@avva` + `@smoke` or `@regression`
- **ARRANGE → ACT → ASSERT** — clear separation
- `beforeEach` for page object instantiation and `goto()`

### 7. Waits
- **USE:** `waitFor({ state: 'visible', timeout: 15000 })`
- **USE:** `waitForLoadState('networkidle', { timeout: 30000 })` for SPA navigation
- **BANNED:** `page.waitForTimeout()` — non-deterministic, unreliable

### 8. File Organization
- Locators: `src/web/pages/avva/locators/<feature>.locators.js`
- Page Objects: `src/web/pages/avva/<feature>.page.js`
- Specs: `src/web/tests/avva/avva-<feature>.spec.js`
- Test Data: `src/shared/data/test-data-avva.js`

---

## AVVA-SPECIFIC PATTERNS

### Pattern 1: SPA Navigation
```javascript
// AVVA is a React SPA — no full page reload on navigation
await page.click('[data-testid="nav-launchpad"]');
await page.waitForLoadState('networkidle', { timeout: 30000 });
await page.locator('[data-testid="agent-canvas"]').waitFor({ state: 'visible', timeout: 15000 });
```

### Pattern 2: Loading Indicators
```javascript
// AVVA shows loading spinner during async operations
const spinner = page.locator('[data-testid="loading-spinner"]');
await spinner.waitFor({ state: 'hidden', timeout: 15000 });
```

### Pattern 3: Toast Notifications
```javascript
// AVVA uses toast notifications for success/error messages
const toast = page.locator('[data-testid="success-toast"]');
await toast.waitFor({ state: 'visible', timeout: 15000 });
const message = await toast.textContent();
expect(message).toContain(TD.avva.messages.agentSavedSuccess);
```

### Pattern 4: Dynamic Lists
```javascript
// Agent lists, test case lists load dynamically
await page.waitForLoadState('networkidle');
const listItems = page.locator('[data-testid="agent-list-item"]');
await listItems.first().waitFor({ state: 'visible', timeout: 15000 });
```

---

## BANNED PRACTICES

### ❌ NEVER Do These:
1. Hardcode `https://int-ai.aava.ai/...` in specs
2. Use `waitForTimeout(3000)` instead of explicit waits
3. Assert inside page object methods
4. Write specs without `[Cxxx]` TestRail case ID
5. Omit `@avva` tag from AVVA test specs
6. Use raw selectors in specs (must go through locator files)
7. Create page objects that don't extend `BasePage`
8. Write test titles without the agent context (e.g., "Test 1" instead of "User creates agent")
9. Mix setup and assertions in the same test
10. Create multiple page object instances in one test

---

## OUTPUT FORMAT

When generating AVVA test code, output exactly three file blocks:

```javascript
// === FILE: src/web/pages/avva/locators/<feature>.locators.js ===
<locator file content>

// === FILE: src/web/pages/avva/<feature>.page.js ===
<page object file content>

// === FILE: src/web/tests/avva/avva-<feature>.spec.js ===
<spec file content>
```

Each block must:
- Start with `// === FILE: <path> ===`
- Be complete and runnable (no `...` or `TODO` placeholders)
- Follow all conventions from `framework.md`
- Include JSDoc comments
- Use test data from `test-data-avva.js`

---

## ERROR HANDLING

### If Application is Unavailable:
- State clearly: "AVVA application at <URL> is unavailable"
- Generate best-effort code with `TODO:` markers for unconfirmed selectors
- Recommend: "Run Phase 4 live inspection when application is accessible"

### If Context Files are Missing:
- State which context files are missing
- Proceed with generic Playwright patterns
- Recommend: "Create context files before generating production test code"

### If TestRail is Unavailable:
- Generate tests with `[C0]` placeholder IDs
- Note: "TestRail case IDs will be assigned in Phase 3 when TestRail is accessible"

---

## QUALITY GATES

Before saving any AVVA test file, verify:

- [ ] File paths match AVVA structure (`src/web/pages/avva/`, `src/web/tests/avva/`)
- [ ] All selectors use `.first()` in locator files
- [ ] Page objects extend `BasePage`
- [ ] Test titles include `[Cxxx]` case ID
- [ ] Tests tagged with `@avva` + `@smoke` or `@regression`
- [ ] All assertions use `TD.avva.*` constants
- [ ] No `console.log`, `debugger`, or debug code
- [ ] No `waitForTimeout()` calls
- [ ] JSDoc comments on all page object methods
- [ ] Three separate file blocks with `// === FILE: ... ===` headers

---

## TRACEABILITY

Every AVVA test must maintain this traceability chain:

```
Jira Story (AVVA-XX)
    ↓ jira/get_issue
Acceptance Criteria (AC1, AC2, ...)
    ↓ Phase 3.1
TestRail Cases (C123, C124, ...)
    ↓ Phase 3.3
Playwright Spec Title ([C123] Test Case 1: ...)
    ↓ Phase 8
TestRail Results (pass/fail)
    ↓ Phase 3.4
Jira Story Comment (updated with case IDs and results)
```

TestRail case IDs are the **single source of truth** for traceability.

---

## EXAMPLE: COMPLETE TEST GENERATION

**Input:** "Generate smoke test for AVVA Agent Builder: User creates agent with minimal config"

**Output:**

```javascript
// === FILE: src/web/pages/avva/locators/agent-builder.locators.js ===
const locators = {
  agentCanvas: (page) => page.locator('[data-testid="agent-canvas"]').first(),
  agentNameInput: (page) => page.locator('[data-testid="agent-name-input"]').first(),
  saveAgentBtn: (page) => page.locator('[data-testid="save-agent"]').first(),
  successToast: (page) => page.locator('[data-testid="success-toast"]').first(),
};
module.exports = locators;

// === FILE: src/web/pages/avva/agent-builder.page.js ===
const BasePage = require('../base.page');
const loc = require('./locators/agent-builder.locators');

const URL = 'https://int-ai.aava.ai/launchpad/build/agent';

class AgentBuilderPage extends BasePage {
  async goto() {
    await super.goto(URL);
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async enterAgentName(name) {
    await loc.agentNameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.agentNameInput(this.page).fill(name);
  }

  async clickSave() {
    await loc.saveAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.saveAgentBtn(this.page).click();
  }

  async getSuccessMessage() {
    await loc.successToast(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.successToast(this.page).textContent();
  }
}
module.exports = AgentBuilderPage;

// === FILE: src/web/tests/avva/avva-agent-builder-smoke.spec.js ===
const { test, expect } = require('../../../shared/fixtures');
const AgentBuilderPage = require('../../pages/avva/agent-builder.page');
const TD = require('../../../shared/data/test-data-avva');

test.describe('[UI] AVVA Agent Builder Smoke', { tag: ['@smoke', '@avva'] }, () => {
  let agentPage;

  test.beforeEach(async ({ page }) => {
    agentPage = new AgentBuilderPage(page);
    await agentPage.goto();
  });

  test('[C123] Test Case 1: User creates agent with minimal config', async ({ page }) => {
    // Arrange
    const agentName = `Test Agent ${Date.now()}`;

    // Act
    await agentPage.enterAgentName(agentName);
    await agentPage.clickSave();

    // Assert
    const successMsg = await agentPage.getSuccessMessage();
    expect(successMsg).toContain(TD.avva.messages.agentSavedSuccess);
  });
});
```

---

## FINAL REMINDER

**Every AVVA test must:**
1. Load context files (Phase 1)
2. Audit existing assets (Phase 2)
3. Create TestRail cases (Phase 3)
4. Inspect live app (Phase 4)
5. Follow POM pattern (Phase 6)
6. Pass quality gates (Phase 7)
7. Verify with test runner (Phase 8)

**No exceptions. No shortcuts.**
