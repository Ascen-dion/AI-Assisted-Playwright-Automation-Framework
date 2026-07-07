// === FILE: src/tests/purchase/starhub-galaxy-a57-default-config-automated.spec.js ===
/**
 * [UI] StarHub Galaxy A57 5G - Default Configuration
 *
 * Target URL: https://consumer.starhub.com/personal/store/mobile/devices/samsung/galaxy-a57-5g
 * TestRail Case: C628
 */
const { test, expect } = require('../../fixtures');
const StarHubMobilePurchasePage = require('../../pages/starhub-mobile-purchase.page');
const TD = require('../../data/test-data');

test.describe('[UI] StarHub Galaxy A57 5G Default Configuration', { tag: ['@smoke'] }, () => {
  let pageObj;

  test('[C628] Test Case 3: Verify default device configuration displays correct colour, storage, and payment option on Samsung Galaxy A57 5G details page', async ({ page }) => {
    pageObj = new StarHubMobilePurchasePage(page);
    await pageObj.gotoGalaxyA57();

    const colourText = await pageObj.getDefaultColourLabel();
    expect(colourText).toContain(TD.galaxyA57.colourLabelPrefix);
    expect(colourText).toContain(TD.galaxyA57.defaultColour);

    const storageText = await pageObj.getDefaultStorageLabel();
    expect(storageText).toContain(TD.galaxyA57.storageLabelPrefix);
    expect(storageText).toContain(TD.galaxyA57.defaultStorage);

    const storage256Visible = await pageObj.isStorage256GBVisible();
    expect(storage256Visible).toBe(true);

    const activePaymentText = await pageObj.getActivePaymentOptionText();
    expect(activePaymentText).toContain(TD.galaxyA57.defaultPaymentPeriod);

    const payment24Visible = await pageObj.is24MonthPaymentVisible();
    expect(payment24Visible).toBe(true);
  });
});
