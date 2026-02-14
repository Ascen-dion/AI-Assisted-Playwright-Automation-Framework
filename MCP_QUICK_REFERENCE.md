# MCP Quick Reference Card

## 🚀 Model Context Protocol - Cheat Sheet

### Installation
```bash
npm install  # MCP SDK already included
```

### Basic Usage

```javascript
const { test } = require('../core/ai-test-runner');

test('test name', async ({ mcpClaude }) => {
  // Your MCP-powered test
});
```

---

## Core Methods

### Navigate
```javascript
await mcpClaude.navigate('https://example.com');
```

### Execute Actions
```javascript
await mcpClaude.do('click login button');
await mcpClaude.do('fill email with test@example.com');
await mcpClaude.do('login as admin with password secret123');
```

### Interact (Focused)
```javascript
await mcpClaude.interact('click the blue submit button');
await mcpClaude.interact('type hello into search box');
```

### Verify
```javascript
await mcpClaude.verify('user is logged in');
await mcpClaude.verify('dashboard is visible');
await mcpClaude.verify('cart has 3 items');
```

### Find with Self-Healing
```javascript
const element = await mcpClaude.findWithHealing('submit button');
// { selector: '#submit', healed: true/false }
```

### Analyze Page
```javascript
const analysis = await mcpClaude.analyzePage();
// Returns: { purpose, elements, state, suggestions }
```

### Generate Test Code
```javascript
const code = await mcpClaude.generateTestCode('Test user login and logout');
```

---

## Quick Examples

### Login Flow
```javascript
test('login', async ({ mcpClaude }) => {
  await mcpClaude.navigate('https://saucedemo.com');
  await mcpClaude.do('login as standard_user with password secret_sauce');
  await mcpClaude.verify('products page is displayed');
});
```

### E2E Checkout
```javascript
test('checkout', async ({ mcpClaude }) => {
  await mcpClaude.navigate('https://saucedemo.com');
  await mcpClaude.do('login as standard_user');
  await mcpClaude.do('add first product to cart');
  await mcpClaude.interact('click cart icon');
  await mcpClaude.verify('cart shows 1 item');
});
```

### Hybrid (MCP + Playwright)
```javascript
test('hybrid', async ({ page, mcpClaude }) => {
  // Use MCP for complex interactions
  await mcpClaude.navigate('https://example.com');
  await mcpClaude.do('search for laptops');
  
  // Use Playwright for precise checks
  const count = await page.locator('.product').count();
  expect(count).toBeGreaterThan(0);
  
  // Back to MCP for verification
  await mcpClaude.verify('search results are displayed');
});
```

---

## MCP vs Traditional

| Task | Traditional Playwright | MCP-Enhanced |
|------|----------------------|--------------|
| **Login** | 5 lines, brittle selectors | 1 line, self-healing |
| **Form Fill** | Multiple `fill()` calls | 1 `do()` instruction |
| **Verification** | Manual locators + expect | Natural language `verify()` |
| **Debugging** | Console logs, screenshots | AI analysis |
| **Maintenance** | Update selectors manually | Auto-adapts to changes |

---

## Best Practices

### ✅ DO
- Use natural language
- Be specific in descriptions
- Mix MCP + Playwright for optimal performance
- Clear history between independent tests

### ❌ DON'T
- Over-complicate single instructions
- Use MCP for simple waits
- Put CSS selectors in natural language methods

---

## Troubleshooting

### Element Not Found
```javascript
// Add more context
await mcpClaude.do('click the blue Submit button in footer');

// Or enable self-healing
const el = await mcpClaude.findWithHealing('submit button');
```

### Verification Fails
```javascript
// Debug with page analysis
const analysis = await mcpClaude.analyzePage();
console.log('Page state:', analysis);
```

### Performance Issues
```javascript
// Batch actions together
await mcpClaude.do('login as testuser with password pass123');
// Instead of 3 separate calls
```

---

## Available Tools (Behind the Scenes)

MCP exposes 12 tools to Claude:
- `navigate_to_url` - Smart navigation
- `find_element` - Multi-strategy detection
- `click_element` - Intelligent clicking
- `fill_input` - Form filling
- `get_page_content` - HTML extraction
- `get_dom_snapshot` - Simplified DOM
- `take_screenshot` - Visual capture
- `assert_visible` - Visibility check
- `assert_text` - Text verification
- `wait_for_selector` - Element waiting
- `execute_javascript` - Custom JS
- `generate_test` - Auto test creation

---

## Full Documentation

📖 See [MCP_INTEGRATION.md](MCP_INTEGRATION.md) for complete guide

---

## Run Examples

```bash
npm test -- mcp-example.spec.js
```

---

**Questions?** Check the full MCP Integration Guide or Team Onboarding documentation.
