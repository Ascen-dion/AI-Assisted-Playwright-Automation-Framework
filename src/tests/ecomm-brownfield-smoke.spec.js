const { test, expect } = require('@playwright/test');
const EcommBrownfieldPage = require('../pages/ecomm-brownfield.page');

test.describe('Brownfield E-commerce Smoke Suite', () => {
  let ecommPage;

  test.beforeEach(async ({ page }) => {
    ecommPage = new EcommBrownfieldPage(page);
    await ecommPage.goto();
  });

  test('loads target e-commerce application', async ({ page }) => {
    const shellVisible = await ecommPage.isShellVisible();
    expect(shellVisible).toBe(true);
    await expect(page).toHaveURL(/azurewebsites\.net/i);
  });

  test('shows primary page layout', async () => {
    const hasLayout = await ecommPage.hasHeaderAndFooter();
    expect(hasLayout).toBe(true);
  });

  test('exposes shopping discovery entry points', async () => {
    const hasDiscoverySurface = await ecommPage.canDiscoverShoppingSurface();
    expect(hasDiscoverySurface).toBe(true);
  });
});
