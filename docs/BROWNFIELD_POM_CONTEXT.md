# Brownfield POM Project Context — OCBC Bank

This branch is dedicated to automating the OCBC Bank Singapore website:

- Target app: https://www.ocbc.com/group/gateway
- Personal Banking: https://www.ocbc.com/personal-banking
- Automation style: Playwright + Page Object Model (POM)
- Goal: Deterministic test generation using project-specific context and reusable assets

## Knowledge Layers To Maintain

1. Application knowledge
- Main user journeys: gateway navigation, product browsing (accounts, cards, loans, investments, insurance), application flows
- Environment assumptions: production site with dynamic rate tables and carousels (2-4s page loads)
- Selector strategy: prefer role/text; avoid positional selectors unless required

2. Framework knowledge
- All generated tests should use POM (`src/pages`, `src/pages/locators`, `src/tests`)
- Never duplicate selector strings in specs
- Reuse common helper methods before creating new utilities

3. Domain knowledge
- Banking product pages must validate rates, eligibility criteria, and product details
- Internet Banking login redirects to a separate domain (internet.ocbc.com) — do not follow in nav tests
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
