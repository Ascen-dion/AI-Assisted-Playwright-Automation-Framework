# Brownfield POM Project Context

This branch is dedicated to the brownfield e-commerce application:

- Target app: https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/
- Automation style: Playwright + Page Object Model (POM)
- Goal: Deterministic test generation using project-specific context and reusable assets

## Knowledge Layers To Maintain

1. Application knowledge
- Main user journeys: login, product discovery, cart, checkout
- Environment assumptions: lower and unstable environments are expected
- Selector strategy: prefer role/text/data-testid; fallback to stable CSS only

2. Framework knowledge
- All generated tests should use POM (`src/pages`, `src/pages/locators`, `src/tests`)
- Never duplicate selector strings in specs
- Reuse common helper methods before creating new utilities

3. Domain knowledge
- E-commerce flows must validate pricing/cart integrity and checkout outcomes
- Test data should isolate users/items to avoid flaky shared-state failures

## Prompting Rules

- Always include target URL explicitly.
- Prioritize deterministic assertions over broad visual assumptions.
- If story details are incomplete, produce smoke-safe checks first, then deeper validations.
- Keep steps idempotent so reruns do not fail due to prior state.

## Reusable Artifacts

- Seed locators: `src/pages/locators/ecomm-brownfield.locators.js`
- Seed page object: `src/pages/ecomm-brownfield.page.js`
- Seed smoke spec: `src/tests/ecomm-brownfield-smoke.spec.js`
