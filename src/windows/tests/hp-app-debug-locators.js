/**
 * ONE-SHOT DEBUG SCRIPT — NOT a test file
 * Run with: node src/windows/tests/hp-app-debug-locators.js
 *
 * Purpose: Connect to WinAppDriver, click through Privacy → Welcome,
 *          then print all element Names/AutomationIds on the Welcome screen.
 *
 * Prerequisites:
 *   1. WinAppDriver running: "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"
 *   2. HP app NOT running (script will launch it)
 */

const { remote } = require('webdriverio');

const AUMID = 'AD2F1837.myHP_v10z8vjag6ke6!App';
const WAD_URL = 'http://127.0.0.1:4723';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function printElements(driver, label) {
  console.log(`\n===== Elements on: ${label} =====`);
  try {
    const all = await driver.$$('//*');
    for (const el of all) {
      try {
        const name = await el.getAttribute('Name');
        const automationId = await el.getAttribute('AutomationId');
        const controlType = await el.getAttribute('LocalizedControlType');
        if (name || automationId) {
          console.log(`  [${controlType || '?'}]  Name="${name}"  AutomationId="${automationId}"`);
        }
      } catch {
        // skip
      }
    }
  } catch (e) {
    console.log('  Error listing elements:', e.message);
  }
}

(async () => {
  let driver;
  try {
    console.log('Connecting to WinAppDriver…');
    driver = await remote({
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      capabilities: {
        platformName: 'Windows',
        'appium:app': AUMID,
        'appium:automationName': 'Windows',
        'appium:newCommandTimeout': 60,
      },
      logLevel: 'silent',
    });

    console.log('App launched. Waiting 8s for initial load…');
    await sleep(8000);

    // ── Step 1: Detect & dismiss Privacy screen ──────────────────────────────
    console.log('\nChecking for Privacy screen (BTN_ACCEPT_ALL)…');
    let acceptAllBtn;
    try {
      acceptAllBtn = await driver.$('//Button[@AutomationId="FuFConsents.FuFConsents.AcceptAllButton"]');
      const displayed = await acceptAllBtn.isDisplayed();
      if (displayed) {
        console.log('  ✓ Privacy screen detected via AcceptAllButton AutomationId');
        await printElements(driver, 'Privacy Screen');
        console.log('\nClicking Accept all…');
        await acceptAllBtn.click();
        console.log('Clicked. Waiting 5s for transition…');
        await sleep(5000);
      } else {
        console.log('  Privacy screen NOT visible (btn exists but not displayed)');
      }
    } catch (e) {
      console.log('  Privacy screen not found or already dismissed:', e.message);
    }

    // ── Step 2: Detect Welcome screen ────────────────────────────────────────
    console.log('\nChecking for Welcome screen…');
    await printElements(driver, 'Welcome / Home Screen (after privacy dismiss)');

    // Try to find Continue as guest with various strategies
    const strategies = [
      ['//Button[@AutomationId="FuFConsents.FuFWelcome.ContinueAsGuestButton"]', 'FuFConsents.FuFWelcome.ContinueAsGuestButton'],
      ['//Button[@AutomationId="FuFWelcome.FuFWelcome.ContinueAsGuestButton"]', 'FuFWelcome.FuFWelcome.ContinueAsGuestButton'],
      ['//*[contains(@AutomationId,"ContinueAsGuest")]', 'contains AutomationId ContinueAsGuest'],
      ['//*[contains(@AutomationId,"Guest")]', 'contains AutomationId Guest'],
      ['//*[contains(@Name,"Continue as guest")]', 'contains Name Continue as guest'],
      ['//*[contains(@Name,"Continue as a guest")]', 'contains Name Continue as a guest'],
    ];

    let continueAsGuestFound = false;
    for (const [xpath, desc] of strategies) {
      try {
        const el = await driver.$(xpath);
        const displayed = await el.isDisplayed();
        if (displayed) {
          console.log(`\n  ✓ "Continue as guest" FOUND with: ${desc}`);
          continueAsGuestFound = true;
          console.log('Clicking Continue as guest…');
          await el.click();
          await sleep(5000);
          break;
        }
      } catch {
        // not found with this strategy
      }
    }

    if (!continueAsGuestFound) {
      console.log('\n  ✗ "Continue as guest" NOT found with any strategy.');
      console.log('  Check element dump above for welcome screen elements.');
    }

    // ── Step 3: Print Home screen ─────────────────────────────────────────────
    console.log('\n===== Elements after dismissing welcome screen =====');
    await printElements(driver, 'Home Screen');

    // Check for Sign In button
    const signInStrategies = [
      ['//Button[@AutomationId="SignIn"]', 'SignIn'],
      ['//*[contains(@AutomationId,"SignIn")]', 'contains SignIn'],
      ['//*[contains(@Name,"Sign in")]', 'Name Sign in'],
    ];
    for (const [xpath, desc] of signInStrategies) {
      try {
        const el = await driver.$(xpath);
        const displayed = await el.isDisplayed();
        console.log(`  Sign In [${desc}]: displayed=${displayed}`);
      } catch {
        console.log(`  Sign In [${desc}]: NOT FOUND`);
      }
    }

  } catch (e) {
    console.error('FATAL:', e.message);
  } finally {
    if (driver) {
      await driver.deleteSession().catch(() => {});
    }
  }
})();
