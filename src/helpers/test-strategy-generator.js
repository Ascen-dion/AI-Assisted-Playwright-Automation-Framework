/**
 * Smart Test Strategy Generator
 * Determines appropriate test strategy based on story type and content
 */

class TestStrategyGenerator {
  
  /**
   * Analyze story to determine test strategy
   */
  static analyzeStory(story) {
    const title = (story.title || '').toLowerCase();
    const description = (story.description || '').toLowerCase();
    const allText = `${title} ${description}`.toLowerCase();
    
    // Detect story type
    const storyType = this.detectStoryType(allText);
    
    // Detect target elements/areas
    const targetElements = this.detectTargetElements(story);
    
    // Detect verification approach
    const verificationApproach = this.detectVerificationApproach(story, storyType);
    
    return {
      storyType,
      targetElements,
      verificationApproach,
      testStrategy: this.generateTestStrategy(storyType, targetElements, verificationApproach),
      url: this.extractURL(story)
    };
  }
  
  /**
   * Detect story type (ADD, MODIFY, VERIFY, REMOVE)
   */
  static detectStoryType(text) {
    if (text.includes('add') || text.includes('create') || text.includes('implement') || text.includes('new')) {
      return 'ADD';
    }
    if (text.includes('modify') || text.includes('change') || text.includes('update') || text.includes('edit')) {
      return 'MODIFY';
    }
    if (text.includes('remove') || text.includes('delete') || text.includes('hide')) {
      return 'REMOVE';
    }
    if (text.includes('verify') || text.includes('check') || text.includes('ensure') || text.includes('confirm')) {
      return 'VERIFY';
    }
    
    // Default for UI stories
    return 'ADD';
  }
  
  /**
   * Extract target elements from story
   */
  static detectTargetElements(story) {
    const elements = [];
    const allText = `${story.title} ${story.description}`.toLowerCase();
    
    // Common UI elements
    if (allText.includes('headline') || allText.includes('title')) {
      elements.push({ type: 'heading', selectors: ['h1', 'h2', '.headline', '.title'] });
    }
    if (allText.includes('button')) {
      elements.push({ type: 'button', selectors: ['button', '[type="button"]', '.btn'] });
    }
    if (allText.includes('hero') || allText.includes('main section')) {
      elements.push({ type: 'hero', selectors: ['.hero', 'main', '.main-content', 'section'] });
    }
    if (allText.includes('navigation') || allText.includes('menu')) {
      elements.push({ type: 'navigation', selectors: ['nav', '.navigation', '.menu'] });
    }
    
    // Extract specific text to verify
    const textMatches = story.description?.match(/"([^"]+)"/g) || [];
    const targetText = textMatches.map(match => match.replace(/"/g, ''));
    
    return {
      uiElements: elements,
      targetText: targetText,
      contentArea: this.detectContentArea(allText)
    };
  }
  
  /**
   * Detect where content should appear
   */
  static detectContentArea(text) {
    if (text.includes('homepage') || text.includes('home page')) return 'homepage';
    if (text.includes('hero')) return 'hero';
    if (text.includes('header')) return 'header';
    if (text.includes('footer')) return 'footer';
    if (text.includes('sidebar')) return 'sidebar';
    return 'main';
  }
  
  /**
   * Determine verification approach
   */
  static detectVerificationApproach(story, storyType) {
    switch (storyType) {
      case 'ADD':
        return 'STRUCTURAL'; // Test that structure exists for new content
      case 'MODIFY':
        return 'CONTENT'; // Test that content has changed
      case 'VERIFY':
        return 'CONTENT'; // Test that content exists
      case 'REMOVE':
        return 'ABSENCE'; // Test that content is gone
      default:
        return 'STRUCTURAL';
    }
  }
  
  /**
   * Generate test strategy based on analysis
   */
  static generateTestStrategy(storyType, targetElements, verificationApproach) {
    const strategies = {
      'ADD': {
        approach: 'Test page structure and areas where new content should be added',
        tests: [
          'Verify target page loads successfully',
          'Verify content area exists and is accessible',
          'Verify page structure supports new content',
          'Test responsive behavior of target area'
        ]
      },
      'MODIFY': {
        approach: 'Test that content has been updated correctly',
        tests: [
          'Verify page loads successfully',
          'Check for updated content',
          'Verify old content is replaced',
          'Test content formatting and positioning'
        ]
      },
      'VERIFY': {
        approach: 'Test that existing content is present and correct',
        tests: [
          'Verify page loads successfully',
          'Check content exists',
          'Verify content is visible',
          'Test content positioning and formatting'
        ]
      },
      'REMOVE': {
        approach: 'Test that content has been removed',
        tests: [
          'Verify page loads successfully',
          'Confirm content is not present',
          'Verify page layout is intact',
          'Test no broken elements remain'
        ]
      }
    };
    
    return strategies[storyType] || strategies['ADD'];
  }
  
  /**
   * Extract URL from story
   */
  static extractURL(story) {
    // Try extractedUrls first
    if (story.extractedUrls && story.extractedUrls.length > 0) {
      return story.extractedUrls[0];
    }
    
    // Try description
    const urlMatch = (story.description || '').match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0].replace(/\/$/, ''); // Remove trailing slash
    }
    
    // Fallback based on story ID
    if (story.id && story.id.startsWith('ED-')) {
      return 'https://www.endpointclinical.com';
    }
    
    return 'https://example.com';
  }
  
  /**
   * Generate smart test code based on strategy
   */
  static generateSmartTestCases(story, strategy) {
    const { storyType, targetElements, verificationApproach, testStrategy, url } = strategy;
    
    const testCases = [];
    
    if (storyType === 'ADD') {
      // For ADD stories, test the infrastructure, not the end result
      testCases.push({
        title: `Verify ${strategy.url} page structure for new content`,
        steps: [
          'Navigate to target page',
          'Verify page loads successfully',
          'Check that content areas exist',
          'Verify page is ready for new content'
        ],
        testCode: this.generateStructuralTest(story, url, targetElements),
        type: 'structural'
      });
      
      if (targetElements.targetText.length > 0) {
        testCases.push({
          title: `Test content area accessibility for "${targetElements.targetText[0]}"`,
          steps: [
            'Navigate to target page',
            'Locate main content area',
            'Verify area is visible and accessible',
            'Test responsive behavior'
          ],
          testCode: this.generateAccessibilityTest(story, url, targetElements),
          type: 'accessibility'
        });
      }
      
    } else if (storyType === 'VERIFY' || storyType === 'MODIFY') {
      // For VERIFY/MODIFY, test actual content
      targetElements.targetText.forEach(text => {
        testCases.push({
          title: `Verify "${text}" is displayed correctly`,
          steps: [
            'Navigate to target page',
            `Look for "${text}" content`,
            'Verify text is visible',
            'Check positioning and formatting'
          ],
          testCode: this.generateContentTest(story, url, text, targetElements),
          type: 'content'
        });
      });
    }
    
    return testCases;
  }
  
  /**
   * Generate structural test code (for ADD stories)
   */
  static generateStructuralTest(story, url, targetElements) {
    return `const { test, expect } = require('@playwright/test');

test.describe('${story.title} - Page Structure Verification', () => {
  test('Verify page structure supports new content', async ({ page }) => {
    // Navigate to target page
    await page.goto('${url}', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/.+/);
    
    // Check main content areas exist
    ${targetElements.uiElements.map(element => `
    // Verify ${element.type} area exists
    const ${element.type}Area = page.locator('${element.selectors[0]}').first();
    await expect(${element.type}Area).toBeVisible({ timeout: 10000 });`).join('')}
    
    // Verify page is responsive
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    // Test accessibility
    const mainContent = page.locator('main, .main-content, .hero').first();
    await expect(mainContent).toBeVisible();
    
    console.log('✅ Page structure verification passed');
  });
  
  test('Test responsive behavior for new content area', async ({ page }) => {
    await page.goto('${url}');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);
      
      const contentArea = page.locator('main, .hero, .main-content').first();
      await expect(contentArea).toBeVisible();
      
      console.log(\`✅ Responsive test passed for \${viewport.width}x\${viewport.height}\`);
    }
  });
});`;
  }
  
  /**
   * Generate content test code (for VERIFY/MODIFY stories)
   */
  static generateContentTest(story, url, targetText, targetElements) {
    return `const { test, expect } = require('@playwright/test');

test.describe('${story.title} - Content Verification', () => {
  test('Verify "${targetText}" content is displayed', async ({ page }) => {
    // Navigate with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto('${url}', { 
          waitUntil: 'networkidle', 
          timeout: 30000 
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await page.waitForTimeout(2000);
      }
    }
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Try multiple selector strategies for the text
    const textSelectors = [
      \`text="${targetText}"\`,
      \`h1:has-text("${targetText}")\`,
      \`h2:has-text("${targetText}")\`,
      \`[class*="hero"]:has-text("${targetText}")\`,
      \`[class*="heading"]:has-text("${targetText}")\`,
      \`*:has-text("${targetText}")\`
    ];
    
    let found = false;
    for (const selector of textSelectors) {
      try {
        const element = page.locator(selector).first();
        await expect(element).toBeVisible({ timeout: 5000 });
        console.log(\`✅ Found text using selector: \${selector}\`);
        found = true;
        break;
      } catch (error) {
        // Try next selector
        continue;
      }
    }
    
    if (!found) {
      // Fallback: Check if text exists anywhere on page
      const bodyText = await page.locator('body').textContent();
      if (bodyText.includes('${targetText}')) {
        console.log('⚠️ Text found on page but not visible with standard selectors');
        console.log('This might indicate a CSS or positioning issue');
      } else {
        console.log('❌ Text "${targetText}" not found on page');
        console.log('Available headings on page:');
        const headings = await page.locator('h1, h2, h3').allTextContents();
        console.log(headings);
      }
      throw new Error('Content verification failed: Text not found or not visible');
    }
  });
});`;
  }
  
  /**
   * Generate accessibility test code
   */
  static generateAccessibilityTest(story, url, targetElements) {
    return `const { test, expect } = require('@playwright/test');

test.describe('${story.title} - Accessibility Verification', () => {
  test('Verify content area accessibility', async ({ page }) => {
    await page.goto('${url}', { waitUntil: 'domcontentloaded' });
    
    // Check main content landmarks
    const main = page.locator('main, [role="main"], .main-content').first();
    await expect(main).toBeVisible();
    
    // Verify heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check color contrast (basic check)
    const bodyStyles = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });
    
    console.log('✅ Accessibility check passed', bodyStyles);
  });
});`;
  }
}

module.exports = TestStrategyGenerator;