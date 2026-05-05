// === FILE: src/bdd/steps/homepage/homepage.steps.js ===
/**
 * Homepage Step Definitions — steps specific to the StarHub personal home page.
 *
 * Common navigation and assertion steps are in ../common.steps.js.
 */

const { Then } = require('../../support/fixtures');
const { expect } = require('@playwright/test');

// ──────────────────────────────────────────────────────────
// THEN — Top Navigation assertions
// ──────────────────────────────────────────────────────────

Then('the {string} top nav link should be visible', async ({ page }, linkName) => {
  await expect(
    page.getByRole('link', { name: linkName }).first()
  ).toBeVisible({ timeout: 15000 });
});

// ──────────────────────────────────────────────────────────
// THEN — Main Navigation assertions
// ──────────────────────────────────────────────────────────

Then('the {string} menu button should be visible', async ({ page }, buttonName) => {
  await expect(
    page.getByRole('button', { name: buttonName })
  ).toBeVisible({ timeout: 15000 });
});

// ──────────────────────────────────────────────────────────
// THEN — Hero Banner assertions
// ──────────────────────────────────────────────────────────

Then('the hero banner heading should be visible', async ({ starhubPage }) => {
  const heading = await starhubPage.getHeroHeadingText();
  expect(heading).toBeTruthy();
});

// ──────────────────────────────────────────────────────────
// THEN — Value Proposition assertions
// ──────────────────────────────────────────────────────────

Then('the {string} value proposition should be visible', async ({ page }, propText) => {
  await expect(
    page.getByText(propText).first()
  ).toBeVisible({ timeout: 15000 });
});

// ──────────────────────────────────────────────────────────
// THEN — Section Heading assertions
// ──────────────────────────────────────────────────────────

Then('the {string} section heading should be visible', async ({ page }, headingText) => {
  await expect(
    page.getByRole('heading', { name: new RegExp(headingText, 'i') }).first()
  ).toBeVisible({ timeout: 15000 });
});

// ──────────────────────────────────────────────────────────
// THEN — Footer assertions
// ──────────────────────────────────────────────────────────

Then('the footer copyright should contain {string}', async ({ starhubPage }, expectedText) => {
  const copyrightText = await starhubPage.getFooterCopyrightText();
  expect(copyrightText).toContain(expectedText);
});

Then('the {string} footer link should be visible', async ({ page }, linkName) => {
  const link = page.getByRole('link', { name: linkName });
  await link.last().scrollIntoViewIfNeeded();
  await expect(link.last()).toBeVisible({ timeout: 15000 });
});
