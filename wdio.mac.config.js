// === FILE: wdio.mac.config.js ===
/**
 * WebDriverIO configuration for macOS desktop app automation.
 *
 * Technology stack:
 *   - WebDriverIO (WDIO) v9 — JS test runner
 *   - Appium v3 + appium-mac2-driver — bridges WebDriver to XCTest on macOS
 *   - mac2 driver — Apple's XCTest UIAutomation framework
 *
 * PREREQUISITES (one-time setup on macOS):
 *   1. macOS 12 Monterey or newer
 *   2. Xcode Command Line Tools:  xcode-select --install
 *   3. Install mac2 Appium driver: npx appium driver install mac2
 *   4. Enable Accessibility for Terminal (or your IDE):
 *      System Settings → Privacy & Security → Accessibility → ✓ Terminal
 *   5. Ensure HP Smart is installed from the Mac App Store
 *      (mas install 1474276998   OR   open App Store → search "HP Smart")
 *
 * USAGE:
 *   npm run test:mac              # run all mac specs
 *   npm run test:mac:hp           # run only HP Smart smoke tests
 *   MAC_BUNDLE_ID=com.apple.calculator npm run test:mac   # target any app
 */

const path = require('path');
const fs   = require('fs');
const glob = require('glob');
require('dotenv').config();

// ── Per-test state (worker-process scope) ────────────────────────────────────
let _currentTestTitle      = '';
let _currentTestSteps      = [];
let _currentTestScreenshot = null;

const macPlatformConfig = require('./config/platform/mac.config.js');

exports.config = {
  // ─── Runner ────────────────────────────────────────────────────────────────
  runner: 'local',

  // ─── Test specs ────────────────────────────────────────────────────────────
  specs: [
    path.resolve(__dirname, 'src/mac/tests/**/*.spec.js'),
  ],
  exclude: [],

  // ─── Capabilities ──────────────────────────────────────────────────────────
  capabilities: [
    {
      platformName: 'Mac',
      'appium:automationName': 'mac2',

      /**
       * bundleId: The macOS app bundle ID.
       * Override via MAC_BUNDLE_ID env var.
       *
       * HP Smart:   com.hp.SmartForDesktop
       * Calculator: com.apple.calculator
       * Finder:     com.apple.finder
       *
       * Discover: osascript -e 'id of app "AppName"'
       */
      'appium:bundleId': macPlatformConfig.bundleId,

      // Wait up to 30s for the app to launch before failing session creation
      'appium:newCommandTimeout': 120,
    },
  ],

  // ─── Appium server connection ──────────────────────────────────────────────
  // mac2 runs on port 4724 by default to avoid conflicts with the Windows
  // Appium instance (which uses 4723).
  // Start it with:  npm run appium:mac:start
  services: [],
  hostname: '127.0.0.1',
  port: 4724,
  path: '/',

  // ─── Runner settings ────────────────────────────────────────────────────────
  maxInstances: 1,              // macOS UI tests must run sequentially (single desktop)
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // ─── Framework ──────────────────────────────────────────────────────────────
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: process.env.CI ? 120000 : 60000,
  },

  // ─── Reporters ────────────────────────────────────────────────────────────
  reporters: [
    'spec',
    [
      'html-nice',
      {
        outputDir: './test-results/mac/html',
        filename: 'report.html',
        reportTitle: 'macOS App Test Report',
        linkScreenshots: true,
        showInBrowser: false,
        collapseTests: false,
        useOnAfterCommandForScreenshot: false,
      },
    ],
    [
      'json',
      {
        outputDir: path.resolve(__dirname, 'test-results/mac'),
        outputFileFormat: () => 'results-mac.json',
      },
    ],
  ],

  // ─── Hooks ──────────────────────────────────────────────────────────────────
  before(capabilities, specs) {
    // ── Ensure output directories exist ─────────────────────────────────────
    [
      'test-results/mac/html/screenshots',
      'test-results/mac/videos',
      'logs',
    ].forEach(dir => fs.mkdirSync(path.resolve(__dirname, dir), { recursive: true }));

    // Clear the steps log at session start
    const stepLogPath = path.resolve(__dirname, 'test-results/mac/steps-log.json');
    fs.writeFileSync(stepLogPath, JSON.stringify({}));

    // ── Named step helper ────────────────────────────────────────────────────
    // Usage in tests:  await browser.step('Verify Sign In button is visible');
    browser.addCommand('step', async function(description) {
      console.log(`  ▶ ${description}`);
      _currentTestSteps.push(description);
    });
  },

  beforeTest(test) {
    _currentTestTitle      = test.title;
    _currentTestSteps      = [];
    _currentTestScreenshot = null;
  },

  afterTest(test, context, { error }) {
    // ── Screenshot every test (PASS and FAIL) ─────────────────────────────
    const timestamp      = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName       = test.title.replace(/[^a-zA-Z0-9-]/g, '_').substring(0, 50);
    const screenshotsDir = path.resolve(__dirname, 'test-results/mac/html/screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    const status         = error ? 'FAIL' : 'PASS';
    const screenshotPath = path.join(screenshotsDir, `${status}-${safeName}-${timestamp}.png`);

    try {
      browser.saveScreenshot(screenshotPath);
      if (error) console.log(`  📸 Failure screenshot: ${path.basename(screenshotPath)}`);
      _currentTestScreenshot = screenshotPath;
    } catch (e) {
      console.warn('  ⚠ Could not save screenshot:', e.message);
    }

    // ── Flush steps + screenshot to side-channel log ──────────────────────
    const stepLogPath = path.resolve(__dirname, 'test-results/mac/steps-log.json');
    let stepLog = {};
    try { stepLog = JSON.parse(fs.readFileSync(stepLogPath, 'utf-8')); } catch (_e) {}
    stepLog[_currentTestTitle] = {
      steps:      [..._currentTestSteps],
      screenshot: _currentTestScreenshot,
    };
    fs.writeFileSync(stepLogPath, JSON.stringify(stepLog, null, 2));
  },

  onComplete() {
    // ── Inject steps + screenshots into the reporter JSON ─────────────────
    const htmlDir     = path.resolve(__dirname, 'test-results/mac/html');
    const stepLogPath = path.resolve(__dirname, 'test-results/mac/steps-log.json');

    let stepLog = {};
    try { stepLog = JSON.parse(fs.readFileSync(stepLogPath, 'utf-8')); } catch (_e) {}

    const workerJsonFiles = glob.sync('report-*-*.json', { cwd: htmlDir, absolute: true });

    for (const jsonFile of workerJsonFiles) {
      try {
        const reportData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

        for (const suite of (reportData.suites || [])) {
          for (const test of (suite.tests || [])) {
            const data = stepLog[test.title];
            if (!data) continue;

            const stepEvents       = (data.steps || []).map(s => ({ type: 'log', value: `▶  ${s}` }));
            const screenshotEvents = data.screenshot ? [{ type: 'screenshot', value: data.screenshot }] : [];

            test.events = [...stepEvents, ...screenshotEvents, ...(test.events || [])];
          }
        }

        fs.writeFileSync(jsonFile, JSON.stringify(reportData));
      } catch (e) {
        console.warn(`  ⚠ Could not inject steps into ${path.basename(jsonFile)}:`, e.message);
      }
    }

    // ── Generate consolidated HTML report ──────────────────────────────────
    const { ReportAggregator } = require('wdio-html-nice-reporter');
    const reportAggregator = new ReportAggregator({
      outputDir: './test-results/mac/html',
      filename: 'report.html',
      reportTitle: 'macOS App Test Report',
      collapseTests: false,
      linkScreenshots: true,
    });
    return reportAggregator.createReport();
  },
};
