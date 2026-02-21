# Facebook Login Page Verification Test Plan

## Application Overview

A single focused test case to verify that the Facebook login page at https://www.facebook.com loads correctly and all critical login-related UI elements are present and functional.

## Test Scenarios

### 1. Facebook Login Page Load and Element Verification

**Seed:** `seed.spec.ts`

#### 1.1. Verify Facebook login page loads with all critical elements

**File:** `tests/facebook-login-page.spec.ts`

**Steps:**
  1. Navigate to https://www.facebook.com
    - expect: Page loads successfully without errors
    - expect: Page URL is 'https://www.facebook.com/'
    - expect: Page title is 'Facebook'
  2. Verify the Facebook logo image is visible in the header area
    - expect: Facebook logo image element is rendered and visible on the page
  3. Verify the tagline text 'Explore the things you love.' is displayed
    - expect: Tagline text is visible below the logo, confirming the marketing section loaded
  4. Verify the login form heading 'Log in to Facebook' is visible
    - expect: The heading text 'Log in to Facebook' is displayed above the login form
  5. Verify the 'Email address or mobile number' text input field is visible and empty
    - expect: The email/phone textbox is visible
    - expect: The textbox is initially empty
    - expect: The textbox has accessible name 'Email address or mobile number'
  6. Verify the 'Password' text input field is visible and empty
    - expect: The password textbox is visible
    - expect: The textbox is initially empty
    - expect: The textbox has accessible name 'Password'
  7. Verify the 'Log in' button is visible and enabled
    - expect: The 'Log in' button is visible
    - expect: The button is clickable (cursor pointer)
  8. Verify the 'Forgotten password?' link is visible and has a valid href
    - expect: The 'Forgotten password?' link is visible
    - expect: The link points to the password recovery flow (/recover/initiate/)
  9. Verify the 'Create new account' link is visible and has a valid href
    - expect: The 'Create new account' link is visible
    - expect: The link points to the registration page (/reg/)
  10. Verify the Meta logo is displayed in the login section
    - expect: The 'Meta logo' image is visible, confirming branding is loaded
  11. Verify footer contains language options and legal links
    - expect: Language text 'English (UK)' is visible in the footer
    - expect: At least one regional language link is present (e.g. 'हिन्दी', 'मराठी')
    - expect: Footer links for 'Privacy Policy', 'Terms', 'Cookies', and 'Help' are visible
    - expect: Meta copyright text 'Meta © 2026' is visible
  12. Type a test email into the email field and verify the value is accepted
    - expect: The typed text appears in the email input field
    - expect: The field retains the entered value
  13. Type a test password into the password field and verify the value is accepted
    - expect: The typed text appears in the password input field (masked)
    - expect: The field retains the entered value
  14. Click the 'Log in' button with invalid credentials and verify an error response
    - expect: The page navigates or shows an error/validation message
    - expect: No unhandled JavaScript exceptions occur
    - expect: The login form handles invalid credentials gracefully
