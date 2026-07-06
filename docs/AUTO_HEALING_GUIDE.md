# 🔧 Automatic Self-Healing System Documentation

## Overview

The framework now includes **automatic self-healing** that works during test execution, eliminating most selector failures without manual intervention.

## 🎯 How It Works

### Before (Manual Healing)
```
Test runs → Selector fails → Test fails → Queue for offline repair → Run healing script → Update code → Re-run test
```

### After (Automatic Healing) ✅
```
Test runs → Selector fails → Auto-try fallbacks → Success! → Test continues
                                    ↓
                              (Still fails?) → Queue for offline repair
```

## 🚀 Quick Start

### 1. Enable Automatic Healing (Already Enabled)

In your `.env` file:
```bash
AUTO_HEALING_ENABLED=true          # Enable automatic healing
AUTO_HEALING_USE_AI=false          # Don't use expensive real-time AI
AUTO_HEALING_MAX_ATTEMPTS=3        # Try 3 fallback strategies
AUTO_HEALING_TIMEOUT=5000          # 5 second timeout per attempt
```

### 2. Use the Enhanced Fixture

**All existing tests automatically get self-healing** if they use:
```javascript
const { test, expect } = require('../../fixtures');
```

No test code changes needed!

### 3. Run Tests Normally

```bash
npx playwright test --config=config/playwright.config.js
```

Watch the console for healing messages:
```
[AutoHeal] 🔍 Attempting to heal selector: .overlay-modal
[AutoHeal] 🔧 Trying ARIA strategy (1/3)...
[AutoHeal] ✅ ARIA strategy succeeded with: getByRole('dialog')
[AutoHeal] 🎉 Continuing test with healed selector
```

## 🔬 Healing Strategies (In Order)

### 1. **History-Based** (Fastest)
- Checks `test-results/healing-history.json`
- If this selector failed before and was healed, try the same fix
- **0ms overhead** if hit found

### 2. **ARIA Role Strategies**
- `getByRole('button', { name: 'text' })`
- `getByRole('link', { name: 'text' })`
- Case-insensitive variations
- **Most stable** - ARIA roles rarely change

### 3. **Text-Based Strategies**
- `getByText('exact text')`
- `getByText(partialText)`
- `getByLabel('label')`
- `getByPlaceholder('placeholder')`

### 4. **CSS Variations**
- Class name with wildcards: `[class*="modal"]`
- ID with wildcards: `[id*="popup"]`
- Data attributes: `[data-testid*="login"]`

### 5. **XPath Fallbacks**
- Text contains: `xpath=//*[contains(text(), "text")]`
- Class contains: `xpath=//*[contains(@class, "class")]`

### 6. **AI-Powered** (Optional, Expensive)
- Only if `AUTO_HEALING_USE_AI=true`
- Sends page HTML to AI engine
- Gets intelligent selector suggestions
- **Slow** - adds 2-5 seconds per failure

## 📊 Healing History

Successful healings are saved to `test-results/healing-history.json`:

```json
[
  {
    "timestamp": "2026-07-06T14:30:00.000Z",
    "testFile": "src/tests/purchase/starhub-galaxy-a57-purchase-journey.spec.js",
    "testTitle": "[C312] AC4: Proceed to next step by clicking Next button",
    "oldSelector": ".overlay-modal",
    "newSelector": "getByRole('dialog')",
    "strategy": "ARIA",
    "success": true,
    "elementHint": "login popup"
  }
]
```

**Benefits:**
- Future test runs use the learned selector instantly
- No repeated healing overhead
- Framework learns from your application

## 🎯 Performance Impact

| Scenario | Performance |
|----------|-------------|
| Selector works on first try | **0ms overhead** |
| Healing from history | **< 10ms overhead** |
| Fallback strategies (1-3 attempts) | **1-5 seconds** |
| AI-powered healing (if enabled) | **2-10 seconds** |

**Recommendation:** Keep `AUTO_HEALING_USE_AI=false` for fast execution. Use offline batch healing for complex cases.

## 🛠️ Configuration Options

### AUTO_HEALING_ENABLED
```bash
AUTO_HEALING_ENABLED=true   # Default: true
```
- `true`: Enable automatic healing during tests
- `false`: Disable (tests fail immediately on selector errors)

### AUTO_HEALING_USE_AI
```bash
AUTO_HEALING_USE_AI=false   # Default: false (recommended)
```
- `false`: Use only fast fallback strategies
- `true`: Also try AI-powered healing (expensive, slower)

**When to enable AI:**
- Complex, dynamic selectors
- Application with frequent UI changes
- Willing to trade speed for coverage

### AUTO_HEALING_MAX_ATTEMPTS
```bash
AUTO_HEALING_MAX_ATTEMPTS=3   # Default: 3
```
- How many fallback selectors to try per strategy
- Higher = more thorough but slower
- Range: 1-5 (recommended: 3)

### AUTO_HEALING_TIMEOUT
```bash
AUTO_HEALING_TIMEOUT=5000   # Default: 5000ms
```
- Timeout per healing attempt
- Lower = fail faster
- Higher = more patient (for slow pages)

## 📋 Offline Batch Healing (Still Available)

For complex failures that automatic healing couldn't fix:

```bash
# Check healing queue
cat test-results/healing-queue.json

# Run offline AI repair
node src/helpers/self-healing.js --queue test-results/healing-queue.json
```

This generates intelligent fixes for batch review and application.

## 🔍 Debugging Healing

### View Healing Attempts in Console
Healing logs appear during test execution:
```
[AutoHeal] 🔍 Attempting to heal selector: .login-button
[AutoHeal] 📚 Found successful healing in history, trying: getByRole('button', { name: 'Log in' })
[AutoHeal] ✅ History-based healing succeeded!
```

### Check Healing History
```bash
# View all successful healings
cat test-results/healing-history.json

# Count healings by strategy
jq '[.[] | .strategy] | group_by(.) | map({strategy: .[0], count: length})' test-results/healing-history.json
```

### Check Healing Queue (Failed Healings)
```bash
# View elements that couldn't be healed automatically
cat test-results/healing-queue.json
```

## 🎓 Best Practices

### ✅ DO
- Keep `AUTO_HEALING_ENABLED=true` for most tests
- Review `healing-history.json` periodically to find patterns
- Update page objects with better selectors from successful healings
- Use offline batch healing for complex failures

### ❌ DON'T
- Enable `AUTO_HEALING_USE_AI=true` in CI/CD (too slow)
- Rely on healing as a substitute for good selectors
- Ignore repeated healing patterns (they indicate brittle selectors)
- Set `MAX_ATTEMPTS` too high (diminishing returns after 3)

## 🆚 Comparison with Other Frameworks

| Feature | This Framework | Selenium | Cypress | TestCafe |
|---------|---------------|----------|---------|----------|
| **Automatic healing during execution** | ✅ Yes | ❌ No | ⚠️ Limited | ⚠️ Limited |
| **History-based learning** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Multiple fallback strategies** | ✅ ARIA, text, CSS, XPath | ❌ No | ⚠️ Text only | ⚠️ CSS only |
| **Optional AI healing** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Zero test code changes** | ✅ Yes | ❌ Requires SDK | ✅ Yes | ✅ Yes |
| **Offline batch repair** | ✅ Yes | ❌ No | ❌ No | ❌ No |

## 🚨 Troubleshooting

### Problem: Healing is too slow
**Solution:** Reduce `AUTO_HEALING_MAX_ATTEMPTS` or disable AI:
```bash
AUTO_HEALING_MAX_ATTEMPTS=2
AUTO_HEALING_USE_AI=false
```

### Problem: Tests still fail despite healing
**Check:**
1. Is the element actually on the page? (`npx playwright test --headed`)
2. Does it require authentication? (check `globalSetup`)
3. Is it timing-dependent? (increase `AUTO_HEALING_TIMEOUT`)

Run offline batch healing for complex cases:
```bash
node src/helpers/self-healing.js --queue test-results/healing-queue.json
```

### Problem: Healing logs are too verbose
**Solution:** The healing fixture only logs to console during failures. If you want less output, redirect console:
```bash
npx playwright test 2>/dev/null
```

### Problem: Want to disable healing for specific tests
**Solution:** Use vanilla Playwright fixture:
```javascript
const { test, expect } = require('@playwright/test');  // No healing
```

## 📈 Monitoring and Metrics

Track healing effectiveness:

```javascript
// Count healings by strategy
const history = require('./test-results/healing-history.json');
const strategies = history.reduce((acc, h) => {
  acc[h.strategy] = (acc[h.strategy] || 0) + 1;
  return acc;
}, {});
console.log('Healing Strategy Distribution:', strategies);
```

Expected distribution for healthy tests:
- **History**: 50-70% (learned from past runs)
- **ARIA**: 20-30% (stable selectors)
- **Text**: 5-15% (good for buttons/links)
- **CSS**: 5-10% (fallback)
- **XPath**: < 5% (last resort)
- **AI**: < 5% (complex cases only)

If you see **XPath > 20%** → Your selectors need improvement.

## 🔮 Future Enhancements

Planned features:
- [ ] Selector confidence scoring
- [ ] Automatic page object updates
- [ ] Visual regression healing
- [ ] Multi-page healing correlation
- [ ] CI/CD healing metrics dashboard

## 📞 Support

For questions or issues:
- Check `test-results/healing-history.json` for patterns
- Review healing console logs
- Run offline batch healing for complex cases
- Update page objects with stable selectors from successful healings

---

**Remember:** Automatic healing is a safety net, not a substitute for good selectors! Always prefer stable selectors (ARIA roles, data-testid, semantic HTML) in your page objects.
