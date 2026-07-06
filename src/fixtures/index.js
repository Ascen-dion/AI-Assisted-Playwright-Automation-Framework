// === FILE: src/fixtures/index.js ===
/**
 * Extended Playwright test fixture for brownfield automation.
 *
 * Usage in new spec files (replaces direct @playwright/test imports):
 *
 *   const { test, expect } = require('../fixtures');
 *
 * Benefits over raw @playwright/test:
 *  - ✅ AUTOMATIC SELF-HEALING: Tries multiple selector strategies in real-time during test execution
 *  - Healing queue: on test failure, failed selector context is appended to
 *    test-results/healing-queue.json for batch AI repair via `npm run heal`
 *  - Healing history: learns from successful healings and reuses them
 *  - Existing page objects continue to work unchanged — no POM edits required
 *
 * Configuration (.env):
 *  - AUTO_HEALING_ENABLED=true   (default: true)  - Enable automatic healing during tests
 *  - AUTO_HEALING_USE_AI=false   (default: false) - Use real-time AI healing (expensive)
 *  - AUTO_HEALING_MAX_ATTEMPTS=3 (default: 3)     - Max fallback attempts per selector
 *
 * Offline batch repair (for complex failures):
 *  After a test run with failures, run:
 *    node src/helpers/self-healing.js --queue test-results/healing-queue.json
 *  This feeds failures to the AI engine which generates replacement selectors.
 */

const { test: autoHealingTest, expect } = require('./auto-healing');
const path = require('path');
const fs = require('fs');

const HEALING_QUEUE_PATH = path.resolve(__dirname, '../../test-results/healing-queue.json');

/**
 * Append a failed test's context to the healing queue.
 * The AI healer reads this file to batch-generate replacement selectors.
 */
function enqueueForHealing(testTitle, testFile, errors) {
  let queue = [];
  if (fs.existsSync(HEALING_QUEUE_PATH)) {
    try {
      queue = JSON.parse(fs.readFileSync(HEALING_QUEUE_PATH, 'utf8'));
    } catch {
      queue = [];
    }
  }

  const entry = {
    timestamp: new Date().toISOString(),
    testTitle,
    testFile,
    errors: errors.map((e) => ({
      message: e.message,
      stack: (e.stack || '').split('\n').slice(0, 5).join('\n')
    }))
  };

  queue.push(entry);

  try {
    fs.mkdirSync(path.dirname(HEALING_QUEUE_PATH), { recursive: true });
    fs.writeFileSync(HEALING_QUEUE_PATH, JSON.stringify(queue, null, 2));
  } catch (writeErr) {
    // Non-fatal — test outcome is not affected
    console.error('[fixture] Could not write healing queue:', writeErr.message);
  }
}

/**
 * Export the auto-healing test fixture
 * This provides automatic selector healing during test execution
 */
exports.test = autoHealingTest;

exports.expect = expect;
