/**
 * MCP Integration Demo Tests
 * Quick demonstration of MCP capabilities
 * 
 * Run with: npx playwright test mcp-demo.spec.js --headed
 */

const { test, expect } = require('@playwright/test');
const testAgents = require('../../core/test-agents-mcp');
const mcpClient = require('../../mcp/playwright-mcp-client');

// Increase timeout for AI operations (AI calls can take 30-60 seconds)
test.setTimeout(120000); // 2 minutes

test.describe('MCP Demo - Quick Start', () => {

  test('1. MCP Connection and Server Info', async () => {
    console.log('\n🔌 Testing MCP Connection...\n');

    // Get MCP server information
    const mcpInfo = await testAgents.getMCPInfo();
    
    console.log('📊 MCP Server Info:');
    console.log(JSON.stringify(mcpInfo, null, 2));

    expect(mcpInfo).toBeDefined();
  });

  test('2. List MCP Tools', async () => {
    console.log('\n🔧 Listing MCP Tools...\n');

    // List available MCP tools
    const tools = await testAgents.listMCPTools();
    
    console.log(`📋 Available Tools (${tools.tools.length}):`);
    tools.tools.forEach(tool => {
      console.log(`  ✓ ${tool.name}: ${tool.description}`);
    });

    // With MCP disabled, should return empty array
    // With MCP enabled, should have 4 tools
    expect(Array.isArray(tools.tools)).toBe(true);
  });

  test('3. MCP Planner Agent - Generate Test Plan', async ({ page }) => {
    console.log('\n🎯 Testing Planner Agent via MCP...\n');

    const testDescription = 'Login test for SauceDemo with standard user';

    const plan = await testAgents.planTest(testDescription, {
      testType: 'smoke',
      priority: 'high'
    });

    console.log('📝 Generated Test Plan:');
    console.log(plan.substring(0, 500) + '...\n');

    expect(plan).toBeDefined();
    expect(plan.length).toBeGreaterThan(100);
    expect(plan.toLowerCase()).toContain('test');
  });

  test('4. MCP Generator Agent - Generate Code', async ({ page }) => {
    console.log('\n💻 Testing Generator Agent via MCP...\n');

    const testDescription = `
Test: Login to SauceDemo
Steps:
1. Navigate to https://www.saucedemo.com
2. Enter username: standard_user
3. Enter password: secret_sauce
4. Click login button
5. Verify products page is displayed
`;

    const code = await testAgents.generateTest(testDescription, {
      framework: 'playwright-ai',
      url: 'https://www.saucedemo.com'
    });

    console.log('🎨 Generated Code:');
    console.log(code.substring(0, 500) + '...\n');

    expect(code).toBeDefined();
    expect(code.length).toBeGreaterThan(100);
    expect(code).toContain('test');
  });

});

test.describe('MCP Demo - Advanced Features', () => {

  test('5. MCP Page Context Analysis', async ({ page }) => {
    // Only run if MCP is enabled
    const mcpInfo = await testAgents.getMCPInfo();
    test.skip(!mcpInfo.available, 'MCP not enabled - set USE_MCP=true');

    console.log('\n🌐 Testing Page Context Analysis...\n');

    await page.goto('https://www.saucedemo.com');
    await page.waitForLoadState('networkidle');

    const analysis = await testAgents.analyzePageContext(
      page,
      'What are the main interactive elements on this page?'
    );

    console.log('🔍 Page Analysis:');
    console.log(analysis.substring(0, 500) + '...\n');

    expect(analysis).toBeDefined();
    expect(analysis.length).toBeGreaterThan(50);
  });

  test('6. MCP Healer Agent - Failure Analysis', async ({ page }) => {
    console.log('\n🔧 Testing Healer Agent via MCP...\n');

    const failureContext = {
      errorMessage: 'TimeoutError: Waiting for selector "#login-button" failed',
      testCode: `
await page.goto('https://www.saucedemo.com');
await page.click('#login-button');
      `,
      pageUrl: 'https://www.saucedemo.com',
      stackTrace: 'Error: Timeout 30000ms exceeded...'
    };

    const analysis = await testAgents.healTest(failureContext);

    console.log('💊 Healing Analysis:');
    console.log(analysis.substring(0, 500) + '...\n');

    expect(analysis).toBeDefined();
    expect(analysis.length).toBeGreaterThan(100);
    expect(analysis.toLowerCase()).toContain('fix');
  });

  test('7. MCP Plan and Generate Workflow', async ({ page }) => {
    console.log('\n🚀 Testing Plan + Generate Workflow...\n');

    const { plan, code } = await testAgents.planAndGenerate(
      'Add item to cart on SauceDemo',
      {
        testType: 'e2e',
        framework: 'playwright-ai',
        url: 'https://www.saucedemo.com'
      }
    );

    console.log('📋 Generated Plan:');
    console.log(plan.substring(0, 300) + '...\n');

    console.log('💻 Generated Code:');
    console.log(code.substring(0, 300) + '...\n');

    expect(plan).toBeDefined();
    expect(code).toBeDefined();
    expect(plan.length).toBeGreaterThan(100);
    expect(code.length).toBeGreaterThan(100);
  });

  test('8. Direct MCP Tool Call', async ({ page }) => {
    // Only run if MCP is enabled
    const mcpInfo = await testAgents.getMCPInfo();
    test.skip(!mcpInfo.available, 'MCP not enabled - set USE_MCP=true');

    console.log('\n🔨 Testing Direct MCP Tool Call...\n');

    const result = await testAgents.callMCPTool('generate_test_plan', {
      requirements: 'Checkout flow test for e-commerce',
      testType: 'e2e',
      priority: 'high'
    });

    console.log('🎯 Direct Tool Call Result:');
    console.log(result.content[0].text.substring(0, 300) + '...\n');

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.content[0].text).toBeDefined();
  });

});
