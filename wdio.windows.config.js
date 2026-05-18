// === FILE: wdio.windows.config.js ===
/**
 * WebDriverIO configuration for Windows desktop app automation.
 *
 * Technology stack:
 *   - WebDriverIO (WDIO) v9 — JS test runner
 *   - Appium v2 + appium-windows-driver — bridges WebDriver to WinAppDriver
 *   - WinAppDriver — Microsoft's open-source UIAutomation driver
 *
 * PREREQUISITES (one-time):
 *   1. Windows 10/11: Settings → Update & Security → For Developers → ON
 *   2. Install WinAppDriver: https://github.com/microsoft/WinAppDriver/releases
 *      OR use: npx appium driver install windows
 *   3. Start WinAppDriver.exe before running tests
 *      OR let Appium manage it via the appium service below
 *
 * USAGE:
 *   npx wdio wdio.windows.config.js
 *   npm run test:windows
 *   WINDOWS_APP="C:\\Path\\To\\App.exe" npm run test:windows
 */

const path = require('path');
const fs   = require('fs');
const glob = require('glob');
require('dotenv').config();

// ── Per-test state (worker-process scope) ───────────────────────────────────
// These module-level vars are used inside the worker to collect steps and
// screenshot paths, then flushed to disk in afterTest so onComplete (which
// runs in the main process) can inject them into the HTML report JSON.
let _currentTestTitle      = '';
let _currentTestSteps      = [];
let _currentTestScreenshot = null;

const windowsPlatformConfig = require('./config/platform/windows.config.js');

exports.config = {
  // ─── Runner ────────────────────────────────────────────────────────────────
  runner: 'local',

  // ─── Test specs ────────────────────────────────────────────────────────────
  specs: [
    path.resolve(__dirname, 'src/windows/tests/**/*.spec.js'),
  ],
  exclude: [],

  // ─── Capabilities ──────────────────────────────────────────────────────────
  capabilities: [
    {
      platformName: 'Windows',
      'appium:automationName': 'Windows',
      /**
       * app: Full path to .exe  →  Win32/WPF/WinForms
       *      AUMID string       →  UWP / Microsoft Store apps
       *      'Root'             →  Attach to existing desktop session
       *
       * Override via WINDOWS_APP env var (see windows.config.js).
       */
      'appium:app': windowsPlatformConfig.app,

      // Increase launch timeout for slow apps (30s for CI cold-start, 10s locally)
      'appium:ms:waitForAppLaunch': process.env.CI ? 30 : 10,

      // --- Optional capabilities (uncomment as needed) ---
      // 'appium:appArguments': '--some-flag',   // CLI args to pass to the app
      // 'appium:appWorkingDir': 'C:\\App\\',    // Working directory for the app
      // 'appium:createSessionTimeout': 20000,   // Override session creation timeout
    },
  ],

  // ─── Appium service ────────────────────────────────────────────────────────
  // Appium is expected to already be running (shared with MobileWright on port 4723).
  // Start it manually with:  npm run appium:start
  // If you want WDIO to auto-start a SEPARATE Appium instance, uncomment the block below
  // and change the port to 4724 to avoid conflicts with MobileWright's port 4723.
  //
  // services: [
  //   ['appium', {
  //     command: 'appium',
  //     args: { address: '127.0.0.1', port: 4724, log: './logs/appium-windows.log' },
  //   }],
  // ],
  services: [],

  // ─── Appium server connection ───────────────────────────────────────────────
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',                    // Appium v2 uses '/' ; WinAppDriver uses '/wd/hub'

  // ─── Runner settings ────────────────────────────────────────────────────────
  maxInstances: 1,              // Windows UI tests must run sequentially (single desktop)
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

  // ─── Reporters ───────────────────────────────────────────────────────────────
  reporters: [
    'spec',
    [
      'html-nice',
      {
        outputDir: './test-results/windows/html',
        filename: 'report.html',
        reportTitle: 'Windows App Test Report',
        linkScreenshots: true,
        showInBrowser: false,
        collapseTests: false,
        useOnAfterCommandForScreenshot: false,
      },
    ],
    [
      'json',
      {
        outputDir: path.resolve(__dirname, 'test-results/windows'),
        outputFileFormat: () => 'results-windows.json',
      },
    ],
    [
      'video',
      {
        saveAllVideos: false,         // only keep videos for FAILED tests
        videoSlowdownMultiplier: 3,   // slow playback so frames are readable
        outputDir: './test-results/windows/videos',
        maxTestNameCharacters: 100,
      },
    ],
  ],

  // ─── Hooks ───────────────────────────────────────────────────────────────────
  before(capabilities, specs) {
    // ── Ensure output directories exist ─────────────────────────────────────
    [
      'test-results/windows/html/screenshots',
      'test-results/windows/videos',
      'logs',
    ].forEach(dir => fs.mkdirSync(path.resolve(__dirname, dir), { recursive: true }));

    // Clear the steps log at session start so stale data from previous runs
    // doesn't bleed into this run's report.
    const stepLogPath = path.resolve(__dirname, 'test-results/windows/steps-log.json');
    fs.writeFileSync(stepLogPath, JSON.stringify({}));

    // ── Named step helper ────────────────────────────────────────────────────
    // Usage in tests:  await browser.step('Verify Sign In button is visible');
    // Steps are collected into _currentTestSteps and written to steps-log.json
    // in afterTest, then injected into the HTML report JSON in onComplete.
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

  async afterTest(test, context, { error }) {
    // ── Screenshot every test (PASS and FAIL) ──────────────────────────────
    const timestamp      = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName       = test.title.replace(/[^a-zA-Z0-9-]/g, '_').substring(0, 50);
    const screenshotsDir = path.resolve(__dirname, 'test-results/windows/html/screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    const status         = error ? 'FAIL' : 'PASS';
    const screenshotPath = path.join(screenshotsDir, `${status}-${safeName}-${timestamp}.png`);

    try {
      await browser.saveScreenshot(screenshotPath);
      if (error) console.log(`  📸 Failure screenshot: ${path.basename(screenshotPath)}`);
      _currentTestScreenshot = screenshotPath;
    } catch (e) {
      console.warn('  ⚠ Could not save screenshot:', e.message);
    }

    // ── Flush steps + screenshot to side-channel log ───────────────────────
    // onComplete (main process) reads this file to inject events into the
    // report-N-N.json before generating the final HTML.
    const stepLogPath = path.resolve(__dirname, 'test-results/windows/steps-log.json');
    let stepLog = {};
    try { stepLog = JSON.parse(fs.readFileSync(stepLogPath, 'utf-8')); } catch (_e) {}
    stepLog[_currentTestTitle] = {
      steps:      [..._currentTestSteps],
      screenshot: _currentTestScreenshot,
    };
    fs.writeFileSync(stepLogPath, JSON.stringify(stepLog, null, 2));
  },

  async afterSuite(suite) {
    // When before() throws (e.g. waitUntil timeout), afterTest is never called for
    // individual tests. Capture a screenshot at the suite level so the app state
    // at the point of failure is always preserved in the artifact.
    if (!suite.error) return;
    const timestamp      = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotsDir = path.resolve(__dirname, 'test-results/windows/html/screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });
    const screenshotPath = path.join(screenshotsDir, `FAIL-before-hook-${timestamp}.png`);
    try {
      await browser.saveScreenshot(screenshotPath);
      console.log(`  Suite failure screenshot saved: ${path.basename(screenshotPath)}`);

      // Also write to the steps-log so onComplete injects it into the HTML report
      const stepLogPath = path.resolve(__dirname, 'test-results/windows/steps-log.json');
      let stepLog = {};
      try { stepLog = JSON.parse(fs.readFileSync(stepLogPath, 'utf-8')); } catch (_e) {}
      stepLog['__suite_failure__'] = {
        steps: [`Suite before() hook failed: ${suite.error.message || 'unknown error'}`],
        screenshot: screenshotPath,
      };
      fs.writeFileSync(stepLogPath, JSON.stringify(stepLog, null, 2));
    } catch (e) {
      console.warn('  Could not save suite failure screenshot:', e.message);
    }
  },

  onComplete() {
    // ── Inject steps + screenshots into the reporter JSON ──────────────────
    // wdio-html-nice-reporter runs in the main process and receives test
    // events only from native WebDriver commands.  browser.addCommand steps
    // never reach the reporter, so we bridge the gap via a filesystem log
    // written in afterTest (worker) and read here (main process).
    const htmlDir     = path.resolve(__dirname, 'test-results/windows/html');
    const stepLogPath = path.resolve(__dirname, 'test-results/windows/steps-log.json');

    let stepLog = {};
    try { stepLog = JSON.parse(fs.readFileSync(stepLogPath, 'utf-8')); } catch (_e) {}

    // Find all per-worker JSON files (report-0-0.json, report-0-1.json, …)
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

            // Prepend steps, then screenshot, before any existing events (e.g. errors)
            test.events = [...stepEvents, ...screenshotEvents, ...(test.events || [])];
          }
        }

        fs.writeFileSync(jsonFile, JSON.stringify(reportData));
      } catch (e) {
        console.warn(`  ⚠ Could not inject steps into ${path.basename(jsonFile)}:`, e.message);
      }
    }

    // ── Generate consolidated HTML report ──────────────────────────────────
    // NOTE: Do NOT call reportAggregator.clean() — it deletes the output dir
    // and removes the report-N-N.json files, causing "No Json files found".
    const { ReportAggregator } = require('wdio-html-nice-reporter');
    const reportAggregator = new ReportAggregator({
      outputDir: './test-results/windows/html',
      filename: 'report.html',
      reportTitle: 'Windows App Test Report',
      collapseTests: false,
      linkScreenshots: true,
    });
    return reportAggregator.createReport();
  },
};
