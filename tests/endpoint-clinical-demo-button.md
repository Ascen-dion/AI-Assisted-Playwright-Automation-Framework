# Endpoint Clinical REQUEST DEMO Button Verification Test Plan

## Application Overview

A comprehensive test plan to verify the presence and functionality of the REQUEST DEMO button on the Endpoint Clinical homepage. This covers testing the button in multiple locations, accessibility, and user interaction flows.

## Test Scenarios

### 1. REQUEST DEMO Button Verification

**Seed:** `tests/endpoint-clinical-setup.spec.ts`

#### 1.1. Navigate to Homepage and Verify Page Load

**File:** `tests/endpoint-clinical-demo-button/homepage-navigation.spec.ts`

**Steps:**
  1. Navigate to https://www.endpointclinical.com/ and verify basic page elements load correctly
    - expect: The page should load successfully without errors
    - expect: The page title should contain 'Endpoint Clinical'
    - expect: The main navigation should be visible
    - expect: The hero section with 'Your hidden advantage in RTSM' should be displayed

#### 1.2. Verify REQUEST DEMO Button in Navigation

**File:** `tests/endpoint-clinical-demo-button/navigation-demo-button.spec.ts`

**Steps:**
  1. Locate and verify the REQUEST DEMO button in the top navigation bar
    - expect: The REQUEST DEMO button should be visible in the top navigation
    - expect: The button should be clickable and properly styled
    - expect: The button should have accessible text 'REQUEST DEMO'
    - expect: The button link should point to '/request-a-demo' endpoint

#### 1.3. Verify REQUEST DEMO Button in Main Content

**File:** `tests/endpoint-clinical-demo-button/content-demo-button.spec.ts`

**Steps:**
  1. Scroll to verify the Request a Demo button in the main content area
    - expect: The 'Request a Demo' button should be visible in the hero section
    - expect: The button should be clickable and properly styled
    - expect: The button should have accessible text 'Request a Demo'
    - expect: The button link should point to '/request-a-demo' endpoint

#### 1.4. Test REQUEST DEMO Button Functionality

**File:** `tests/endpoint-clinical-demo-button/demo-button-functionality.spec.ts`

**Steps:**
  1. Click the REQUEST DEMO button in navigation and verify navigation
    - expect: Clicking the navigation REQUEST DEMO button should navigate to the demo request page
    - expect: The destination page should load successfully
    - expect: The page should contain a demo request form or relevant content
  2. Navigate back and click the Request a Demo button in the main content area
    - expect: Clicking the content Request a Demo button should navigate to the demo request page
    - expect: Both buttons should lead to the same destination
    - expect: The page should be accessible and load without errors

#### 1.5. Handle Cookie Banner and Test Accessibility

**File:** `tests/endpoint-clinical-demo-button/accessibility-and-cookies.spec.ts`

**Steps:**
  1. Handle cookie banner interactions and verify button accessibility
    - expect: The cookie banner should be displayed on first visit
    - expect: The REQUEST DEMO buttons should still be accessible with cookie banner present
    - expect: After accepting/denying cookies, buttons should remain functional
  2. Test keyboard navigation and accessibility features of the REQUEST DEMO buttons
    - expect: REQUEST DEMO buttons should be keyboard navigable
    - expect: Buttons should have proper ARIA labels and roles
    - expect: Focus states should be visible and appropriate

#### 1.6. Cross-Browser and Responsive Testing

**File:** `tests/endpoint-clinical-demo-button/cross-browser-responsive.spec.ts`

**Steps:**
  1. Test REQUEST DEMO button visibility and functionality across different screen sizes and browsers
    - expect: REQUEST DEMO buttons should be visible and functional on desktop viewports (1920x1080, 1366x768)
    - expect: Buttons should adapt appropriately on tablet viewports (768x1024)
    - expect: Buttons should be accessible on mobile viewports (375x667, 414x896)
    - expect: Button styling and positioning should be consistent across viewports
