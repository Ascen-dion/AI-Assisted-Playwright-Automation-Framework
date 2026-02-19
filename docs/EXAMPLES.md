# AI Framework Usage Examples

## Table of Contents
1. [Basic Element Interactions](#basic-element-interactions)
2. [Form Handling](#form-handling)
3. [Advanced Scenarios](#advanced-scenarios)
4. [Visual Testing](#visual-testing)
5. [Self-Healing Examples](#self-healing-examples)
6. [Performance Testing](#performance-testing)

---

## Basic Element Interactions

### Simple Click Actions
```javascript
const { test } = require('./src/core/ai-test-runner');

test('Click various elements', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com');
  
  // Simple button click
  await aiPage.clickElement('search button');
  
  // Link click
  await aiPage.clickElement('about us link');
  
  // Icon click
  await aiPage.clickElement('hamburger menu icon');
  
  // Double click
  await aiPage.doubleClickElement('editable title');
  
  // Right click
  await aiPage.rightClickElement('context menu trigger');
});
```

### Text Input
```javascript
test('Fill various input fields', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com/contact');
  
  // Text input
  await aiPage.fillField('name field', 'John Doe');
  
  // Email input
  await aiPage.fillField('email address', 'john@example.com');
  
  // Textarea
  await aiPage.fillField('message or comment box', 'This is my message');
  
  // Password field
  await aiPage.fillField('password', 'SecurePass123!');
  
  // Search box
  await aiPage.fillField('search input', 'playwright automation');
  await aiPage.pressKey('Enter');
});
```

---

## Form Handling

### Complete Form Submission
```javascript
test('Submit registration form', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com/register');
  
  // Personal information
  await aiPage.fillField('first name', 'Jane');
  await aiPage.fillField('last name', 'Smith');
  await aiPage.fillField('email', 'jane.smith@example.com');
  await aiPage.fillField('phone number', '555-0123');
  
  // Address
  await aiPage.fillField('street address', '123 Main Street');
  await aiPage.fillField('city', 'New York');
  await aiPage.selectOption('state dropdown', 'NY');
  await aiPage.fillField('zip code', '10001');
  
  // Account details
  await aiPage.fillField('username', 'janesmith');
  await aiPage.fillField('password', 'SecurePassword123!');
  await aiPage.fillField('confirm password', 'SecurePassword123!');
  
  // Checkboxes
  await aiPage.clickElement('terms and conditions checkbox');
  await aiPage.clickElement('newsletter subscription checkbox');
  
  // Radio buttons
  await aiPage.clickElement('female gender option');
  
  // Submit
  await aiPage.clickElement('create account button');
  
  // Verify success
  await aiPage.verifyElement('welcome message');
  await aiPage.verifyText('success notification', 'Account created successfully');
});
```

### Dynamic Forms
```javascript
test('Handle dynamic form fields', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com/dynamic-form');
  
  // Select triggers additional fields
  await aiPage.selectOption('account type', 'Business');
  
  // Wait for and fill dynamic fields
  await aiPage.waitForElement('company name field');
  await aiPage.fillField('company name', 'Acme Corp');
  await aiPage.fillField('tax id', '12-3456789');
  
  // Add multiple items dynamically
  for (let i = 1; i <= 3; i++) {
    await aiPage.clickElement('add item button');
    await aiPage.fillField(`item ${i} name`, `Product ${i}`);
    await aiPage.fillField(`item ${i} quantity`, String(i * 10));
  }
  
  await aiPage.clickElement('submit form button');
});
```

---

## Advanced Scenarios

### Multi-Step Workflows
```javascript
test('Complete shopping journey', async ({ aiPage }) => {
  // Step 1: Browse products
  await aiPage.navigateTo('https://shop.example.com');
  await aiPage.fillField('search bar', 'laptop');
  await aiPage.pressKey('Enter');
  
  // Step 2: Filter results
  await aiPage.clickElement('filter menu');
  await aiPage.clickElement('brand apple checkbox');
  await aiPage.selectOption('sort by dropdown', 'Price: Low to High');
  
  // Step 3: Select product
  await aiPage.clickElement('first product in results');
  await aiPage.verifyElement('product details page');
  
  // Step 4: Configure product
  await aiPage.selectOption('color selector', 'Space Gray');
  await aiPage.selectOption('storage selector', '512GB');
  
  // Step 5: Add to cart
  await aiPage.clickElement('add to cart button');
  await aiPage.verifyElement('added to cart notification');
  
  // Step 6: View cart
  await aiPage.clickElement('shopping cart icon');
  await aiPage.verifyText('cart total', '$1,299.00');
  
  // Step 7: Checkout
  await aiPage.clickElement('proceed to checkout button');
  
  // Step 8: Guest checkout
  await aiPage.clickElement('continue as guest option');
  
  // Step 9: Shipping info
  await aiPage.fillField('shipping email', 'customer@example.com');
  await aiPage.fillField('shipping first name', 'John');
  await aiPage.fillField('shipping last name', 'Customer');
  await aiPage.fillField('shipping address', '456 Oak Avenue');
  await aiPage.fillField('shipping city', 'San Francisco');
  await aiPage.selectOption('shipping state', 'CA');
  await aiPage.fillField('shipping zip', '94102');
  
  // Step 10: Shipping method
  await aiPage.clickElement('standard shipping option');
  await aiPage.clickElement('continue to payment button');
  
  // Step 11: Payment (test mode)
  await aiPage.fillField('card number', '4242424242424242');
  await aiPage.fillField('expiry date', '12/25');
  await aiPage.fillField('cvv', '123');
  await aiPage.fillField('billing zip code', '94102');
  
  // Step 12: Place order
  await aiPage.clickElement('place order button');
  
  // Step 13: Verify success
  await aiPage.verifyElement('order confirmation page');
  await aiPage.verifyText('order number', 'ORD-');
});
```

### Handling Modals and Popups
```javascript
test('Interact with modals', async ({ aiPage, page }) => {
  await aiPage.navigateTo('https://example.com');
  
  // Trigger modal
  await aiPage.clickElement('open modal button');
  
  // Wait for modal to appear
  await aiPage.waitForElement('modal dialog');
  
  // Interact within modal
  await aiPage.fillField('modal email input', 'user@example.com');
  await aiPage.clickElement('modal submit button');
  
  // Wait for modal to close
  await page.waitForSelector('.modal', { state: 'hidden' });
  
  // Continue with main page
  await aiPage.verifyElement('success message');
});
```

### Tab and Window Management
```javascript
test('Handle multiple tabs', async ({ aiPage, page, context }) => {
  await aiPage.navigateTo('https://example.com');
  
  // Click link that opens new tab
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    aiPage.clickElement('open in new tab link')
  ]);
  
  // Switch to new tab
  const newAiPage = new (require('./src/core/ai-page'))(newPage);
  await newAiPage.verifyElement('new page content');
  
  // Interact with new tab
  await newAiPage.fillField('search field', 'test query');
  
  // Close new tab and return to original
  await newPage.close();
  await aiPage.verifyElement('original page content');
});
```

---

## Visual Testing

### Screenshot Comparison
```javascript
test('Visual regression test', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com/dashboard');
  
  // Take baseline screenshot
  await aiPage.takeScreenshot('dashboard-baseline', {
    path: './test-results/baselines/dashboard.png',
    fullPage: true
  });
  
  // Make some changes
  await aiPage.clickElement('dark mode toggle');
  
  // Take comparison screenshot with AI analysis
  const analysis = await aiPage.takeScreenshot('dashboard-dark-mode', {
    analyze: true,
    expectedState: 'dashboard in dark mode with all elements visible'
  });
  
  expect(analysis.matches).toBe(true);
  expect(analysis.confidence).toBeGreaterThan(0.8);
});
```

### Visual State Validation
```javascript
test('Validate UI state changes', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com/app');
  
  // Verify initial state
  await aiPage.validatePageState('empty shopping cart message displayed');
  
  // Add item
  await aiPage.clickElement('add first item button');
  
  // Verify state changed
  await aiPage.validatePageState('shopping cart with 1 item and total price');
  
  // Add another item
  await aiPage.clickElement('add second item button');
  
  // Verify updated state
  await aiPage.validatePageState('shopping cart with 2 items and updated total');
});
```

### Responsive Design Testing
```javascript
const visualAI = require('./src/helpers/visual-ai');

test('Validate responsive layout', async ({ browser }) => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];
  
  const screenshots = [];
  
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const aiPage = new (require('./src/core/ai-page'))(page);
    
    await aiPage.navigateTo('https://example.com');
    
    const screenshot = await page.screenshot();
    screenshots.push({ viewport: viewport.name, screenshot });
    
    await context.close();
  }
  
  // AI validates responsive design
  const analysis = await visualAI.validateResponsiveDesign(screenshots);
  
  expect(analysis.isResponsive).toBe(true);
  expect(analysis.score).toBeGreaterThan(0.8);
});
```

---

## Self-Healing Examples

### Automatic Selector Healing
```javascript
test('Test with self-healing selectors', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com');
  
  // First run: selector is found and cached
  await aiPage.clickElement('submit button');
  
  // If the button's ID/class changes in future, AI will:
  // 1. Try cached selector
  // 2. Detect failure
  // 3. Use AI to find new selector
  // 4. Update cache
  // 5. Continue test execution
  
  // Test continues without modification needed
  await aiPage.verifyElement('success message');
});
```

### Monitoring Healing Events
```javascript
const selfHealing = require('./src/helpers/self-healing');

test('Review self-healing statistics', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com');
  
  // Perform test actions
  await aiPage.clickElement('dynamic button');
  await aiPage.fillField('dynamic input', 'test');
  
  // Get healing statistics
  const stats = selfHealing.getStatistics();
  console.log('Healing Stats:', stats);
  
  // Generate healing report
  const report = await selfHealing.generateReport();
  console.log(report);
});
```

---

## Performance Testing

### Measure Page Load
```javascript
test('Monitor page performance', async ({ aiPage, page }) => {
  const startTime = Date.now();
  
  await aiPage.navigateTo('https://example.com');
  
  const loadTime = Date.now() - startTime;
  console.log(`Page loaded in ${loadTime}ms`);
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart
    };
  });
  
  console.log('Performance Metrics:', metrics);
  
  // Assert performance thresholds
  expect(loadTime).toBeLessThan(5000);
  expect(metrics.domContentLoaded).toBeLessThan(2000);
});
```

### Track Test Execution Time
```javascript
test('Monitor test performance', async ({ aiPage }) => {
  const steps = [];
  
  const trackStep = async (name, action) => {
    const start = Date.now();
    await action();
    const duration = Date.now() - start;
    steps.push({ name, duration });
  };
  
  await trackStep('Navigate', () => 
    aiPage.navigateTo('https://example.com'));
  
  await trackStep('Login', async () => {
    await aiPage.fillField('username', 'testuser');
    await aiPage.fillField('password', 'testpass');
    await aiPage.clickElement('login button');
  });
  
  await trackStep('Search', () => 
    aiPage.fillField('search box', 'query'));
  
  // Log performance data
  console.table(steps);
  
  // Identify slow steps
  const slowSteps = steps.filter(s => s.duration > 3000);
  if (slowSteps.length > 0) {
    console.warn('Slow steps detected:', slowSteps);
  }
});
```

---

## Error Handling

### Graceful Failure Recovery
```javascript
test('Handle errors gracefully', async ({ aiPage, page }) => {
  await aiPage.navigateTo('https://example.com');
  
  try {
    // Try to find element that might not exist
    await aiPage.clickElement('optional modal close button', {
      timeout: 5000
    });
  } catch (error) {
    console.log('Modal not present, continuing...');
  }
  
  // Continue with test
  await aiPage.clickElement('main navigation link');
});
```

### Custom Error Messages
```javascript
test('Provide context in failures', async ({ aiPage }) => {
  await aiPage.navigateTo('https://example.com');
  
  try {
    await aiPage.verifyElement('expected content');
  } catch (error) {
    // Enhance error with context
    const pageInfo = await aiPage.getPageInfo();
    const screenshot = await aiPage.takeScreenshot('error-state');
    
    throw new Error(`
      Test failed at: ${pageInfo.url}
      Page title: ${pageInfo.title}
      Original error: ${error.message}
      Screenshot saved: error-state.png
    `);
  }
});
```

This framework provides powerful AI-assisted automation capabilities while maintaining the flexibility and reliability of Playwright!
