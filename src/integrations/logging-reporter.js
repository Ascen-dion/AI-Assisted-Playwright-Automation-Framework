// === FILE: src/integrations/logging-reporter.js ===
/**
 * Playwright custom reporter — centralized Winston logging.
 *
 * Hooks into every test and step lifecycle event.
 * Zero changes required to page objects or spec files.
 *
 * Wired into playwright.config.js as a reporter entry.
 * Logs are written to:
 *   logs/combined.log  — all levels
 *   logs/error.log     — errors only
 *   console            — colourised output during test run
 */

const path = require('path');
const logger = require(path.resolve(__dirname, '../../utils/logger'));

// Playwright step titles that are worth logging — covers clicks, navigation,
// form input, visibility checks, URL/title assertions, and waitFor calls.
const LOGGABLE_ACTIONS = [
  'click', 'fill', 'type', 'select', 'check', 'uncheck', 'hover',
  'goto', 'navigate', 'reload',
  'waitfor', 'wait for',
  'expect', 'tobevisible', 'tohaveurl', 'tohavetitle', 'tohavetext',
  'tocontaintext', 'tobechecked', 'tobe',
  'press', 'tap', 'dblclick',
  'screenshot', 'evaluate',
];

class LoggingReporter {
  onBegin(config, suite) {    this._flakyCount = 0;    logger.info('========================================');
    logger.info(`Test run started`, {
      totalTests: suite.allTests().length,
      workers: config.workers,
    });
    logger.info('========================================');
  }

  onTestBegin(test) {
    logger.info(`[START] ${test.title}`, {
      file: test.location?.file?.split('src/tests/')[1] || test.location?.file,
    });
  }

  onStepBegin(test, result, step) {
    // Log meaningful Playwright API actions — skip internal hooks and fixture setup
    if (step.category === 'pw:api' && LOGGABLE_ACTIONS.some(k => step.title.toLowerCase().includes(k))) {
      logger.info(`  ▶ ${step.title}`);
    }
  }

  onStepEnd(test, result, step) {
    if (step.category === 'pw:api') {
      const duration = step.duration ? ` (${step.duration}ms)` : '';
      if (step.error) {
        logger.error(`  ✗ FAILED: ${step.title}${duration}`, {
          error: step.error.message,
        });
      } else if (LOGGABLE_ACTIONS.some(k => step.title.toLowerCase().includes(k))) {
        logger.info(`  ✓ ${step.title}${duration}`);
      }
    }
  }

  onTestEnd(test, result) {
    const duration = `${(result.duration / 1000).toFixed(2)}s`;

    // A test that ultimately passed after one or more retries is flaky
    const isFlaky = result.status === 'passed' && result.retry > 0;

    // Track flaky count for summary
    if (isFlaky) this._flakyCount = (this._flakyCount || 0) + 1;

    if (isFlaky) {
      logger.warn(`[FLAKY] ${test.title}`, {
        duration,
        retriesNeeded: result.retry,
        hint: 'Test passed after retry — investigate selector stability or network timing'
      });
    } else if (result.status === 'passed') {
      logger.info(`[PASS] ${test.title}`, { duration });
    } else if (result.status === 'failed') {
      logger.error(`[FAIL] ${test.title}`, {
        duration,
        error: result.error?.message || 'Unknown error',
        retries: result.retry,
      });
    } else if (result.status === 'timedOut') {
      logger.error(`[TIMEOUT] ${test.title}`, { duration });
    } else if (result.status === 'skipped') {
      logger.warn(`[SKIP] ${test.title}`);
    }
  }

  onEnd(result) {
    logger.info('========================================');
    logger.info(`Test run finished`, {
      status: result.status,
      duration: `${((result.duration || 0) / 1000).toFixed(2)}s`,
      flakyTests: this._flakyCount || 0,
    });
    if (this._flakyCount > 0) {
      logger.warn(`[FLAKY SUMMARY] ${this._flakyCount} test(s) passed only after retry — check logs/combined.log for [FLAKY] entries`);
    }
    logger.info('========================================');
  }
}

module.exports = LoggingReporter;
