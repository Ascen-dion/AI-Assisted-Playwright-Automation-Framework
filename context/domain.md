# Domain Knowledge — E-Commerce Business Rules

## Business Domain
This is a consumer-facing e-commerce store ("E-Shop") selling physical products online.

## Core Business Concepts

### Product Catalogue
- Products are listed on the /products page
- Each product has: name, price, image, "Add to Cart" action
- Products load asynchronously — data is fetched from an API on page load
- Test must wait for products to be visible before interacting

### Shopping Cart
- Cart is session-based (no login required in current implementation)
- Cart count in navigation updates when items are added
- Empty cart state: "Your cart is empty" with prompt to add products
- Cart integrity: quantity × unit price must equal line total

### Pricing and Commerce Rules
- Free shipping threshold: orders over $50
- Payment: described as "100% secure transactions"
- Returns: 30-day return policy
- Tests that involve pricing MUST validate: displayed price matches expected value, not just that a price is visible

### Checkout Flow (to be validated when implemented)
- Cart → Review → Payment → Confirmation
- Each step must be idempotent — re-running the test should not double-charge or duplicate orders
- Use isolated test data (unique users/sessions) to avoid shared-state flakiness

## Test Data Rules
- Do not use shared test accounts — isolate per test run where possible
- If test data creates state (e.g. adds to cart), clean up after or use a fresh session
- Price and quantity assertions must use exact values, not regex patterns

## Edge Cases to Cover
- Empty cart state — verify messaging and call-to-action
- Products loading state — do not assert before async data resolves
- Cold start delays on Azure hosting — use generous timeouts
- Navigation between pages — SPA routing means URL changes without full reload
- Cart count badge — must update immediately after add without page refresh

## Acceptance Criteria Patterns
When a Jira story says "verify X is visible" — test both isVisible AND position (above fold)
When a Jira story says "verify X text" — assert exact text content, not partial
When a Jira story says "verify navigation" — test all nav links are present and clickable
When a Jira story says "verify page loads" — test URL, title, and at least one key element

## Quality Expectations
- Smoke tests: cover homepage, navigation, products page load, cart empty state
- Regression tests: cover add-to-cart, cart total, feature card content
- All tests must pass in headed and headless Chromium
- Flaky tests should be triaged and healed within one sprint
