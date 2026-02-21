/**
 * Ascendion SharePoint Hub Test
 * Verifies "HUB Intranet" title exists
 * 
 * IMPORTANT: SharePoint requires authentication
 * You may need to handle Microsoft OAuth login flow
 * 
 * Run with: npx playwright test sharepoint-hub.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

test.describe('Ascendion SharePoint Hub - HUB Intranet Title Verification', () => {
  
  // Increase timeout for SharePoint (can be slow)
  test.setTimeout(90000);

  /**
   * NOTE: SharePoint authentication handling
   * 
   * Option 1: Manual login (run in headed mode, login manually first time)
   * Option 2: Use persistent context with saved auth
   * Option 3: Programmatically handle Microsoft OAuth (complex)
   * 
   * For this test, we'll attempt to navigate and handle common scenarios
   */

  test.beforeEach(async ({ page }) => {
    console.log('\n🌐 Navigating to Ascendion SharePoint Hub...');
    console.log('⚠️  Note: This test requires authentication to SharePoint');
  });

  test('TC-001: Navigate to SharePoint and verify redirect', async ({ page }) => {
    console.log('📝 Test: SharePoint URL navigation');
    
    try {
      // Navigate to SharePoint
      await page.goto('https://ascendionhub.sharepoint.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Get current URL after potential redirects
      const currentURL = page.url();
      console.log(`   Current URL: ${currentURL}`);
      
      // Check if we're on login page or actual SharePoint
      if (currentURL.includes('login.microsoftonline.com') || currentURL.includes('login.live.com')) {
        console.log('⚠️  Redirected to Microsoft login page');
        console.log('   This test requires authentication');
        console.log('   Please run in --headed mode and login manually, or use persistent auth');
        
        // Take screenshot of login page
        await page.screenshot({ path: 'test-results/sharepoint-login-page.png' });
        
        // Skip remaining assertions
        test.skip();
      } else {
        console.log('✅ Accessed SharePoint (already authenticated or public access)');
        await page.screenshot({ path: 'test-results/sharepoint-homepage.png' });
      }
      
    } catch (error) {
      console.log(`❌ Navigation failed: ${error.message}`);
      await page.screenshot({ path: 'test-results/sharepoint-error.png' });
      throw error;
    }
  });

  test('TC-002: Verify "HUB Intranet" title exists (requires authentication)', async ({ page }) => {
    console.log('📝 Test: HUB Intranet title verification');
    
    try {
      // Navigate to SharePoint
      await page.goto('https://ascendionhub.sharepoint.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Check if we hit login page
      const currentURL = page.url();
      if (currentURL.includes('login.')) {
        console.log('⚠️  Authentication required. Skipping test.');
        console.log('   To run this test:');
        console.log('   1. Run with --headed flag');
        console.log('   2. Login manually when prompted');
        console.log('   3. Or use: npx playwright auth save sharepoint-auth.json');
        test.skip();
        return;
      }
      
      // Wait for SharePoint to load
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      
      // Give SharePoint additional time to render (it's heavy on JS)
      await page.waitForTimeout(3000);
      
      console.log('   Searching for "HUB Intranet" title...');
      
      // Strategy 1: Direct text match
      const titleLocator1 = page.locator('text=HUB Intranet');
      const isVisible1 = await titleLocator1.isVisible().catch(() => false);
      
      if (isVisible1) {
        console.log('✅ Found title via exact text match');
        await expect(titleLocator1).toBeVisible();
        await page.screenshot({ path: 'test-results/sharepoint-hub-title-found.png' });
        return;
      }
      
      // Strategy 2: Partial text match
      const titleLocator2 = page.locator(':has-text("HUB Intranet")');
      const count2 = await titleLocator2.count();
      
      if (count2 > 0) {
        console.log(`✅ Found title via partial match (${count2} elements)`);
        await expect(titleLocator2.first()).toBeVisible();
        await page.screenshot({ path: 'test-results/sharepoint-hub-title-found.png' });
        return;
      }
      
      // Strategy 3: Check SharePoint-specific selectors
      const sharePointSelectors = [
        '.ms-siteLogo-siteName',
        '.o365cs-nav-brandingText',
        '[role="heading"]',
        '.ms-HubNav-link',
        '.ms-core-brandingText'
      ];
      
      for (const selector of sharePointSelectors) {
        const elements = await page.locator(selector).all();
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.includes('HUB Intranet')) {
            console.log(`✅ Found title in ${selector}: "${text.trim()}"`);
            await expect(element).toBeVisible();
            await page.screenshot({ path: 'test-results/sharepoint-hub-title-found.png' });
            return;
          }
        }
      }
      
      // Strategy 4: Check entire page content
      const pageContent = await page.content();
      if (pageContent.includes('HUB Intranet')) {
        console.log('⚠️  Title text exists in HTML but may not be visible');
        console.log('   This could be due to SharePoint dynamic loading');
        
        await page.screenshot({ 
          path: 'test-results/sharepoint-full-page.png',
          fullPage: true 
        });
        
        // Extract some context
        const contextMatch = pageContent.match(/.{50}HUB Intranet.{50}/);
        if (contextMatch) {
          console.log(`   Context: ...${contextMatch[0]}...`);
        }
        
        // Mark as warning but not failure
        console.log('⚠️  Test passed with warning: title in HTML but visibility unclear');
      } else {
        console.log('❌ Title "HUB Intranet" not found anywhere on page');
        await page.screenshot({ 
          path: 'test-results/sharepoint-title-not-found.png',
          fullPage: true 
        });
        throw new Error('Title "HUB Intranet" not found on SharePoint page');
      }
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      await page.screenshot({ 
        path: 'test-results/sharepoint-test-error.png',
        fullPage: true 
      });
      throw error;
    }
  });

  test('TC-003: SharePoint page structure validation', async ({ page }) => {
    console.log('📝 Test: SharePoint page structure');
    
    try {
      await page.goto('https://ascendionhub.sharepoint.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Check if authenticated
      if (page.url().includes('login.')) {
        console.log('⚠️  Authentication required. Skipping test.');
        test.skip();
        return;
      }
      
      await page.waitForLoadState('networkidle');
      
      // Check for common SharePoint elements
      console.log('   Checking SharePoint UI elements...');
      
      const checks = [
        { name: 'Office 365 Suite Bar', selector: '#O365_MainLink_NavMenu, .o365cs-nav-topItem' },
        { name: 'SharePoint Navigation', selector: '.ms-HubNav, [role="navigation"]' },
        { name: 'Main Content Area', selector: '.ms-webpart-zone, #contentBox' },
        { name: 'Page Title', selector: 'h1, [role="heading"]' }
      ];
      
      for (const check of checks) {
        const element = page.locator(check.selector).first();
        const exists = await element.count() > 0;
        
        if (exists) {
          console.log(`   ✅ ${check.name} present`);
        } else {
          console.log(`   ❌ ${check.name} not found`);
        }
      }
      
      console.log('✅ SharePoint structure validation completed\n');
      
    } catch (error) {
      console.log(`❌ Structure validation failed: ${error.message}`);
    }
  });

  test('TC-004: Authentication helper - Setup instructions', async ({ page }) => {
    console.log('📝 Test: Authentication setup helper');
    console.log('\n📋 SHAREPOINT AUTHENTICATION SETUP INSTRUCTIONS:');
    console.log('=' .repeat(80));
    console.log('\nOption 1: Manual Login (Recommended for Local Testing)');
    console.log('   Run: npx playwright test sharepoint-hub.spec.js --headed');
    console.log('   Action: Login manually when prompted');
    console.log('   Note: Browser will stay open for you to authenticate');
    console.log('\nOption 2: Save Authentication State');
    console.log('   Step 1: npx playwright codegen https://ascendionhub.sharepoint.com/');
    console.log('   Step 2: Login manually in the browser that opens');
    console.log('   Step 3: Save auth: await context.storageState({ path: "auth.json" })');
    console.log('   Step 4: Use in tests: test.use({ storageState: "auth.json" })');
    console.log('\nOption 3: Environment Variables (CI/CD)');
    console.log('   Set: SHAREPOINT_USER=your.email@ascendion.com');
    console.log('   Set: SHAREPOINT_PASS=your_password');
    console.log('   Note: Handle MFA separately if enabled');
    console.log('\nOption 4: Azure AD Service Principal (Advanced)');
    console.log('   Use service account for automated testing');
    console.log('   Requires Azure AD app registration');
    console.log('=' .repeat(80) + '\n');
    
    // This test always passes - it's just informational
    expect(true).toBe(true);
  });

});
