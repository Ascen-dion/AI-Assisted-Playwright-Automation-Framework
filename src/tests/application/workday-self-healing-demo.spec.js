// === FILE: src/tests/application/workday-self-healing-demo.spec.js ===
/**
 * Self-Healing Demo — Capital One AAVA Demo (Use Case 3)
 *
 * DEMO NARRATIVE:
 * ──────────────────────────────────────────────────────────────────────────
 * "Workday just released its March 2026 update. The Journal Entry Status
 *  field was renamed in the DOM from:
 *
 *    data-automation-id="journalEntryStatus"   (pre-release)
 *  to:
 *    data-automation-id="jelStatus"            (post-release)
 *
 *  Without AAVA, this would silently break every test that reads the status.
 *  Watch what happens when AAVA detects the failure and heals it automatically."
 * ──────────────────────────────────────────────────────────────────────────
 *
 * DEMO STEPS (run in order, live in front of the audience):
 *
 *   Step 1: Run 'workday-self-healing-demo.spec.js --project=chromium'
 *           → The "Broken Selector" test FAILS (as expected — this proves it breaks)
 *           → The failure is written to test-results/healing-queue.json
 *
 *   Step 2: Run the AI healer:
 *           node src/helpers/self-healing.js --queue test-results/healing-queue.json
 *           → AI reads the page HTML and the broken selector
 *           → AI suggests the new selector: [data-automation-id="jelStatus"]
 *           → Healing is recorded in test-results/healing-history.json
 *
 *   Step 3: Apply the healed selector:
 *           The locator file is updated automatically (or shown manually for demo)
 *
 *   Step 4: Re-run the spec → all tests PASS ✓
 *
 * Run command:
 *   npx playwright test src/tests/application/workday-self-healing-demo.spec.js \
 *     --config=config/playwright.config.js --headed
 */

const { test, expect } = require('../../fixtures');
const WorkdayFinancePage = require('../../pages/workday-finance.page');
const TD = require('../../data/workday-test-data');

// ─────────────────────────────────────────────────────────────────────────────
//  Phase A — BEFORE the Workday release (selectors are correct — all green)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UC3-A] Self-Healing Demo: Pre-Release Baseline (all tests PASS)', {
  tag: ['@demo', '@self-healing', '@capital-one'],
}, () => {
  let finance;

  test.beforeEach(async ({ page }) => {
    finance = new WorkdayFinancePage(page);
    await finance.gotoCreateJournalEntry();
  });

  test('[C215] Test Case 15: Read Journal Entry status using correct selector (pre-release)', async ({ page }) => {
    // This uses the CORRECT selector — should pass every time before a Workday release
    const status = await finance.getJournalEntryStatus();
    expect(status.trim()).toBe(TD.statuses.journalDraft);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Phase B — AFTER the Workday release (broken selector — test FAILS)
//  This is the "red state" we show to the audience before triggering self-healing.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UC3-B] Self-Healing Demo: Post-Release Broken Selector (test FAILS — expected)', {
  tag: ['@demo', '@self-healing', '@capital-one', '@broken'],
}, () => {

  test('[C216] Test Case 16: Status selector breaks after Workday release [SELF-HEALING TARGET]', async ({ page }) => {
    /**
     * DEMO NOTE: This test deliberately uses the OLD (now broken) selector.
     * The fixture wraps the test and writes the failure context to
     * test-results/healing-queue.json for the AI to repair.
     *
     * In a real scenario, this would be a normal test that unknowingly breaks
     * after a Workday release. AAVA detects it and queues it for healing.
     */

    // Navigate to Journal Entry form
    const finance = new WorkdayFinancePage(page);
    await finance.gotoCreateJournalEntry();

    // ⚠️  BROKEN SELECTOR — simulates post-Workday-release DOM change
    // Before release: [data-automation-id="journalEntryStatus"]
    // After release:  [data-automation-id="jelStatus"]  ← what Workday now uses
    const brokenSelector = '[data-automation-id="journalEntryStatus"]'; // OLD — will not find element
    const statusElement = page.locator(brokenSelector);

    // This will fail → fixture catches it → writes to healing-queue.json
    await expect(statusElement).toBeVisible({ timeout: 8000 });
    const statusText = await statusElement.textContent();
    expect(statusText.trim()).toBe(TD.statuses.journalDraft);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Phase C — AFTER AI healing (healed selector — test PASSES again)
//  Show this after running: node src/helpers/self-healing.js --queue test-results/healing-queue.json
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UC3-C] Self-Healing Demo: Post-Healing (test PASSES again ✓)', {
  tag: ['@demo', '@self-healing', '@capital-one', '@healed'],
}, () => {

  test('[C217] Test Case 17: Status selector works after AI healing (uses new selector)', async ({ page }) => {
    /**
     * DEMO NOTE: After running the AI healer, this test uses the NEW selector
     * that AAVA discovered: [data-automation-id="jelStatus"]
     *
     * In production, the locator file is automatically patched by the healer.
     * This test demonstrates the healed result.
     *
     * Healing history is persisted at: test-results/healing-history.json
     * The AI will not re-heal the same element — it learns from history.
     */

    const finance = new WorkdayFinancePage(page);
    await finance.gotoCreateJournalEntry();

    // ✅ HEALED SELECTOR — discovered by AI during self-healing run
    const healedSelector = '[data-automation-id="jelStatus"]';
    const statusElement = page.locator(healedSelector);

    await expect(statusElement).toBeVisible({ timeout: 15000 });
    const statusText = await statusElement.textContent();
    expect(statusText.trim()).toBe(TD.statuses.journalDraft);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Phase D — Healing History Validation
//  Show the audience that AAVA remembers the healing and won't repeat the error.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('[UC3-D] Self-Healing Demo: Healing History Prevents Repeat Failures', {
  tag: ['@demo', '@self-healing', '@capital-one'],
}, () => {
  const fs = require('fs');
  const path = require('path');

  test('[C218] Test Case 18: Healing history file records the repaired selector', async () => {
    /**
     * This test validates the AAVA healing history file directly.
     * It proves that the framework learned the fix and will apply it
     * immediately in future runs without needing AI again.
     */
    const historyPath = path.resolve(__dirname, '../../../test-results/healing-history.json');

    if (!fs.existsSync(historyPath)) {
      test.skip(true, 'Healing history not yet created — run UC3-B and the healer first');
      return;
    }

    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    const journalStatusHeal = history.find(
      (h) => h.elementDescription && h.elementDescription.includes('journalEntryStatus')
        && h.success === true
    );

    expect(journalStatusHeal).toBeDefined();
    expect(journalStatusHeal.newSelector).toContain('jelStatus');
    expect(journalStatusHeal.healingStrategy).toMatch(/ai-generated|history-based/);
    expect(journalStatusHeal.confidence).toBeGreaterThan(0.7);
  });
});
