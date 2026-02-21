# 🎭 Microsoft Playwright MCP Integration Guide

## Complete Integration of Microsoft's Official @playwright/mcp Package

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [What is Microsoft Playwright MCP?](#what-is-microsoft-playwright-mcp)
3. [Installation](#installation)
4. [Architecture](#architecture)
5. [Quick Start](#quick-start)
6. [Tools & Capabilities](#tools--capabilities)
7. [Usage Examples](#usage-examples)
8. [API Reference](#api-reference)
9. [Hybrid Workflows](#hybrid-workflows)
10. [Configuration](#configuration)
11. [Troubleshooting](#troubleshooting)

---

## 🤔 Overview

The framework now integrates **TWO** MCP implementations:

| MCP Implementation | Purpose | Key Features |
|-------------------|---------|--------------|
| **Custom MCP** | AI Test Generation | Test planning, code generation, failure analysis |
| **Microsoft MCP** | Browser Automation | Direct browser control via accessibility tree |

**Why Both?**
- **Custom MCP**: AI-powered test creation and healing
- **Microsoft MCP**: Robust, standardized browser automation
- **Together**: AI-assisted automated testing workflows

---

## 🎭 What is Microsoft Playwright MCP?

Microsoft's official Model Context Protocol server for Playwright provides:

### Core Features
- **Accessibility Tree-Based**: No vision models or screenshots needed
- **Fast & Lightweight**: Direct element interaction via semantic references
- **LLM-Friendly**: Structured data optimized for AI consumption
- **Comprehensive Tools**: 25+ browser automation tools

### Key Capabilities
| Category | Tools |
|----------|-------|
| **Navigation** | navigate, navigate_back |
| **Interaction** | click, type, fill_form, select_option, drag |
| **Inspection** | snapshot, screenshot, console_messages, network_requests |
| **Keyboard/Mouse** | press_key, hover, evaluate |
| **Tab Management** | tabs (list, create, close, select) |
| **Advanced** | run_code, resize, file_upload, handle_dialog |

---

## 📦 Installation

### 1. Install Package
```bash
npm install @playwright/mcp --save
```

### 2. Important Understanding

**Microsoft Playwright MCP** is designed to run as a **standalone MCP server**, not as a programmatic library. It's meant to be used with MCP clients like:
- VS Code / VS Code Insiders
- Claude Desktop
- Cursor
- Windsurf
- Other MCP-compatible clients

### 3. Two Ways to Use Microsoft Playwright MCP

#### Option A: As Standalone MCP Server (Production Use)

Run the MCP server:
```bash
npx @playwright/mcp@latest
```

Then configure your MCP client:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

#### Option B: Framework Integration (Demonstration)

The framework includes a **mock wrapper** for demonstration purposes:
```javascript
const microsoftMCP = require('./src/mcp/microsoft-playwright-mcp-client');
await microsoftMCP.connect(); // Mock connection
await microsoftMCP.browserNavigate('https://example.com'); // Mock call
```

⚠️ **Note**: This wrapper demonstrates the API but doesn't execute actual browser automation. For real browser automation, use Option A.

### 4. Environment Configuration
Add to `.env` (optional):
```bash
# Enable Microsoft Playwright MCP mock wrapper
USE_MICROSOFT_MCP=true

# Optional: Custom MCP (AI capabilities)
USE_MCP=true
```

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────┐
│                 Playwright Test Suite                      │
│                   (*.spec.js files)                        │
└─────────────────────┬─────────────────────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────────────────────┐
│                   MCP Manager                              │
│              (Unified Interface)                           │
│                                                            │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │   Custom MCP        │    │  Microsoft MCP           │ │
│  │   (AI Engine)       │    │  (@playwright/mcp)       │ │
│  │                     │    │                          │ │
│  │ • Test Planning     │    │ • Browser Navigation     │ │
│  │ • Code Generation   │    │ • Element Interaction    │ │
│  │ • Failure Analysis  │    │ • Accessibility Tree     │ │
│  │ • Page Analysis     │    │ • Console/Network Logs   │ │
│  └─────────────────────┘    └──────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

### Integration Files

```
src/mcp/
├── playwright-mcp-client.js              # Custom MCP (AI)
├── playwright-mcp-server.js              # Custom MCP Server
├── microsoft-playwright-mcp-client.js    # Microsoft MCP Wrapper [NEW]
└── mcp-manager.js                        # Unified Manager [NEW]

examples/
└── microsoft-mcp-examples.js             # Usage Examples [NEW]

src/tests/
└── microsoft-mcp-integration.spec.js     # Integration Tests [NEW]

docs/
└── MICROSOFT_MCP_INTEGRATION.md          # This Guide [NEW]
```

---

## 🚀 Quick Start

### Production Use (Recommended)

For real browser automation with Microsoft Playwright MCP:

**Step 1:** Run the MCP server in a terminal
```bash
npx @playwright/mcp@latest
```

**Step 2:** Configure your MCP client (VS Code, Claude Desktop, etc.)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Step 3:** Use browser automation tools through your MCP client
- Ask your AI assistant: "Navigate to google.com"
- Ask: "Take a screenshot of the page"
- Ask: "Click the search button"

See [Microsoft Playwright MCP Documentation](https://github.com/microsoft/playwright-mcp#getting-started) for detailed setup.

---

### Framework Demo Mode  (Development/Testing)

The framework includes mock wrappers for demonstration:

#### Option 1: Direct Usage (Mock Mode)

```javascript
const microsoftMCP = require('./src/mcp/microsoft-playwright-mcp-client');

// Connect (mock)
await microsoftMCP.connect();

// These return mock responses for demonstration
await microsoftMCP.browserNavigate('https://www.saucedemo.com');
const snapshot = await microsoftMCP.browserSnapshot();

// Close
await microsoftMCP.browserClose();
```

⚠️ **Note**: This demonstrates the API but doesn't execute real browser automation. The calls return mock responses showing what would happen in production.

#### Option 2: Unified Manager (AI + Browser Mock)

```javascript
const mcpManager = require('./src/mcp/mcp-manager');

// Connect to both (custom AI MCP + Microsoft MCP mock)
await mcpManager.connect({
  customMCP: true,        // AI capabilities (if USE_MCP=true)
  microsoftMCP: true      // Browser automation (mock)
});

// Use AI to generate test plan (requires AI provider configured)
const plan = await mcpManager.generateTestPlan('Login test for SauceDemo');

// Execute with browser automation (mock responses)
await mcpManager.browserNavigate('https://www.saucedemo.com');
const snapshot = await mcpManager.browserSnapshot();

// Close all
await mcpManager.disconnect();
```

⚠️ **Note**: The `mcpManager` combines:
- **Custom MCP** (real AI test generation - requires AI provider)
- **Microsoft MCP** (mock browser automation for demo)

---

## 🔧 Tools & Capabilities

### Core Automation Tools

#### browser_navigate
Navigate to a URL
```javascript
await microsoftMCP.browserNavigate('https://example.com');
```

#### browser_snapshot
Get accessibility tree snapshot (better than screenshot)
```javascript
const snapshot = await microsoftMCP.browserSnapshot();
// Optional: Save to file
const snapshot = await microsoftMCP.browserSnapshot('page-snapshot.md');
```

#### browser_click
Click an element
```javascript
await microsoftMCP.browserClick({
  ref: 'submit-btn',           // Element reference from snapshot
  element: 'Submit button',    // Human-readable description
  doubleClick: false,          // Optional
  button: 'left',              // Optional: left, right, middle
  modifiers: ['Shift']         // Optional: modifier keys
});
```

#### browser_type
Type text into element
```javascript
await microsoftMCP.browserType({
  ref: 'search-input',
  element: 'Search box',
  text: 'Playwright MCP',
  submit: true,              // Press Enter after typing
  slowly: false              // Type character-by-character
});
```

#### browser_fill_form
Fill multiple form fields
```javascript
await microsoftMCP.browserFillForm([
  { ref: 'username', element: 'Username', text: 'admin' },
  { ref: 'password', element: 'Password', text: 'secret' },
  { ref: 'email', element: 'Email', text: 'admin@example.com' }
]);
```

#### browser_select_option
Select dropdown option
```javascript
await microsoftMCP.browserSelectOption({
  ref: 'country-dropdown',
  element: 'Country selector',
  values: ['USA']
});
```

### Inspection Tools

#### browser_console_messages
Get console logs
```javascript
const logs = await microsoftMCP.browserConsoleMessages('info'); // error, warning, info, debug
```

#### browser_network_requests
Get network activity
```javascript
const requests = await microsoftMCP.browserNetworkRequests(false); // includeStatic
```

#### browser_take_screenshot
Capture screenshot
```javascript
await microsoftMCP.browserTakeScreenshot({
  type: 'png',                    // png, jpeg
  filename: 'screenshot.png',
  fullPage: true
});
```

### Advanced Tools

#### browser_run_code
Execute custom Playwright code
```javascript
const result = await microsoftMCP.browserRunCode(`
  async (page) => {
    const title = await page.title();
    const url = page.url();
    return { title, url };
  }
`);
```

#### browser_evaluate
Evaluate JavaScript
```javascript
await microsoftMCP.browserEvaluate({
  function: '() => { return document.title; }'
});
```

#### browser_tabs
Manage tabs
```javascript
// List tabs
await microsoftMCP.browserTabs('list');

// Create new tab
await microsoftMCP.browserTabs('create');

// Switch to tab
await microsoftMCP.browserTabs('select', 0);

// Close tab
await microsoftMCP.browserTabs('close', 1);
```

---

## 💻 Usage Examples

### Example 1: Simple Navigation & Inspection

```javascript
const microsoftMCP = require('./src/mcp/microsoft-playwright-mcp-client');

async function example1() {
  await microsoftMCP.connect();
  
  await microsoftMCP.browserNavigate('https://www.google.com');
  const snapshot = await microsoftMCP.browserSnapshot();
  
  console.log('Page structure:', snapshot);
  
  await microsoftMCP.browserClose();
}
```

### Example 2: Form Automation

```javascript
async function loginTest() {
  await microsoftMCP.connect();
  
  // Navigate
  await microsoftMCP.browserNavigate('https://www.saucedemo.com');
  
  // Fill login form
  await microsoftMCP.browserFillForm([
    { ref: 'user-name', element: 'Username', text: 'standard_user' },
    { ref: 'password', element: 'Password', text: 'secret_sauce' }
  ]);
  
  // Submit
  await microsoftMCP.browserClick({
    ref: 'login-button',
    element: 'Login button'
  });
  
  // Wait and verify
  await microsoftMCP.browserWaitFor({ time: 2 });
  const snapshot = await microsoftMCP.browserSnapshot();
  
  console.log('Logged in:', snapshot.includes('Products'));
  
  await microsoftMCP.browserClose();
}
```

### Example 3: Network & Console Monitoring

```javascript
async function monitoringTest() {
  await microsoftMCP.connect();
  
  await microsoftMCP.browserNavigate('https://example.com');
  
  // Get console messages
  const logs = await microsoftMCP.browserConsoleMessages('error');
  console.log('Console errors:', logs);
  
  // Get network requests
  const requests = await microsoftMCP.browserNetworkRequests(false);
  console.log('API calls:', requests);
  
  await microsoftMCP.browserClose();
}
```

---

## 📚 API Reference

### MicrosoftPlaywrightMCPClient

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `connect()` | `options` | `Promise<void>` | Connect to MCP server |
| `disconnect()` | - | `Promise<void>` | Disconnect from server |
| `listTools()` | - | `Promise<Object>` | List available tools |
| `callTool()` | `name, args` | `Promise<any>` | Call a tool directly |

#### Browser Methods

See [Tools & Capabilities](#tools--capabilities) section for detailed method signatures.

### MCPManager

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `connect()` | `{customMCP, microsoftMCP}` | `Promise<Object>` | Connect to MCP servers |
| `disconnect()` | - | `Promise<void>` | Disconnect all servers |
| `getStatus()` | - | `Object` | Get connection status |

#### AI Methods (Custom MCP)
- `generateTestPlan(requirements, options)`
- `generatePlaywrightCode(description, options)`
- `analyzeTestFailure(failureData)`
- `analyzePageContext(pageData)`

#### Browser Methods (Microsoft MCP)
- All methods from MicrosoftPlaywrightMCPClient
- Prefixed with `browser*` (e.g., `browserNavigate`, `browserClick`)

#### Hybrid Methods
- `aiAssistedWorkflow(goal, url)` - Combine AI planning with browser automation
- `healFailedTest(failureData)` - AI-powered test healing

---

## 🔄 Hybrid Workflows

### AI-Assisted Browser Automation

Combine AI test planning with browser execution:

```javascript
const mcpManager = require('./src/mcp/mcp-manager');

async function aiAssistedTest() {
  // Connect both MCP servers
  await mcpManager.connect({
    customMCP: true,
    microsoftMCP: true
  });
  
  // Step 1: Generate plan with AI
  const plan = await mcpManager.generateTestPlan(
    'Login to SauceDemo and add 3 items to cart'
  );
  console.log('AI Generated Plan:', plan);
  
  // Step 2: Execute with browser automation
  await mcpManager.browserNavigate('https://www.saucedemo.com');
  
  // Step 3: Get page snapshot
  const snapshot = await mcpManager.browserSnapshot();
  
  // Step 4: Generate code based on page state
  const code = await mcpManager.generatePlaywrightCode(
    `Login with username from snapshot: ${snapshot}`
  );
  
  // Step 5: Execute generated actions
  await mcpManager.browserFillForm([
    { ref: 'user-name', element: 'Username', text: 'standard_user' },
    { ref: 'password', element: 'Password', text: 'secret_sauce' }
  ]);
  
  await mcpManager.browserClick({
    ref: 'login-button',
    element: 'Login'
  });
  
  await mcpManager.disconnect();
}
```

### Self-Healing Tests

Use AI to analyze and fix failures:

```javascript
async function selfHealingTest() {
  await mcpManager.connect({ customMCP: true, microsoftMCP: true });
  
  try {
    // Attempt test action
    await mcpManager.browserClick({
      ref: 'old-button-id',
      element: 'Submit button'
    });
  } catch (error) {
    // Test failed - use AI to analyze
    console.log('Test failed, attempting self-heal...');
    
    // Get current page state
    const snapshot = await mcpManager.browserSnapshot();
    
    // Analyze failure with AI
    const healing = await mcpManager.healFailedTest({
      errorMessage: error.message,
      pageState: snapshot,
      failedAction: 'Click submit button'
    });
    
    console.log('AI Healing Suggestions:', healing.analysis);
    
    // Apply suggested fix (if available)
    if (healing.suggestedFix) {
      // Retry with updated selector
      await mcpManager.browserClick(healing.suggestedFix);
    }
  }
  
  await mcpManager.disconnect();
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# .env file

# Enable Microsoft Playwright MCP
USE_MICROSOFT_MCP=true

# Enable Custom MCP (AI capabilities)
USE_MCP=true

# AI Provider Configuration (for Custom MCP)
AI_PROVIDER=ollama
OLLAMA_MODEL=llama3.2:3b
OLLAMA_BASE_URL=http://localhost:11434

# Or use Anthropic
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your-key

# Or use OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=your-key
```

### Microsoft MCP Server Options

The @playwright/mcp package supports many configuration options:

```javascript
await microsoftMCP.connect({
  browser: 'chromium',        // chromium, firefox, webkit
  headless: false,            // Run in headed mode
  viewport: { width: 1280, height: 720 },
  timeout: 30000,             // Navigation timeout
  // ... many more options available
});
```

See [Microsoft Playwright MCP README](../node_modules/@playwright/mcp/README.md) for full configuration options.

---

## 🐛 Troubleshooting

### Issue: Connection Failed

**Error**: `Failed to connect to Microsoft Playwright MCP`

**Solution**:
1. Verify installation: `npm list @playwright/mcp`
2. Check Node version: `node --version` (requires 18+)
3. Set environment variable: `USE_MICROSOFT_MCP=true`

### Issue: Tools Not Available

**Error**: `Tool not found` or empty tools list

**Solution**:
1. Ensure connection is established: `await microsoftMCP.connect()`
2. List tools: `await microsoftMCP.listTools()`
3. Check tool name spelling

### Issue: Element Not Found

**Error**: `Element with ref 'xyz' not found`

**Solution**:
1. Get fresh snapshot: `const snapshot = await microsoftMCP.browserSnapshot()`
2. Find correct element reference in snapshot
3. Use the exact `ref` value from snapshot
4. Provide descriptive `element` parameter

### Issue: Both MCPs Conflict

**Error**: Unexpected behavior when using both MCPs

**Solution**:
1. Use `mcpManager` for unified access
2. Be explicit about which MCP to use
3. Custom MCP for AI, Microsoft MCP for browser
4. Don't try to use both for the same operation

---

## 📖 Additional Resources

- **Microsoft Playwright MCP**: https://github.com/microsoft/playwright-mcp
- **MCP Specification**: https://modelcontextprotocol.io/
- **Playwright Docs**: https://playwright.dev/
- **Framework Docs**: See `docs/` folder

---

## 🎉 Summary

You now have:

✅ **Microsoft Playwright MCP** - Installed and integrated  
✅ **Custom MCP** - AI test generation capabilities  
✅ **Unified Manager** - Single interface for both  
✅ **25+ Browser Tools** - Complete automation toolkit  
✅ **Hybrid Workflows** - AI + Browser automation  
✅ **Examples & Tests** - Ready to use code samples  

**Next Steps:**
1. Run examples: `node examples/microsoft-mcp-examples.js`
2. Run tests: `npx playwright test microsoft-mcp-integration.spec.js`
3. Build your own AI-assisted tests!

---

**Questions?** Check the troubleshooting section or explore the example files.
