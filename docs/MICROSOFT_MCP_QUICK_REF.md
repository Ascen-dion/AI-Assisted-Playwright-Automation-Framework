# 🚀 Microsoft Playwright MCP - Quick Reference

## Installation
```bash
npm install @playwright/mcp
```

## Environment Setup
```bash
# .env
USE_MICROSOFT_MCP=true
```

---

## Basic Usage

### Connect
```javascript
const microsoftMCP = require('./src/mcp/microsoft-playwright-mcp-client');
await microsoftMCP.connect();
```

### Navigate
```javascript
await microsoftMCP.browserNavigate('https://example.com');
```

### Snapshot (Accessibility Tree)
```javascript
const snapshot = await microsoftMCP.browserSnapshot();
```

### Click
```javascript
await microsoftMCP.browserClick({
  ref: 'button-id',
  element: 'Submit button'
});
```

### Type
```javascript
await microsoftMCP.browserType({
  ref: 'input-id',
  element: 'Username field',
  text: 'admin'
});
```

### Fill Form
```javascript
await microsoftMCP.browserFillForm([
  { ref: 'username', element: 'Username', text: 'user' },
  { ref: 'password', element: 'Password', text: 'pass' }
]);
```

### Close
```javascript
await microsoftMCP.browserClose();
```

---

## Unified Manager (AI + Browser)

```javascript
const mcpManager = require('./src/mcp/mcp-manager');

// Connect both
await mcpManager.connect({
  customMCP: true,        // AI
  microsoftMCP: true      // Browser
});

// AI: Generate plan
const plan = await mcpManager.generateTestPlan('Login test');

// Browser: Automate
await mcpManager.browserNavigate('https://example.com');
await mcpManager.browserClick({ ref: 'btn', element: 'Button' });

// Disconnect
await mcpManager.disconnect();
```

---

## Key Tools

| Tool | Purpose |
|------|---------|
| `browserNavigate(url)` | Navigate to URL |
| `browserSnapshot()` | Get accessibility tree |
| `browserClick(options)` | Click element |
| `browserType(options)` | Type text |
| `browserFillForm(fields)` | Fill multiple fields |
| `browserSelectOption(options)` | Select dropdown |
| `browserPressKey(key)` | Press keyboard key |
| `browserWaitFor(options)` | Wait for condition |
| `browserTakeScreenshot(options)` | Capture screenshot |
| `browserConsoleMessages(level)` | Get console logs |
| `browserNetworkRequests(includeStatic)` | Get network activity |
| `browserRunCode(code)` | Run Playwright code |
| `browserTabs(action, index)` | Manage tabs |
| `browserClose()` | Close browser |

---

## Examples

### Example 1: Simple Test
```javascript
await microsoftMCP.connect();
await microsoftMCP.browserNavigate('https://www.google.com');
const snapshot = await microsoftMCP.browserSnapshot();
console.log(snapshot);
await microsoftMCP.browserClose();
```

### Example 2: Login Flow
```javascript
await microsoftMCP.connect();
await microsoftMCP.browserNavigate('https://www.saucedemo.com');

await microsoftMCP.browserFillForm([
  { ref: 'user-name', element: 'Username', text: 'standard_user' },
  { ref: 'password', element: 'Password', text: 'secret_sauce' }
]);

await microsoftMCP.browserClick({
  ref: 'login-button',
  element: 'Login'
});

await microsoftMCP.browserWaitFor({ time: 2 });
await microsoftMCP.browserClose();
```

### Example 3: Monitoring
```javascript
await microsoftMCP.connect();
await microsoftMCP.browserNavigate('https://example.com');

const logs = await microsoftMCP.browserConsoleMessages('error');
const requests = await microsoftMCP.browserNetworkRequests(false);

console.log('Errors:', logs);
console.log('Requests:', requests);

await microsoftMCP.browserClose();
```

---

## Run Examples
```bash
# Node examples
node examples/microsoft-mcp-examples.js

# Playwright tests
npx playwright test microsoft-mcp-integration.spec.js --headed
```

---

## Architecture

```
Custom MCP (AI)           Microsoft MCP (Browser)
     ↓                            ↓
Test Planning             Element Interaction
Code Generation           Accessibility Tree
Failure Analysis          Console/Network Logs
     ↓                            ↓
         MCP Manager (Unified)
                ↓
         Your Test Suite
```

---

## Documentation

- **Full Guide**: [docs/MICROSOFT_MCP_INTEGRATION.md](MICROSOFT_MCP_INTEGRATION.md)
- **Examples**: [examples/microsoft-mcp-examples.js](../examples/microsoft-mcp-examples.js)
- **Tests**: [src/tests/microsoft-mcp-integration.spec.js](../src/tests/microsoft-mcp-integration.spec.js)
- **Official Docs**: https://github.com/microsoft/playwright-mcp

---

## Troubleshooting

**Connection Failed?**
- Check: `npm list @playwright/mcp`
- Verify: Node 18+
- Set: `USE_MICROSOFT_MCP=true`

**Element Not Found?**
1. Get snapshot: `browserSnapshot()`
2. Find element `ref` in snapshot
3. Use exact `ref` value

---

## Quick Tips

✅ Use `browserSnapshot()` instead of screenshots  
✅ Get element `ref` from snapshot for interactions  
✅ Use `mcpManager` when combining AI + Browser  
✅ Microsoft MCP for browser, Custom MCP for AI  
✅ Run examples first to understand the flow  

---

**Ready to go!** 🚀
