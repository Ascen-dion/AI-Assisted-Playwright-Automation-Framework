const { test, expect } = require('../../core/ai-test-runner');
const visualAI = require('../../helpers/visual-ai');
const selfHealing = require('../../helpers/self-healing');

/**
 * Advanced real-world test scenarios
 * Demonstrates the full power of AI-assisted automation
 */

test.describe('E-Commerce Complete Flow', () => {
  
  test('End-to-end purchase with AI validation', async ({ aiPage, page }) => {
    // Step 1: Homepage
    await aiPage.navigateTo('https://www.saucedemo.com');
    
    // AI validates homepage loaded correctly
    await aiPage.validatePageState('login page with username and password fields');
    
    // Step 2: Login
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    
    // AI validates successful login
    await aiPage.validatePageState('products page with multiple items displayed');
    
    // Step 3: Add multiple products
    const products = ['backpack', 'bike light', 'bolt t-shirt'];
    
    for (const product of products) {
      await aiPage.clickElement(`add to cart button for ${product}`);
    }
    
    // Verify cart count
    await aiPage.verifyText('shopping cart badge', '3');
    
    // Step 4: Go to cart
    await aiPage.clickElement('shopping cart');
    
    // Take screenshot and validate
    const cartAnalysis = await aiPage.takeScreenshot('cart-page', {
      analyze: true,
      expectedState: 'shopping cart with 3 items listed'
    });
    
    expect(cartAnalysis.matches).toBe(true);
    
    // Step 5: Proceed to checkout
    await aiPage.clickElement('checkout button');
    
    // Step 6: Fill checkout information
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('last name', 'Doe');
    await aiPage.fillField('postal code', '12345');
    await aiPage.clickElement('continue');
    
    // Step 7: Review and complete
    await aiPage.validatePageState('checkout overview with order summary');
    await aiPage.clickElement('finish');
    
    // Step 8: Verify order completion
    await aiPage.verifyElement('complete order confirmation');
    await aiPage.validatePageState('thank you page with confirmation message');
    
    // Get action history for reporting
    const history = aiPage.getActionHistory();
    console.log(`Test completed with ${history.length} actions`);
  });
});

test.describe('Dynamic Content Handling', () => {
  
  test('Handle infinite scroll and lazy loading', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://example.com/infinite-scroll');
    
    let itemCount = 0;
    const targetItems = 50;
    
    while (itemCount < targetItems) {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Wait for new items to load (AI detects loading state)
      await page.waitForTimeout(1000);
      
      // Count items
      itemCount = await page.locator('.item').count();
      
      console.log(`Loaded ${itemCount} items...`);
    }
    
    // Verify all items loaded
    expect(itemCount).toBeGreaterThanOrEqual(targetItems);
    
    // AI validates the page state
    await aiPage.validatePageState(`list with at least ${targetItems} items visible`);
  });

  test('Handle AJAX-loaded content', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://example.com/ajax-demo');
    
    // Trigger AJAX request
    await aiPage.clickElement('load data button');
    
    // Wait for loading indicator to disappear
    await page.waitForSelector('.loading-spinner', { state: 'hidden' });
    
    // AI verifies content loaded
    await aiPage.validatePageState('data table with multiple rows visible');
    
    // Extract and validate data
    const textAnalysis = await visualAI.extractText(
      await page.screenshot()
    );
    
    expect(textAnalysis.keyElements).toContain('data-loaded');
  });
});

test.describe('Complex Form Validation', () => {
  
  test('Multi-step form with conditional fields', async ({ aiPage }) => {
    await aiPage.navigateTo('https://example.com/complex-form');
    
    // Step 1: Personal Info
    await aiPage.fillField('full name', 'Jane Smith');
    await aiPage.fillField('email', 'jane.smith@example.com');
    await aiPage.fillField('phone', '555-0123');
    await aiPage.clickElement('next step button');
    
    // Step 2: Account Type (triggers conditional fields)
    await aiPage.clickElement('business account radio');
    
    // Wait for conditional fields to appear
    await aiPage.waitForElement('company name field');
    await aiPage.fillField('company name', 'Acme Corporation');
    await aiPage.fillField('tax id', '12-3456789');
    await aiPage.fillField('number of employees', '50');
    
    await aiPage.clickElement('next step button');
    
    // Step 3: Preferences
    await aiPage.clickElement('email notifications checkbox');
    await aiPage.clickElement('sms notifications checkbox');
    await aiPage.selectOption('preferred contact time', 'Morning (9am-12pm)');
    
    await aiPage.clickElement('next step button');
    
    // Step 4: Review
    await aiPage.validatePageState('review page showing all entered information');
    
    // Verify all data is displayed correctly
    await aiPage.verifyText('review name', 'Jane Smith');
    await aiPage.verifyText('review company', 'Acme Corporation');
    
    // Submit
    await aiPage.clickElement('submit form button');
    
    // Verify success
    await aiPage.verifyElement('success confirmation message');
  });

  test('Form validation with real-time feedback', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://example.com/validated-form');
    
    // Test invalid email
    await aiPage.fillField('email', 'invalid-email');
    await aiPage.clickElement('submit button');
    await aiPage.verifyElement('email error message');
    
    // Correct email
    await aiPage.fillField('email', 'valid@example.com');
    await page.waitForSelector('.email-error', { state: 'hidden' });
    
    // Test password requirements
    await aiPage.fillField('password', 'weak');
    await aiPage.verifyElement('password strength indicator showing weak');
    
    await aiPage.fillField('password', 'StrongP@ssw0rd123');
    await aiPage.verifyElement('password strength indicator showing strong');
    
    // Submit valid form
    await aiPage.clickElement('submit button');
    await aiPage.verifyElement('form submitted successfully message');
  });
});

test.describe('Visual Regression Testing', () => {
  
  test('Compare UI across different states', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://example.com/theme-demo');
    
    // Capture light mode
    const lightModeScreenshot = await page.screenshot();
    
    // Switch to dark mode
    await aiPage.clickElement('dark mode toggle');
    await page.waitForTimeout(500); // Wait for transition
    
    // Capture dark mode
    const darkModeScreenshot = await page.screenshot();
    
    // AI compares the screenshots
    const comparison = await visualAI.compareScreenshots(
      darkModeScreenshot,
      lightModeScreenshot
    );
    
    expect(comparison.identical).toBe(false);
    expect(comparison.differences).toContainEqual(
      expect.objectContaining({ type: 'style' })
    );
    
    console.log('Visual differences:', comparison.differences);
  });

  test('Detect UI anomalies', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://example.com/dashboard');
    
    const screenshot = await page.screenshot();
    
    // AI detects any UI issues
    const anomalies = await visualAI.detectAnomalies(screenshot, [
      'header navigation',
      'main content area',
      'sidebar menu',
      'footer'
    ]);
    
    if (anomalies.hasAnomalies) {
      console.warn('UI Anomalies detected:', anomalies.anomalies);
    }
    
    expect(anomalies.overallScore).toBeGreaterThan(0.7);
  });
});

test.describe('Performance Monitoring', () => {
  
  test('Track and validate page performance', async ({ aiPage, page }) => {
    const performanceData = [];
    
    // Monitor network requests
    page.on('response', response => {
      performanceData.push({
        url: response.url(),
        status: response.status(),
        timing: response.timing()
      });
    });
    
    const startTime = Date.now();
    await aiPage.navigateTo('https://example.com');
    const loadTime = Date.now() - startTime;
    
    // Get Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('Performance Metrics:', {
      loadTime,
      vitals,
      requests: performanceData.length
    });
    
    // Assert performance budgets
    expect(loadTime).toBeLessThan(5000);
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500);
    }
  });
});

test.describe('Self-Healing Demonstration', () => {
  
  test('Automatically adapt to DOM changes', async ({ aiPage }) => {
    await aiPage.navigateTo('https://example.com');
    
    // First interaction - selector gets cached
    await aiPage.clickElement('submit button');
    
    // Simulate DOM change (in real scenario, button ID/class changed)
    // AI will detect failure and find new selector automatically
    await aiPage.clickElement('submit button');
    
    // Get healing statistics
    const stats = selfHealing.getStatistics();
    console.log('Self-healing stats:', stats);
    
    // Verify test continued successfully
    await aiPage.verifyElement('expected result');
  });

  test('Generate healing report', async ({ aiPage }) => {
    // Perform various actions
    await aiPage.navigateTo('https://example.com');
    await aiPage.clickElement('dynamic element 1');
    await aiPage.fillField('dynamic input', 'test');
    await aiPage.clickElement('dynamic button 2');
    
    // Generate comprehensive healing report
    const report = await selfHealing.generateReport();
    
    console.log('=== SELF-HEALING REPORT ===');
    console.log(report);
    
    expect(report).toContain('Self-Healing Report');
  });
});

test.describe('API Integration with UI Tests', () => {
  
  test('Validate UI against API data', async ({ aiPage, request }) => {
    // Fetch data from API
    const apiResponse = await request.get('https://api.example.com/products');
    const products = await apiResponse.json();
    
    // Navigate to products page
    await aiPage.navigateTo('https://example.com/products');
    
    // Verify UI shows correct number of products
    const uiProductCount = await aiPage.page.locator('.product-item').count();
    expect(uiProductCount).toBe(products.length);
    
    // Verify first product details match
    const firstProduct = products[0];
    await aiPage.verifyText('first product name', firstProduct.name);
    await aiPage.verifyText('first product price', `$${firstProduct.price}`);
  });
});

test.describe('Accessibility Testing', () => {
  
  test('Validate ARIA labels and keyboard navigation', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://example.com');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verify navigation worked
    await aiPage.verifyElement('expected page after keyboard navigation');
    
    // Check for ARIA labels
    const ariaIssues = await page.evaluate(() => {
      const issues = [];
      const buttons = document.querySelectorAll('button');
      
      buttons.forEach((button, index) => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
          issues.push(`Button ${index} missing accessible label`);
        }
      });
      
      return issues;
    });
    
    expect(ariaIssues).toHaveLength(0);
  });
});
