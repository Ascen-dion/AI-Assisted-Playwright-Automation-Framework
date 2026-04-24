// === FILE: src/tests/nav/ud-homepage-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const UdHomepageNavPage = require('../../pages/ud-homepage-nav.page');
const UdProductsNavPage = require('../../pages/ud-products-nav.page');
const TD = require('../../data/test-data');

// ─────────────────────────────────────────────────────────────────────────────
//  AC1: Verify homepage hero banner is visible on load
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UI] AC1: Verify UnionDigital Bank homepage loads with hero banner', { tag: ['@smoke', '@regression'] }, () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new UdHomepageNavPage(page);
    await homePage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[C001] Test Case 1: Verify homepage loads and hero banner section is visible', async ({ page }) => {
    // Assert — homepage banner section visible
    await expect(page.locator('#homepage-banner')).toBeVisible({ timeout: 15000 });

    // Assert — page URL matches homepage pattern
    await expect(page).toHaveURL(TD.urlPatterns.homepage, { timeout: 15000 });
  });

  test('[C002] Test Case 2: Verify homepage page title contains UnionDigital Bank', async ({ page }) => {
    // Assert — page title
    await expect(page).toHaveTitle(TD.pageTitles.homepage, { timeout: 15000 });
  });

  test('[C003] Test Case 3: Verify Download the App CTA button is visible on homepage banner', async ({ page }) => {
    // Assert — download CTA visible
    await expect(page.getByRole('button', { name: /download the app/i }).first()).toBeVisible({ timeout: 15000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  AC2: Navigate to UD Save page via Products dropdown
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UI] AC2: Navigate to UD Save page via Products dropdown', { tag: ['@smoke', '@regression'] }, () => {
  let productsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new UdProductsNavPage(page);
    await productsPage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[C004] Test Case 1: Navigate to UD Save page via Products dropdown', async ({ page }) => {
    // Act
    await productsPage.openProductsDropdown();
    await productsPage.clickUdSave();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.productsSavings, { timeout: 15000 });
  });

  test('[C005] Test Case 2: Navigate to UD Time Deposit page via Products dropdown', async ({ page }) => {
    // Act
    await productsPage.openProductsDropdown();
    await productsPage.clickUdTimeDeposit();

    // Assert
    await expect(page).toHaveURL(TD.urlPatterns.productsTimeDeposit, { timeout: 15000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  AC3: Verify About Us nav link navigates correctly
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UI] AC3: Verify About Us navigation link resolves correctly', { tag: ['@smoke', '@regression'] }, () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new UdHomepageNavPage(page);
    await homePage.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[C006] Test Case 1: Verify About Us nav link is visible and navigates to about-us page', async ({ page }) => {
    // Assert — link visible
    await expect(page.getByRole('link', { name: 'About Us' }).first()).toBeVisible({ timeout: 15000 });

    // Act
    await homePage.clickAboutUsNav();

    // Assert — URL resolves to about-us
    await expect(page).toHaveURL(TD.urlPatterns.aboutUs, { timeout: 15000 });
  });
});
