// === FILE: src/windows/locators/hp-app.locators.js ===
/**
 * Locators for the HP Windows App (myHP)
 * AUMID: AD2F1837.myHP_v10z8vjag6ke6!App
 *
 * Locator strategy priority for Windows UIAutomation:
 *   1. ~AutomationId  — most stable (survives app updates)
 *   2. ~AccessibleName — text/aria label
 *   3. XPath          — fallback for complex queries
 *
 * To discover more locators:
 *   - Use Accessibility Insights for Windows (free, from Microsoft)
 *   - Or use the windows-app-mcp tools: windows_launch_app → windows_list_elements
 */

module.exports = {
  // ─── WebView2 document roots (AutomationId — most stable) ────────────────
  // Use these as ready-sentinels in waitForScreen() to confirm web content loaded.

  /** WebView2 document root — present when web content is fully loaded */
  ROOT_WEB_AREA: '~RootWebArea',

  /** Header section group — present when navigation bar is rendered */
  HEADER_ROOT: '~header-root',

  // ─── Privacy / data consent screen (Screen 1 on first launch / after reset) ──
  // AutomationIds discovered via WDIO debug script (real UIAutomation tree inspection).

  /** "Your data and privacy" heading — text-based fallback for detection */
  HEADING_PRIVACY:        '//*[@Name="Your data and privacy"]',

  /** "Accept all" button — use as BOTH detector AND clicker for the privacy screen.
   *  AutomationId is the most stable locator (survives text/layout changes). */
  BTN_ACCEPT_ALL:         '~FuFConsents.FuFConsents.AcceptAllButton',

  /** "Decline optional data" button on the privacy consent screen */
  BTN_DECLINE_OPTIONAL:   '~FuFConsents.FuFConsents.DeclineOptionalDataButton',

  // ─── Welcome / sign-in onboarding screen (Screen 2 on first launch) ────────
  // Appears after the privacy screen is dismissed.
  // Contains: Sign in (large CTA), Create account, Continue as guest.

  /** "Continue as guest" button — use as BOTH detector AND clicker for the welcome screen.
   *  AutomationId: WelcomeScreen.WelcomeScreenView.ContinueAsGuestButton */
  BTN_CONTINUE_AS_GUEST:  '~WelcomeScreen.WelcomeScreenView.ContinueAsGuestButton',

  /** "Sign in" button on the WELCOME screen (large CTA — different AutomationId from nav) */
  BTN_SIGN_IN_WELCOME:    '~Account.WelcomeScreenView.SignInButton',

  /** "Create account" button — welcome screen only */
  BTN_CREATE_ACCOUNT:     '~WelcomeScreen.WelcomeScreenView.CreateAccountButton',

  // ─── Top navigation bar (HOME screen only) ─────────────────────────────────
  // NOTE: "Sign in" appears on BOTH the welcome screen and the home screen nav,
  // but with DIFFERENT AutomationIds. Always use BTN_SIGN_IN (nav) to confirm
  // the HOME screen is loaded — it will NOT match the welcome screen CTA.

  /** "Sign in" button in the TOP NAV BAR — home screen only (AutomationId: Account.NavBarView.SignInButton) */
  BTN_SIGN_IN:          '~Account.NavBarView.SignInButton',

  /** Fallback: name-based Sign in match (matches both welcome and home — use carefully) */
  BTN_SIGN_IN_ALT:      '//Button[@Name="Sign in"]',

  /** "devices" tab icon in nav bar */
  BTN_DEVICES:          '~NavBar.NavBarView.DevicesIcon',

  /** Shopping / for-you icon in nav bar */
  BTN_SHOPPING:         '~NavBar.NavBarView.ForYouIcon',

  /** Add Device button */
  BTN_ADD:              '~NavBar.NavBarView.AddDevicePlusIcon-bite-button-icon',

  /** Notifications bell icon */
  BTN_NOTIFICATIONS:    '~BellNotifications.NavBarView.BellNotificationIcon-bite-button-icon',

  /** Profile and Settings icon */
  BTN_ACCOUNT:          '~Account.NavBarView.ProfileIcon-bite-button-icon',

  // ─── Main content ───────────────────────────────────────────────────────────

  /** "My Notebook" section heading (AutomationId: pcdevicedetails__device-name) */
  HEADING_MY_NOTEBOOK:  '~pcdevicedetails__device-name',

  /** HP EliteBook model text (AutomationId: pcdevicedetails__device-nickname) */
  TEXT_NOTEBOOK_MODEL:  '~pcdevicedetails__device-nickname',

  /** Battery / charging status (list item contains charging text) */
  LABEL_BATTERY_STATUS: '//*[contains(@Name,"Charging") or contains(@Name,"Battery") or contains(@Name,"battery")]',

  // ─── App window chrome (always accessible via UIAutomation) ─────────────────

  /** Window close button */
  BTN_CLOSE:            '//Button[@Name="Close"]',

  /** Window minimize button */
  BTN_MINIMIZE:         '//Button[@Name="Minimize"]',

  /** Window title bar — used to verify the correct app launched */
  TITLE_BAR:            '//TitleBar',
};
