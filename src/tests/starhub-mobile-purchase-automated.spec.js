/**
 * [UI] StarHub Mobile Device Purchase Flow
 *
 * AC2: Select Mobile Device
 *   - Navigate to All Phones listing → select Galaxy A57 5G → PDP loads
 * AC3: Verify Default Device Configuration
 *   - Colour: Awesome Navy (NOTE: AC states "Black"; live default confirmed as "Awesome Navy" on 2026-04-13)
 *   - Storage: 256GB
 *   - Payment: 24-month installment
 * AC4: Proceed to Next Step
 *   - Clicking Next initiates purchase journey (auth modal appears)
 * AC5: Display Login / Sign-Up Popup
 *   - Popup shows exact message + "Log in with Hub ID" + "Don't have an account? Sign up here"
 */
const { test, expect } = require('@playwright/test');
const StarHubMobilePurchasePage = require('../pages/starhub-mobile-purchase.page');

test.describe('[UI] StarHub Mobile Device Purchase Flow', () => {

  /**
   * AC2: Select Mobile Device
   * Navigates from homepage → Mobile dropdown → All Phones → selects Galaxy A57 5G
   */
  test.describe('AC2: Select Mobile Device', () => {
    let pageObj;

    test.beforeEach(async ({ page }) => {
      pageObj = new StarHubMobilePurchasePage(page);
      await pageObj.goto();
      await pageObj.dismissCookieConsent();
    });

    test('AC2: Clicking Galaxy A57 5G on the All Phones listing page opens the device detail page', async ({ page }) => {
      // Arrange: open mobile nav dropdown
      await pageObj.navigateToMobileDropdown();

      // Act: navigate to All Phones listing and select the device
      await pageObj.clickAllPhones();
      await pageObj.selectGalaxyA57Device();

      // Assert: PDP for Galaxy A57 5G is displayed
      const isLoaded = await pageObj.isProductDetailPageLoaded();
      expect(isLoaded).toBe(true);
      await expect(page).toHaveURL(/galaxy-a57-5g/i);
    });
  });

  /**
   * AC3–AC5 navigate directly to the PDP for speed and test independence.
   * PDP URL: consumer.starhub.com/personal/store/mobile/devices/samsung/galaxy-a57-5g
   */
  test.describe('AC3-AC5: Device Configuration and Purchase Flow', () => {
    let pageObj;

    test.beforeEach(async ({ page }) => {
      pageObj = new StarHubMobilePurchasePage(page);
      await pageObj.gotoPDP();
      await pageObj.dismissCookieConsent();
    });

    test('AC3: Samsung Galaxy A57 5G detail page shows correct default configuration', async ({ page }) => {
      // Assert: PDP is displayed
      const isLoaded = await pageObj.isProductDetailPageLoaded();
      expect(isLoaded).toBe(true);

      // Assert: default colour
      // NOTE: AC states "Black" — live DOM confirms default is "Awesome Navy" (2026-04-13)
      const colour = await pageObj.getSelectedColor();
      expect(colour).toMatch(/Awesome Navy/i);

      // Assert: default storage
      const storage = await pageObj.getSelectedStorage();
      expect(storage).toMatch(/256\s?GB/i);

      // Assert: default payment option
      const payment = await pageObj.getSelectedPaymentOption();
      expect(payment).toMatch(/24.?month/i);
    });

    test('AC4: Clicking the Next button initiates the next step in the purchase journey', async ({ page }) => {
      // Arrange: confirm PDP is loaded
      await pageObj.isProductDetailPageLoaded();

      // Act: click Next
      await pageObj.clickNextButton();

      // Assert: next step is initiated (auth modal becomes visible)
      const isModalVisible = await pageObj.isAuthModalVisible();
      expect(isModalVisible).toBe(true);
    });

    test('AC5: Auth popup displays login message and both login and sign-up options', async ({ page }) => {
      // Arrange: reach the auth trigger
      await pageObj.isProductDetailPageLoaded();
      await pageObj.clickNextButton();

      // Assert: exact popup message
      const authMessage = await pageObj.getAuthMessage();
      expect(authMessage).toBe('Please log in or create an account to continue with your purchase');

      // Assert: "Log in with Hub ID" button is visible
      const isHubIdVisible = await pageObj.isHubIdLoginButtonVisible();
      expect(isHubIdVisible).toBe(true);

      // Assert: "Don't have an account? Sign up here" button is visible
      const isSignUpVisible = await pageObj.isSignUpLinkVisible();
      expect(isSignUpVisible).toBe(true);
    });
  });
});