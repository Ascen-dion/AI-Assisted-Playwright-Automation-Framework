/**
 * Microsoft Playwright MCP Integration Tests
 * 
 * Demonstrates using Microsoft's @playwright/mcp for browser automation
 * These tests use the official Playwright MCP package
 * 
 * Setup:
 * 1. Install: npm install @playwright/mcp
 * 2. Set in .env: USE_MICROSOFT_MCP=true
 * 3. Run: npx playwright test microsoft-mcp-integration.spec.js --headed
 */

const { test, expect } = require('@playwright/test');
const mcpManager = require('../../mcp/mcp-manager');
const microsoftMCP = require('../../mcp/microsoft-playwright-mcp-client');

test.describe('Microsoft Playwright MCP Integration', () => {
  
  test.beforeAll(async () => {
    console.log('\n🎭 Microsoft Playwright MCP Integration Tests Starting...\n');
  });

  test.afterAll(async () => {
    await mcpManager.disconnect();
    console.log('\n✅ All Microsoft MCP tests completed!\n');
  });

  test('1. MCP Connection and Info', async () => {
    console.log('\n🔌 Test 1: Connecting to Microsoft Playwright MCP...\n');

    // Connect to Microsoft MCP
    await microsoftMCP.connect();

    // List available tools
    const tools = await microsoftMCP.listTools();
    
    console.log(`📋 Available Tools: ${tools.tools?.length || 0}`);
    if (tools.tools && tools.tools.length > 0) {
      console.log('\nSample tools:');
      tools.tools.slice(0, 5).forEach(tool => {
        console.log(`  ✓ ${tool.name}: ${tool.description}`);
      });
    }

    expect(microsoftMCP.isConnected).toBe(true);
  });

  test('2. Browser Navigation and Snapshot', async () => {
    console.log('\n🌐 Test 2: Navigation and Snapshot...\n');

    await microsoftMCP.connect();

    // Navigate to Google
    console.log('Navigating to Google...');
    await microsoftMCP.browserNavigate('https://www.google.com');

    // Get accessibility snapshot
    console.log('Taking accessibility snapshot...');
    const snapshot = await microsoftMCP.browserSnapshot();

    console.log('Snapshot preview:');
    console.log(snapshot.substring(0, 300) + '...\n');

    expect(snapshot).toBeDefined();
    expect(snapshot.length).toBeGreaterThan(0);
  });

  test('3. Form Interaction - SauceDemo Login', async () => {
    console.log('\n📝 Test 3: Form Interaction...\n');

    await microsoftMCP.connect();

    // Navigate to SauceDemo
    console.log('Navigating to SauceDemo...');
    await microsoftMCP.browserNavigate('https://www.saucedemo.com');

    // Get initial snapshot
    const initialSnapshot = await microsoftMCP.browserSnapshot();
    console.log('Initial page loaded');

    // Fill form fields
    console.log('Filling login form...');
    await microsoftMCP.browserFillForm([
      {
        ref: 'user-name',
        element: 'Username field',
        text: 'standard_user'
      },
      {
        ref: 'password',
        element: 'Password field',
        text: 'secret_sauce'
      }
    ]);

    console.log('Clicking login button...');
    await microsoftMCP.browserClick({
      ref: 'login-button',
      element: 'Login button'
    });

    // Wait for navigation
    await microsoftMCP.browserWaitFor({ time: 2 });

    // Get final snapshot
    const finalSnapshot = await microsoftMCP.browserSnapshot();
    console.log('Login completed, products page loaded\n');

    expect(finalSnapshot).toBeDefined();
  });

  test('4. Console and Network Monitoring', async () => {
    console.log('\n📊 Test 4: Console and Network Monitoring...\n');

    await microsoftMCP.connect();

    // Navigate to a page
    await microsoftMCP.browserNavigate('https://www.google.com');

    // Get console messages
    console.log('Fetching console messages...');
    const consoleLogs = await microsoftMCP.browserConsoleMessages('info');
    console.log('Console messages retrieved');

    // Get network requests
    console.log('Fetching network requests...');
    const networkRequests = await microsoftMCP.browserNetworkRequests(false);
    console.log('Network requests retrieved\n');

    expect(consoleLogs).toBeDefined();
    expect(networkRequests).toBeDefined();
  });

  test('5. Running Custom Playwright Code', async () => {
    console.log('\n🚀 Test 5: Running Custom Playwright Code...\n');

    await microsoftMCP.connect();

    await microsoftMCP.browserNavigate('https://www.google.com');

    // Run custom Playwright code
    console.log('Executing custom Playwright code...');
    const result = await microsoftMCP.browserRunCode(`
      async (page) => {
        const title = await page.title();
        const url = page.url();
        const viewportSize = page.viewportSize();
        return { title, url, viewportSize };
      }
    `);

    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('');

    expect(result).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.url).toContain('google.com');
  });

  test('6. Keyboard and Mouse Interactions', async () => {
    console.log('\n⌨️ Test 6: Keyboard and Mouse Interactions...\n');

    await microsoftMCP.connect();

    // Navigate to Google
    await microsoftMCP.browserNavigate('https://www.google.com');
    await microsoftMCP.browserWaitFor({ time: 1 });

    // Get snapshot to find search box
    const snapshot = await microsoftMCP.browserSnapshot();

    // Type in search box (assuming we have the ref from snapshot)
    console.log('Typing in search box...');
    await microsoftMCP.browserType({
      ref: 'APjFqb', // Google search input ID (may vary)
      element: 'Search input',
      text: 'Playwright MCP',
      slowly: false
    });

    // Press Enter
    console.log('Pressing Enter...');
    await microsoftMCP.browserPressKey('Enter');

    await microsoftMCP.browserWaitFor({ time: 2 });

    console.log('Search completed\n');
  });

  test('7. Screenshot Capture', async () => {
    console.log('\n📷 Test 7: Screenshot Capture...\n');

    await microsoftMCP.connect();

    await microsoftMCP.browserNavigate('https://www.saucedemo.com');

    // Take full page screenshot
    console.log('Taking screenshot...');
    const screenshot = await microsoftMCP.browserTakeScreenshot({
      type: 'png',
      fullPage: false
    });

    console.log('Screenshot captured\n');

    expect(screenshot).toBeDefined();
  });

  test('8. Tab Management', async () => {
    console.log('\n📑 Test 8: Tab Management...\n');

    await microsoftMCP.connect();

    // Initial tab
    await microsoftMCP.browserNavigate('https://www.google.com');

    // List tabs
    console.log('Listing tabs...');
    let tabs = await microsoftMCP.browserTabs('list');
    console.log(`Current tabs: ${tabs}`);

    // Create new tab
    console.log('Creating new tab...');
    await microsoftMCP.browserTabs('create');

    tabs = await microsoftMCP.browserTabs('list');
    console.log(`Tabs after creation: ${tabs}`);

    // Switch to first tab
    console.log('Switching to tab 0...');
    await microsoftMCP.browserTabs('select', 0);

    console.log('Tab operations completed\n');
  });

  test('9. Unified MCP Manager - AI + Browser', async () => {
    console.log('\n🤖 Test 9: Unified MCP Manager (AI + Browser Automation)...\n');

    // Connect both MCP servers
    console.log('Connecting to both MCP servers...');
    const status = await mcpManager.connect({
      customMCP: true,
      microsoftMCP: true
    });

    console.log('Connection status:', status);

    // Use AI to generate test plan
    if (status.custom) {
      console.log('Generating test plan with AI...');
      try {
        const plan = await mcpManager.generateTestPlan('Simple login test');
        console.log('Test plan preview:', plan.substring(0, 200) + '...');
      } catch (error) {
        console.log('AI plan generation skipped:', error.message);
      }
    }

    // Use browser automation
    if (status.microsoft) {
      console.log('Performing browser automation...');
      await mcpManager.browserNavigate('https://www.saucedemo.com');
      const snapshot = await mcpManager.browserSnapshot();
      console.log('Browser snapshot captured');
    }

    console.log('Unified MCP test completed\n');
  });

  test('10. AI-Assisted Browser Workflow', async () => {
    console.log('\n🎯 Test 10: AI-Assisted Browser Workflow...\n');

    await mcpManager.connect({
      customMCP: true,
      microsoftMCP: true
    });

    // Run AI-assisted workflow
    console.log('Starting AI-assisted workflow...');
    const result = await mcpManager.aiAssistedWorkflow(
      'Login to SauceDemo',
      'https://www.saucedemo.com'
    );

    console.log('Workflow result:');
    console.log(`  Goal: ${result.goal}`);
    console.log(`  URL: ${result.url}`);
    console.log(`  Success: ${result.success}`);
    console.log(`  Actions performed: ${result.actions.length}`);
    
    if (result.plan) {
      console.log(`  AI Plan generated: Yes (${result.plan.length} chars)`);
    }

    console.log('');

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

});

test.describe('MCP Status and Configuration', () => {

  test('Check MCP Configuration', async () => {
    console.log('\n⚙️ Checking MCP Configuration...\n');

    const status = mcpManager.getStatus();

    console.log('MCP Status:');
    console.log(`  Custom MCP (AI):`);
    console.log(`    Enabled: ${status.custom.enabled}`);
    console.log(`    Connected: ${status.custom.connected}`);
    console.log(`  Microsoft MCP (Browser):`);
    console.log(`    Enabled: ${status.microsoft.enabled}`);
    console.log(`    Connected: ${status.microsoft.connected}`);
    console.log('');

    expect(status).toBeDefined();
  });

});
