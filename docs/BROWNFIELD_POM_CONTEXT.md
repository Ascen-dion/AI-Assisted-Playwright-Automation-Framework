# Brownfield POM Project Context — StarHub

This branch is dedicated to automating the StarHub Singapore telecommunications website:

- Target app: https://www.starhub.com
- Store: https://consumer.starhub.com/personal/store
- Automation style: Playwright + Page Object Model (POM)
- Goal: Deterministic test generation using project-specific context and reusable assets

## Knowledge Layers To Maintain

1. Application knowledge
- Main user journeys: mobile device browsing, device selection, purchase flow, authentication
- Environment assumptions: production site with heavy JavaScript/API loading (3-5s page loads)
- Selector strategy: prefer role/text; avoid positional selectors unless required

2. Framework knowledge
- All generated tests should use POM (`src/pages`, `src/pages/locators`, `src/tests`)
- Never duplicate selector strings in specs
- Reuse common helper methods before creating new utilities

3. Domain knowledge
- Telecom e-commerce flows must validate device configuration defaults (colour, storage, payment)
- Authentication is required to proceed past device selection — popup validation is key
- Test data should isolate state per test case to avoid shared-state flakiness

## Prompting Rules

- Always include target URL explicitly.
- Prioritize deterministic assertions over broad visual assumptions.
- If story details are incomplete, produce smoke-safe checks first, then deeper validations.
- Keep steps idempotent so reruns do not fail due to prior state.

## Reusable Artifacts

- Seed locators: `src/pages/locators/starhub-mobile-purchase.locators.js`
- Seed page object: `src/pages/starhub-mobile-purchase.page.js`
- Seed smoke spec: `src/tests/starhub-mobile-purchase-automated.spec.js`
