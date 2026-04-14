# Project Prompt — Always-On Instructions

These instructions are injected into every AI prompt regardless of what the UI provides.
They act as guardrails to keep all generated output aligned with this project.

## Always Do
- Always reference the target URL explicitly: https://www.starhub.com
- Always generate locators in `src/pages/locators/`, page objects in `src/pages/`
- Place specs in the correct subdirectory: `src/tests/nav/` for navigation/smoke, `src/tests/purchase/` for purchase journeys
- Always use `waitFor` before asserting on any dynamically loaded content
- Always wrap navigation in `goto()` methods on the page object — never call `page.goto()` directly in specs
- Always produce deterministic assertions — use `TD.*` values from `src/data/test-data.js` for all assertion strings, URLs, and regex patterns
- Always generate a beforeEach that navigates to the page; include a try/catch for cookies as a safety net (globalSetup handles primary dismissal)
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
- Spec imports: use `require('../../fixtures')` (not `@playwright/test`) for new specs to enable self-healing
- Test data: all assertion strings/URLs must reference `const TD = require('../../data/test-data')` — never hardcode them inline
- Tags: add `{ tag: ['@smoke', '@regression'] }` to nav specs; `{ tag: ['@regression'] }` to purchase/journey specs

## Jira Story Generation Format
- Story title format: `[UI] <brief action or verification>`
- Acceptance criteria should be numbered and testable (Given/When/Then or plain English bullet points)
- Always include the target URL in the story description

## Test Case Generation Format
- Title format: `Test Case N: <action verb> <what is being verified>`
- Steps should be numbered and start with an action verb (Navigate, Click, Verify, Assert)
- Expected result should be a concrete, observable outcome — not "it works correctly"
