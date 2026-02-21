/**
 * Microsoft Playwright MCP Examples
 * 
 * Demonstrates how to use Microsoft's official @playwright/mcp package
 * for browser automation via Model Context Protocol
 * 
 * Run with: node examples/microsoft-mcp-examples.js
 */

const mcpManager = require('../src/mcp/mcp-manager');
const microsoftMCP = require('../src/mcp/microsoft-playwright-mcp-client');

// Example 1: Basic Browser Automation
async function example1_BasicAutomation() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 1: Basic Browser Automation with Microsoft MCP');
  console.log('='.repeat(80) + '\n');

  try {
    // Connect to Microsoft MCP
    await microsoftMCP.connect();

    // Navigate to a website
    console.log('🌐 Navigating to Google...');
    await microsoftMCP.browserNavigate('https://www.google.com');

    // Get accessibility snapshot (better than screenshot)
    console.log('📸 Getting page snapshot...');
    const snapshot = await microsoftMCP.browserSnapshot();
    console.log('Snapshot preview:');
    console.log(snapshot.substring(0, 500) + '...\n');

    // Close browser
    await microsoftMCP.browserClose();

    console.log('✅ Example 1 completed!\n');
  } catch (error) {
    console.error('❌ Example 1 failed:', error.message);
  }
}

// Example 2: Form Filling
async function example2_FormFilling() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 2: Form Filling with Microsoft MCP');
  console.log('='.repeat(80) + '\n');

  try {
    await microsoftMCP.connect();

    // Navigate to SauceDemo
    console.log('🌐 Navigating to SauceDemo...');
    await microsoftMCP.browserNavigate('https://www.saucedemo.com');

    // Get snapshot to understand page structure
    console.log('📸 Getting page snapshot...');
    const snapshot = await microsoftMCP.browserSnapshot();

    // Fill login form (Note: You need actual ref values from snapshot)
    console.log('📝 Filling login form...');
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

    // Click login button
    console.log('🖱️ Clicking login button...');
    await microsoftMCP.browserClick({
      ref: 'login-button',
      element: 'Login button'
    });

    // Wait for page to load
    await microsoftMCP.browserWaitFor({ time: 2 });

    // Get final snapshot
    const finalSnapshot = await microsoftMCP.browserSnapshot();
    console.log('Final page snapshot preview:');
    console.log(finalSnapshot.substring(0, 300) + '...\n');

    await microsoftMCP.browserClose();

    console.log('✅ Example 2 completed!\n');
  } catch (error) {
    console.error('❌ Example 2 failed:', error.message);
  }
}

// Example 3: Network and Console Monitoring
async function example3_Monitoring() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 3: Network and Console Monitoring');
  console.log('='.repeat(80) + '\n');

  try {
    await microsoftMCP.connect();

    console.log('🌐 Navigating to a test page...');
    await microsoftMCP.browserNavigate('https://www.google.com');

    // Get console messages
    console.log('📜 Getting console messages...');
    const consoleLogs = await microsoftMCP.browserConsoleMessages('info');
    console.log('Console messages:', consoleLogs);

    // Get network requests
    console.log('🌐 Getting network requests...');
    const networkRequests = await microsoftMCP.browserNetworkRequests(false);
    console.log('Network requests:', networkRequests);

    await microsoftMCP.browserClose();

    console.log('✅ Example 3 completed!\n');
  } catch (error) {
    console.error('❌ Example 3 failed:', error.message);
  }
}

// Example 4: Tab Management
async function example4_TabManagement() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 4: Tab Management');
  console.log('='.repeat(80) + '\n');

  try {
    await microsoftMCP.connect();

    // Navigate to initial page
    await microsoftMCP.browserNavigate('https://www.google.com');

    // List tabs
    console.log('📋 Listing tabs...');
    let tabs = await microsoftMCP.browserTabs('list');
    console.log('Current tabs:', tabs);

    // Create new tab
    console.log('➕ Creating new tab...');
    await microsoftMCP.browserTabs('create');

    tabs = await microsoftMCP.browserTabs('list');
    console.log('Tabs after creating new tab:', tabs);

    // Switch to tab
    console.log('🔀 Switching to tab 0...');
    await microsoftMCP.browserTabs('select', 0);

    await microsoftMCP.browserClose();

    console.log('✅ Example 4 completed!\n');
  } catch (error) {
    console.error('❌ Example 4 failed:', error.message);
  }
}

// Example 5: Running Playwright Code
async function example5_RunPlaywrightCode() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 5: Running Playwright Code Directly');
  console.log('='.repeat(80) + '\n');

  try {
    await microsoftMCP.connect();

    await microsoftMCP.browserNavigate('https://www.google.com');

    // Run custom Playwright code
    console.log('🚀 Running custom Playwright code...');
    const result = await microsoftMCP.browserRunCode(`
      async (page) => {
        const title = await page.title();
        const url = page.url();
        return { title, url };
      }
    `);

    console.log('Result from Playwright code:', result);

    await microsoftMCP.browserClose();

    console.log('✅ Example 5 completed!\n');
  } catch (error) {
    console.error('❌ Example 5 failed:', error.message);
  }
}

// Example 6: Unified MCP Manager (AI + Browser Automation)
async function example6_UnifiedMCPManager() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 6: Unified MCP Manager (AI + Browser Automation)');
  console.log('='.repeat(80) + '\n');

  try {
    // Connect to both MCP servers
    console.log('🔌 Connecting to all MCP servers...');
    const status = await mcpManager.connect({
      customMCP: true,
      microsoftMCP: true
    });

    console.log('Connection status:', status);

    // Use AI to generate test plan
    console.log('\n🎯 Generating test plan with AI...');
    const plan = await mcpManager.generateTestPlan('Login test for SauceDemo');
    console.log('Test plan preview:', plan.substring(0, 300) + '...\n');

    // Use browser automation
    console.log('🌐 Automating browser...');
    await mcpManager.browserNavigate('https://www.saucedemo.com');
    const snapshot = await mcpManager.browserSnapshot();
    console.log('Snapshot preview:', snapshot.substring(0, 300) + '...\n');

    // Close browser
    await mcpManager.browserClose();

    // Disconnect all
    await mcpManager.disconnect();

    console.log('✅ Example 6 completed!\n');
  } catch (error) {
    console.error('❌ Example 6 failed:', error.message);
  }
}

// Example 7: AI-Assisted Workflow
async function example7_AIAssistedWorkflow() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 7: AI-Assisted Browser Workflow');
  console.log('='.repeat(80) + '\n');

  try {
    await mcpManager.connect({
      customMCP: true,
      microsoftMCP: true
    });

    // Run AI-assisted workflow
    console.log('🤖 Running AI-assisted workflow...');
    const result = await mcpManager.aiAssistedWorkflow(
      'Login to SauceDemo and add items to cart',
      'https://www.saucedemo.com'
    );

    console.log('Workflow result:', JSON.stringify(result, null, 2));

    await mcpManager.browserClose();
    await mcpManager.disconnect();

    console.log('✅ Example 7 completed!\n');
  } catch (error) {
    console.error('❌ Example 7 failed:', error.message);
  }
}

// Main function to run all examples
async function runAllExamples() {
  console.log('\n' + '🎭'.repeat(40));
  console.log('MICROSOFT PLAYWRIGHT MCP EXAMPLES');
  console.log('🎭'.repeat(40) + '\n');

  console.log('NOTE: Make sure to set USE_MICROSOFT_MCP=true in .env to enable Microsoft MCP\n');

  // Run examples (uncomment the ones you want to run)
  
  // await example1_BasicAutomation();
  // await example2_FormFilling();
  // await example3_Monitoring();
  // await example4_TabManagement();
  // await example5_RunPlaywrightCode();
  // await example6_UnifiedMCPManager();
  // await example7_AIAssistedWorkflow();

  console.log('\n' + '='.repeat(80));
  console.log('All examples completed! Uncomment examples in runAllExamples() to run them.');
  console.log('='.repeat(80) + '\n');
}

// Run if called directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

module.exports = {
  example1_BasicAutomation,
  example2_FormFilling,
  example3_Monitoring,
  example4_TabManagement,
  example5_RunPlaywrightCode,
  example6_UnifiedMCPManager,
  example7_AIAssistedWorkflow
};
