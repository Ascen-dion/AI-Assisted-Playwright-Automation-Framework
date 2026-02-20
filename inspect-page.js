/**
 * Page Inspector - Find the actual headline element
 */
const { chromium } = require('playwright');

async function inspectPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Inspecting https://www.endpointclinical.com...\n');
    await page.goto('https://www.endpointclinical.com', { waitUntil: 'networkidle' });
    
    // Search for the headline text
    const searchText = 'Your hidden advantage in RTSM';
    console.log(`Looking for: "${searchText}"\n`);
    
    // Try to find elements containing this text
    const allText = await page.locator(`text="${searchText}"`).all();
    console.log(`Found ${allText.length} elements with exact text match\n`);
    
    // Try partial match
    const partialMatch = await page.locator(`text=/hidden advantage/i`).all();
    console.log(`Found ${partialMatch.length} elements with partial text match\n`);
    
    // Get all H1 tags
    const h1Tags = await page.locator('h1').all();
    console.log(`\n📋 All H1 tags on the page (${h1Tags.length}):`);
    for (let i = 0; i < h1Tags.length; i++) {
      const text = await h1Tags[i].textContent();
      console.log(`  ${i + 1}. <h1>: "${text.trim()}"`);
    }
    
    // Get all H2 tags (in case it's an H2)
    const h2Tags = await page.locator('h2').all();
    console.log(`\n📋 All H2 tags on the page (${h2Tags.length}):`);
    for (let i = 0; i < Math.min(h2Tags.length, 10); i++) {
      const text = await h2Tags[i].textContent();
      console.log(`  ${i + 1}. <h2>: "${text.trim()}"`);
    }
    
    // Search for any element containing "RTSM"
    console.log(`\n📋 Elements containing "RTSM":`);
    const rtsmElements = await page.locator('text=/RTSM/i').all();
    for (let i = 0; i < Math.min(rtsmElements.length, 5); i++) {
      const tagName = await rtsmElements[i].evaluate(el => el.tagName);
      const text = await rtsmElements[i].textContent();
      const classes = await rtsmElements[i].evaluate(el => el.className);
      console.log(`  ${i + 1}. <${tagName.toLowerCase()}> class="${classes}": "${text.trim().substring(0, 100)}"`);
    }
    
    // Get the hero section
    console.log(`\n📋 Hero/Main section content:`);
    const heroSelectors = [
      '[class*="hero"]',
      '[class*="banner"]',
      'header section',
      'main section:first-of-type',
      '[class*="intro"]'
    ];
    
    for (const selector of heroSelectors) {
      try {
        const hero = page.locator(selector).first();
        if (await hero.count() > 0) {
          const text = await hero.textContent();
          console.log(`\n  ${selector}:`);
          console.log(`    "${text.trim().substring(0, 200)}..."`);
        }
      } catch (e) {
        // Skip if selector fails
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectPage();
