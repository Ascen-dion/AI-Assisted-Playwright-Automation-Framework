# GitHub Actions CI/CD Setup

This document explains how to set up GitHub Actions to run Playwright tests automatically and send email reports.

## 🚀 Features

- ✅ Automated test execution on push, PR, and schedule
- 📧 Email notifications with test results
- 📊 HTML test reports uploaded as artifacts
- 💬 PR comments with test status
- 📸 Screenshot attachment on failures
- 🔄 Daily scheduled test runs

## 📋 Prerequisites

1. GitHub repository with Playwright tests
2. Gmail account (or other SMTP server) for sending emails
3. GitHub account with repository access

## ⚙️ Configuration Steps

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

#### Required Secrets:

1. **`ANTHROPIC_API_KEY`** (Optional - for AI features)
   - Your Anthropic API key for AI-powered element detection
   - Get from: https://console.anthropic.com/

2. **`EMAIL_USERNAME`**
   - Your Gmail address (e.g., your-email@gmail.com)
   - This will be used to send test reports

3. **`EMAIL_PASSWORD`**
   - **Important:** Use an App Password, NOT your regular Gmail password
   - How to create Gmail App Password:
     1. Go to Google Account → Security
     2. Enable 2-Step Verification (if not already enabled)
     3. Go to App Passwords: https://myaccount.google.com/apppasswords
     4. Select "Mail" and "Other (Custom name)"
     5. Enter "Playwright Tests" as name
     6. Copy the 16-character password
     7. Use this as your `EMAIL_PASSWORD` secret

4. **`EMAIL_TO`**
   - Recipient email address for test reports
   - Can be same as EMAIL_USERNAME or different
   - For multiple recipients: `email1@example.com,email2@example.com`

### Step 2: Using Other Email Providers

If you want to use a different email provider, update the workflow file:

#### **For Outlook/Office365:**
```yaml
server_address: smtp.office365.com
server_port: 587
```

#### **For Yahoo Mail:**
```yaml
server_address: smtp.mail.yahoo.com
server_port: 587
```

#### **For Custom SMTP:**
```yaml
server_address: your-smtp-server.com
server_port: 587  # or 465 for SSL
```

### Step 3: Verify Workflow File

The workflow file should be at: `.github/workflows/playwright.yml`

### Step 4: Test the Setup

1. **Manual Trigger:**
   - Go to **Actions** tab in GitHub
   - Select "Playwright Tests" workflow
   - Click "Run workflow"
   - Choose branch and click "Run workflow"

2. **Push Trigger:**
   ```bash
   git add .
   git commit -m "Test CI/CD setup"
   git push
   ```

3. **Check Results:**
   - Go to Actions tab
   - Click on the running workflow
   - Monitor progress
   - Check email inbox for report

## 📧 Email Report Contents

The email report includes:

- ✅ Test execution status (Pass/Fail)
- 📊 Repository and branch information
- 🔗 Direct link to GitHub Actions run
- 📦 Links to download artifacts (reports, screenshots)
- 📸 Screenshots attached for failed tests
- 📄 HTML formatted report

## 🎯 Workflow Triggers

The workflow runs automatically on:

1. **Push to master/main branch**
   ```bash
   git push origin master
   ```

2. **Pull Requests to master/main**
   - Automatically runs on PR creation/update
   - Posts comment with results on the PR

3. **Scheduled (Daily at 9 AM UTC)**
   - Configured via cron: `0 9 * * *`
   - Can be changed in workflow file

4. **Manual trigger**
   - Run from GitHub Actions UI
   - Use `workflow_dispatch` event

## 📦 Artifacts

After each run, the following artifacts are available for 30 days:

1. **Playwright HTML Report**
   - Interactive HTML report
   - Test execution details
   - Screenshots and videos

2. **Test Results**
   - Screenshots of failures
   - Trace files for debugging
   - Logs and error details

### Download Artifacts:
1. Go to Actions tab
2. Click on a workflow run
3. Scroll down to "Artifacts" section
4. Click to download

## 🔧 Customization

### Change Email Template

Edit the email body in `.github/workflows/playwright.yml` under the "Prepare email content" step.

### Modify Test Schedule

Change the cron expression:
```yaml
schedule:
  - cron: '0 9 * * *'  # Daily at 9 AM UTC
  # Examples:
  # '0 */6 * * *'     # Every 6 hours
  # '0 0 * * 1'       # Every Monday at midnight
  # '0 12 * * 1-5'    # Weekdays at noon
```

### Add Slack Notifications

Add this step to the workflow:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Microsoft Teams Notifications

Add this step:
```yaml
- name: Teams Notification
  uses: toko-bifrost/ms-teams-deploy-card@master
  with:
    webhook-uri: ${{ secrets.TEAMS_WEBHOOK }}
```

## 🐛 Troubleshooting

### Email Not Received

1. **Check spam folder**
2. **Verify secrets are set correctly**
   - Go to Settings → Secrets → Actions
   - Confirm all 4 secrets exist

3. **Check App Password**
   - Must be 16-character App Password
   - Not regular Gmail password
   - 2FA must be enabled

4. **Check workflow logs**
   - Go to Actions tab
   - Click on failed run
   - Expand "Send Email Notification" step

### Tests Failing in CI

1. **Check environment variables**
   - Verify ANTHROPIC_API_KEY is set (if using AI features)

2. **Browser installation**
   - Workflow includes `npx playwright install --with-deps`

3. **View detailed logs**
   - Download test-results artifact
   - Check screenshots and traces

### Workflow Not Triggering

1. **Verify workflow file location**
   - Must be in `.github/workflows/` directory
   - File must have `.yml` or `.yaml` extension

2. **Check branch names**
   - Update branch names if different from master/main

3. **Permissions**
   - Ensure you have write access to repository

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Cron Expression Generator](https://crontab.guru/)

## 🎉 Success Checklist

- [ ] All 4 GitHub secrets configured
- [ ] Gmail App Password created (not regular password)
- [ ] Workflow file in `.github/workflows/` directory
- [ ] Manual workflow triggered successfully
- [ ] Email received with test report
- [ ] Artifacts downloadable from GitHub
- [ ] PR comments working (if applicable)

## 💡 Tips

- **Use App Passwords:** Never use your actual Gmail password
- **Test Locally:** Run `npx playwright test` locally before pushing
- **Monitor Usage:** Check GitHub Actions minutes usage
- **Optimize Tests:** Keep test execution under 60 minutes
- **Archive Old Artifacts:** Download important reports within 30 days

---

**Need Help?** Check the workflow logs in the Actions tab or review the troubleshooting section above.
