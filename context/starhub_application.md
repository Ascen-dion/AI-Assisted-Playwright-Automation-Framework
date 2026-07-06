# Application Context - StarHub Personal Website

## Base Configuration

- Target URL: https://www.starhub.com/personal.html
- Base Domain: https://www.starhub.com
- Commerce Subdomain: https://consumer.starhub.com
- Application Type: Telecommunications storefront and account onboarding journey
- Primary Automation Scope: Navigation, device listing/PDP, and pre-checkout auth gate

## Primary Entry Point

- Landing page for tests: https://www.starhub.com/personal.html
- Cookie handling: dismissed by global setup and persisted to storage state
- Navigation model: top-nav tabs open mega-menus, then route to either marketing pages or commerce SPA pages

## Top-Level Navigation Tabs (Personal)

The homepage contains five high-value tabs used by current automation assets:

1. Mobile
2. Broadband
3. Entertainment
4. Lifestyle & Safety
5. Membership

Each tab expands a dropdown menu with link-driven routes.

## Critical Route Map for Existing Purchase Flow

- Home: https://www.starhub.com/personal.html
- All Phones listing: https://consumer.starhub.com/personal/store/mobile/devices
- Samsung Galaxy A57 5G PDP: https://consumer.starhub.com/personal/store/mobile/devices/samsung/galaxy-a57-5g

## Existing Automation Assets (Reuse-First)

- Page object: src/pages/starhub-mobile-purchase.page.js
- Locator file: src/pages/locators/starhub-mobile-purchase.locators.js
- Purchase spec: src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js
- Test data source: src/data/test-data.js

## Verified Purchase Journey

1. Open personal homepage
2. Open Mobile dropdown
3. Click All Phones
4. Select Samsung Galaxy A57 5G
5. Validate default configuration on PDP
6. Click Next
7. Validate login/sign-up popup for unauthenticated user

## Key UI Behaviors

### Listing Page

- Device cards render dynamically
- Heading expected: Mobile Devices
- Count text expected pattern: /\d+ items/

### Samsung Galaxy A57 PDP

- Default colour in live app: Awesome Navy
- Default storage: 256GB
- Default payment option: 24-month
- Next CTA exists and should trigger auth gate when user is logged out

### Auth Gate

- Popup expected after clicking Next on PDP
- Required actions visible in popup:
  - Log in with Hub ID
  - Don't have an account? Sign up here

## Loading and Synchronization Characteristics

- Consumer pages are React-heavy and may hold network connections
- Navigation should use domcontentloaded plus explicit element waits
- Avoid relying only on networkidle for success criteria
- Default element wait budget: 15000ms
- Default navigation timeout: 60000ms

## Selector Strategy Priority

1. data-testid or equivalent test attributes
2. ARIA role plus accessible name
3. Stable visible text
4. Stable CSS classes (only when above are unavailable)
5. Avoid XPath and brittle positional selectors where possible

## Stability Notes

- Some popups and overlays are timing-sensitive
- Device grids can hydrate late; assert after target card visibility
- Auth modal class names may vary by environment/state; prefer semantic locators when possible

## Environment and Execution Notes

- Browser baseline: Chromium projects in config/playwright.config.js
- Storage state: playwright/.auth/storageState.json
- Reporter pipeline includes TestRail reporter and logging reporter
- Test discovery root: src/tests

## Coverage Boundaries

This context intentionally focuses on:

- Personal homepage navigation
- Mobile > All Phones > Galaxy A57 purchase pre-auth flow

Out of scope for this context file:

- Full checkout post-login
- Payment gateway processing
- Account profile management journeys
