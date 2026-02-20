# Playwright AI Framework - UI Setup Instructions

## 🚀 Quick Start Guide

### Step 1: Install UI Dependencies

```powershell
cd ui
npm install --legacy-peer-deps
```

If you encounter errors, try:
```powershell
npm install --force
```

### Step 2: Install Backend Dependencies

```powershell
cd ../server
npm install
```

### Step 3: Configure Environment

The backend needs access to your existing integrations. No additional configuration needed since it uses the parent directory's modules.

### Step 4: Start Backend API

Open a PowerShell terminal:

```powershell
cd server
node workflow-api.js
```

You should see:
```
🚀 Workflow API server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
```

### Step 5: Start Frontend UI

Open **another** PowerShell terminal:

```powershell
cd ui
npm start
```

Browser will automatically open to `http://localhost:3000`

### Step 6: Test the Workflow

1. Enter Story ID: `ED-2`
2. Click "🚀 Run Workflow"
3. Watch the progress indicators
4. Review the logs
5. Check the results summary

## 🌐 Deploy to GitHub Pages

### Option 1: Automatic (GitHub Actions)

Already configured! Just push to main:

```powershell
git add .
git commit -m "Add UI and backend"
git push origin main
```

Visit: https://viplove29.github.io/playwright-ai-framework

### Option 2: Manual Deploy

```powershell
cd ui
npm run build
npm run deploy
```

## 🔧 Troubleshooting

### UI Dependencies Installation Fails

Try these commands in order:

```powershell
cd ui
rm -r node_modules -Force -ErrorAction SilentlyContinue
rm package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install --legacy-peer-deps
```

### Backend Cannot Find Modules

The backend uses relative paths to access integrations. Make sure you're in the correct directory:

```powershell
# Check your current location
pwd
# Should be: .../playwright-ai-framework/server

# If not, navigate correctly
cd path/to/playwright-ai-framework/server
node workflow-api.js
```

### Port Already in Use

If port 3001 or 3000 is in use:

**Backend (3001):**
```powershell
$env:PORT=3002
node workflow-api.js
```

Then update `ui/src/components/WorkflowUI.js` line 16:
```javascript
const API_URL = 'http://localhost:3002';
```

**Frontend (3000):**
```powershell
$env:PORT=3001
npm start
```

### CORS Errors in Browser

The backend is already configured for CORS. If you still see errors:

1. Make sure backend is running
2. Check the API URL in `WorkflowUI.js`
3. Verify no browser extensions are blocking requests

## 📊 Usage Examples

### Example 1: ED-2 Story

```
Story ID: ED-2
Expected Time: ~26 seconds
Expected Tests: 5 test cases
Expected Result: All pass ✅
```

### Example 2: Custom Story

Make sure the story exists in your Jira instance before running.

## 🎯 Architecture Overview

```
┌─────────────────┐
│   React UI      │ (Port 3000)
│  GitHub Pages   │
└────────┬────────┘
         │ HTTP Requests
         ↓
┌─────────────────┐
│  Express API    │ (Port 3001)
│   workflow-api  │
└────────┬────────┘
         │
         ├→ Jira Integration
         ├→ TestRail Integration
         ├→ AI Engine (OpenRouter)
         └→ Playwright Tests
```

## 📝 File Structure

```
playwright-ai-framework/
├── ui/                              # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorkflowUI.js       # Main UI component
│   │   │   ├── StepProgress.js     # Progress indicator
│   │   │   └── LogViewer.js        # Log display
│   │   ├── App.js                  # App root
│   │   └── index.js                # Entry point
│   ├── public/
│   │   └── index.html              # HTML template
│   └── package.json                # Dependencies
│
├── server/                          # Express Backend
│   ├── workflow-api.js             # API server
│   └── package.json                # Dependencies
│
├── src/
│   ├── integrations/               # Used by backend
│   │   ├── jira-integration.js
│   │   └── testrail-integration.js
│   └── core/
│       └── ai-engine.js            # Used by backend
│
└── .github/
    └── workflows/
        └── deploy-ui.yml           # Auto-deployment
```

## 🎨 Customization

### Change Theme Colors

Edit `ui/src/index.css`:
```css
body {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Change API URL for Production

Edit `ui/src/components/WorkflowUI.js`:
```javascript
// Line 16
const API_URL = process.env.REACT_APP_API_URL || 'https://your-production-api.com';
```

### Add More Workflow Steps

Edit `ui/src/components/WorkflowUI.js`:
```javascript
const steps = [
  { id: 1, name: 'Your Step', icon: '🎯' },
  // ... add more
];
```

## 🚀 Production Deployment

### Frontend (GitHub Pages)

Already configured via `.github/workflows/deploy-ui.yml`

Access at: https://viplove29.github.io/playwright-ai-framework

### Backend Options

| Platform | Free Tier | Setup Difficulty | URL Example |
|----------|-----------|------------------|-------------|
| Vercel | Yes | Easy | your-app.vercel.app |
| Railway | Yes (500 hrs) | Easy | your-app.railway.app |
| Render | Yes | Medium | your-app.onrender.com |
| Heroku | No | Medium | your-app.herokuapp.com |

**Recommended: Vercel**

```powershell
npm install -g vercel
cd server
vercel
```

Follow the prompts and get your production URL.

## 📧 Support

If you encounter issues:

1. Check this setup guide
2. Review [UI_DEPLOYMENT_GUIDE.md](UI_DEPLOYMENT_GUIDE.md)
3. Check console logs (F12 in browser)
4. Review backend terminal output
5. Open a GitHub issue

## ✅ Success Indicators

You've successfully set up the UI when:

- ✅ Backend shows "server running on http://localhost:3001"
- ✅ UI opens in browser at http://localhost:3000
- ✅ Entering "ED-2" and clicking Run shows progress
- ✅ All 6 steps complete successfully
- ✅ Results summary displays
- ✅ Logs show execution details

## 🎉 You're Ready!

Your Playwright AI Framework now has a beautiful web interface!

**Local Development:**
- UI: http://localhost:3000
- API: http://localhost:3001

**Production:**
- UI: https://viplove29.github.io/playwright-ai-framework
- API: Deploy backend to Vercel/Railway (see guide above)

Enjoy automating your testing! 🚀
