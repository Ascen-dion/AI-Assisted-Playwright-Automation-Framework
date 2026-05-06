# Project Prompt — Always-On Instructions (Mobile)

These instructions are injected into every mobile agent session regardless of what the user provides.
They act as guardrails to keep all generated output aligned with this project's mobile automation standards.

---

## Always Do

- Always read `context/mobile/application.md` first to get the `bundleId`, platform, screen inventory, and known selectors
- Always read `context/mobile/framework.md` for file naming conventions, POM structure, and selector priority rules
- Always read `context/mobile/domain.md` for business rules and meaningful assertion values
- Always generate locators in `mobile/pages/locators/`, page objects in `mobile/pages/`
- Always place specs in `mobile/tests/<appName>-<feature>.spec.js`
- Always use `waitFor({ state: 'visible', timeout: TD.timeouts.<key> })` before asserting on any dynamically loaded element
- Always wrap screen navigation in a `goto()` method on the page object — never call `device.launchApp()` directly in specs
- Always produce deterministic assertions — use `TD.*` values from `mobile/data/<appName>-test-data.js` for all assertion strings
- Always verify every selector against the live accessibility tree using `mobile_list_elements_on_screen` before writing a locator file
- Always embed a `[Cxxx]` TestRail case ID in every test title before writing any spec
- Always add `test.use({ platform: TD.app.platform, bundleId: TD.app.bundleId })` at the top level of every spec file
- Always set `test.setTimeout(TD.timeouts.appLaunch + 10000)` at the `describe` level

---

## Always Avoid

- Never generate placeholder text like "TODO", "your selector here", or "implement this"
- Never use hardcoded wait times (`sleep`, fixed `setTimeout`) — use `waitFor` with explicit conditions
- Never put raw selector strings directly inside spec files — all selectors go through page object methods
- Never generate tests that depend on execution order or share mutable state
- Never assert on loading spinners or intermediate states — wait for them to resolve first
- Never use positional or index-based selectors as primary locators
- Never hardcode `bundleId`, screen labels, or timeout values directly in specs — they all come from `TD.*`
- Never re-implement `launch()`, `close()`, or `dismissSignInPrompt()` in a subclass — they are inherited from the base page

---

## Code Generation Format

- Always output three separate code blocks: locators file, page object file, spec file
- Each block must start with `// === FILE: <relative-path> ===` as the first line
- Use CommonJS (`require` / `module.exports`) — this project does not use ES modules
- Use 2-space indentation throughout
- Test data: all assertion strings and timeout values must reference `const TD = require('../data/<appName>-test-data')` — never hardcode them inline
- Tags: add `@smoke` to launch and visibility tests; `@regression` to full interaction journeys

---

## Jira Story Generation Format

- Story title format: `[Mobile] <brief action or verification>`
- Acceptance criteria should be numbered and testable (Given/When/Then or plain English bullet points)
- Always include the `bundleId` and target screen in the story description

---

## Test Case Generation Format

- Title format: `Test Case N: <action verb> <what is being verified>`
- Steps should be numbered and start with an action verb (Launch, Tap, Type, Swipe, Verify, Assert)
- Expected result must be a concrete, observable outcome (visible element, text value, screen state) — never "it works correctly"
- Preconditions must state: device online, app installed, and which screen the test starts from

- Always generate locators in `src/pages/locators/`, page objects in `src/pages/`
- Place specs in the correct subdirectory: `src/tests/nav/` for navigation/smoke, `src/tests/application/` for application journeys
- Always use `waitFor` before asserting on any dynamically loaded content
- Always wrap navigation in `goto()` methods on the page object — never call `page.goto()` directly in specs
- Always produce deterministic assertions — use `TD.*` values from `src/data/test-data.js` for all assertion strings, URLs, and regex patterns
- Always generate a beforeEach that navigates to the page; include a try/catch for cookie consent (`I understand` button) as a safety net
- Always embed a `[Cxxx]` TestRail case ID in every test title before writing any spec

## Always Avoid
- Never generate placeholder text like "TODO", "your selector here", or "implement this"
- Never use `page.waitForTimeout()` as a substitute for proper `waitFor` conditions
- Never put raw CSS selectors or locator strings directly inside spec files
- Never generate tests that depend on test execution order
- Never assert on loading spinners or intermediate states — wait for them to resolve first
- Never generate tests that share mutable state between test cases

## Code Generation Format
- Always output three separate code blocks: locators file, page object file, spec file
- Each block must start with `// === FILE: <relative-path> ===` as the first line
- Use CommonJS (`require`/`module.exports`) — this project does not use ES modules
- Use 2-space indentation throughout
- Spec imports: use `require('../../shared/fixtures')` (not `@mobilewright/test`) for new specs to enable self-healing
- Test data: all assertion strings/URLs must reference `const TD = require('../../shared/data/golfgalaxy-test-data')` — never hardcode them inline
- Tags: add `{ tag: ['@smoke', '@regression'] }` to nav specs; `{ tag: ['@regression'] }` to application/journey specs

## Jira Story Generation Format
- Story title format: `[UI] <brief action or verification>`
- Acceptance criteria should be numbered and testable (Given/When/Then or plain English bullet points)
- Always include the target URL in the story description

## Test Case Generation Format
- Title format: `Test Case N: <action verb> <what is being verified>`
- Steps should be numbered and start with an action verb (Navigate, Click, Verify, Assert)
- Expected result should be a concrete, observable outcome — not "it works correctly"

