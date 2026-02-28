# SauceDemo E-Commerce Test Plan

## Application Overview

SauceDemo is an e-commerce testing application that provides a complete shopping experience. The application allows users to login, browse products, add items to cart, proceed through a multi-step checkout process, and receive order confirmation. The application includes features for inventory management, cart management, user authentication, and order processing with validation at each step.

## Test Scenarios

### 1. Authentication Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 1.1. Successful Login with Standard User

**File:** `tests/authentication/standard-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: The login page should load with username, password fields, and login button visible
  2. Enter 'standard_user' in the username field
    - expect: Username field should accept and display the entered text
  3. Enter 'secret_sauce' in the password field
    - expect: Password field should accept the entered text (masked)
  4. Click the Login button
    - expect: User should be redirected to inventory page
    - expect: URL should change to /inventory.html
    - expect: Products page should display with product listings

#### 1.2. Invalid Login Attempts

**File:** `tests/authentication/invalid-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: The login page should load successfully
  2. Enter invalid username 'invalid_user' and valid password 'secret_sauce'
    - expect: Error message should be displayed
    - expect: User should remain on login page
  3. Clear fields and enter valid username 'standard_user' and invalid password 'wrong_password'
    - expect: Error message should be displayed
    - expect: User should remain on login page
  4. Clear fields and leave both username and password empty, then click Login
    - expect: Error message should be displayed for required fields
    - expect: User should remain on login page

#### 1.3. Login with Different User Types

**File:** `tests/authentication/multiple-user-types.spec.ts`

**Steps:**
  1. Test login with 'locked_out_user' and 'secret_sauce'
    - expect: Error message should indicate user is locked out
    - expect: User should remain on login page
  2. Test login with 'problem_user' and 'secret_sauce'
    - expect: Login should succeed but application may exhibit problem behaviors
    - expect: User should reach inventory page
  3. Test login with 'performance_glitch_user' and 'secret_sauce'
    - expect: Login should succeed with potential performance delays
    - expect: User should reach inventory page

### 2. Product Inventory Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 2.1. Product Listing Display

**File:** `tests/inventory/product-display.spec.ts`

**Steps:**
  1. Login with standard_user and navigate to inventory page
    - expect: All 6 products should be displayed
    - expect: Each product should show image, name, description, price
    - expect: Products should be sorted A-Z by default
  2. Verify all product information is correct
    - expect: Sauce Labs Backpack: $29.99
    - expect: Sauce Labs Bike Light: $9.99
    - expect: Sauce Labs Bolt T-Shirt: $15.99
    - expect: Sauce Labs Fleece Jacket: $49.99
    - expect: Sauce Labs Onesie: $7.99
    - expect: Test.allTheThings() T-Shirt (Red): $15.99
  3. Click on product names and images to verify they are interactive links
    - expect: Product names should be clickable links
    - expect: Clicking should navigate to product detail (if available) or remain functional

#### 2.2. Product Sorting Functionality

**File:** `tests/inventory/product-sorting.spec.ts`

**Steps:**
  1. Login and access inventory page
    - expect: Products should be displayed in default Name (A to Z) order
  2. Select 'Name (Z to A)' from sorting dropdown
    - expect: Products should be reordered from Z to A
    - expect: Test.allTheThings() T-Shirt should appear first
    - expect: Sauce Labs Backpack should appear last
  3. Select 'Price (low to high)' from sorting dropdown
    - expect: Products should be ordered by ascending price
    - expect: Sauce Labs Onesie ($7.99) should appear first
    - expect: Sauce Labs Fleece Jacket ($49.99) should appear last
  4. Select 'Price (high to low)' from sorting dropdown
    - expect: Products should be ordered by descending price
    - expect: Sauce Labs Fleece Jacket ($49.99) should appear first
    - expect: Sauce Labs Onesie ($7.99) should appear last

### 3. Shopping Cart Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 3.1. Add Single Item to Cart

**File:** `tests/cart/add-single-item.spec.ts`

**Steps:**
  1. Login and navigate to inventory page
    - expect: Inventory page should load with all products visible
    - expect: Cart should be empty (no badge visible)
  2. Click 'Add to cart' button for Sauce Labs Backpack
    - expect: Button text changes from 'Add to cart' to 'Remove'
    - expect: Cart badge displays '1'
    - expect: Item is successfully added to cart
  3. Click on cart icon to view cart contents
    - expect: Cart page should display with 1 item
    - expect: Sauce Labs Backpack should be listed with correct price $29.99
    - expect: Quantity should show 1
    - expect: Remove button should be available

#### 3.2. Add Multiple Items to Cart

**File:** `tests/cart/add-multiple-items.spec.ts`

**Steps:**
  1. Login and navigate to inventory page
    - expect: Inventory page should load successfully
  2. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to cart
    - expect: Both 'Add to cart' buttons should change to 'Remove'
    - expect: Cart badge should show '2'
    - expect: Items should be successfully added
  3. Add Sauce Labs Bolt T-Shirt ($15.99) to cart
    - expect: Cart badge should update to '3'
    - expect: All three items should be in cart
  4. Navigate to cart page
    - expect: All 3 items should be listed
    - expect: Total quantity should be 3
    - expect: Each item should show correct price and description

#### 3.3. Remove Items from Cart

**File:** `tests/cart/remove-items.spec.ts`

**Steps:**
  1. Login, add 2 items to cart (Backpack and Bike Light)
    - expect: Cart should show 2 items
    - expect: Cart badge should display '2'
  2. From inventory page, click 'Remove' button for Backpack
    - expect: Button changes from 'Remove' to 'Add to cart'
    - expect: Cart badge updates to '1'
    - expect: Item is removed from cart
  3. Navigate to cart page and click 'Remove' for remaining item
    - expect: Item should be removed from cart
    - expect: Cart should be empty
    - expect: Cart badge should disappear or show 0
  4. Verify cart is completely empty
    - expect: Cart page should show no items
    - expect: Continue Shopping and Checkout buttons should still be available

#### 3.4. Cart Navigation and Continue Shopping

**File:** `tests/cart/cart-navigation.spec.ts`

**Steps:**
  1. Login, add items to cart, and navigate to cart page
    - expect: Cart page should display with added items
  2. Click 'Continue Shopping' button
    - expect: User should be redirected back to inventory page
    - expect: Cart badge should maintain item count
    - expect: Selected items should still show 'Remove' buttons
  3. Navigate back to cart using cart icon
    - expect: Cart should retain all previously added items
    - expect: All item details should be preserved

### 4. Checkout Process Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 4.1. Complete Checkout Flow - Happy Path

**File:** `tests/checkout/complete-checkout-flow.spec.ts`

**Steps:**
  1. Login, add 2 items to cart (Backpack $29.99, Bike Light $9.99), navigate to cart
    - expect: Cart should show 2 items correctly
    - expect: Total should calculate to $39.98 before tax
  2. Click 'Checkout' button from cart page
    - expect: User should be redirected to checkout step 1
    - expect: URL should be /checkout-step-one.html
    - expect: Form should display with First Name, Last Name, Zip/Postal Code fields
  3. Fill out checkout information: First Name 'John', Last Name 'Doe', Zip Code '12345'
    - expect: All fields should accept input
    - expect: No validation errors should appear
  4. Click 'Continue' button
    - expect: User should proceed to checkout overview page
    - expect: URL should be /checkout-step-two.html
    - expect: Order summary should be displayed
  5. Verify checkout overview information
    - expect: Both items should be listed with correct quantities and prices
    - expect: Payment info should show 'SauceCard #31337'
    - expect: Shipping should show 'Free Pony Express Delivery!'
    - expect: Item total should be $39.98
    - expect: Tax should be calculated ($3.20)
    - expect: Total should be $43.18
  6. Click 'Finish' button to complete order
    - expect: User should reach order confirmation page
    - expect: URL should be /checkout-complete.html
    - expect: 'Thank you for your order!' message should be displayed
    - expect: Pony Express image should be visible
    - expect: Order dispatch message should be shown

#### 4.2. Checkout Information Validation

**File:** `tests/checkout/checkout-validation.spec.ts`

**Steps:**
  1. Login, add items to cart, proceed to checkout step 1
    - expect: Checkout information form should be displayed
  2. Leave all fields empty and click 'Continue'
    - expect: Validation error should be displayed
    - expect: User should remain on checkout step 1
    - expect: Form should not proceed
  3. Fill only First Name 'John' and click 'Continue'
    - expect: Validation error should indicate missing Last Name and Zip Code
    - expect: User should remain on current step
  4. Fill First Name 'John' and Last Name 'Doe', leave Zip Code empty
    - expect: Validation error should indicate missing Zip Code
    - expect: User should not proceed
  5. Fill all required fields with valid data
    - expect: Form should validate successfully
    - expect: User should proceed to checkout overview

#### 4.3. Checkout Navigation and Cancel Options

**File:** `tests/checkout/checkout-navigation.spec.ts`

**Steps:**
  1. Login, add items, proceed to checkout step 1
    - expect: Checkout step 1 should load with form fields and navigation buttons
  2. Click 'Cancel' button from checkout step 1
    - expect: User should be redirected back to cart page
    - expect: Items should still be in cart
    - expect: Cart state should be preserved
  3. Proceed to checkout step 2 (overview page)
    - expect: Overview page should display order summary
  4. Click 'Cancel' button from overview page
    - expect: User should be redirected back to cart page
    - expect: Order should not be placed
    - expect: Cart items should be preserved
  5. Complete checkout process and reach confirmation page
    - expect: Order confirmation should be displayed
  6. Click 'Back Home' button from confirmation page
    - expect: User should be redirected to inventory page
    - expect: Cart should be empty (order completed)
    - expect: User can start new shopping session

#### 4.4. Empty Cart Checkout Attempt

**File:** `tests/checkout/empty-cart-checkout.spec.ts`

**Steps:**
  1. Login to application and ensure cart is empty
    - expect: Cart should be empty with no items
    - expect: Cart badge should not be visible or show 0
  2. Navigate directly to cart page
    - expect: Cart page should show no items
    - expect: Checkout button should be visible but may be disabled
  3. Attempt to click 'Checkout' button with empty cart
    - expect: System should prevent checkout with empty cart OR
    - expect: Appropriate message should be displayed OR
    - expect: User should be redirected to add items first

### 5. Application Navigation Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 5.1. Side Menu Navigation

**File:** `tests/navigation/side-menu-navigation.spec.ts`

**Steps:**
  1. Login and navigate to any page in the application
    - expect: Hamburger menu button should be visible in header
  2. Click on hamburger menu button
    - expect: Side menu should slide in from left
    - expect: Menu should show: All Items, About, Logout, Reset App State options
    - expect: Close menu button should be visible
  3. Click 'All Items' from side menu
    - expect: User should be redirected to inventory page
    - expect: Menu should close automatically
    - expect: Current page should be inventory/products page
  4. Open menu and click 'About' option
    - expect: New tab/window should open to https://saucelabs.com/
    - expect: User should remain logged in to main application
  5. Open menu and click 'Reset App State'
    - expect: Application state should reset
    - expect: Cart should be cleared
    - expect: User should remain logged in
    - expect: Page should refresh to clean state

#### 5.2. Logout Functionality

**File:** `tests/navigation/logout-functionality.spec.ts`

**Steps:**
  1. Login and navigate to inventory page
    - expect: User should be successfully logged in and on inventory page
  2. Open side menu and click 'Logout'
    - expect: User should be logged out
    - expect: User should be redirected to login page
    - expect: Session should be terminated
  3. Attempt to navigate back to inventory page using browser back button
    - expect: User should be redirected to login page
    - expect: User should not be able to access protected pages
    - expect: Session should remain terminated
  4. Test direct URL access to protected pages after logout
    - expect: Accessing /inventory.html should redirect to login
    - expect: Accessing /cart.html should redirect to login
    - expect: All protected routes should require re-authentication

### 6. Edge Cases and Error Handling Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 6.1. Browser Navigation and State Management

**File:** `tests/edge-cases/browser-navigation.spec.ts`

**Steps:**
  1. Login, add items to cart, then use browser back button
    - expect: Application should handle back navigation gracefully
    - expect: Cart state should be preserved
    - expect: User should remain authenticated
  2. Navigate through checkout process, then use browser refresh
    - expect: Page should reload appropriately
    - expect: Form data might be lost (expected behavior)
    - expect: User should remain logged in
    - expect: Cart state should be preserved
  3. Navigate to cart page and use browser forward/back buttons
    - expect: Navigation should work correctly
    - expect: Application state should remain consistent
    - expect: Cart contents should be preserved

#### 6.2. Form Input Edge Cases

**File:** `tests/edge-cases/form-input-validation.spec.ts`

**Steps:**
  1. Test checkout form with special characters in name fields
    - expect: Form should handle special characters appropriately
    - expect: Names with apostrophes, hyphens should be accepted
    - expect: Form should validate or sanitize input appropriately
  2. Test checkout form with very long input strings
    - expect: Form should handle long strings gracefully
    - expect: Input should be limited to reasonable length OR
    - expect: System should truncate or show appropriate error
  3. Test checkout form with numeric-only names
    - expect: System should validate name fields appropriately
    - expect: Numeric names should be handled per business rules
  4. Test postal code with various international formats
    - expect: Postal code should accept various formats
    - expect: International postal codes should be valid
    - expect: Appropriate validation should be in place

#### 6.3. Application Performance and Load

**File:** `tests/edge-cases/performance-testing.spec.ts`

**Steps:**
  1. Login with 'performance_glitch_user' and observe response times
    - expect: Application should load but may be slower
    - expect: All functionality should remain working
    - expect: Response times should be measurable
  2. Add all 6 items to cart rapidly in succession
    - expect: All items should be added correctly
    - expect: Cart count should update accurately
    - expect: No items should be missed or double-counted
  3. Navigate rapidly between pages (inventory -> cart -> checkout)
    - expect: Navigation should be responsive
    - expect: State should be preserved correctly
    - expect: No data should be lost during rapid navigation

#### 6.4. URL Manipulation and Security

**File:** `tests/edge-cases/url-security.spec.ts`

**Steps:**
  1. Access protected URLs directly without logging in
    - expect: User should be redirected to login page
    - expect: Unauthorized access should be prevented
    - expect: Security should be maintained
  2. Manipulate URL parameters on checkout pages
    - expect: Application should handle invalid URLs gracefully
    - expect: User should be redirected appropriately
    - expect: No system errors should occur
  3. Test application with invalid/malformed URLs
    - expect: Application should show appropriate error pages
    - expect: User should be able to navigate back to valid pages
    - expect: System should remain stable

### 7. Cross-Browser and Accessibility Tests

**Seed:** `tests/saucedemo-seed.spec.ts`

#### 7.1. Responsive Design and Mobile Testing

**File:** `tests/accessibility/responsive-design.spec.ts`

**Steps:**
  1. Test application on mobile viewport sizes (320px, 768px, 1024px)
    - expect: Application should be responsive
    - expect: All functionality should remain accessible
    - expect: UI elements should resize appropriately
    - expect: Text should remain readable
  2. Test touch interactions on mobile devices
    - expect: Buttons should be large enough for touch
    - expect: Touch interactions should work correctly
    - expect: Scrolling should work smoothly
  3. Test application in different orientations (portrait/landscape)
    - expect: Layout should adapt to orientation changes
    - expect: All content should remain accessible
    - expect: Functionality should be preserved

#### 7.2. Keyboard Navigation and Accessibility

**File:** `tests/accessibility/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate through login form using only keyboard (Tab, Enter keys)
    - expect: All form elements should be reachable via keyboard
    - expect: Tab order should be logical
    - expect: Login should complete using keyboard only
  2. Navigate through product inventory using keyboard only
    - expect: Product buttons should be keyboard accessible
    - expect: Add to cart should work with keyboard
    - expect: Focus indicators should be visible
  3. Complete entire checkout process using only keyboard navigation
    - expect: All checkout steps should be keyboard accessible
    - expect: Form submission should work with Enter key
    - expect: All buttons should be reachable and functional
  4. Test side menu navigation with keyboard
    - expect: Menu should open with keyboard shortcuts
    - expect: All menu items should be keyboard accessible
    - expect: Menu should close with Escape key or appropriate navigation
