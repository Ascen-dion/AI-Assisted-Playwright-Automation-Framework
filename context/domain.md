# Domain Knowledge — Telecommunications E-commerce

## Business Domain
StarHub Singapore telecommunications provider offering mobile plans, devices, broadband, and entertainment services to personal and business customers.

## Core Business Concepts

### Device Sales Process
- **Device Selection**: Browse mobile devices by brand (Apple, Samsung, OPPO, etc.)
- **Configuration**: Select color, storage capacity, and payment terms
- **Payment Options**: 24-month installment (default), 12-month, or pay in full
- **Plan Integration**: Devices tied to mobile plan subscriptions
- **Authentication Required**: Login/account creation needed for purchase

### Product Catalog Structure
- **Devices**: Mobile phones, tablets, watches, accessories
- **Plans**: 5G Unlimited+ plans with different tiers (Core, Plus, Platinum)
- **Add-ons**: SmartSupport, DeviceDollars, Value-added services
- **Promotions**: New line bonuses, trade-in programs, pay-later discounts

### Pricing and Commercial Rules
- **Device Pricing**: Installment plans reduce upfront cost
- **Plan Integration**: Device discounts tied to plan tier selection
- **Promotional Offers**:
  - Up to $300 off with 5G Unlimited+ plans (Core & above)
  - New line/port-in bonuses up to $300
  - CIS customer discounts up to $250
  - DeviceDollars for existing customers
- **SmartSupport**: Optional $14.26/month with free first month

### Customer Journey Requirements
1. **Device Selection**: Must select specific model (e.g., Samsung Galaxy A57 5G)
2. **Configuration**: Color and storage selection required
3. **Payment Terms**: Choose installment period (24/12 months) or full payment
4. **Authentication**: Hub ID login or account creation mandatory
5. **Plan Selection**: Choose compatible mobile plan
6. **Checkout**: Complete purchase with selected options

### Business Validation Points
- **Device Availability**: Stock status and color/storage options
- **Price Calculations**: Installment amounts match retail price / months
- **Plan Compatibility**: Device works with selected plan tier
- **Promotional Eligibility**: Customer qualifies for advertised discounts
- **Authentication Flow**: Secure login/signup process completion

### Error States and Edge Cases
- **Out of Stock**: Alternative options suggested
- **Invalid Configuration**: Color/storage combination not available
- **Plan Conflicts**: Device not compatible with selected plan
- **Authentication Failures**: Login errors, account creation issues
- **Payment Failures**: Invalid payment methods or declined transactions

## Test Data Requirements
- **Device Models**: Focus on actively promoted devices (Galaxy A57 5G)
- **Test Accounts**: Valid Hub ID credentials for authenticated flows
- **Payment Methods**: Test payment instruments for checkout validation
- **Plan Configurations**: Various plan tiers for compatibility testing

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
