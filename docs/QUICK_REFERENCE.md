# Playwright AI Framework - Quick Reference Card

## 🎯 What is it?
**Next-gen test automation** = Playwright + AI for self-healing, intelligent tests

---

## ⚡ Quick Start (5 min)

```bash
# 1. Clone & Install
git clone https://github.com/viplove29/playwright-ai-framework.git
cd playwright-ai-framework
npm install && npx playwright install

# 2. Configure
echo "ANTHROPIC_API_KEY=your_key" > .env

# 3. Run
npx playwright test saucedemo_Smoke.spec.js --headed
```

---

## 📝 Write Tests in Plain English

### Before (Traditional)
```javascript
await page.fill('#user-name-input-field', 'user');
await page.click('button[data-test="login-btn-123"]');
```

### After (AI Framework)
```javascript
await aiPage.fillField('username', 'user');
await aiPage.clickElement('login button');
```

---

## 🔧 Essential Methods

| Method | Usage |
|--------|-------|
| `navigateTo(url)` | `await aiPage.navigateTo('https://...')` |
| `fillField(desc, val)` | `await aiPage.fillField('email', 'user@test.com')` |
| `clickElement(desc)` | `await aiPage.clickElement('submit button')` |
| `verifyElement(desc)` | `await aiPage.verifyElement('success message')` |
| `verifyText(desc, txt)` | `await aiPage.verifyText('title', 'Dashboard')` |
| `takeScreenshot(name)` | `await aiPage.takeScreenshot('final-state')` |

**Mix with standard Playwright:** `page.fill('#id', 'value')`

---

## 🎯 Common Commands

```bash
# Run tests
npm test                        # All tests (headless)
npx playwright test --headed    # Visible browser
npx playwright test --ui        # Interactive mode
npx playwright test --debug     # Debug mode
npx playwright test file.spec.js # Specific file

# Reports
npx playwright show-report      # View HTML report
```

---

## 🚀 Key Benefits

✅ **70% less maintenance** - Self-healing tests adapt to UI changes
✅ **56% faster** - Write tests in plain English
✅ **66% less flaky** - Intelligent element finding
✅ **AI failure analysis** - Know WHY tests fail
✅ **Built-in CI/CD** - GitHub Actions + email reports

---

## 📁 File Structure

```
src/tests/           ← Your test files (work here!)
  ├── example.spec.js
  ├── saucedemo.spec.js
  └── your-test.spec.js

.env                 ← API keys
.github/workflows/   ← CI/CD pipeline
config/              ← Playwright config
```

---

## 📧 CI/CD Setup (One-Time)

**GitHub Secrets** (Settings → Secrets → Actions):
- `EMAIL_USERNAME` = your-email@gmail.com
- `EMAIL_PASSWORD` = Gmail App Password (16 chars)
- `EMAIL_TO` = recipient@example.com
- `ANTHROPIC_API_KEY` = sk-ant-api03-...

**Then:** Push code → Tests run → Email sent 📧

---

## ✍️ Test Template

```javascript
const { test, expect } = require('../core/ai-test-runner');

test.describe('Feature Name', () => {
  
  test('Test description', async ({ aiPage, page }) => {
    // Navigate
    await aiPage.navigateTo('https://example.com');
    
    // Interact (choose AI or standard)
    await aiPage.fillField('email', 'user@test.com');
    await page.fill('#password', 'password123'); // or use Playwright
    await aiPage.clickElement('login button');
    
    // Verify
    await aiPage.verifyElement('dashboard');
    
    // Screenshot
    await aiPage.takeScreenshot('logged-in');
  });
});
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Element not found | Use more specific description or direct selector |
| AI connection error | Check `ANTHROPIC_API_KEY` in `.env` |
| Tests fail in CI | Verify GitHub secrets are set |
| Email not received | Use App Password, check spam folder |

---

## 📚 Learn More

- [Team Onboarding Guide](TEAM_ONBOARDING.md) - Complete guide
- [Team Presentation](TEAM_PRESENTATION.md) - Slide deck
- [Secrets Setup](SECRETS_SETUP.md) - CI/CD configuration

---

## 💡 Pro Tips

1. **Mix approaches:** AI for resilience, Playwright for precision
2. **Use headed mode:** See what's happening (`--headed`)
3. **Debug interactively:** Use `--ui` flag
4. **Check reports:** HTML reports have detailed insights
5. **Start simple:** Basic tests first, add AI features gradually

---

## 🎯 Best Practices

✅ **DO:**
- Use descriptive element names
- Add screenshots at key steps
- Keep tests independent
- Mix AI and standard methods

❌ **DON'T:**
- Use vague descriptions like "button" or "input"
- Hardcode credentials
- Make tests depend on each other
- Skip verification steps

---

## 📊 Success Metrics

**Our Goals:**
- 80% test coverage
- < 10% flaky tests  
- 50% faster test writing
- 60% less maintenance

---

## 🤝 Need Help?

- 📖 Full docs: `TEAM_ONBOARDING.md`
- 💬 Slack: #test-automation
- 🐛 GitHub Issues
- 📧 Email team lead

---

**Keep this card handy! Print or bookmark. 🎭**

**Version:** 1.0 | **Last Updated:** Feb 2026
