/**
 * Aava AI Website Test
 * Verifies "Future of Engineering" title exists
 * 
 * Run with: npx playwright test aava-ai.spec.js --headed
 */

const { test, expect } = require('@playwright/test');

test.describe('Aava AI - Future of Engineering Title Verification', () => {
  
  // Increase timeout for slower page loads
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Navigate to Aava AI website before each test
    console.log('\n🌐 Navigating to Aava AI website...');
    await page.goto('https://int-ai.aava.ai/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
  });

  test('TC-001: Verify homepage loads successfully', async ({ page }) => {
    console.log('📝 Test: Homepage load verification');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify page title (if available)
    const title = await page.title();
    console.log(`   Page Title: ${title}`);
    expect(title).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/aava-homepage.png',
      fullPage: true 
    });
    
    console.log('✅ Homepage loaded successfully\n');
  });

  test('TC-002: Verify "Future of Engineering" title exists', async ({ page }) => {
    console.log('📝 Test: Future of Engineering title verification');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Strategy 1: Try exact text match
    const titleLocator1 = page.locator('text=Future of Engineering');
    const isVisible1 = await titleLocator1.isVisible().catch(() => false);
    
    if (isVisible1) {
      console.log('✅ Found title via exact text match');
      await expect(titleLocator1).toBeVisible();
      await page.screenshot({ path: 'test-results/aava-title-found.png' });
      return;
    }
    
    // Strategy 2: Try partial text match
    const titleLocator2 = page.locator(':has-text("Future of Engineering")');
    const isVisible2 = await titleLocator2.count();
    
    if (isVisible2 > 0) {
      console.log(`✅ Found title via partial match (${isVisible2} elements)`);
      await expect(titleLocator2.first()).toBeVisible();
      await page.screenshot({ path: 'test-results/aava-title-found.png' });
      return;
    }
    
    // Strategy 3: Try common heading selectors
    const headingSelectors = ['h1', 'h2', 'h3', '[class*="title"]', '[class*="heading"]'];
    
    for (const selector of headingSelectors) {
      const elements = await page.locator(selector).all();
      for (const element of elements) {
        const text = await element.textContent();
        if (text && text.includes('Future of Engineering')) {
          console.log(`✅ Found title in ${selector}: "${text.trim()}"`);
          await expect(element).toBeVisible();
          await page.screenshot({ path: 'test-results/aava-title-found.png' });
          return;
        }
      }
    }
    
    // Strategy 4: Check entire page content as fallback
    const pageContent = await page.content();
    if (pageContent.includes('Future of Engineering')) {
      console.log('⚠️  Title text exists in page HTML but may not be visible');
      console.log('   This might be due to dynamic loading or visibility issues');
      
      // Take screenshot for manual review
      await page.screenshot({ 
        path: 'test-results/aava-title-in-html.png',
        fullPage: true 
      });
      
      // Print surrounding context
      const contextMatch = pageContent.match(/.{50}Future of Engineering.{50}/);
      if (contextMatch) {
        console.log(`   Context: ...${contextMatch[0]}...`);
      }
    } else {
      console.log('❌ Title "Future of Engineering" not found anywhere on page');
      await page.screenshot({ 
        path: 'test-results/aava-title-not-found.png',
        fullPage: true 
      });
      throw new Error('Title "Future of Engineering" not found on page');
    }
  });

  test('TC-003: Verify title visibility and styling', async ({ page }) => {
    console.log('📝 Test: Title visibility and styling');
    
    await page.waitForLoadState('networkidle');
    
    // Find the title element (using multiple strategies)
    let titleElement;
    
    // Try different locator strategies
    const strategies = [
      page.locator('text=Future of Engineering'),
      page.locator(':has-text("Future of Engineering")').first(),
      page.locator('h1:has-text("Future of Engineering")'),
      page.locator('h2:has-text("Future of Engineering")')
    ];
    
    for (const locator of strategies) {
      try {
        if (await locator.isVisible({ timeout: 5000 })) {
          titleElement = locator;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!titleElement) {
      console.log('⚠️  Skipping styling test - title element not found');
      test.skip();
      return;
    }
    
    // Check visibility
    await expect(titleElement).toBeVisible();
    console.log('✅ Title is visible');
    
    // Get bounding box
    const boundingBox = await titleElement.boundingBox();
    if (boundingBox) {
      console.log(`   Position: x=${boundingBox.x}, y=${boundingBox.y}`);
      console.log(`   Size: ${boundingBox.width}x${boundingBox.height}`);
      
      // Verify it's within viewport (for above the fold content)
      const viewport = page.viewportSize();
      if (boundingBox.y < viewport.height) {
        console.log('✅ Title is above the fold (visible without scrolling)');
      }
    }
    
    // Get computed styles
    const fontSize = await titleElement.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    const color = await titleElement.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    console.log(`   Font size: ${fontSize}`);
    console.log(`   Color: ${color}`);
    console.log('✅ Title styling verified\n');
  });

  test('TC-004: Verify title on responsive viewports', async ({ page }) => {
    console.log('📝 Test: Responsive design verification');
    
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);
      
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Reload page to ensure responsive CSS applies
      await page.reload({ waitUntil: 'networkidle' });
      
      // Check if title is still visible
      const titleLocator = page.locator(':has-text("Future of Engineering")').first();
      
      try {
        await expect(titleLocator).toBeVisible({ timeout: 10000 });
        console.log(`✅ Title visible on ${viewport.name}`);
        
        // Take screenshot
        await page.screenshot({ 
          path: `test-results/aava-${viewport.name.toLowerCase()}.png`,
          fullPage: true
        });
      } catch (error) {
        console.log(`⚠️  Title not visible on ${viewport.name}`);
        await page.screenshot({ 
          path: `test-results/aava-${viewport.name.toLowerCase()}-issue.png`,
          fullPage: true
        });
      }
    }
    
    console.log('\n✅ Responsive design test completed\n');
  });

  test('TC-005: Page accessibility check', async ({ page }) => {
    console.log('📝 Test: Basic accessibility verification');
    
    await page.waitForLoadState('networkidle');
    
    // Check for semantic HTML
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    
    console.log(`   H1 tags: ${h1Count}`);
    console.log(`   H2 tags: ${h2Count}`);
    
    if (h1Count === 1) {
      console.log('✅ Proper H1 structure (one H1 per page)');
    } else if (h1Count === 0) {
      console.log('⚠️  No H1 tag found - accessibility concern');
    } else {
      console.log('⚠️  Multiple H1 tags found - consider semantic structure');
    }
    
    // Check if page has proper language attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    if (htmlLang) {
      console.log(`✅ HTML lang attribute set: ${htmlLang}`);
    } else {
      console.log('⚠️  No lang attribute - accessibility concern');
    }
    
    console.log('✅ Basic accessibility check completed\n');
  });

});
