# 🚀 UI Deployment Guide

Complete guide to deploy and use the Playwright AI Workflow UI on GitHub Pages.

## 📋 Prerequisites

- Node.js 18+ installed
- Git configured
- GitHub repository access
- Jira and TestRail credentials configured

## 🎯 Quick Start

### 1. Install Dependencies

```powershell
# Install UI dependencies
cd ui
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Start Backend API (Required)

The backend API must be running for the UI to work:

```powershell
cd server
npm start
```

✅ Backend running at: `http://localhost:3001`

### 3. Start Frontend UI (Development)

```powershell
cd ui
npm start
```

✅ UI opens at: `http://localhost:3000`

### 4. Test Locally

1. Open browser to `http://localhost:3000`
2. Enter Story ID: `ED-2`
3. Click "Run Workflow"
4. Watch the magic happen! 🎉

## 🌐 Deploy to GitHub Pages

### Option A: Automatic Deployment (Recommended)

The GitHub Actions workflow will automatically deploy when you push:

```powershell
git add .
git commit -m "Deploy UI to GitHub Pages"
git push origin main
```

**Deployment URL**: https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/

⚠️ **Note**: This URL works after GitHub Pages is configured. See [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md) for complete setup.

### Option B: Manual Deployment

```powershell
cd ui
npm run build
npm run deploy
```

## ⚙️ GitHub Pages Setup

### Enable GitHub Pages

1. Go to repository: https://github.com/Ascen-dion/AI-Assisted-Playwright-Automation-Framework
2. Click **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Save settings

### Verify Deployment

1. Check GitHub Actions tab
2. Wait for "Deploy UI to GitHub Pages" workflow
3. Status should show ✅ green checkmark
4. Visit: https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/

## 🔧 Backend Hosting Options

The React UI is static and hosted on GitHub Pages, but you need a backend API server. Here are your options:

### Option 1: Local Backend (Development)

- **Pros**: Free, easy to debug
- **Cons**: Only works on your machine
- **Setup**: `cd server && npm start`

### Option 2: Vercel (Recommended for Production)

**Free tier, easy deployment:**

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd server
vercel
```

Follow prompts and note your API URL (e.g., `https://your-api.vercel.app`)

Then update `ui/src/components/WorkflowUI.js`:

```javascript
// Change from localhost to your Vercel URL
const API_URL = 'https://your-api.vercel.app';
```

### Option 3: Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Create new project from repo
4. Select `server/` directory
5. Deploy and get URL

### Option 4: Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Deploy and get URL

### Option 5: GitHub Codespaces

1. Open repository in GitHub Codespaces
2. Run backend: `cd server && npm start`
3. Make port 3001 public
4. Use the forwarded URL

## 🔐 Environment Configuration

### Backend Environment Variables

Create `server/.env`:

```env
JIRA_BASE_URL=https://ascendionconfluence.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
TESTRAIL_URL=https://ascendionqe.testrail.io
TESTRAIL_EMAIL=your-email@example.com
TESTRAIL_API_KEY=your-testrail-key
OPENROUTER_API_KEY=your-openrouter-key
PORT=3001
```

### Frontend Environment Variables

Create `ui/.env`:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

Or update directly in `ui/src/components/WorkflowUI.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

## 📊 Workflow Walkthrough

### Step 1: Access the UI

Navigate to: https://viplove29.github.io/playwright-ai-framework

### Step 2: Enter Story ID

- Type a Jira story ID (e.g., `ED-2`, `ED-3`)
- Press Enter or click "Run Workflow"

### Step 3: Watch Progress

The UI shows 6 sequential steps:

1. 📋 **Fetch Jira Story** - Retrieves story details
2. 🤖 **Generate Test Cases** - AI creates test cases  
3. 📊 **Push to TestRail** - Syncs to TestRail
4. ⚙️ **Generate Test Scripts** - Creates Playwright code
5. 🚀 **Execute Tests** - Runs automation
6. ✅ **Update Results** - Posts back to Jira

### Step 4: Review Results

After completion, you'll see:
- Total test cases generated
- Pass/fail statistics
- TestRail sync status
- Execution duration
- Full execution logs

## 🎨 Customization

### Change Colors

Edit `ui/src/index.css`:

```css
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

Edit `ui/src/components/WorkflowUI.css`:

```css
.run-button {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Change Logo/Title

Edit `ui/src/App.js`:

```javascript
<h1>🎭 Your Company Name</h1>
<p>Custom Tagline Here</p>
```

### Add Custom Steps

Edit `ui/src/components/WorkflowUI.js`:

```javascript
const steps = [
  { id: 1, name: 'Custom Step', icon: '🎯' },
  // ... more steps
];
```

## 🐛 Troubleshooting

### Issue: CORS Error

**Error**: "Access to XMLHttpRequest at 'http://localhost:3001' from origin 'https://viplove29.github.io' has been blocked by CORS"

**Solution**: Backend must allow your GitHub Pages domain:

```javascript
// server/workflow-api.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://viplove29.github.io']
}));
```

### Issue: API Not Found

**Error**: "Failed to fetch" or "Network request failed"

**Solution**: 
1. Check backend is running
2. Verify API URL in `WorkflowUI.js`
3. Test backend health: `curl http://localhost:3001/api/health`

### Issue: Build Fails

**Error**: npm ERR! during `npm run build`

**Solution**:
```powershell
cd ui
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Issue: Deployment Not Showing

**Solution**:
1. Check GitHub Actions status
2. Verify Pages settings
3. Clear browser cache
4. Add `/` to the end of URL

## 📱 Mobile Optimization

The UI is fully responsive:
- ✅ Desktop (1920x1080)
- ✅ Laptop (1440x900)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

Test on different devices using browser DevTools.

## 🔄 Update Process

### Push New Changes

```powershell
# Make changes to UI files
cd ui/src/components
# Edit files...

# Commit and push
git add .
git commit -m "Update UI features"
git push origin main

# GitHub Actions will auto-deploy
```

### Force Redeploy

```powershell
# Trigger workflow manually
# Go to GitHub → Actions → "Deploy UI to GitHub Pages"
# Click "Run workflow"
```

## 📊 Monitoring

### Check Deployment Status

1. Go to: https://github.com/viplove29/playwright-ai-framework/actions
2. Look for latest "Deploy UI to GitHub Pages" run
3. Click for details and logs

### View Live Logs

Backend logs (local):
```powershell
cd server
npm start
# Logs appear in console
```

### Analytics (Optional)

Add Google Analytics to `ui/public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

## ✅ Verification Checklist

Before going live:

- [ ] UI builds without errors (`npm run build`)
- [ ] Backend API responds (`curl http://localhost:3001/api/health`)
- [ ] CORS configured for GitHub Pages domain
- [ ] Environment variables set correctly
- [ ] Jira integration tested
- [ ] TestRail integration tested
- [ ] Test execution works end-to-end
- [ ] GitHub Pages deployment successful
- [ ] Mobile responsive design verified
- [ ] Error handling works properly

## 🎉 Success!

You now have a beautiful, production-ready UI for your Playwright AI Framework!

**Live URL**: https://viplove29.github.io/playwright-ai-framework

Share it with your team and enjoy automated testing! 🚀
