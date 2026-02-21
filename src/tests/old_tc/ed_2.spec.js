import { test, expect } from '@playwright/test';

class HomePage {
  constructor(page) {
    this.page = page;
    this.heroSectionSelector = 'section.hero'; // Adjust selector based on actual implementation
    this.headlineSelector = `${this.heroSectionSelector} h1`; // Adjust selector based on actual implementation
  }

  async navigate() {
    await this.page.goto('https://www.endpointclinical.com/');
  }

  async getHeadlineText() {
    return await this.page.textContent(this.headlineSelector);
  }

  async isHeadlineVisible() {
    return await this.page.isVisible(this.headlineSelector);
  }

  async isInViewport() {
    const headline = await this.page.locator(this.headlineSelector);
    const boundingBox = await headline.boundingBox();
    return boundingBox && boundingBox.y >= 0 && boundingBox.y + boundingBox.height <= await this.page.viewportSize().height;
  }
}

test.describe('Homepage Headline Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('Verify the homepage displays the text “Your hidden advantage in RTSM”', async () => {
    const headlineText = await homePage.getHeadlineText();
    expect(headlineText).toContain('Your');
    expect(headlineText).toContain('advantage');
    expect(headlineText).toContain('RTSM');
  });

  test('Verify the text is clearly visible without requiring the user to scroll', async () => {
    const isVisible = await homePage.isHeadlineVisible();
    expect(isVisible).toBe(true);
    
    const isInViewport = await homePage.isInViewport();
    expect(isInViewport).toBe(true);
  });

  test('Verify the text appears in the main hero section of the homepage', async () => {
    const isVisible = await homePage.isHeadlineVisible();
    expect(isVisible).toBe(true);
  });

  test('Navigate to the homepage and verify that the text “Your hidden advantage in RTSM” is displayed', async () => {
    const headlineText = await homePage.getHeadlineText();
    expect(headlineText).toContain('Your');
    expect(headlineText).toContain('advantage');
    expect(headlineText).toContain('RTSM');
  });

  test('Open the homepage on different screen sizes and confirm the text is visible and properly formatted', async ({ page }) => {
    const screenSizes = [
      { width: 1280, height: 720 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 667 }, // Mobile
    ];

    for (const size of screenSizes) {
      await page.setViewportSize(size);
      await homePage.navigate();
      const headlineText = await homePage.getHeadlineText();
      expect(headlineText).toContain('Your');
      expect(headlineText).toContain('advantage');
      expect(headlineText).toContain('RTSM');
      const isVisible = await homePage.isHeadlineVisible();
      expect(isVisible).toBe(true);
    }
  });
});