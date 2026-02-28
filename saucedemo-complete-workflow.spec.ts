// spec: SauceDemo E-Commerce Test Plan
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('SauceDemo E-Commerce Test Plan', () => {

  test('Successful Login with Standard User', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    
    // Enter 'standard_user' in the username field
    await page.locator('[data-test="username"]').fill('standard_user');
    
    // Enter 'secret_sauce' in the password field
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // Click the Login button
    await page.locator('[data-test="login-button"]').click();
    
    // Validation: User should be redirected to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Validation: Products page should display with product listings
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('Add Single Item to Cart', async ({ page }) => {
    // Login first
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Click 'Add to cart' button for Sauce Labs Backpack
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Validation: Button text changes from 'Add to cart' to 'Remove'
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Validation: Cart badge displays '1'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Click on cart icon to view cart contents
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Validation: Cart page should display with 1 item
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
  });

  test('Complete Checkout Flow', async ({ page }) => {
    // Login first
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Add 2 items to cart (Backpack $29.99, Bike Light $9.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Validation: Cart badge should show '2'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Navigate to cart and click 'Checkout' button
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill out checkout information: First Name 'John', Last Name 'Doe', Zip Code '12345'
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click 'Continue' button
    await page.locator('[data-test="continue"]').click();
    
    // Verify checkout overview information
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    
    // Validation: Order summary should show correct items and totals
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('Item total: $39.98')).toBeVisible();
    await expect(page.getByText('Tax: $3.20')).toBeVisible();
    await expect(page.getByText('Total: $43.18')).toBeVisible();
    await expect(page.getByText('SauceCard #31337')).toBeVisible();
    await expect(page.getByText('Free Pony Express Delivery!')).toBeVisible();
    
    // Click 'Finish' button to complete order
    await page.locator('[data-test="finish"]').click();
    
    // Validation: Order confirmation page should display success message
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    await expect(page.getByText('Checkout: Complete!')).toBeVisible();
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();
  });

  test('Product Inventory Display and Sorting', async ({ page }) => {
    // Login first
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Validation: All 6 products should be displayed with correct information
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('$29.99').first()).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Bolt T-Shirt')).toBeVisible();
    await expect(page.getByText('$15.99').first()).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Fleece Jacket')).toBeVisible();
    await expect(page.getByText('$49.99')).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Onesie')).toBeVisible();
    await expect(page.getByText('$7.99')).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Test.allTheThings() T-Shirt (Red)')).toBeVisible();
    
    // Test sorting functionality
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    
    // Test Price (low to high) sorting
    await sortDropdown.selectOption('lohi');
    const firstProductLowHigh = page.locator('[data-test="inventory-item"]').first();
    await expect(firstProductLowHigh).toContainText('$7.99'); // Onesie should be first
    
    // Test Price (high to low) sorting
    await sortDropdown.selectOption('hilo');
    const firstProductHighLow = page.locator('[data-test="inventory-item"]').first();
    await expect(firstProductHighLow).toContainText('$49.99'); // Fleece Jacket should be first
  });

  test('Cart Management - Add and Remove Items', async ({ page }) => {
    // Login first
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Add multiple items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Validation: Cart badge should show '3'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
    
    // Remove one item from inventory page
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // Validation: Cart badge should update to '2'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Validation: Only 2 items should remain in cart
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Bolt T-Shirt')).toBeVisible();
    await expect(page.locator('[data-test="inventory-item-name"]').getByText('Sauce Labs Backpack')).not.toBeVisible();
    
    // Remove item from cart page
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    
    // Continue shopping to verify cart state
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Validation: Cart badge should show '1'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('Invalid Login Attempts', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Test with invalid username
    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Validation: Error message should be displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    
    // Clear fields and test with invalid password
    await page.locator('[data-test="username"]').clear();
    await page.locator('[data-test="password"]').clear();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();
    
    // Validation: Error message should be displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // Test with empty fields
    await page.locator('[data-test="username"]').clear();
    await page.locator('[data-test="password"]').clear();
    await page.locator('[data-test="login-button"]').click();
    
    // Validation: Error message for required fields
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('Checkout Validation and Error Handling', async ({ page }) => {
    // Login and add items to cart
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Test validation with empty fields
    await page.locator('[data-test="continue"]').click();
    
    // Validation: Error message should be displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    
    // Test partial form completion
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    
    // Validation: Error message for missing Last Name
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
    
    // Test cancel functionality
    await page.locator('[data-test="cancel"]').click();
    
    // Validation: Should return to cart page
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
  });
});