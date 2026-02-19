# GitHub Secrets Configuration - Quick Reference

## 🔐 Required Secrets

Add these in: **Repository Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Example Value | Required |
|-------------|-------------|---------------|----------|
| `EMAIL_USERNAME` | Gmail address for sending reports | `your-email@gmail.com` | YES |
| `EMAIL_PASSWORD` | Gmail App Password (16 chars) | `abcd efgh ijkl mnop` | YES |
| `EMAIL_TO` | Recipient email address(es) | `recipient@example.com` | YES |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features | `sk-ant-api03-...` | NO* |

*Required only if using AI-powered element detection features

## 📧 How to Create Gmail App Password

### Step-by-Step:

1. **Go to Google Account Security**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the setup process

3. **Create App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App Passwords

4. **Generate Password**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: `Playwright Tests`
   - Click **Generate**

5. **Copy the Password**
   - You'll see a 16-character password like: `abcd efgh ijkl mnop`
   - Copy this **entire password** (with or without spaces)

6. **Add to GitHub Secret**
   - Paste as `EMAIL_PASSWORD` secret
   - **Remove spaces** if copying with spaces

### ⚠️ Important Notes:

- ✅ Use **App Password** (16 characters)
- ❌ **Never** use your regular Gmail password
- ✅ 2-Step Verification **must** be enabled
- ✅ You can create multiple app passwords
- ✅ You can revoke app passwords anytime

## 🧪 Test Your Setup

### 1. Add Secrets
```
EMAIL_USERNAME = your-email@gmail.com
EMAIL_PASSWORD = abcd efgh ijkl mnop
EMAIL_TO = your-email@gmail.com
```

### 2. Trigger Workflow
```bash
git add .
git commit -m "Test CI/CD"
git push
```

### 3. Check Status
- Go to **Actions** tab
- Watch the workflow run
- Check your email inbox

## 🔧 Troubleshooting

### ❌ "Invalid credentials" error

**Solution:** 
- Verify you're using **App Password**, not regular password
- Ensure 2FA is enabled
- Recreate App Password

### ❌ Email not received

**Check:**
1. Spam/Junk folder
2. All 3 email secrets are set correctly
3. Workflow logs for errors
4. Email quotas (Gmail: 500 emails/day)

### ❌ Workflow fails immediately

**Check:**
1. Secrets are named **exactly** as shown (case-sensitive)
2. No leading/trailing spaces in secret values
3. Workflow file is in `.github/workflows/` directory

## 📋 Secrets Checklist

- [ ] `EMAIL_USERNAME` added ✉️
- [ ] `EMAIL_PASSWORD` added (App Password) 🔑
- [ ] `EMAIL_TO` added 📬
- [ ] `ANTHROPIC_API_KEY` added (if needed) 🤖
- [ ] All secret names match exactly 📝
- [ ] No extra spaces in values ✂️
- [ ] Gmail App Password created (not regular password) ✅
- [ ] 2-Step Verification enabled on Gmail 🔐
- [ ] Test email sent successfully 📧

## 🎯 Multiple Recipients

To send emails to multiple addresses:

```
EMAIL_TO = email1@example.com,email2@example.com,email3@example.com
```

Separate emails with commas, no spaces.

## 🔄 Update Secrets

To update a secret:
1. Go to Settings → Secrets → Actions
2. Click on the secret name
3. Click "Update secret"
4. Enter new value
5. Click "Update secret"

## 🗑️ Delete Secrets

To remove a secret:
1. Go to Settings → Secrets → Actions
2. Click on the secret name
3. Click "Remove secret"
4. Confirm deletion

---

**Need more help?** See [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) for detailed instructions.
