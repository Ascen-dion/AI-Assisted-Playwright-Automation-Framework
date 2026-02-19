# Quick Start Guide

## 🚀 Getting Started with AI-Assisted Playwright Framework

### Prerequisites

- Node.js 16+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Basic understanding of Playwright

### Installation

1. **Clone or create the project**
```bash
mkdir playwright-ai-framework
cd playwright-ai-framework
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npm run install:browsers
```

4. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Your First AI-Assisted Test

Create a test file `src/tests/my-first-test.spec.js`:

```javascript
const { test, expect } = require('../core/ai-test-runner');

test('My first AI-assisted test', async ({ aiPage }) => {
  // Navigate to a website
  await aiPage.navigateTo('https://example.com');
  
  // AI finds and clicks a button using natural language
  await aiPage.clickElement('login button');
  
  // AI finds and fills form fields
  await aiPage.fillField('username or email', 'testuser@example.com');
  await aiPage.fillField('password', 'SecurePassword123');
  
  // Submit the form
  await aiPage.clickElement('sign in button');
  
  // Verify success
  await aiPage.verifyElement('welcome message or dashboard');
});
```

### Run Your Test

```bash
# Run in headed mode (see the browser)
npm test -- --headed

# Run specific test file
npm test -- my-first-test.spec.js

# Debug mode
npm test -- --debug
```

## 🎯 Key Features to Try

### 1. Natural Language Element Selection

Instead of writing complex selectors:
```javascript
// ❌ Old way
await page.click('button[data-testid="submit-btn"]');

// ✅ AI-assisted way
await aiPage.clickElement('submit button');
```

### 2. Self-Healing Tests

If an element selector changes, AI automatically finds the new selector:
```javascript
// Works even if the button's ID or class changes!
await aiPage.clickElement('checkout button');
```

### 3. Visual Validation

Validate UI state using screenshots:
```javascript
await aiPage.validatePageState('login form with username and password fields');
```

### 4. Smart Assertions

Let AI suggest what to verify:
```javascript
const screenshot = await aiPage.takeScreenshot('homepage', {
  analyze: true,
  expectedState: 'homepage with featured products'
});

expect(screenshot.matches).toBe(true);
```

## 📊 Understanding AI Methods

### Navigation
```javascript
await aiPage.navigateTo('https://example.com');
```

### Element Interaction
```javascript
// Click
await aiPage.clickElement('search button');

// Fill input
await aiPage.fillField('search box', 'playwright automation');

// Select dropdown
await aiPage.selectOption('country selector', 'United States');

// Upload file
await aiPage.uploadFile('file input', './path/to/file.pdf');

// Hover
await aiPage.hoverElement('dropdown menu');

// Double click
await aiPage.doubleClickElement('editable text');
```

### Verification
```javascript
// Verify element exists
await aiPage.verifyElement('success message');

// Verify text content
await aiPage.verifyText('heading', 'Welcome Back');

// Validate page state with AI
await aiPage.validatePageState('shopping cart with 3 items');
```

### Screenshots & Analysis
```javascript
// Simple screenshot
await aiPage.takeScreenshot('checkout-page');

// Screenshot with AI analysis
const analysis = await aiPage.takeScreenshot('product-page', {
  analyze: true,
  expectedState: 'product details page with price and add to cart button'
});
```

## 🔧 Configuration

### Browser Settings

Edit `config/playwright.config.js`:
```javascript
use: {
  headless: false,  // Set to true for CI
  viewport: { width: 1280, height: 720 },
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### AI Settings

In `.env`:
```bash
# Enable/disable AI features
ENABLE_AI=true
ENABLE_SELF_HEALING=true
ENABLE_VISUAL_VALIDATION=true

# Timeout settings
TIMEOUT=30000
```

## 📈 Viewing Reports

After running tests:

```bash
# View Playwright's HTML report
npm run report

# AI-enhanced reports are in:
# test-results/ai-reports/
```

## 🐛 Common Issues

### "API key not found"
- Make sure `.env` file exists in project root
- Check `ANTHROPIC_API_KEY` is set correctly

### "Element not found"
- AI needs a clear description: "login button" not just "button"
- Try more specific descriptions: "blue submit button in footer"

### Tests running slowly
- AI element finding adds ~1-2 seconds per interaction
- Disable AI for known stable selectors:
```javascript
await aiPage.clickElement('submit', { enableAI: false });
```

## 💡 Best Practices

1. **Descriptive Element Names**: Use clear, unique descriptions
   - ✅ "primary navigation menu"
   - ❌ "menu"

2. **Cache Selectors**: Successfully found selectors are cached automatically

3. **Combine with Standard Playwright**: You can mix AI and standard methods
   ```javascript
   await aiPage.clickElement('login button');
   await page.click('#known-selector'); // Standard Playwright
   ```

4. **Review Healing History**: Check `test-results/healing-history.json`

## 📚 Next Steps

- Explore example tests in `src/tests/example.spec.js`
- Read the full documentation in `README.md`
- Check out visual AI features in `src/helpers/visual-ai.js`
- Review self-healing capabilities in `src/helpers/self-healing.js`

## 🆘 Need Help?

- Check logs in `logs/combined.log`
- Review AI failure analysis in test reports
- Enable debug logging: `LOG_LEVEL=debug npm test`

Happy Testing! 🎉
