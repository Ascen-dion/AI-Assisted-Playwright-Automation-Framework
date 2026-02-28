// Amazon.com Basic Search Functionality Test
// Generated from test plan exploration using Playwright CLI capabilities

import { test, expect } from '@playwright/test';

test.describe('Amazon.com Search and Discovery Tests', () => {
  
  test('Basic Product Search Functionality', async ({ page }) => {
    // Navigate to Amazon homepage
    await page.goto('https://www.amazon.com');
    
    // Verify homepage elements
    await expect(page).toHaveTitle(/Amazon/);
    await expect(page.locator('#twotabsearchtextbox')).toBeVisible();
    await expect(page.locator('#nav-search-submit-button')).toBeVisible();
    await expect(page.locator('#nav-link-accountList')).toBeVisible();
    await expect(page.locator('#nav-cart')).toBeVisible();
    
    // Perform product search
    await page.fill('#twotabsearchtextbox', 'headphones');
    await page.click('#nav-search-submit-button');
    
    // Verify search results page
    await expect(page).toHaveURL(/.*\/s\?k=headphones.*/);
    await expect(page).toHaveTitle(/.*headphones.*/);
    
    // Verify search results are displayed
    await expect(page.locator('[data-component-type="s-search-result"]')).toHaveCount({ min: 10 });
    
    // Verify filter and sort options
    await expect(page.locator('#s-refinements')).toBeVisible(); // Filters sidebar
    await expect(page.locator('#s-result-sort-select')).toBeVisible(); // Sort dropdown
    
    // Verify product result structure
    const firstResult = page.locator('[data-component-type="s-search-result"]').first();
    await expect(firstResult.locator('a[href*="/dp/"]')).toBeVisible(); // Product link
  });

  test('Search Results Filtering and Sorting', async ({ page }) => {
    // Navigate to search results
    await page.goto('https://www.amazon.com');
    await page.fill('#twotabsearchtextbox', 'laptops');
    await page.click('#nav-search-submit-button');
    
    // Wait for results to load
    await page.waitForLoadState('domcontentloaded');
    
    // Test sorting functionality
    await page.selectOption('#s-result-sort-select', 'price-asc-rank');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify URL updates with sort parameter
    await expect(page).toHaveURL(/.*s=price-asc-rank.*/);
    
    // Test price filtering (if available)
    const priceFilter = page.locator('#p_36-title');
    if (await priceFilter.isVisible()) {
      await priceFilter.click();
      
      // Select a price range
      const priceRange = page.locator('input[name="s-ref-checkbox-p_36"]').first();
      if (await priceRange.isVisible()) {
        await priceRange.click();
        await page.waitForLoadState('domcontentloaded');
        
        // Verify filter is applied
        await expect(page).toHaveURL(/.*p_36.*/);
      }
    }
  });

  test('Search Edge Cases and Error Handling', async ({ page }) => {
    await page.goto('https://www.amazon.com');
    
    // Test search with non-existent product
    await page.fill('#twotabsearchtextbox', 'xqzywvutsrqponmlk');
    await page.click('#nav-search-submit-button');
    
    // Verify no results handling
    await page.waitForLoadState('domcontentloaded');
    // Amazon typically shows suggestions or related products instead of pure "no results"
    await expect(page.locator('#search')).toBeVisible();
    
    // Test search with special characters
    await page.fill('#twotabsearchtextbox', '@#$%^&*()');
    await page.click('#nav-search-submit-button');
    
    await page.waitForLoadState('domcontentloaded');
    // Verify page doesn't break
    await expect(page.locator('#search')).toBeVisible();
    
    // Test empty search
    await page.fill('#twotabsearchtextbox', '');
    await page.click('#nav-search-submit-button');
    
    // Verify appropriate handling of empty search  
    // Amazon may redirect to homepage or show an error message
    const currentUrl = page.url();
    expect(currentUrl).toContain('amazon.com');
  });

  test('Product Navigation and Detail View', async ({ page }) => {
    // Navigate to search results
    await page.goto('https://www.amazon.com');
    await page.fill('#twotabsearchtextbox', 'wireless mouse');
    await page.click('#nav-search-submit-button');
    
    await page.waitForLoadState('domcontentloaded');
    
    // Click on first product with dp link
    const firstProduct = page.locator('[data-component-type="s-search-result"] a[href*="/dp/"]').first();
    await firstProduct.click();
    
    await page.waitForLoadState('domcontentloaded');
    
    // Verify product detail page elements
    await expect(page).toHaveURL(/.*\/dp\/.*/);
    
    // Check for key product page elements (these may vary)
    const productTitle = page.locator('#productTitle, [data-automation-id="title"]');
    const addToCartButton = page.locator('#add-to-cart-button, [name="submit.add-to-cart"]');
    
    await expect(productTitle.or(page.locator('h1'))).toBeVisible();
    
    // Test Add to Cart functionality (if button is present)
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Handle potential popup or navigation to cart
      await page.waitForTimeout(2000);
      
      // Check if cart was updated (cart count or navigation to cart page)
      const cartElement = page.locator('#nav-cart-count, #attach-added-to-cart-message, [data-csa-c-content-id="sw-atc"]');
      await expect(cartElement.first()).toBeVisible({ timeout: 10000 });
    }
  });
});