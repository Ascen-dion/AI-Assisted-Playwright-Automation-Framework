const { test, expect } = require('../../core/ai-test-runner');

/**
 * End-to-End Tests for SauceDemo E-Commerce Website
 * https://www.saucedemo.com/
 */

test.describe('SauceDemo - Authentication', () => {
  
  test('Should login successfully with valid credentials', async ({ aiPage }) => {
    await aiPage.navigateTo('https://www.saucedemo.com/');
    
    // Login with standard user
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    
    // Verify successful login
    await aiPage.waitForElement('products container');
    await aiPage.verifyElement('shopping cart icon');
    await aiPage.validatePageState('products page with inventory items displayed');
    
    // Take screenshot
    await aiPage.takeScreenshot('successful-login');
  });

  test('Should show error message for invalid credentials', async ({ aiPage }) => {
    await aiPage.navigateTo('https://www.saucedemo.com/');
    
    // Attempt login with invalid credentials
    await aiPage.fillField('username', 'invalid_user');
    await aiPage.fillField('password', 'wrong_password');
    await aiPage.clickElement('login button');
    
    // Verify error message is displayed
    await aiPage.verifyElement('error message');
    await aiPage.verifyText('error message', 'Username and password do not match');
  });

  test('Should show error when username is missing', async ({ aiPage }) => {
    await aiPage.navigateTo('https://www.saucedemo.com/');
    
    // Only fill password
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    
    // Verify error
    await aiPage.verifyElement('error message');
    await aiPage.verifyText('error message', 'Username is required');
  });

  test('Should show error when password is missing', async ({ aiPage }) => {
    await aiPage.navigateTo('https://www.saucedemo.com/');
    
    // Only fill username
    await aiPage.fillField('username', 'standard_user');
    await aiPage.clickElement('login button');
    
    // Verify error
    await aiPage.verifyElement('error message');
    await aiPage.verifyText('error message', 'Password is required');
  });
});

test.describe('SauceDemo - Product Browsing', () => {
  
  test.beforeEach(async ({ aiPage }) => {
    // Login before each test
    await aiPage.navigateTo('https://www.saucedemo.com/');
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    await aiPage.waitForElement('products container');
  });

  test('Should display all products on inventory page', async ({ aiPage }) => {
    // Verify products are displayed
    await aiPage.verifyElement('product items');
    await aiPage.validatePageState('inventory page showing multiple products');
    
    // Verify product details are visible
    await aiPage.verifyElement('product name');
    await aiPage.verifyElement('product price');
    await aiPage.verifyElement('product image');
    
    await aiPage.takeScreenshot('products-inventory');
  });

  test('Should sort products by price (low to high)', async ({ aiPage }) => {
    // Click on sort dropdown
    await aiPage.clickElement('product sort dropdown');
    
    // Select price low to high
    await aiPage.selectOption('product sort dropdown', 'Price (low to high)');
    
    // Verify sorting
    await aiPage.validatePageState('products sorted by price ascending');
    await aiPage.takeScreenshot('sorted-price-low-high');
  });

  test('Should sort products by price (high to low)', async ({ aiPage }) => {
    // Click on sort dropdown
    await aiPage.clickElement('product sort dropdown');
    
    // Select price high to low
    await aiPage.selectOption('product sort dropdown', 'Price (high to low)');
    
    // Verify sorting
    await aiPage.validatePageState('products sorted by price descending');
    await aiPage.takeScreenshot('sorted-price-high-low');
  });

  test('Should sort products by name (A to Z)', async ({ aiPage }) => {
    // Click on sort dropdown
    await aiPage.clickElement('product sort dropdown');
    
    // Select name A to Z
    await aiPage.selectOption('product sort dropdown', 'Name (A to Z)');
    
    // Verify sorting
    await aiPage.validatePageState('products sorted alphabetically');
  });

  test('Should view product details', async ({ aiPage }) => {
    // Click on first product
    await aiPage.clickElement('first product name');
    
    // Verify product details page
    await aiPage.verifyElement('product details container');
    await aiPage.verifyElement('product description');
    await aiPage.verifyElement('add to cart button');
    await aiPage.verifyElement('back to products button');
    
    await aiPage.takeScreenshot('product-details');
  });
});

test.describe('SauceDemo - Shopping Cart', () => {
  
  test.beforeEach(async ({ aiPage }) => {
    // Login before each test
    await aiPage.navigateTo('https://www.saucedemo.com/');
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    await aiPage.waitForElement('products container');
  });

  test('Should add single product to cart', async ({ aiPage }) => {
    // Add product to cart
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    
    // Verify cart badge shows 1
    await aiPage.verifyElement('shopping cart badge');
    await aiPage.verifyText('shopping cart badge', '1');
    
    // Verify button text changed to Remove
    await aiPage.verifyText('remove button for sauce labs backpack', 'Remove');
    
    await aiPage.takeScreenshot('single-item-added');
  });

  test('Should add multiple products to cart', async ({ aiPage }) => {
    // Add first product
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    
    // Add second product
    await aiPage.clickElement('add to cart button for sauce labs bike light');
    
    // Add third product
    await aiPage.clickElement('add to cart button for sauce labs bolt t-shirt');
    
    // Verify cart badge shows 3
    await aiPage.verifyText('shopping cart badge', '3');
    
    await aiPage.takeScreenshot('multiple-items-added');
  });

  test('Should remove product from cart on inventory page', async ({ aiPage }) => {
    // Add product
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    await aiPage.verifyText('shopping cart badge', '1');
    
    // Remove product
    await aiPage.clickElement('remove button for sauce labs backpack');
    
    // Verify badge is gone or shows 0
    await aiPage.validatePageState('cart is empty');
  });

  test('Should view cart contents', async ({ aiPage }) => {
    // Add products
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    await aiPage.clickElement('add to cart button for sauce labs bike light');
    
    // Click cart icon
    await aiPage.clickElement('shopping cart icon');
    
    // Verify cart page
    await aiPage.verifyElement('cart contents');
    await aiPage.verifyElement('cart item');
    await aiPage.verifyElement('continue shopping button');
    await aiPage.verifyElement('checkout button');
    
    await aiPage.takeScreenshot('cart-contents');
  });

  test('Should remove item from cart page', async ({ aiPage }) => {
    // Add product
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    
    // Go to cart
    await aiPage.clickElement('shopping cart icon');
    
    // Remove item
    await aiPage.clickElement('remove button');
    
    // Verify cart is empty
    await aiPage.validatePageState('empty cart with no items');
  });

  test('Should continue shopping from cart', async ({ aiPage }) => {
    // Add product and go to cart
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    await aiPage.clickElement('shopping cart icon');
    
    // Click continue shopping
    await aiPage.clickElement('continue shopping button');
    
    // Verify back on inventory page
    await aiPage.verifyElement('products container');
    await aiPage.validatePageState('inventory page with products');
  });
});

test.describe('SauceDemo - Checkout Flow', () => {
  
  test.beforeEach(async ({ aiPage }) => {
    // Login and add item to cart
    await aiPage.navigateTo('https://www.saucedemo.com/');
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    await aiPage.waitForElement('products container');
    await aiPage.clickElement('add to cart button for sauce labs backpack');
  });

  test('Should complete full checkout process', async ({ aiPage }) => {
    // Go to cart
    await aiPage.clickElement('shopping cart icon');
    
    // Proceed to checkout
    await aiPage.clickElement('checkout button');
    
    // Fill checkout information
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('last name', 'Doe');
    await aiPage.fillField('postal code', '12345');
    
    await aiPage.takeScreenshot('checkout-info-filled');
    
    // Continue
    await aiPage.clickElement('continue button');
    
    // Verify checkout overview
    await aiPage.verifyElement('checkout summary');
    await aiPage.verifyElement('payment information');
    await aiPage.verifyElement('shipping information');
    await aiPage.verifyElement('price total');
    
    await aiPage.takeScreenshot('checkout-overview');
    
    // Finish checkout
    await aiPage.clickElement('finish button');
    
    // Verify success
    await aiPage.verifyElement('checkout complete container');
    await aiPage.verifyText('complete header', 'Thank you for your order');
    await aiPage.validatePageState('order confirmation page with success message');
    
    await aiPage.takeScreenshot('order-complete');
  });

  test('Should show error when first name is missing', async ({ aiPage }) => {
    await aiPage.clickElement('shopping cart icon');
    await aiPage.clickElement('checkout button');
    
    // Fill only last name and zip
    await aiPage.fillField('last name', 'Doe');
    await aiPage.fillField('postal code', '12345');
    
    // Try to continue
    await aiPage.clickElement('continue button');
    
    // Verify error
    await aiPage.verifyElement('error message');
    await aiPage.verifyText('error message', 'First Name is required');
  });

  test('Should show error when last name is missing', async ({ aiPage }) => {
    await aiPage.clickElement('shopping cart icon');
    await aiPage.clickElement('checkout button');
    
    // Fill only first name and zip
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('postal code', '12345');
    
    // Try to continue
    await aiPage.clickElement('continue button');
    
    // Verify error
    await aiPage.verifyElement('error message');
    await aiPage.verifyText('error message', 'Last Name is required');
  });

  test('Should show error when postal code is missing', async ({ aiPage }) => {
    await aiPage.clickElement('shopping cart icon');
    await aiPage.clickElement('checkout button');
    
    // Fill only names
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('last name', 'Doe');
    
    // Try to continue
    await aiPage.clickElement('continue button');
    
    // Verify error
    await aiPage.verifyElement('error message');
    await aiPage.verifyText('error message', 'Postal Code is required');
  });

  test('Should cancel checkout from info page', async ({ aiPage }) => {
    await aiPage.clickElement('shopping cart icon');
    await aiPage.clickElement('checkout button');
    
    // Click cancel
    await aiPage.clickElement('cancel button');
    
    // Verify back on cart page
    await aiPage.verifyElement('cart contents');
  });

  test('Should cancel from checkout overview', async ({ aiPage }) => {
    await aiPage.clickElement('shopping cart icon');
    await aiPage.clickElement('checkout button');
    
    // Fill info and continue
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('last name', 'Doe');
    await aiPage.fillField('postal code', '12345');
    await aiPage.clickElement('continue button');
    
    // Cancel from overview
    await aiPage.clickElement('cancel button');
    
    // Verify back on inventory
    await aiPage.verifyElement('products container');
  });

  test('Should verify price calculation in checkout', async ({ aiPage }) => {
    // Add multiple items
    await aiPage.clickElement('add to cart button for sauce labs bike light');
    
    // Go to checkout
    await aiPage.clickElement('shopping cart icon');
    await aiPage.clickElement('checkout button');
    
    // Fill info
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('last name', 'Doe');
    await aiPage.fillField('postal code', '12345');
    await aiPage.clickElement('continue button');
    
    // Verify price elements
    await aiPage.verifyElement('subtotal');
    await aiPage.verifyElement('tax');
    await aiPage.verifyElement('total');
    
    await aiPage.takeScreenshot('price-breakdown');
  });
});

test.describe('SauceDemo - Navigation & Menu', () => {
  
  test.beforeEach(async ({ aiPage }) => {
    // Login before each test
    await aiPage.navigateTo('https://www.saucedemo.com/');
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    await aiPage.waitForElement('products container');
  });

  test('Should open and close sidebar menu', async ({ aiPage }) => {
    // Open menu
    await aiPage.clickElement('burger menu button');
    
    // Verify menu is open
    await aiPage.verifyElement('navigation menu');
    await aiPage.verifyElement('logout link');
    
    // Close menu
    await aiPage.clickElement('close menu button');
    
    await aiPage.takeScreenshot('menu-interaction');
  });

  test('Should navigate to About page', async ({ aiPage }) => {
    // Open menu
    await aiPage.clickElement('burger menu button');
    
    // Click About
    await aiPage.clickElement('about link');
    
    // Note: This will navigate to saucelabs.com
    await aiPage.takeScreenshot('about-navigation');
  });

  test('Should reset app state', async ({ aiPage }) => {
    // Add items to cart
    await aiPage.clickElement('add to cart button for sauce labs backpack');
    await aiPage.verifyText('shopping cart badge', '1');
    
    // Open menu and reset
    await aiPage.clickElement('burger menu button');
    await aiPage.clickElement('reset app state link');
    
    // Verify cart is cleared
    await aiPage.validatePageState('cart is empty after reset');
  });

  test('Should logout successfully', async ({ aiPage }) => {
    // Open menu
    await aiPage.clickElement('burger menu button');
    
    // Click logout
    await aiPage.clickElement('logout link');
    
    // Verify back on login page
    await aiPage.verifyElement('login button');
    await aiPage.verifyElement('username field');
    await aiPage.verifyElement('password field');
    
    await aiPage.takeScreenshot('logged-out');
  });
});

test.describe('SauceDemo - End-to-End User Journey', () => {
  
  test('Complete user journey: Browse -> Add to Cart -> Checkout -> Logout', async ({ aiPage }) => {
    // Step 1: Login
    await aiPage.navigateTo('https://www.saucedemo.com/');
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    await aiPage.waitForElement('products container');
    
    await aiPage.takeScreenshot('step-1-logged-in');
    
    // Step 2: Browse and sort products
    await aiPage.clickElement('product sort dropdown');
    await aiPage.selectOption('product sort dropdown', 'Price (low to high)');
    
    await aiPage.takeScreenshot('step-2-sorted-products');
    
    // Step 3: View product details
    await aiPage.clickElement('first product name');
    await aiPage.verifyElement('product details container');
    
    await aiPage.takeScreenshot('step-3-product-details');
    
    // Step 4: Add to cart from details page
    await aiPage.clickElement('add to cart button');
    
    // Step 5: Back to products
    await aiPage.clickElement('back to products button');
    
    // Step 6: Add more items
    await aiPage.clickElement('add to cart button for sauce labs bike light');
    await aiPage.clickElement('add to cart button for sauce labs bolt t-shirt');
    
    await aiPage.verifyText('shopping cart badge', '3');
    
    await aiPage.takeScreenshot('step-6-multiple-items');
    
    // Step 7: View cart
    await aiPage.clickElement('shopping cart icon');
    await aiPage.verifyElement('cart contents');
    
    await aiPage.takeScreenshot('step-7-cart-view');
    
    // Step 8: Proceed to checkout
    await aiPage.clickElement('checkout button');
    
    // Step 9: Fill checkout info
    await aiPage.fillField('first name', 'Jane');
    await aiPage.fillField('last name', 'Smith');
    await aiPage.fillField('postal code', '54321');
    
    await aiPage.takeScreenshot('step-9-checkout-info');
    
    await aiPage.clickElement('continue button');
    
    // Step 10: Review order
    await aiPage.verifyElement('checkout summary');
    
    await aiPage.takeScreenshot('step-10-order-review');
    
    // Step 11: Complete order
    await aiPage.clickElement('finish button');
    
    // Step 12: Verify success
    await aiPage.verifyElement('checkout complete container');
    await aiPage.verifyText('complete header', 'Thank you for your order');
    
    await aiPage.takeScreenshot('step-12-order-complete');
    
    // Step 13: Back to products
    await aiPage.clickElement('back to products button');
    
    // Step 14: Logout
    await aiPage.clickElement('burger menu button');
    await aiPage.clickElement('logout link');
    
    // Step 15: Verify logged out
    await aiPage.verifyElement('login button');
    
    await aiPage.takeScreenshot('step-15-logged-out');
  });
});
