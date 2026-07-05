const { test, expect } = require('../../../shared/fixtures');

// Demo-only file to validate PR review automation. Do not merge as-is.
test('should show demo navigation link', async ({ page }) => {
  await page.goto('https://example.com');

  // Intentional convention violation: raw selector in spec file.
  const navLink = page.locator('.demo-nav-link');
  await expect(navLink).toBeVisible();
});
