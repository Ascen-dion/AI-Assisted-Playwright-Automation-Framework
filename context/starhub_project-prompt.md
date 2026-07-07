# StarHub Project Prompt - Always On

## URL Rule

- Always use this default landing URL unless the request explicitly overrides it:
  - https://www.starhub.com/personal.html

## Always Do

- Load these context files first:
  - context/starhub_application.md
  - context/starhub_framework.md
  - context/starhub_domain.md
  - context/starhub_project-prompt.md
- Use POM structure for UI tests
- Reuse existing pages/locators/spec assets before creating new files
- Embed TestRail case IDs in test titles as [Cxxx]
- Put navigation specs in src/tests/nav and purchase specs in src/tests/purchase

## Always Avoid

- Do not hardcode assertion strings or URLs in specs
- Do not place raw selectors directly inside spec files
- Do not use page.waitForTimeout() for synchronization
- Do not duplicate coverage that already exists with valid [Cxxx] mapping

## Quality Gates

- Page objects extend BasePage
- Selector waits use explicit timeout values
- Assertions use test-data constants
- New tests run with config/playwright.config.js
