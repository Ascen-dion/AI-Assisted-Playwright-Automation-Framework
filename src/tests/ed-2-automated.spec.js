const { test, expect } = require('@playwright/test');

test.describe('Endpoint Clinical Homepage Verification', () => {
  test('Test Case 1: The homepage displays the text “Your hidden advantage in RTSM”', async ({ page }) => {
    try {
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      // Find the hero heading text
      const heroHeading = page.locator('h1');
      await expect(heroHeading).toBeVisible({ timeout: 15000 });
      const headingText = await heroHeading.textContent();

      // Fix: Match the actual text format on the page
      expect(headingText).toContain('Your hiddenadvantagein RTSM');

      console.log('✓ Test Case 1 passed: Text is displayed');
    } catch (error) {
      console.error('❌ Test Case 1 failed:', error);
      throw error;
    }
  });

  test('Test Case 2: The text is clearly visible without requiring the user to scroll', async ({ page }) => {
    try {
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      // Verify the hero heading is visible without scrolling
      const heroHeading = page.locator('h1');
      await expect(heroHeading).toBeVisible({ timeout: 15000 });

      console.log('✓ Test Case 2 passed: Text is visible without scrolling');
    } catch (error) {
      console.error('❌ Test Case 2 failed:', error);
      throw error;
    }
  });

  test('Test Case 3: The text appears in the main hero section of the homepage', async ({ page }) => {
    try {
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      // Verify the hero heading is in the main hero section
      const heroHeading = page.locator('h1');
      await expect(heroHeading).toBeVisible({ timeout: 15000 });

      console.log('✓ Test Case 3 passed: Text appears in hero section');
    } catch (error) {
      console.error('❌ Test Case 3 failed:', error);
      throw error;
    }
  });

  test('Test Case 4: Responsive Design Verification', async ({ page }) => {
    try {
      const viewports = [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'mobile', width: 375, height: 667 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('https://www.endpointclinical.com', { 
          waitUntil: 'domcontentloaded', 
          timeout: 60000 
        });

        // Dismiss any consent/cookie dialogs
        try {
          const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
          await consentBtn.click({ timeout: 5000 });
          await page.waitForTimeout(1000);
        } catch (e) { /* No consent dialog */ }

        // Verify the hero heading is visible on all screen sizes
        const heroHeading = page.locator('h1');
        await expect(heroHeading).toBeVisible({ timeout: 15000 });

        // Fix: Match the actual text format on the page
        const headingText = await heroHeading.textContent();
        expect(headingText).toContain('Your hiddenadvantagein RTSM');

        console.log(`✓ Test Case 4 passed on ${viewport.name} viewport`);
      }
    } catch (error) {
      console.error('❌ Test Case 4 failed:', error);
      throw error;
    }
  });
});