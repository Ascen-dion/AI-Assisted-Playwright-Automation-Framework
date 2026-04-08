const { test, expect } = require('@playwright/test');

test.describe('ZS.com Page Inspection', () => {
  test('Inspect ZS.com page to find logo', async ({ page }) => {
    // Navigate to ZS.com
    await page.goto('https://www.zs.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('Page Title:', await page.title());
    
    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'test-results/zs-page-screenshot.png', fullPage: true });
    console.log('✓ Screenshot saved to test-results/zs-page-screenshot.png');
    
    // Find all images on the page
    const images = await page.locator('img').all();
    console.log(`Found ${images.length} images on the page:`);
    
    for (let i = 0; i < Math.min(images.length, 10); i++) {
      const img = images[i];
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const className = await img.getAttribute('class');
      console.log(`Image ${i + 1}:`, { src, alt, className });
    }
    
    // Check header content specifically
    const headerContent = await page.locator('header').first().innerHTML();
    console.log('Header HTML (first 500 chars):', headerContent.substring(0, 500));
    
    // Look for any element containing "zs" or "logo" in text or attributes
    const possibleLogos = await page.locator('*').evaluateAll(elements => {
      const results = [];
      elements.forEach((el, index) => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.getAttribute('class')?.toLowerCase() || '';
        const id = el.getAttribute('id')?.toLowerCase() || '';
        const alt = el.getAttribute('alt')?.toLowerCase() || '';
        const src = el.getAttribute('src')?.toLowerCase() || '';
        
        if (text.includes('zs') || className.includes('logo') || id.includes('logo') || 
            alt.includes('zs') || alt.includes('logo') || src.includes('logo') || 
            className.includes('zs') || id.includes('zs')) {
          results.push({
            tagName: el.tagName,
            className,
            id,
            alt,
            src,
            text: text.substring(0, 50),
            innerHTML: el.innerHTML.substring(0, 100)
          });
        }
      });
      return results.slice(0, 10); // Limit to first 10 matches
    });
    
    console.log('Possible logo elements found:', possibleLogos);
  });
});