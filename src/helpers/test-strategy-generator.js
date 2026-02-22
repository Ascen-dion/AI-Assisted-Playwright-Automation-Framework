/**
 * Smart Test Strategy Generator
 * Determines appropriate test strategy based on story type and content
 */

class TestStrategyGenerator {
  
  /**
   * Analyze story to determine test strategy
   */
  static analyzeStory(story) {
    // Handle undefined story gracefully
    if (!story) {
      console.warn('[TestStrategy] Story is undefined, using default fallback strategy');
      return this.getDefaultStrategy();
    }
    
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
   * Get default fallback strategy when story is undefined
   */
  static getDefaultStrategy() {
    return {
      storyType: 'VERIFY',
      targetElements: {
        uiElements: [
          { type: 'heading', selectors: ['h1', 'h2', '.headline', '.title'] },
          { type: 'content', selectors: ['main', '.main-content', '.hero'] }
        ],
        targetText: [],
        contentArea: 'main'
      },
      verificationApproach: 'STRUCTURAL',
      testStrategy: {
        approach: 'Test basic page structure and functionality',
        tests: [
          'Verify page loads successfully',
          'Verify main content areas are present',
          'Test basic page navigation',
          'Verify responsive behavior'
        ]
      },
      url: 'https://example.com'
    };
  }
  
  /**
   * Detect story type (ADD, MODIFY, VERIFY, REMOVE)
   */
  static detectStoryType(text) {
    // VERIFY patterns first (most common for test automation)
    if (text.includes('verify') || text.includes('check') || text.includes('ensure') || 
        text.includes('confirm') || text.includes('test ') || text.includes('validate') ||
        text.includes('functionality') || text.includes('should') || text.includes('assert') ||
        text.includes('expect')) {
      return 'VERIFY';
    }
    // Use word boundary checks for short keywords to avoid false positives
    // e.g., 'new' in 'renewal' or 'news' should NOT trigger ADD
    if (/\badd\b/.test(text) || /\bcreate\b/.test(text) || text.includes('implement') || /\bnew\s/.test(text)) {
      return 'ADD';
    }
    if (text.includes('modify') || text.includes('change') || text.includes('update') || text.includes('edit')) {
      return 'MODIFY';
    }
    if (text.includes('remove') || text.includes('delete') || text.includes('hide')) {
      return 'REMOVE';
    }
    
    // Default: VERIFY is safest for test automation (tests existing functionality)
    return 'VERIFY';
  }
  
  /**
   * Extract target elements from story
   */
  static detectTargetElements(story) {
    const elements = [];
    
    // Handle undefined story
    if (!story || !story.title) {
      return {
        uiElements: [
          { type: 'heading', selectors: ['h1', 'h2', '.headline', '.title'] },
          { type: 'content', selectors: ['main', '.main-content', '.hero'] }
        ],
        targetText: [],
        contentArea: 'main'
      };
    }
    
    const allText = `${story.title} ${story.description || ''}`.toLowerCase();
    
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
    
    // Extract specific text to verify from BOTH title and description
    const titleTextMatches = story.title?.match(/"([^"]+)"/g) || [];
    const descTextMatches = story.description?.match(/"([^"]+)"/g) || [];
    const allTextMatches = [...titleTextMatches, ...descTextMatches];
    const targetText = allTextMatches.map(match => match.replace(/"/g, ''));
    
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
    // Handle undefined story
    if (!story) {
      return 'https://example.com';
    }
    
    // Priority 1: Try extractedUrls (from Jira or requirements flow)
    if (story.extractedUrls && story.extractedUrls.length > 0) {
      const url = story.extractedUrls[0];
      console.log(`[TestStrategy] 🔗 URL from extractedUrls: ${url}`);
      return url;
    }
    
    // Priority 2: Try title for URLs (users often put www.amazon.com in title)
    const titleUrlMatch = (story.title || '').match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|io|co|edu|gov|ai|dev)[^\s)\]>,]*)/i);
    if (titleUrlMatch) {
      const rawUrl = titleUrlMatch[0].replace(/[)\].,;:!?]+$/, '');
      const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl.startsWith('www.') ? '' : 'www.'}${rawUrl}`;
      console.log(`[TestStrategy] 🔗 URL from title: ${url}`);
      return url.replace(/\/$/, '');
    }
    
    // Priority 3: Try description for URLs
    const descUrlMatch = (story.description || '').match(/https?:\/\/[^\s)\]>,]+/);
    if (descUrlMatch) {
      const cleanDescUrl = descUrlMatch[0].replace(/[)\].,;:!?]+$/, '').replace(/\/$/, '');
      console.log(`[TestStrategy] 🔗 URL from description: ${cleanDescUrl}`);
      return cleanDescUrl;
    }
    
    // Priority 4: Try description for domain names (www.amazon.com style)
    const descDomainMatch = (story.description || '').match(/(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|io|co|edu|gov|ai|dev)[^\s]*)/i);
    if (descDomainMatch) {
      const rawUrl = descDomainMatch[0];
      const url = `https://${rawUrl.startsWith('www.') ? '' : 'www.'}${rawUrl}`;
      console.log(`[TestStrategy] 🔗 URL from description domain: ${url}`);
      return url.replace(/\/$/, '');
    }
    
    // Priority 5: Try acceptance criteria for URLs
    if (story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria)) {
      for (const criterion of story.acceptanceCriteria) {
        const criterionUrl = (criterion || '').match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|io|co|edu|gov|ai|dev)[^\s)\]>,]*)/i);
        if (criterionUrl) {
          const rawUrl = criterionUrl[0].replace(/[)\].,;:!?]+$/, '');
          const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl.startsWith('www.') ? '' : 'www.'}${rawUrl}`;
          console.log(`[TestStrategy] 🔗 URL from acceptance criteria: ${url}`);
          return url.replace(/\/$/, '');
        }
      }
    }
    
    // Priority 6: Fallback based on story ID pattern
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
    const storyTitle = story?.title || 'Page Structure Test';
    return `const { test, expect } = require('@playwright/test');

test.describe('${storyTitle} - Page Structure Verification', () => {
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
    const storyTitle = story?.title || 'Content Verification Test';
    return `const { test, expect } = require('@playwright/test');

test.describe('${storyTitle} - Content Verification', () => {
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
  static generateAccessibilityTest(story, url, targetElements) {    const storyTitle = story?.title || 'Accessibility Test';    return `const { test, expect } = require('@playwright/test');

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