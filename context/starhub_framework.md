# Framework Knowledge - StarHub Brownfield Playwright

## Primary URL

- Default landing URL: https://www.starhub.com/personal.html

## Structure Rules

- Use Page Object Model for all UI tests
- Locators: src/pages/locators/<name>.locators.js
- Page objects: src/pages/<name>.page.js
- Specs:
  - Navigation tests: src/tests/nav/<name>-automated.spec.js
  - Purchase tests: src/tests/purchase/<name>-automated.spec.js

## Reuse-First Policy

- Reuse existing page objects and methods before adding new ones
- Reuse existing locator definitions where available
- Do not duplicate selector strings across files
- Extend existing files when they already model the same page or flow

## Assertions and Data

- Source all assertion values from src/data/test-data.js
- Do not hardcode URLs, labels, or regex values in specs

## Timeout and Stability

- Navigation timeout: 60000ms
- Element wait timeout: 15000ms
- Prefer explicit locator waits over fixed delays
- Do not use page.waitForTimeout() as synchronization

## Coding Conventions

- CommonJS only (require/module.exports)
- Keep assertions in specs, not in page objects
- Use descriptive test titles with TestRail prefix format: [Cxxx] Test Case N: ...
- Prefer fixtures import for new specs:
  - const { test, expect } = require('../../fixtures')

## Runtime and Reporting

- Use config/playwright.config.js when running tests
- TestRail reporter parses [Cxxx] from title and posts results automatically
- Logging reporter writes structured logs for failures and flake analysis
