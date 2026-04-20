# Project Prompt — Capital One Workday QE (Always-On Instructions)

These instructions are injected into every AI prompt regardless of what the UI provides.
They act as guardrails to keep all generated output aligned with this Capital One Workday project.

## Always Do
- Always reference the Workday tenant URL from `TD.urls.*` or `process.env.WORKDAY_BASE_URL` — never hardcode the tenant URL
- Always generate locators in `src/pages/locators/workday-<area>.locators.js` using `data-automation-id` attributes
- Always place page objects in `src/pages/workday-<area>.page.js` extending `BasePage`
- Always place all specs under `src/tests/application/` (no `nav/` directory for Workday)
- Always use `waitFor({ state: 'visible', timeout: 15000 })` before asserting on Workday form fields
- Always call `waitForLoadState('networkidle', { timeout: 60000 })` after Workday page navigation
- Always wrap navigation in `gotoXxx()` methods on the page object — never call `page.goto()` directly in specs
- Always produce deterministic assertions — use `TD.*` values from `src/data/workday-test-data.js`
- Always include `[AAVA-TEST] <story-ref> <timestamp>` in memo/description fields for sandbox cleanup
- Always reverse test journal entries in the last test of each suite to keep the impl tenant clean
- Always embed a `[Cxxx]` TestRail case ID in every test title before writing any spec
- Always handle Workday typeaheads: fill → wait for `[data-automation-id="promptOption"]` → click

## Always Avoid
- Never generate placeholder text like "TODO", "your selector here", or "implement this"
- Never use `page.waitForTimeout()` as a substitute for proper `waitFor` conditions
- Never put raw `data-automation-id` strings directly inside spec files — go through page objects
- Never generate tests that depend on test execution order
- Never hardcode Workday credentials — always use `TD.credentials.username` / `TD.credentials.password`
- Never skip the sandbox cleanup step for tests that post journal entries
- Never assert on loading spinners or intermediate states — wait for them to resolve first
- Never generate tests that share mutable state between test cases

## Code Generation Format
- Always output three separate code blocks: locators file, page object file, spec file
- Each block must start with `// === FILE: <relative-path> ===` as the first line
- Use CommonJS (`require`/`module.exports`) — this project does not use ES modules
- Use 2-space indentation throughout
- Spec imports: use `require('../../fixtures')` (not `@playwright/test`) for new specs to enable self-healing
- Test data: all assertion strings/URLs must reference `const TD = require('../../data/test-data')` — never hardcode them inline
- Tags: add `{ tag: ['@smoke', '@regression'] }` to nav specs; `{ tag: ['@regression'] }` to application/journey specs

## Jira Story Generation Format
- Story title format: `[UI] <brief action or verification>`
- Acceptance criteria should be numbered and testable (Given/When/Then or plain English bullet points)
- Always include the target URL in the story description

## Test Case Generation Format
- Title format: `Test Case N: <action verb> <what is being verified>`
- Steps should be numbered and start with an action verb (Navigate, Click, Verify, Assert)
- Expected result should be a concrete, observable outcome — not "it works correctly"
