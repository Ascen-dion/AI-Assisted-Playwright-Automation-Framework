const { test, expect } = require('@playwright/test');

test.describe('Ascendion Homepage Welcome Message Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://ascendion.com', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Dismiss any consent/cookie dialogs
    try {
      const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
      await consentBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) { /* No consent dialog present */ }
  });

  test('Test Case 1: Open the URL https://ascendion.com in a web browser', async ({ page }) => {
    try {
      await expect(page).toHaveURL(/ascendion/i);
      console.log('✓ Test Case 1 passed: URL opened successfully');
    } catch (error) {
      console.error('❌ Test Case 1 failed:', error);
      throw error;
    }
  });

  test('Test Case 2: Verify that the text "AI is Everywhere. Value Isn’t—Until You Engineer It." is displayed on the homepage', async ({ page }) => {
    try {
      const welcomeText = page.locator('h2').first();
      await expect(welcomeText).toContainText('AI is Everywhere. Value Isn’t—Until You Engineer It.', { timeout: 20000 });
      console.log('✓ Test Case 2 passed: Welcome message is displayed');
    } catch (error) {
      console.error('❌ Test Case 2 failed:', error);
      throw error;
    }
  });

  test('Test Case 3: Ensure the text is visible without scrolling on the initial page load', async ({ page }) => {
    try {
      const welcomeText = page.locator('h2').first();
      await expect(welcomeText).toBeVisible({ timeout: 20000 });

      const boundingBox = await welcomeText.boundingBox();
      const viewport = await page.viewportSize();

      expect(boundingBox).not.toBeNull();
      expect(boundingBox.x).toBeGreaterThanOrEqual(0);
      expect(boundingBox.y).toBeGreaterThanOrEqual(0);
      expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(viewport.width);
      expect(boundingBox.y + boundingBox.height).toBeLessThanOrEqual(viewport.height);
      console.log('✓ Test Case 3 passed: Text is visible without scrolling');
    } catch (error) {
      console.error('❌ Test Case 3 failed:', error);
      throw error;
    }
  });

  test('Test Case 4: Check that the text is displayed in a readable font size and style', async ({ page }) => {
    try {
      const welcomeText = page.locator('h2').first();
      await expect(welcomeText).toBeVisible({ timeout: 20000 });

      const styles = await welcomeText.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          color: style.color
        };
      });

      const fontSizeMatch = styles.fontSize.match(/(\d+)px/);
      expect(fontSizeMatch && parseInt(fontSizeMatch[1]) >= 16).toBeTruthy();
      console.log('✓ Test Case 4 passed: Text has readable font size and style');
    } catch (error) {
      console.error('❌ Test Case 4 failed:', error);
      throw error;
    }
  });

  test('Test Case 5: Confirm that the text is centered on the page', async ({ page }) => {
    try {
      const welcomeText = page.locator('h2').first();
      await expect(welcomeText).toBeVisible({ timeout: 20000 });

      const boundingBox = await welcomeText.boundingBox();
      const viewport = await page.viewportSize();

      expect(boundingBox).not.toBeNull();

      const horizontalCenter = boundingBox.x + (boundingBox.width / 2);
      const pageCenter = viewport.width / 2;
      const tolerance = 50;

      expect(Math.abs(horizontalCenter - pageCenter)).toBeLessThanOrEqual(tolerance);
      console.log('✓ Test Case 5 passed: Text is centered on the page');
    } catch (error) {
      console.error('❌ Test Case 5 failed:', error);
      throw error;
    }
  });
});