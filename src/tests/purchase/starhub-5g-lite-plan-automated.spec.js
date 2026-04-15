// === FILE: src/tests/purchase/starhub-5g-lite-plan-automated.spec.js ===
/**
 * [UI] AC13: 5G Lite Plan Selection and Checkout Journey
 *
 * This spec uses test.describe.serial() because AC13b and AC13c form a dependent
 * purchase journey: AC13b adds the 5G Lite plan to the cart; AC13c proceeds to
 * checkout using that cart item. Both tests share the same browser context
 * (same session cookie) so the server-side cart state persists between them.
 *
 * AC13a is independent — it only navigates to the plans page without adding to cart.
 */
const { test, expect } = require('../../fixtures');
const StarHubMobilePurchasePage = require('../../pages/starhub-mobile-purchase.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC13: 5G Lite Plan Selection and Checkout Journey', { tag: ['@regression'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarHubMobilePurchasePage(page);
    try {
      await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 });
    } catch {}
  });

  // ── AC13a: Navigate to 5G Unlimited+ plans page via Mobile dropdown ──────

  test('[C591] Test Case 13a: Navigate to 5G Unlimited+ plans page via Mobile dropdown', async ({ page }) => {
    // Arrange
    await pageObj.goto();

    // Act
    await pageObj.openMobileDropdown();
    await pageObj.clickFiveGUnlimitedLink();

    // Assert — URL resolves to the 5G Unlimited+ mobile plans page
    await expect(page).toHaveURL(TD.urlPatterns.mobilePlans, { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(TD.pageTitles.mobilePlans, { timeout: 15000 });
  });

  // ── AC13b: Select 5G Lite plan and verify Review Order page ─────────────
  // NOTE: This test adds 5G Lite to the cart. AC13c depends on this cart state.

  test('[C592] Test Case 13b: Select 5G Lite plan and verify Review Order page with cart', async ({ page }) => {
    // Arrange — navigate directly to plans page (consumer subdomain SPA)
    await pageObj.gotoMobilePlans();

    // Act — click Select plan on the 5G Lite card (first card under 5G Unlimited+ tab)
    await pageObj.clickSelectPlanFor5GLite();

    // Assert — URL resolves to the Review Order page
    await expect(page).toHaveURL(TD.urlPatterns.reviewOrder, { timeout: 30000 });

    // Assert — 5G Lite plan is visible in the cart summary
    const cartItemVisible = await pageObj.is5GLiteInCart();
    expect(cartItemVisible).toBe(true);
  });

  // ── AC13c: Proceed to checkout from Review Order page ───────────────────
  // NOTE: Runs the full plan-selection flow independently (cart lives in SPA
  // memory — direct navigation to revieworder shows an empty cart for new pages).

  test('[C593] Test Case 13c: Proceed to checkout from Review Order page', async ({ page }) => {
    // Arrange — navigate to plans page and select 5G Lite (own SPA session per test page)
    await pageObj.gotoMobilePlans();
    await pageObj.clickSelectPlanFor5GLite();

    // Wait for redirects through boc-bos to Review Order page
    await expect(page).toHaveURL(TD.urlPatterns.reviewOrder, { timeout: 30000 });

    // Assert — 5G Lite is in the cart (confirms plan selection succeeded)
    const cartItemVisible = await pageObj.is5GLiteInCart();
    expect(cartItemVisible).toBe(true);

    // Assert — Proceed to checkout button is visible and enabled
    const proceedVisible = await pageObj.isProceedToCheckoutVisible();
    expect(proceedVisible).toBe(true);

    // Act — click Proceed to checkout
    await pageObj.clickProceedToCheckout();

    // Assert — clicking Proceed to checkout triggers the Hub ID auth popup
    // (URL stays on revieworder; the auth gate is an overlay modal, not a redirect)
    const loginButtonVisible = await pageObj.isLoginWithHubIDButtonVisible();
    expect(loginButtonVisible).toBe(true);
  });
});
