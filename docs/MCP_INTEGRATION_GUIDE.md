# 🔌 MCP Integration Guide

## Model Context Protocol in Playwright AI Framework

This guide explains how **Model Context Protocol (MCP)** is integrated into the Playwright AI Framework, enabling standardized AI communication, multi-provider support, and advanced agentic workflows.

---

## 📚 Table of Contents

1. [What is MCP?](#what-is-mcp)
2. [Why MCP?](#why-mcp)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [MCP Tools](#mcp-tools)
6. [Usage Examples](#usage-examples)
7. [Configuration](#configuration)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

---

## 🤔 What is MCP?

**Model Context Protocol (MCP)** is an open standard created by Anthropic that enables:

- **Standardized AI Communication** - Consistent interface across AI providers
- **Tool-Based Architecture** - AI capabilities exposed as callable tools
- **Context Management** - Efficient sharing of application state with AI
- **Multi-Provider Support** - Switch between Ollama, Claude, GPT seamlessly

**Think of MCP as "USB for AI"** - plug any AI provider into any application.

---

## 💡 Why MCP?

### Without MCP (Direct Integration)
```javascript
// Hardcoded to one AI provider
const response = await ollamaClient.generate({
  model: 'llama3.2:3b',
  prompt: 'Generate test plan...'
});
```

**Limitations:**
- ❌ Vendor lock-in
- ❌ No standardized interface
- ❌ Manual context passing
- ❌ Difficult to extend

### With MCP (Protocol-Based)
```javascript
// Works with any MCP-compatible AI provider
const result = await mcpClient.callTool('generate_test_plan', {
  requirements: 'Login test for SauceDemo'
});
```

**Benefits:**
- ✅ Provider-agnostic
- ✅ Standardized tool interface
- ✅ Automatic context sharing
- ✅ Easy to extend with new tools

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Playwright Test Suite                 │
│        (Your *.spec.js files)                  │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│        Test Agents (MCP-Enhanced)               │
│  • planTest()    - Planner Agent                │
│  • generateTest() - Generator Agent             │
│  • healTest()    - Healer Agent                 │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│          MCP Client                             │
│  • callTool()                                   │
│  • listTools()                                  │
│  • analyzePageContext()                         │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│          MCP Server                             │
│  Tools:                                         │
│  • generate_test_plan                           │
│  • generate_playwright_code                     │
│  • analyze_test_failure                         │
│  • analyze_page_context                         │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌─────────────┐  ┌─────────────┐
│   Ollama    │  │  Anthropic  │
│  (Local)    │  │   (Cloud)   │
└─────────────┘  └─────────────┘
```

---

## 🚀 Quick Start

### 1. Enable MCP

Add to your `.env` file:

```env
USE_MCP=true
```

### 2. Run MCP Demo

```bash
# Quick demo (8 tests, ~5 minutes)
npx playwright test mcp-demo.spec.js --headed

# See MCP in action
```

### 3. Use MCP in Your Tests

```javascript
const testAgents = require('./src/core/test-agents-mcp');

test('Generate test with MCP', async () => {
  // MCP automatically used if USE_MCP=true
  const code = await testAgents.generateTest('Login test for SauceDemo');
  console.log(code);
});
```

---

## 🔧 MCP Tools

The framework exposes 4 MCP tools:

### 1. `generate_test_plan`

**Purpose:** Generate comprehensive test plans from requirements

**Input:**
```javascript
{
  requirements: "Login test for SauceDemo",
  testType: "smoke",        // smoke, regression, e2e, integration
  priority: "high"          // high, medium, low
}
```

**Output:** Structured test plan (markdown)

**Example:**
```javascript
const plan = await testAgents.planTest('Login test', {
  testType: 'smoke',
  priority: 'high'
});
```

---

### 2. `generate_playwright_code`

**Purpose:** Generate executable Playwright test code

**Input:**
```javascript
{
  testDescription: "Login to SauceDemo and verify dashboard",
  url: "https://www.saucedemo.com",
  framework: "playwright-ai"  // or "playwright"
}
```

**Output:** Executable JavaScript test code

**Example:**
```javascript
const code = await testAgents.generateTest('Login test', {
  url: 'https://www.saucedemo.com',
  framework: 'playwright-ai'
});
```

---

### 3. `analyze_test_failure`

**Purpose:** Analyze test failures and suggest fixes

**Input:**
```javascript
{
  errorMessage: "TimeoutError: Waiting for selector failed",
  testCode: "await page.click('#login')...",
  screenshot: "base64_encoded_screenshot",
  pageUrl: "https://www.saucedemo.com",
  stackTrace: "Error stack trace..."
}
```

**Output:** Root cause analysis and fix suggestions

**Example:**
```javascript
const analysis = await testAgents.healTest({
  errorMessage: 'Selector not found: #login-button',
  testCode: codeSnippet,
  pageUrl: 'https://example.com'
});
```

---

### 4. `analyze_page_context` ⭐ NEW

**Purpose:** Analyze full page context (DOM + screenshot + metadata)

**Input:**
```javascript
{
  url: "https://www.saucedemo.com",
  html: "<html>...</html>",
  screenshot: "base64_screenshot",
  viewport: { width: 1280, height: 720 },
  question: "What are the main interactive elements?"
}
```

**Output:** AI analysis of page structure and testability

**Example:**
```javascript
await page.goto('https://www.saucedemo.com');
const analysis = await testAgents.analyzePageContext(
  page,
  'What elements should I test on this page?'
);
```

---

## 💻 Usage Examples

### Basic Test Generation

```javascript
const { test } = require('@playwright/test');
const testAgents = require('./src/core/test-agents-mcp');

test('Generate login test', async () => {
  const code = await testAgents.generateTest(`
    Test: Login to SauceDemo
    1. Navigate to https://www.saucedemo.com
    2. Enter username: standard_user
    3. Enter password: secret_sauce
    4. Click login button
    5. Verify dashboard is displayed
  `);
  
  console.log('Generated Code:', code);
});
```

### Plan and Generate Workflow

```javascript
test('Full workflow: Plan → Generate → Save', async () => {
  const { plan, code } = await testAgents.planAndGenerate(
    'Checkout flow test for e-commerce',
    {
      testType: 'e2e',
      framework: 'playwright-ai',
      url: 'https://www.saucedemo.com',
      savePlanTo: 'test-results/agents/plans/checkout.md',
      saveCodeTo: 'src/tests/generated-checkout.spec.js'
    }
  );
  
  console.log('Plan saved!');
  console.log('Code saved!');
});
```

### Page Context Analysis

```javascript
test('Analyze page for testability', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  
  const insights = await testAgents.analyzePageContext(
    page,
    'What are the best selectors to use for automation?'
  );
  
  console.log('AI Insights:', insights);
});
```

### Failure Healing

```javascript
test('Auto-heal failed test', async ({ page }, testInfo) => {
  try {
    await page.click('#wrong-selector');
  } catch (error) {
    const screenshot = await page.screenshot({ encoding: 'base64' });
    
    const fix = await testAgents.healTest({
      errorMessage: error.message,
      testCode: 'await page.click("#wrong-selector")',
      screenshot,
      pageUrl: page.url()
    });
    
    console.log('Suggested Fix:', fix);
  }
});
```

### Direct MCP Tool Call

```javascript
test('Use MCP tool directly', async () => {
  const result = await testAgents.callMCPTool('generate_test_plan', {
    requirements: 'API testing for REST endpoints',
    testType: 'api',
    priority: 'high'
  });
  
  console.log('Direct Tool Response:', result.content[0].text);
});
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Enable/disable MCP
USE_MCP=true

# AI Provider (when using MCP)
AI_PROVIDER=local              # local (Ollama), anthropic, openai

# Ollama Configuration
OLLAMA_MODEL=llama3.2:3b
OLLAMA_BASE_URL=http://localhost:11434/v1

# Anthropic Configuration (optional)
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### Toggle MCP On/Off

**MCP Enabled** (`USE_MCP=true`):
- Uses MCP protocol for all AI communication
- Standardized tool interface
- Multi-provider support
- Enhanced context sharing

**MCP Disabled** (`USE_MCP=false`):
- Direct AI engine integration
- Simpler setup
- Faster for basic use cases
- No MCP overhead

**Best Practice:** Enable MCP for production, disable for quick prototyping.

---

## 📖 API Reference

### TestAgentsMCP Class

#### `planTest(description, options)`

Generate test plan.

**Parameters:**
- `description` (string): Test requirements
- `options` (object):
  - `testType`: 'smoke' | 'regression' | 'e2e' | 'integration'
  - `priority`: 'high' | 'medium' | 'low'
  - `saveTo`: File path to save plan

**Returns:** Promise<string> - Test plan

---

#### `generateTest(testDescription, options)`

Generate executable test code.

**Parameters:**
- `testDescription` (string): Test description or plan
- `options` (object):
  - `url`: Target application URL
  - `framework`: 'playwright-ai' | 'playwright'
  - `saveTo`: File path to save code

**Returns:** Promise<string> - Test code

---

#### `healTest(context, options)`

Analyze test failure and suggest fixes.

**Parameters:**
- `context` (object):
  - `errorMessage`: Error message
  - `testCode`: Failed test code
  - `screenshot`: Base64 screenshot
  - `pageUrl`: URL where test failed
  - `stackTrace`: Error stack trace

**Returns:** Promise<string> - Analysis and fixes

---

#### `analyzePageContext(page, question)`

Analyze full page context via MCP.

**Parameters:**
- `page` (Page): Playwright page object
- `question` (string): Optional specific question

**Returns:** Promise<string> - Page analysis

---

#### `getMCPInfo()`

Get MCP server information.

**Returns:** Promise<object> - Server info

---

#### `listMCPTools()`

List available MCP tools.

**Returns:** Promise<object> - Tools list

---

#### `callMCPTool(name, args)`

Call MCP tool directly.

**Parameters:**
- `name` (string): Tool name
- `args` (object): Tool arguments

**Returns:** Promise<object> - Tool response

---

### MCP Client

#### `connect()`

Connect to MCP server.

**Returns:** Promise<void>

---

#### `disconnect()`

Disconnect from MCP server.

**Returns:** Promise<void>

---

#### `callTool(name, args)`

Call an MCP tool.

**Parameters:**
- `name` (string): Tool name
- `args` (object): Tool arguments

**Returns:** Promise<object> - Tool response

---

## 🐛 Troubleshooting

### MCP Not Available

**Error:** "MCP not enabled. Set USE_MCP=true"

**Solution:**
```bash
# Add to .env
echo "USE_MCP=true" >> .env
```

---

### MCP Connection Failed

**Error:** "Failed to connect to MCP server"

**Possible Causes:**
1. Ollama not running
2. Wrong BASE_URL
3. Model not downloaded

**Solutions:**
```bash
# 1. Start Ollama
ollama serve

# 2. Check URL in .env
OLLAMA_BASE_URL=http://localhost:11434/v1

# 3. Download model
ollama pull llama3.2:3b
```

---

### Tools Not Listed

**Error:** Empty tools array

**Solution:**
```javascript
// Check MCP status
const info = await testAgents.getMCPInfo();
console.log(info);

// If enabled: false
// Set USE_MCP=true in .env and restart
```

---

### Page Context Analysis Fails

**Error:** "MCP not enabled"

**Solution:**
```env
# Page context analysis requires MCP
USE_MCP=true
```

---

## 🎯 Best Practices

### 1. Start Simple
```javascript
// First, test MCP connection
const info = await testAgents.getMCPInfo();
console.log('MCP Status:', info.available ? 'Ready' : 'Not enabled');
```

### 2. Use Fallback Logic
```javascript
// Test agents automatically fall back to direct AI if MCP unavailable
const plan = await testAgents.planTest('Login test');
// Works with or without MCP!
```

### 3. Enable MCP for Production
```javascript
// Production: MCP enabled for standardization
USE_MCP=true

// Development: Direct AI for speed
USE_MCP=false
```

### 4. Cache Tool Lists
```javascript
// List tools once, use many times
const { tools } = await testAgents.listMCPTools();
tools.forEach(tool => console.log(tool.name));
```

---

## 📊 MCP vs Direct AI

| Feature | MCP Mode | Direct AI Mode |
|---------|----------|----------------|
| **Setup** | USE_MCP=true | USE_MCP=false |
| **AI Providers** | Multi-provider | Single provider |
| **Tool Interface** | Standardized | Custom |
| **Context Sharing** | Automatic | Manual |
| **Extensibility** | Easy (add tools) | Moderate |
| **Performance** | Slight overhead | Direct |
| **Best For** | Production | Prototyping |

---

## 🚀 Next Steps

1. **Try the Demo:**
   ```bash
   npx playwright test mcp-demo.spec.js --headed
   ```

2. **Read Examples:**
   See `examples/mcp-usage-examples.js`

3. **Enable in Your Tests:**
   Add `USE_MCP=true` to `.env`

4. **Explore Tools:**
   ```javascript
   const tools = await testAgents.listMCPTools();
   ```

---

## 📚 Additional Resources

- **MCP Quick Start:** [MCP_QUICK_START.md](MCP_QUICK_START.md)
- **MCP Architecture:** [MCP_ARCHITECTURE.md](MCP_ARCHITECTURE.md)
- **Usage Examples:** [examples/mcp-usage-examples.js](examples/mcp-usage-examples.js)
- **Official MCP Docs:** https://modelcontextprotocol.io/

---

**Need help?** Check our [troubleshooting section](#troubleshooting) or file an issue on GitHub.

**Happy Testing with MCP! 🎯**
