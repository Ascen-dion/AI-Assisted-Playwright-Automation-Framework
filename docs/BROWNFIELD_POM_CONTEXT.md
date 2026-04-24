# Brownfield POM Project Context — UnionDigital Bank Philippines

This branch is dedicated to automating the UnionDigital Bank Philippines website:

- Target app: https://uniondigitalbank.io/en
- UD Save product: https://uniondigitalbank.io/en/products-savings
- Automation style: Playwright + Page Object Model (POM)
- Goal: Deterministic test generation using project-specific context and reusable assets

## Knowledge Layers To Maintain

1. Application knowledge
- Main user journeys: homepage navigation, products dropdown (UD Save, UD Time Deposit), UD Save account page content, footer navigation
- Environment assumptions: production Next.js SPA site with dynamic content (cookie consent on first visit)
- Selector strategy: prefer role/text; nav items are `div` elements (not `<a>`) — use `getByText()`

2. Framework knowledge
- All generated tests should use POM (`src/pages`, `src/pages/locators`, `src/tests`)
- Never duplicate selector strings in specs
- Reuse common helper methods before creating new utilities

3. Domain knowledge
- BSP-regulated Philippine digital bank (PDIC insured)
- Page content is Taglish (mixed Tagalog/English) — assertions must match exact text
- Products are primarily accessed via the Products dropdown nav item
- Tests should validate page titles, headings, and visible text from TD.* test data

## Prompting Rules

- Always include target URL explicitly.
- Prioritize deterministic assertions over broad visual assumptions.
- If story details are incomplete, produce smoke-safe checks first, then deeper validations.
- Keep steps idempotent so reruns do not fail due to prior state.

## Reusable Artifacts

- Seed locators: `src/pages/locators/ud-homepage-nav.locators.js`
- Seed locators: `src/pages/locators/ud-products-nav.locators.js`
- Seed locators: `src/pages/locators/ud-save-nav.locators.js`
- Seed page object: `src/pages/ud-homepage-nav.page.js`
- Seed page object: `src/pages/ud-products-nav.page.js`
- Seed page object: `src/pages/ud-save-nav.page.js`
- Seed smoke specs: `src/tests/nav/` (place all navigation specs here)
