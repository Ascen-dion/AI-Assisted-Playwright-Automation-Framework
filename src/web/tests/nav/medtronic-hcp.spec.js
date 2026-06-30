// === FILE: src/web/tests/nav/medtronic-hcp.spec.js ===
/**
 * Automated spec for Medtronic India Healthcare Professionals page.
 * JIRA: MED-8
 *
 * Test Cases:
 *   TC1: Verify Healthcare Professionals page loads successfully
 *   TC2: Verify main heading is visible on HCP page
 *   TC3: Verify therapies/products section content is visible
 */

const { test, expect } = require('../../../shared/fixtures');
const MedtronicHcpPage = require('../../pages/medtronic-hcp.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Medtronic India Healthcare Professionals', { tag: ['@regression', '@medtronic'] }, () => {
  let hcpPage;

  test.beforeEach(async ({ page }) => {
    hcpPage = new MedtronicHcpPage(page);
    await hcpPage.goto();
  });

  test('[C286] Test Case 1: Verify Healthcare Professionals page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(TD.urlPatterns.healthcareProfessionals, { timeout: 15000 });
    await expect(page).toHaveTitle(/Medtronic/i, { timeout: 15000 });
  });

  test('[C287] Test Case 2: Verify main heading is visible on HCP page', async () => {
    const visible = await hcpPage.isMainHeadingVisible();
    expect(visible).toBe(true);
  });

  test('[C288] Test Case 3: Verify therapies or products section content is visible', async () => {
    const visible = await hcpPage.isTherapiesSectionVisible();
    expect(visible).toBe(true);
  });
});
