# Domain Knowledge - StarHub Personal Mobile Purchase

## Business Domain

StarHub is a telecommunications provider where users browse devices and plans, then begin purchase flows that require account authentication before checkout.

## Core Domain Model

### Entities

- Customer (anonymous or authenticated)
- Device (example in scope: Samsung Galaxy A57 5G)
- Device configuration (colour, storage, payment tenure)
- Purchase session (state before checkout)
- Authentication gate (login/sign-up modal)

### Primary Journey in Scope

1. Browse devices from Personal homepage
2. Open mobile device listing (All Phones)
3. Select target device (exact model)
4. Verify default configuration values on PDP
5. Attempt progression via Next
6. Enforce login/sign-up gate for unauthenticated user

## Business Rules for In-Scope ACs

### Rule 1: Listing Reachability

- User must be able to navigate from personal homepage to Mobile > All Phones.
- Success state is listing page visibility with a non-empty count.

### Rule 2: Exact Device Selection

- Device selection must target Samsung Galaxy A57 5G exactly.
- Success state is navigation to model-specific PDP.

### Rule 3: Default Configuration Contract

- PDP must expose default selected values for:
  - Colour
  - Storage
  - Payment tenure
- In current live behavior, default colour is Awesome Navy.
- Storage default is 256GB.
- Payment default is 24-month.

### Rule 4: Progression to Next Step

- Clicking Next should advance purchase intent state.
- For unauthenticated users, this transition is represented by auth gate popup appearance.

### Rule 5: Authentication Gate Requirements

Popup must contain:

- Message: Please log in or create an account to continue with your purchase
- Action button: Log in with Hub ID
- Action button/link: Don't have an account? Sign up here

## Domain Assertions and Source of Truth

All test assertions must be sourced from src/data/test-data.js.

Required keys for this journey:

- TD.urlPatterns.allPhones
- TD.urlPatterns.galaxyA57
- TD.deviceListing.itemCountRegex
- TD.galaxyA57.defaultColour
- TD.galaxyA57.defaultStorage
- TD.galaxyA57.defaultPaymentPeriod
- TD.authPopup.message
- TD.authPopup.loginButtonText
- TD.authPopup.signUpButtonText

## AC to Validation Mapping

### AC1

- Validate navigation to listing URL pattern
- Validate listing heading visible
- Validate item count regex match

### AC2

- Validate click on exact model card
- Validate PDP URL pattern
- Validate device title/breadcrumb visible

### AC3

- Validate default colour label/value visible
- Validate storage label/value visible
- Validate payment tenure value visible and active

### AC4

- Validate Next button is interactable
- Validate post-click transition represented by popup visibility

### AC5

- Validate popup container visible
- Validate popup message exact content
- Validate login and sign-up actions visible

## Known Business Variance

- Requirement text may state default colour Black.
- Live site and existing test data currently show Awesome Navy.
- Automation should record this variance and assert against current approved source in test-data unless business confirms change.

## Non-Functional Domain Constraints

- Commerce pages are async and hydration-heavy.
- Assertion timing must be resilient (explicit waits over static delays).
- Tests must remain independent and should not rely on execution order.

## Quality and Traceability Standards

- One test case per acceptance criterion.
- Every automated test title carries [Cxxx] TestRail case ID.
- TestRail case definitions include preconditions, numbered steps, and concrete expected outcomes.
- Jira reference is attached to TestRail via refs field (JIRA_REF or per-case jiraRef).
