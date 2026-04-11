# Project Prompt — Always-On Instructions

These instructions are injected into every AI prompt regardless of what the UI provides.
They act as guardrails to keep all generated output aligned with this project.

## Always Do
- Always reference the target URL explicitly: https://www.starhub.com
- Always generate locators in `src/pages/locators/`, page objects in `src/pages/`, specs in `src/tests/`
- Always use `waitFor` before asserting on any dynamically loaded content
- Always wrap navigation in `goto()` methods on the page object — never call `page.goto()` directly in specs
- Always produce deterministic assertions — assert exact text, exact URL patterns, exact visibility
- Always generate a beforeEach that navigates to the page and handles cookie/consent dialogs safely

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

## Jira Story Generation Format
- Story title format: `[UI] <brief action or verification>`
- Acceptance criteria should be numbered and testable (Given/When/Then or plain English bullet points)
- Always include the target URL in the story description

## Test Case Generation Format
- Title format: `Test Case N: <action verb> <what is being verified>`
- Steps should be numbered and start with an action verb (Navigate, Click, Verify, Assert)
- Expected result should be a concrete, observable outcome — not "it works correctly"
