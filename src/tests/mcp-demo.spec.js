/**
 * MCP Working Demo - No AI Required
 * Demonstrates MCP server tools working directly
 */

const { test } = require('../core/ai-test-runner');

test.describe('MCP Working Demo', () => {
  
  test('Direct MCP server navigation', async ({ mcpClaude, page }) => {
    // Use MCP server directly for navigation
    const result = await mcpClaude.mcpServer.navigateToUrl({
      url: 'https://www.saucedemo.com/',
      waitUntil: 'load'
    });
    
    console.log('✓ MCP Navigation successful');
    console.log('Result:', result.content[0].text);
  });

//   test('MCP click with direct selectors', async ({ mcpClaude, page }) => {
//     await page.goto('https://www.saucedemo.com/');
    
//     // Use MCP server to fill username
//     await mcpClaude.mcpServer.fillInput({
//       selector: '#user-name',
//       value: 'standard_user'
//     });
//     console.log('✓ Filled username via MCP');
    
//     // Fill password
//     await mcpClaude.mcpServer.fillInput({
//       selector: '#password',
//       value: 'secret_sauce'
//     });
//     console.log('✓ Filled password via MCP');
    
//     // Click login button
//     await mcpClaude.mcpServer.clickElement({
//       selector: '#login-button'
//     });
//     console.log('✓ Clicked login via MCP');
    
//     // Wait for products page
//     await page.waitForSelector('.inventory_list');
//     console.log('✓ Login successful!');
//   });

//   test('MCP screenshot capture', async ({ mcpClaude, page }) => {
//     await page.goto('https://www.saucedemo.com/');
    
//     const screenshot = await mcpClaude.mcpServer.takeScreenshot({
//       fullPage: false
//     });
    
//     const imageData = screenshot.content[0].data;
//     console.log('✓ Screenshot captured');
//     console.log('  Size:', imageData.length, 'characters (base64)');
//     console.log('  Type:', screenshot.content[0].mimeType);
//   });

//   test('MCP DOM snapshot', async ({ mcpClaude, page }) => {
//     await page.goto('https://www.saucedemo.com/');
    
//     const snapshot = await mcpClaude.mcpServer.getDOMSnapshot({
//       maxDepth: 3
//     });
    
//     const dom = JSON.parse(snapshot.content[0].text);
//     console.log('✓ DOM Snapshot captured');
//     console.log('  Root tag:', dom.tag);
//     console.log('  Children:', dom.children?.length || 0);
//   });

//   test('MCP assert visible', async ({ mcpClaude, page }) => {
//     await page.goto('https://www.saucedemo.com/');
    
//     await mcpClaude.mcpServer.assertVisible({
//       selector: '#login-button',
//       timeout: 5000
//     });
    
//     console.log('✓ Login button is visible (verified via MCP)');
//   });

  test('MCP complete login flow', async ({ mcpClaude, page }) => {
    // Navigate
    await mcpClaude.mcpServer.navigateToUrl({
      url: 'https://www.saucedemo.com/'
    });
    
    // Assert login page loaded
    await mcpClaude.mcpServer.assertVisible({ selector: '.login_logo' });
    console.log('✓ Login page loaded');
    
    // Fill form
    await mcpClaude.mcpServer.fillInput({ selector: '#user-name', value: 'standard_user' });
    await mcpClaude.mcpServer.fillInput({ selector: '#password', value: 'secret_sauce' });
    console.log('✓ Credentials entered');
    
    // Submit
    await mcpClaude.mcpServer.clickElement({ selector: '#login-button' });
    
    // Wait and verify
    await mcpClaude.mcpServer.waitForSelector({ 
      selector: '.inventory_list',
      state: 'visible',
      timeout: 10000
    });
    console.log('✓ Products page loaded');
    
    // Take screenshot of success
    await mcpClaude.mcpServer.takeScreenshot({ fullPage: true });
    console.log('✓ Success screenshot captured');
  });

});

// Note: These tests demonstrate MCP server tools working WITHOUT requiring Claude AI calls
// For full natural language capabilities, ensure Anthropic API key is  configured
