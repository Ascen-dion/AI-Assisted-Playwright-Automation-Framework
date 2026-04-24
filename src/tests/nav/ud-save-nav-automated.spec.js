// === FILE: src/tests/nav/ud-save-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const UdSaveNavPage = require('../../pages/ud-save-nav.page');
const TD = require('../../data/test-data');

// ─────────────────────────────────────────────────────────────────────────────
//  AC4: Verify UD Save Account page content and page title
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UI] AC4: Verify UD Save Account page loads with correct content', { tag: ['@smoke', '@regression'] }, () => {
  let savePage;

  test.beforeEach(async ({ page }) => {
    savePage = new UdSaveNavPage(page);
    await savePage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[C007] Test Case 1: Verify UD Save Account page title is correct', async ({ page }) => {
    // Assert
    await expect(page).toHaveTitle(TD.pageTitles.productsSavings, { timeout: 15000 });
  });

  test('[C008] Test Case 2: Verify UD Save Account page URL is correct', async ({ page }) => {
    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.productsSavings, { timeout: 15000 });
  });

  test('[C009] Test Case 3: Verify UD Save Account hero heading is visible', async ({ page }) => {
    // Assert — heading visible
    await expect(
      page.getByRole('heading', { name: /UD Save Account/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('[C010] Test Case 4: Verify savings interest rate feature text is visible', async ({ page }) => {
    // Assert
    await expect(
      page.getByText(/Mag-ipon lang sa account mo/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('[C011] Test Case 5: Verify bills payment feature text is visible', async ({ page }) => {
    // Assert
    await expect(
      page.getByText(/Goodbye na sa mahabang pila/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('[C012] Test Case 6: Verify app download section is visible on UD Save page', async ({ page }) => {
    // Assert
    await expect(page.locator('#homepage-download')).toBeVisible({ timeout: 15000 });
  });
});
