// === FILE: src/pages/starhub-mobile-purchase.page.js ===
const BasePage = require('./base.page');
const loc = require('./locators/starhub-mobile-purchase.locators');

const HOMEPAGE_URL = 'https://www.starhub.com/personal.html';
const DEVICES_URL = 'https://consumer.starhub.com/personal/store/mobile/devices';
const GALAXY_A57_URL = 'https://consumer.starhub.com/personal/store/mobile/devices/samsung/galaxy-a57-5g';
const MOBILE_PLANS_URL = 'https://consumer.starhub.com/personal/store/mobile-plans';
const REVIEW_ORDER_URL = 'https://consumer.starhub.com/personal/revieworder';

class StarHubMobilePurchasePage extends BasePage {

  // ── Navigation helpers ───────────────────────────────────────────────────

  /**
   * Navigate to the StarHub personal homepage.
   * Used as entry point for AC1 nav-flow tests.
   */
  async goto() {
    await super.goto(HOMEPAGE_URL);
  }

  /**
   * Navigate directly to the All Phones device listing page.
   * consumer.starhub.com is a heavy React SPA; networkidle waits for JS hydration.
   */
  async gotoDeviceListing() {
    await super.goto(DEVICES_URL);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate directly to the Samsung Galaxy A57 5G product detail page.
   */
  async gotoGalaxyA57() {
    await super.goto(GALAXY_A57_URL);
    await this.page.waitForLoadState('networkidle');
  }

  // ── AC1 — Mobile nav dropdown flow ──────────────────────────────────────

  /**
   * Click the "Mobile" top-nav button to expand the dropdown megamenu.
   */
  async openMobileDropdown() {
    await loc.mobileNavButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.mobileNavButton(this.page).click();
  }

  /**
   * Click the "All Phones" link inside the expanded Mobile dropdown.
   * Caller must have already called openMobileDropdown().
   */
  async clickAllPhones() {
    await loc.allPhonesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.allPhonesLink(this.page).click();
  }

  /**
   * Returns true when the "Mobile Devices" heading is visible on the listing page.
   */
  async isDeviceListingPageDisplayed() {
    await loc.deviceListingHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.deviceListingHeading(this.page).isVisible();
  }

  /**
   * Returns the item count text (e.g. "38 items") from the listing page header.
   */
  async getDeviceItemCountText() {
    await loc.deviceItemCount(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.deviceItemCount(this.page).textContent();
  }

  // ── AC2 — Select device on listing page ─────────────────────────────────

  /**
   * Click the Samsung Galaxy A57 5G device card on the listing page.
   */
  async clickGalaxyA57() {
    await loc.galaxyA57Card(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.galaxyA57Card(this.page).click();
  }

  /**
   * Returns true when the Samsung Galaxy A57 5G device breadcrumb title is visible.
   */
  async isGalaxyA57PDPDisplayed() {
    await loc.deviceBreadcrumbTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.deviceBreadcrumbTitle(this.page).isVisible();
  }

  // ── AC3 — Verify default device configuration ────────────────────────────

  /**
   * Returns the full colour label text from the parent container, e.g. "Colour: Awesome Navy".
   * The .f-label-phone span only contains "Colour: " — the colour name lives in a sibling span.
   * Uses the parent div (xpath=..) which aggregates both prefix and colour value.
   * Waits for the colour name to be hydrated by the SPA before reading.
   */
  async getDefaultColourLabel() {
    // Wait for the parent container to be visible first
    await loc.colourLabel(this.page).waitFor({ state: 'visible', timeout: 15000 });
    // Poll until the parent text contains more than just the "Colour: " prefix
    await this.page.waitForFunction(
      () => {
        const spans = document.querySelectorAll('.f-label-phone');
        for (const span of spans) {
          if (span.textContent.trim().startsWith('Colour:')) {
            const parentText = (span.parentElement?.textContent || '').trim();
            if (parentText.includes(':') && parentText.split(':')[1].trim().length > 0) {
              return true;
            }
          }
        }
        return false;
      },
      { timeout: 15000 }
    );
    return ((await loc.colourLabel(this.page).textContent()) || '').trim();
  }

  /**
   * Returns the full storage label text from the parent container, e.g. "Storage: 256GB".
   * Uses the same parent-traversal approach as getDefaultColourLabel().
   */
  async getDefaultStorageLabel() {
    await loc.storageLabel(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForFunction(
      () => {
        const spans = document.querySelectorAll('.f-label-phone');
        for (const span of spans) {
          if (span.textContent.trim().startsWith('Storage:')) {
            const parentText = (span.parentElement?.textContent || '').trim();
            if (parentText.includes(':') && parentText.split(':')[1].trim().length > 0) {
              return true;
            }
          }
        }
        return false;
      },
      { timeout: 15000 }
    );
    return ((await loc.storageLabel(this.page).textContent()) || '').trim();
  }

  /**
   * Returns the text of the currently active (selected) payment option chip.
   */
  async getActivePaymentOptionText() {
    await loc.activePaymentOption(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.activePaymentOption(this.page).textContent();
  }

  /**
   * Returns true when the 256GB storage option chip is visible on the page.
   */
  async isStorage256GBVisible() {
    await loc.storage256GBOption(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.storage256GBOption(this.page).isVisible();
  }

  /**
   * Returns true when the 24-month payment option is visible on the page.
   */
  async is24MonthPaymentVisible() {
    await loc.payment24MonthOption(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.payment24MonthOption(this.page).isVisible();
  }

  // ── AC4 / AC5 — Next button and auth popup ───────────────────────────────

  /**
   * Click the "Next" purchase CTA button on the device PDP.
   * Note: uses exact match to avoid targeting the image carousel "Next Item" button.
   */
  async clickNextButton() {
    await loc.nextButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.nextButton(this.page).click();
  }

  /**
   * Returns true when the login/signup overlay modal is visible.
   */
  async isLoginPopupVisible() {
    await loc.loginPopupModal(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.loginPopupModal(this.page).isVisible();
  }

  /**
   * Returns the message text displayed inside the login popup.
   */
  async getLoginPopupMessageText() {
    await loc.loginPopupMessage(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.loginPopupMessage(this.page).textContent();
  }

  /**
   * Returns true when the "Log in with Hub ID" button is visible inside the popup.
   */
  async isLoginWithHubIDButtonVisible() {
    await loc.loginWithHubIDButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.loginWithHubIDButton(this.page).isVisible();
  }

  /**
   * Returns true when the "Don't have an account? Sign up here" button is visible.
   */
  async isSignUpButtonVisible() {
    await loc.signUpButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.signUpButton(this.page).isVisible();
  }

  // ── AC13 — 5G Lite plan selection journey ────────────────────────────────

  async gotoMobilePlans() {
    await super.goto(MOBILE_PLANS_URL);
  }

  async gotoReviewOrder() {
    await super.goto(REVIEW_ORDER_URL);
  }

  async clickFiveGUnlimitedLink() {
    await loc.fiveGUnlimitedLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.fiveGUnlimitedLink(this.page).click();
  }

  async clickSelectPlanFor5GLite() {
    await loc.selectPlanFor5GLite(this.page).waitFor({ state: 'visible', timeout: 30000 });
    await loc.selectPlanFor5GLite(this.page).click();
    // Dismiss the "Protect from scams" complimentary services popup that
    // appears on the boc-bos intermediate page before redirecting to revieworder
    try {
      await loc.scamProtectionPopupDismiss(this.page).waitFor({ state: 'visible', timeout: 10000 });
      await loc.scamProtectionPopupDismiss(this.page).click();
    } catch {}
  }

  async is5GLiteInCart() {
    await loc.cartItemFiveGLite(this.page).waitFor({ state: 'visible', timeout: 30000 });
    return await loc.cartItemFiveGLite(this.page).isVisible();
  }

  async isProceedToCheckoutVisible() {
    await loc.proceedToCheckoutButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.proceedToCheckoutButton(this.page).isVisible();
  }

  async clickProceedToCheckout() {
    await loc.proceedToCheckoutButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.proceedToCheckoutButton(this.page).click();
  }
}

module.exports = StarHubMobilePurchasePage;
