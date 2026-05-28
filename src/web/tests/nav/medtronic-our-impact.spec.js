// === FILE: src/web/tests/nav/medtronic-our-impact.spec.js ===
/**
 * Automated spec for Medtronic India Our Impact page.
 * JIRA: MED-6
 *
 * Test Cases:
 *   TC1: Verify Our Impact page loads successfully
 *   TC2: Navigate to Health Equity page
 *   TC3: Navigate to Inclusion, Diversity & Equity page
 *   TC4: Navigate to Protecting Our Planet page
 *   TC5: Navigate to Communities page
 */

const { test, expect } = require('../../../shared/fixtures');
const MedtronicOurImpactPage = require('../../pages/medtronic-our-impact.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Medtronic India Our Impact', { tag: ['@regression', '@medtronic'] }, () => {
  let impactPage;

  test.beforeEach(async ({ page }) => {
    impactPage = new MedtronicOurImpactPage(page);
    await impactPage.goto();
  });

  test('[C70] Test Case 1: Verify Our Impact page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(TD.urlPatterns.ourImpact, { timeout: 15000 });
    await expect(page).toHaveTitle(TD.pageTitles.ourImpact, { timeout: 15000 });
  });

  test('[C71] Test Case 2: Navigate to Health Equity page from Our Impact', async ({ page }) => {
    await impactPage.clickHealthEquity();
    await expect(page).toHaveURL(TD.urlPatterns.healthEquity, { timeout: 15000 });
  });

  test('[C72] Test Case 3: Navigate to Inclusion Diversity Equity page from Our Impact', async ({ page }) => {
    await impactPage.clickInclusionDiversity();
    await expect(page).toHaveURL(/inclusion.*diversity|diversity.*inclusion/i, { timeout: 15000 });
  });

  test('[C73] Test Case 4: Navigate to Protecting Our Planet page from Our Impact', async ({ page }) => {
    await impactPage.clickPlanet();
    await expect(page).toHaveURL(TD.urlPatterns.planet, { timeout: 15000 });
  });

  test('[C74] Test Case 5: Navigate to Communities page from Our Impact', async ({ page }) => {
    await impactPage.clickCommunities();
    await expect(page).toHaveURL(TD.urlPatterns.communities, { timeout: 15000 });
  });
});
