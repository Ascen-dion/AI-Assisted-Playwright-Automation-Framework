const { test, expect } = require('../../core/ai-test-runner');

/**
 * Example tests demonstrating AI-assisted automation
 */

test.describe('AI-Assisted Login Tests', () => {
  
  test('Login with valid credentials using AI element detection', async ({ aiPage }) => {
    // Navigate to login page
    await aiPage.navigateTo('https://demo.playwright.dev/todomvc');
    
    // AI will intelligently find and interact with elements
    // using natural language descriptions
    await aiPage.fillField('todo input field', 'Buy groceries');
    await aiPage.pressKey('Enter');
    
    // Verify the todo was added
    await aiPage.verifyText('todo list', 'Buy groceries');
    
    // Add another todo
    await aiPage.fillField('todo input', 'Walk the dog');
    await aiPage.pressKey('Enter');
    
    // Take screenshot with AI analysis
    const analysis = await aiPage.takeScreenshot('todos-added', {
      analyze: true,
      expectedState: 'todo list with two items visible'
    });
    
    expect(analysis.matches).toBe(true);
  });

  test('Handle dynamic elements with self-healing', async ({ aiPage }) => {
    await aiPage.navigateTo('https://demo.playwright.dev/todomvc');
    
    // Even if element selectors change, AI will find them
    await aiPage.clickElement('new todo input');
    await aiPage.typeText('Test self-healing capability');
    await aiPage.pressKey('Enter');
    
    await aiPage.verifyElement('active todos count');
  });

  test('AI-powered visual validation', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://demo.playwright.dev/todomvc');
    
    // Add multiple todos
    const todos = ['Task 1', 'Task 2', 'Task 3'];
    
    for (const todo of todos) {
      await aiPage.fillField('todo input', todo);
      await aiPage.pressKey('Enter');
    }
    
    // Validate page state using AI
    await aiPage.validatePageState('todo list with three items displayed');
    
    // Click on first todo to mark as complete
    await aiPage.clickElement('first todo checkbox');
    
    // Verify completion with AI
    await aiPage.validatePageState('first todo is marked as completed with strikethrough');
  });
});

test.describe('E-Commerce Tests', () => {
  
  test('Product search and add to cart', async ({ aiPage }) => {
    // This is a demonstration - replace with actual e-commerce site
    await aiPage.navigateTo('https://www.saucedemo.com/');
    
    // Login
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');
    
    // Wait for products page
    await aiPage.waitForElement('products container');
    
    // Add item to cart using AI detection
    await aiPage.clickElement('add to cart button for backpack');
    
    // Verify cart badge
    await aiPage.verifyElement('shopping cart badge');
    
    // Take screenshot
    await aiPage.takeScreenshot('item-added-to-cart');
  });

  test('Complete checkout flow', async ({ aiPage }) => {
    await aiPage.navigateTo('https://www.saucedemo.com/');
    
    // Login
    await aiPage.fillField('username field', 'standard_user');
    await aiPage.fillField('password field', 'secret_sauce');
    await aiPage.clickElement('login button');
    
    // Add product
    await aiPage.clickElement('add to cart button');
    
    // Go to cart
    await aiPage.clickElement('shopping cart icon');
    
    // Proceed to checkout
    await aiPage.clickElement('checkout button');
    
    // Fill checkout information
    await aiPage.fillField('first name', 'John');
    await aiPage.fillField('last name', 'Doe');
    await aiPage.fillField('postal code', '12345');
    
    await aiPage.clickElement('continue button');
    
    // Finish checkout
    await aiPage.clickElement('finish button');
    
    // Verify success
    await aiPage.verifyElement('order confirmation message');
    await aiPage.validatePageState('checkout complete page with success message');
  });
});

test.describe('Form Handling', () => {
  
  test('Complex form with various input types', async ({ aiPage }) => {
    await aiPage.navigateTo('https://demoqa.com/automation-practice-form');
    
    // Fill text inputs
    await aiPage.fillField('first name', 'Jane');
    await aiPage.fillField('last name', 'Smith');
    await aiPage.fillField('email', 'jane@example.com');
    await aiPage.fillField('mobile number', '1234567890');
    
    // Select gender
    await aiPage.clickElement('female gender radio button');
    
    // Date picker
    await aiPage.clickElement('date of birth field');
    await aiPage.selectOption('month dropdown', 'January');
    await aiPage.selectOption('year dropdown', '1990');
    await aiPage.clickElement('15th day of month');
    
    // Subjects (auto-complete)
    await aiPage.fillField('subjects input', 'Maths');
    await aiPage.pressKey('Enter');
    
    // Checkboxes
    await aiPage.clickElement('sports hobby checkbox');
    await aiPage.clickElement('reading hobby checkbox');
    
    // Upload file (if file exists)
    // await aiPage.uploadFile('picture upload', './test-data/sample.jpg');
    
    // Address
    await aiPage.fillField('current address', '123 Main St, City, State');
    
    // Submit form
    await aiPage.clickElement('submit button');
    
    // Verify submission
    await aiPage.verifyElement('thanks for submitting modal');
  });
});

test.describe('AI Error Recovery', () => {
  
  test('Recover from stale elements', async ({ aiPage }) => {
    await aiPage.navigateTo('https://demo.playwright.dev/todomvc');
    
    // Add todos
    await aiPage.fillField('todo input', 'Dynamic element test');
    await aiPage.pressKey('Enter');
    
    // Clear cache to force element re-detection
    aiPage.clearCache();
    
    // AI will automatically find element again even if DOM changed
    await aiPage.fillField('todo input', 'Another task');
    await aiPage.pressKey('Enter');
    
    await aiPage.verifyText('todo list', 'Dynamic element test');
  });
  
  test('Handle unexpected popups and alerts', async ({ aiPage, page }) => {
    // Setup alert handler
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await aiPage.navigateTo('https://demoqa.com/alerts');
    
    // Trigger alert
    await aiPage.clickElement('click me button for alert');
    
    // Continue testing after alert is handled
    await aiPage.verifyElement('alerts page title');
  });
});
