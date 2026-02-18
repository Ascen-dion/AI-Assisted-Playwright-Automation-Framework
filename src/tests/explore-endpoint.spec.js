/**
 * Exploratory Test - Endpoint Clinical Page
 * Let's understand the page structure first
 */

const { test } = require('@playwright/test');
const AIPage = require('../../src/core/ai-page');

test('🔍 Explore Endpoint Clinical page structure', async ({ page }) => {
  const aiPage = new AIPage(page);
  
  console.log('\n🔍 Exploring page structure...\n');
  
  // Navigate
  await page.goto('https://www.endpointclinical.com/solutions-pulse', {
    waitUntil: 'domcontentloaded'
  });
  
  await page.waitForTimeout(3000);
  
  // Take initial screenshot
  await page.screenshot({ 
    path: 'test-results/explore-01-initial-page.png',
    fullPage: true 
  });
  console.log('📸 Initial page screenshot saved');
  
  // Check for any buttons/links with "request" or "demo"
  console.log('\n🔍 Looking for Request/Demo elements...\n');
  
  const requestElements = await page.locator('a, button').evaluateAll(elements => {
    return elements
      .filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text.includes('request') || text.includes('demo') || text.includes('contact');
      })
      .map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim(),
        class: el.className,
        href: el.getAttribute('href'),
        visible: el.offsetParent !== null
      }));
  });
  
  console.log('Found elements:');
  requestElements.forEach((el, i) => {
    console.log(`${i + 1}. [${el.tag}] "${el.text}" - Visible: ${el.visible}`);
    if (el.href) console.log(`   Link: ${el.href}`);
  });
  
  // Try clicking the first visible one
  if (requestElements.length > 0) {
    console.log('\n🖱️  Attempting to click first matching element...\n');
    
    try {
      // Use AI to click
      await aiPage.click('Click the Request Demo or Contact button');
      console.log('✓ Clicked via AI');
      
      await page.waitForTimeout(3000);
      
      // Take screenshot after click
      await page.screenshot({ 
        path: 'test-results/explore-02-after-click.png',
        fullPage: true 
      });
      console.log('📸 After-click screenshot saved');
      
      // Check what elements are now visible
      console.log('\n🔍 Checking current page state...\n');
      
      const url = page.url();
      console.log(`Current URL: ${url}`);
      
      // Look for form elements
      const formCount = await page.locator('form').count();
      const inputCount = await page.locator('input[type="text"], input[type="email"]').count();
      const textareaCount = await page.locator('textarea').count();
      
      console.log(`Forms found: ${formCount}`);
      console.log(`Input fields found: ${inputCount}`);
      console.log(`Textareas found: ${textareaCount}`);
      
      // List all input fields
      if (inputCount > 0) {
        const inputs = await page.locator('input[type="text"], input[type="email"], input[name]').evaluateAll(elements => {
          return elements.map(el => ({
            type: el.type,
            name: el.name,
            id: el.id,
            placeholder: el.placeholder,
            visible: el.offsetParent !== null
          }));
        });
        
        console.log('\nInput fields:');
        inputs.forEach((inp, i) => {
          console.log(`${i + 1}. Type: ${inp.type}, Name: ${inp.name}, ID: ${inp.id}, Placeholder: ${inp.placeholder}`);
        });
      }
      
    } catch (e) {
      console.log('✗ Error:', e.message);
    }
  }
  
  console.log('\n✅ Exploration complete! Check screenshots in test-results/\n');
});
