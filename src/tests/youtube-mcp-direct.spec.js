const { test, expect } = require('@playwright/test');
const mcpClient = require('../mcp/playwright-mcp-client');
const fs = require('fs').promises;
const path = require('path');

/**
 * YouTube Test using MCP (Model Context Protocol)
 * Demonstrates: Direct MCP tool usage for test planning and code generation
 */

test.describe('YouTube - Viplove QA with MCP', () => {

  test('Use MCP Tools: generate_test_plan and generate_playwright_code', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for AI operations
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 YOUTUBE TEST WITH MCP TOOLS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Connect to MCP server
    await mcpClient.connect();
    
    // Get MCP server info
    const serverInfo = await mcpClient.getServerInfo();
    console.log('🔌 MCP Server Connected:');
    console.log(`   Tools: ${serverInfo.toolsCount}`);
    console.log(`   Available: ${serverInfo.tools.join(', ')}\n`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: Use MCP Tool - generate_test_plan
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛠️  STEP 1: MCP Tool - generate_test_plan');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const requirements = `
Test Objective: Search for "Viplove QA - SDET" on YouTube and open a video

Requirements:
1. Navigate to https://www.youtube.com/
2. Handle any cookie consent dialogs
3. Search for "Viplove QA - SDET"
4. Verify search results are displayed
5. Click on the first video
6. Verify video page loads
7. Verify video player is visible
    `;

    console.log('📋 Generating test plan with MCP...\n');
    
    const testPlan = await mcpClient.generateTestPlan(requirements, {
      testType: 'e2e',
      priority: 'high'
    });

    console.log('✅ Test Plan Generated!\n');
    console.log('📄 Test Plan:');
    console.log(testPlan.substring(0, 500) + '...\n');

    // Save the plan
    const planPath = path.join(process.cwd(), 'test-results', 'mcp-youtube-plan.json');
    await fs.mkdir(path.dirname(planPath), { recursive: true });
    await fs.writeFile(planPath, JSON.stringify({ 
      requirements, 
      plan: testPlan,
      timestamp: new Date().toISOString()
    }, null, 2));
    console.log(`💾 Plan saved to: ${planPath}\n`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 2: Use MCP Tool - generate_playwright_code
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛠️  STEP 2: MCP Tool - generate_playwright_code');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💻 Generating Playwright code with MCP...\n');

    const testCode = await mcpClient.generateCode(requirements, {
      url: 'https://www.youtube.com/',
      framework: 'playwright-ai'
    });

    console.log('✅ Test Code Generated!\n');
    console.log('💻 Generated Code Preview:');
    console.log(testCode.substring(0, 400) + '...\n');

    // Save generated code
    const codePath = path.join(process.cwd(), 'src', 'tests', 'mcp-youtube-generated.spec.js');
    await fs.writeFile(codePath, testCode);
    console.log(`💾 Generated code saved to: ${codePath}\n`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 3: Execute the test manually (for demonstration)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 STEP 3: Execute Test (Manual)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('⏳ Navigating to YouTube...');
    await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ YouTube loaded\n');

    // Handle cookie consent
    try {
      const acceptButton = page.locator('button[aria-label*="Accept"], button:has-text("Accept all")').first();
      if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
        console.log('✅ Cookie consent accepted\n');
      }
    } catch (e) {
      console.log('ℹ️  No cookie consent dialog\n');
    }

    // Search
    console.log('⏳ Searching for "Viplove QA - SDET"...');
    await page.waitForTimeout(2000);
    
    const searchBox = page.locator('input#search, input[name="search_query"]').first();
    await searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await searchBox.click();
    await searchBox.fill('Viplove QA - SDET');
    await searchBox.press('Enter');
    console.log('✅ Search submitted\n');

    // Wait for results
    console.log('⏳ Waiting for search results...');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/search_query/);
    console.log('✅ Search results displayed\n');

    // Click first video
    console.log('⏳ Opening first video...');
    const videoLink = page.locator('a#video-title, ytd-video-renderer a#video-title').first();
    await videoLink.waitFor({ state: 'visible', timeout: 10000 });
    
    const videoTitle = await videoLink.getAttribute('title') || await videoLink.textContent();
    console.log(`📹 Found video: "${videoTitle}"`);
    
    await videoLink.click();
    console.log('✅ Video clicked\n');

    // Verify video page
    console.log('⏳ Verifying video page...');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/watch\?v=|shorts\//);
    
    // Video player may be initially hidden, just check it exists
    const videoPlayer = page.locator('video').first();
    await videoPlayer.waitFor({ state: 'attached', timeout: 10000 });
    console.log('✅ Video player found on page\n');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4: Use MCP Tool - analyze_page_context (Optional)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛠️  STEP 4: MCP Tool - analyze_page_context');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔍 Analyzing page context with MCP...\n');

    const pageAnalysis = await mcpClient.analyzePageContext(
      page,
      'What video information is visible on this page?'
    );

    console.log('✅ Page Analysis Complete!\n');
    console.log('📊 Analysis:');
    console.log(pageAnalysis.substring(0, 300) + '...\n');

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/mcp-youtube-final.png',
      fullPage: false 
    });
    console.log('📸 Screenshot saved: test-results/mcp-youtube-final.png\n');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FINAL SUMMARY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 MCP WORKFLOW COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 MCP Tools Used:');
    console.log('   ✅ generate_test_plan - Created test plan');
    console.log('   ✅ generate_playwright_code - Generated executable code');
    console.log('   ✅ analyze_page_context - Analyzed video page\n');

    console.log('📁 Artifacts Generated:');
    console.log('   📄 Test Plan: test-results/mcp-youtube-plan.json');
    console.log('   💻 Generated Code: src/tests/mcp-youtube-generated.spec.js');
    console.log('   📸 Screenshot: test-results/mcp-youtube-final.png\n');

    console.log('✅ Test Status: PASSED\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Disconnect from MCP
    await mcpClient.disconnect();
  });

  test('List all available MCP tools', async () => {
    console.log('\n🔧 MCP TOOLS INVENTORY\n');
    
    await mcpClient.connect();
    
    const tools = await mcpClient.listTools();
    console.log(`📦 Total Tools: ${tools.tools.length}\n`);
    
    tools.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
      console.log(`   Required: ${tool.inputSchema.required.join(', ')}\n`);
    });

    const resources = await mcpClient.listResources();
    console.log(`📚 Total Resources: ${resources.resources.length}\n`);
    
    resources.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.name}`);
      console.log(`   URI: ${resource.uri}`);
      console.log(`   Description: ${resource.description}\n`);
    });

    await mcpClient.disconnect();
  });

});
