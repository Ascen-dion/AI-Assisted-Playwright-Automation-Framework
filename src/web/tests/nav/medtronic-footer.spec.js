// === FILE: src/web/tests/nav/medtronic-footer.spec.js ===
/**
 * Automated spec for Medtronic India footer legal links navigation.
 * JIRA: MED-7
 *
 * Test Cases:
 *   TC1: Navigate to Privacy Statement page via footer link
 *   TC2: Navigate to Terms of Use page via footer link
 *   TC3: Navigate to Contact Us page via footer link
 */

const { test, expect } = require('../../../shared/fixtures');
const MedtronicFooterPage = require('../../pages/medtronic-footer.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Medtronic India Footer Navigation', { tag: ['@regression', '@medtronic'] }, () => {
  let footerPage;

  test.beforeEach(async ({ page }) => {
    footerPage = new MedtronicFooterPage(page);
    await footerPage.goto();
  });

  test('[C283] Test Case 1: Navigate to Privacy Statement page via footer link', async ({ page }) => {
    await footerPage.clickPrivacyStatement();
    await expect(page).toHaveURL(TD.urlPatterns.privacyStatement, { timeout: 15000 });
  });

  test('[C284] Test Case 2: Navigate to Terms of Use page via footer link', async ({ page }) => {
    await footerPage.clickTermsOfUse();
    await expect(page).toHaveURL(TD.urlPatterns.termsOfUse, { timeout: 15000 });
  });

  test('[C285] Test Case 3: Navigate to Contact Us page via footer link', async ({ page }) => {
    await footerPage.clickContact();
    await expect(page).toHaveURL(TD.urlPatterns.contactUs, { timeout: 15000 });
  });
});
