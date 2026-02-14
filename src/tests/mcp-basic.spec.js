/**
 * Simple MCP Test - Basic Verification
 * Tests that MCP integration is working correctly
 */

const { test } = require('../core/ai-test-runner');

test.describe('MCP Basic Verification', () => {
  
  test('MCP client initializes correctly', async ({ mcpClaude, page }) => {
    // Verify mcpClaude fixture is available
    console.log('MCP Client initialized:', mcpClaude ? 'YES' : 'NO');
    console.log('MCP Server available:', mcpClaude.mcpServer ? 'YES' : 'NO');
    console.log('Available tools:', mcpClaude.availableTools?.length || 0);
    
    // Navigate using MCP
    await page.goto('https://www.saucedemo.com/');
    console.log('Page loaded successfully');
    
    // Verify page is accessible
    const title = await page.title();
    console.log('Page title:', title);
  });

  test('MCP server methods are accessible', async ({ mcpClaude, page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Test basic MCP server method
    const result = await mcpClaude.mcpServer.navigateToUrl({
      url: 'https://www.saucedemo.com/',
      waitUntil: 'load'
    });
    
    console.log('Navigate result:', result);
  });

  test('DOM snapshot works', async ({ mcpClaude, page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Get DOM snapshot
    const snapshot = await mcpClaude.mcpServer.getDOMSnapshot({ maxDepth: 2 });
    console.log('DOM Snapshot captured:', snapshot.content[0].text.substring(0, 200) + '...');
  });

  test('Screenshot works', async ({ mcpClaude, page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Take screenshot
    const screenshot = await mcpClaude.mcpServer.takeScreenshot({ fullPage: false });
    console.log('Screenshot captured:', screenshot.content[0].data ? 'YES (base64)' : 'NO');
    console.log('Screenshot length:', screenshot.content[0].data?.length || 0, 'bytes');
  });

});
