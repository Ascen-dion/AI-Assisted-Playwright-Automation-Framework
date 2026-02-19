# 🚀 MCP Quick Start

Get started with Model Context Protocol in 5 minutes.

---

## ⚡ 1-Minute Setup

```bash
# 1. Enable MCP
echo "USE_MCP=true" >> .env

# 2. Run demo
npx playwright test mcp-demo.spec.js --headed

# Done! MCP is working 🎉
```

---

## 📋 What You Get

### 4 MCP Tools

1. **generate_test_plan** - AI test planning
2. **generate_playwright_code** - Code generation
3. **analyze_test_failure** - Self-healing
4. **analyze_page_context** - Page analysis (NEW!)

### 3 Enhanced Agents

- **Planner Agent** - Generate test plans
- **Generator Agent** - Generate executable code
- **Healer Agent** - Analyze and fix failures

---

## 💻 Basic Usage

### Generate Test Code

```javascript
const testAgents = require('./src/core/test-agents-mcp');

const code = await testAgents.generateTest('Login test for SauceDemo');
console.log(code);
```

### Generate Test Plan

```javascript
const plan = await testAgents.planTest('Checkout flow test', {
  testType: 'e2e',
  priority: 'high'
});
```

### Analyze Page

```javascript
await page.goto('https://www.saucedemo.com');
const analysis = await testAgents.analyzePageContext(
  page,
  'What should I test on this page?'
);
```

### Heal Failed Test

```javascript
const fix = await testAgents.healTest({
  errorMessage: 'Selector not found: #login-button',
  testCode: 'await page.click("#login-button")',
  pageUrl: 'https://example.com'
});
```

---

## 🎯 Quick Commands

```bash
# Run MCP demo
npx playwright test mcp-demo.spec.js --headed

# Enable MCP
echo "USE_MCP=true" >> .env

# Disable MCP (use direct AI)
echo "USE_MCP=false" >> .env

# Check MCP status in test
const info = await testAgents.getMCPInfo();
console.log(info);
```

---

## 🔧 MCP vs Direct AI

| Mode | Command | Best For |
|------|---------|----------|
| **MCP** | `USE_MCP=true` | Production, multi-provider |
| **Direct** | `USE_MCP=false` | Prototyping, speed |

---

## 📖 Full Documentation

- **Complete Guide:** [MCP_INTEGRATION_GUIDE.md](MCP_INTEGRATION_GUIDE.md)
- **Architecture:** [MCP_ARCHITECTURE.md](MCP_ARCHITECTURE.md)
- **Examples:** [examples/mcp-usage-examples.js](examples/mcp-usage-examples.js)

---

## ✅ Checklist

- [ ] Enable MCP (`USE_MCP=true`)
- [ ] Run demo (`npx playwright test mcp-demo.spec.js`)
- [ ] Try test generation
- [ ] Try page analysis
- [ ] Read full guide

---

**That's it! You're MCP-powered! 🚀**
