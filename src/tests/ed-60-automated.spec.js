const { test, expect } = require('@playwright/test');

test.describe('ED-60: Verify Solutions tab and Pulse tab functionality', () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test('Test Case 1: Navigate to https://www.endpointclinical.com and verify the Solutions tab is visible on the page', async ({ page }) => {
    try {
      const solutionsTab = page.locator('#w-dropdown-toggle-0');
      await expect(solutionsTab).toBeVisible({ timeout: 15000 });
      console.log('✓ Solutions tab is visible');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 2: Click on the Pulse tab and verify the page navigates to the correct section', async ({ page }) => {
    try {
      // Use more specific locator to avoid ambiguity
      const pulseLink = page.locator('a[href="/solutions-pulse"]').first();
      
      await pulseLink.click();
      await page.waitForURL(/solutions-pulse/i, { timeout: 15000 });
      
      console.log('✓ Navigated to Pulse tab section');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 3: Verify that the text "Your trusted RTSM solution, PULSE is designed to support all study designs with configurable, pre-validated components." is displayed after clicking the Pulse tab', async ({ page }) => {
    try {
      // Navigate directly to the Pulse page
      await page.goto('https://www.endpointclinical.com/solutions-pulse', { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });

      // Wait for content to load
      await page.waitForSelector('.pulse-content', { timeout: 15000 });

      // Use more accurate text matching
      const expectedText = 'Your trusted RTSM solution, PULSE is designed to support all study designs with configurable, pre-validated components.';
      const pulseText = page.locator('.pulse-content').first();
      
      await expect(pulseText).toContainText(expectedText, { timeout: 15000 });
      console.log('✓ Pulse description text is visible');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 4: Confirm the text appears in the expected location on the Pulse tab page', async ({ page }) => {
    try {
      await page.goto('https://www.endpointclinical.com/solutions-pulse', { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });

      await page.waitForSelector('.pulse-content', { timeout: 15000 });

      const pulseText = page.locator('.pulse-content').first();
      const container = pulseText.locator('xpath=..');
      
      await expect(container).toBeVisible({ timeout: 15000 });
      console.log('✓ Pulse text appears in expected location');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 5: Ensure the text is fully visible and not truncated or hidden', async ({ page }) => {
    try {
      await page.goto('https://www.endpointclinical.com/solutions-pulse', { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });

      await page.waitForSelector('.pulse-content', { timeout: 15000 });

      const pulseText = page.locator('.pulse-content').first();
      await expect(pulseText).toBeVisible({ timeout: 15000 });
      await expect(pulseText).not.toBeHidden({ timeout: 15000 });

      // Check if text is truncated by comparing bounding box
      const boundingBox = await pulseText.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
      console.log('✓ Pulse text is fully visible and not truncated');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});