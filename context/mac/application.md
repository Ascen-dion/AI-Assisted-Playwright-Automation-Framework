# Application Context — macOS App Automation

> **How to use this file**: This file is loaded first in every macOS agent session.
> It provides the Bundle ID, screen inventory, and known locator values
> verified against the live XCTest accessibility tree.

---

## Base Configuration

**Framework Runner**: WebDriverIO (WDIO) v9 + Appium + appium-mac2-driver
**App Name**: `HP Smart`
**Bundle ID**: `com.hp.SmartForDesktop`
**Mac App Store ID**: `1474276998`
**Platform**: `macOS 13+ (Ventura / Sonoma / Sequoia)`
**Architecture**: Native macOS app (Electron/SwiftUI hybrid)
**Environment**: Production (Mac App Store app)
**Config file**: `wdio.mac.config.js` at project root

---

## Launch Preconditions

Before running any macOS test:
1. **Accessibility permission granted** → System Settings → Privacy & Security → Accessibility → allow Terminal (or Node.js)
2. **HP Smart installed** → Mac App Store ID `1474276998`; verify with `mdfind "kMDItemCFBundleIdentifier == 'com.hp.SmartForDesktop'"`
3. **Appium running** → `npm run appium:mac:start` (port 4724)
4. **mac2 driver installed** → `npm run appium:install:mac` (one-time setup)
5. **Xcode Command Line Tools installed** → `xcode-select --install`

---

## XCTest / mac2 Accessibility Note

HP Smart for Desktop is a macOS app automated via `appium-mac2-driver` using **XCTest**.
This means:
- Accessibility labels are exposed as `label` (maps to `~accessibilityId` in WDIO)
- XPath uses `XCUIElementType*` prefixes — NOT Windows-style `//Button`
- Preferred locator strategy: `~accessibilityId` for stable IDs, fallback to XPath
- **Verify all locators** with Xcode → Xcode menu → Open Developer Tool → Accessibility Inspector
- macOS Accessibility Inspector equivalent of UIAutomation tree for Windows

---

## Screen Inventory

| Screen Name         | File Name Prefix        | Sentinel Element               | Verified Locator |
|---------------------|-------------------------|-------------------------------|------------------|
| `Home`              | `hp-smart-home`         | Main window (first window)    | `//XCUIElementTypeWindow[1]` |
| `Sign In / Account` | `hp-smart-signin`       | Sign In button                | `~Sign In` |
| `My Printers`       | `hp-smart-printers`     | "My Printers" nav item        | `~My Printers` |
| `Scan`              | `hp-smart-scan`         | "Scan" nav item               | `~Scan` |
| `Print`             | `hp-smart-print`        | "Print" nav item              | `~Print` |

> ⚠️ These are best-guess accessibility labels. Always verify with Xcode Accessibility Inspector
> before writing production locators. Labels may differ from the visual text.

---

## Navigation Structure

```
Launch (bundleId: com.hp.SmartForDesktop)
  └── Home Screen
        ├── Top / Side nav: My Printers, Scan, Print
        ├── Account / Sign In button (top-right or sidebar)
        └── Main content: Printer status area
              ├── Printer status indicator (online/offline)
              └── Quick actions (Scan, Print, etc.)
```

---

## Known Locator Values

> These are framework defaults from `src/mac/locators/hp-smart.locators.js`.
> Verify each one against the live app using Accessibility Inspector.

```js
// Main window
MAIN_WINDOW:          '//XCUIElementTypeWindow[1]'

// Navigation
NAV_MY_PRINTERS:      '~My Printers'
NAV_SCAN:             '~Scan'
NAV_PRINT:            '~Print'

// Auth
BTN_SIGN_IN:          '~Sign In'

// Content
HEADING_MY_PRINTERS:  '//XCUIElementTypeStaticText[contains(@label,"My Printers")]'
STATUS_INDICATOR:     '//*[contains(@label,"printer") or contains(@label,"Printer")]'
```

---

## App Versions and Notes

- **Minimum macOS**: 13.0 (Ventura)
- **App type**: Mac App Store distribution (signed, sandboxed)
- **Accessibility permissions**: Must be granted — sandboxed apps require explicit user/CI grant
- **CI install**: `mas install 1474276998` (requires `mas` tool, pre-installed on GitHub Actions `macos-latest`)
