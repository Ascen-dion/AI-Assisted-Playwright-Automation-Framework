# 🌐 Making Your App Universally Accessible

## The Problem

When you share your GitHub Pages URL (https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/), other users see:

```
[1:22:02 pm] ❌ Error: Failed to fetch
```

**Why?** The frontend tries to connect to `http://localhost:3001`, which:
- ✅ Works on your machine (backend running locally)
- ❌ Fails for others (no backend on their machine)

## The Solution

You have **3 options**:

### ✅ Option 1: Deploy Backend to Cloud (Recommended)

Deploy your backend API to a cloud service and update the frontend configuration.

#### Step 1: Choose a Backend Hosting Service

**Free Tier Options:**
- **Railway** (easiest) - https://railway.app
- **Render** - https://render.com  
- **Fly.io** - https://fly.io
- **Heroku** - https://heroku.com (paid after free tier)

**Enterprise Options:**
- **Azure App Service** - https://azure.microsoft.com
- **AWS Elastic Beanstalk** - https://aws.amazon.com
- **Google Cloud Run** - https://cloud.google.com

#### Step 2: Deploy Your Backend

**Example: Railway (Easiest)**

1. **Create Account**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Connect Repository**: Ascen-dion/AI-Assisted-Playwright-Automation-Framework
4. **Select Branch**: mcp_rail_jira_ui
5. **Root Directory**: Set to `server`
6. **Start Command**: `node workflow-api.js`
7. **Environment Variables**: Add these in Railway settings:
   ```
   JIRA_DOMAIN=ascendionconfluence.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-jira-token
   TESTRAIL_HOST=https://ascendionqe.testrail.io
   TESTRAIL_USER=your-testrail-user
   TESTRAIL_API_KEY=your-testrail-key
   ANTHROPIC_API_KEY=your-anthropic-key
   PORT=3001
   ```

8. **Deploy** - Railway will give you a URL like: `https://your-app.up.railway.app`

#### Step 3: Update Frontend Configuration

```powershell
# Navigate to UI folder
cd ui

# Create/edit .env.production
# Replace with your actual backend URL
echo "REACT_APP_API_URL=https://your-app.up.railway.app" > .env.production
```

#### Step 4: Rebuild and Deploy

```powershell
# Build with production config
npm run build

# Deploy to GitHub Pages
git add .
git commit -m "Configure production backend URL"
git push origin mcp_rail_jira_ui
```

✅ **Done!** Now anyone can use: https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/

---

### 🔧 Option 2: Run Backend Locally (Demo Only)

For demonstrations or team use where you control the backend.

#### Step 1: Enable CORS for GitHub Pages

Update `server/workflow-api.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',  // Local development
    'https://ascen-dion.github.io'  // GitHub Pages
  ],
  credentials: true
}));
```

#### Step 2: Expose Local Backend (Temporary URL)

Use **ngrok** to create a public URL for your local backend:

```powershell
# Install ngrok: https://ngrok.com/download

# Start backend
cd server
node workflow-api.js

# In another terminal, expose it
ngrok http 3001
```

You'll get a URL like: `https://abc123.ngrok.io`

#### Step 3: Update Frontend

```powershell
cd ui
echo "REACT_APP_API_URL=https://abc123.ngrok.io" > .env.production
npm run build
git push origin mcp_rail_jira_ui
```

⚠️ **Limitations:**
- ngrok URLs expire when you close the terminal
- Your computer must stay on and connected
- Not suitable for production use

---

### 📋 Option 3: Demo Mode Only (No Backend Features)

Show the UI without backend functionality.

Update the frontend to display a "Demo Mode" message:

```javascript
// ui/src/components/WorkflowUI.js
const API_BASE_URL = process.env.REACT_APP_API_URL || null;

// Show demo notice if no backend configured
if (!API_BASE_URL) {
  return (
    <div className="demo-notice">
      <h2>🎨 Demo Mode</h2>
      <p>This is a UI demonstration. Backend features require deployment.</p>
      <a href="#">View Deployment Guide</a>
    </div>
  );
}
```

---

## Current Status Indicator

The UI now shows backend connection status:

**✅ Connected**: Green dot + "Backend API Connected"
**❌ Disconnected**: Red dot + "Backend API Not Available" with helpful instructions

Users will immediately see if the backend is accessible.

## Configuration Files

### `.env.example` (Template)
```env
REACT_APP_API_URL=http://localhost:3001
```

### `.env.production` (For Deployment)
```env
REACT_APP_API_URL=https://your-backend.up.railway.app
```

### `.env.local` (Your Local Development - Git Ignored)
```env
REACT_APP_API_URL=http://localhost:3001
```

## Testing

### Test Locally
```powershell
# Terminal 1: Start backend
cd server
node workflow-api.js

# Terminal 2: Start frontend
cd ui
npm start

# Visit: http://localhost:3000
# Should show: ✅ Backend API Connected
```

### Test Production
1. Deploy backend to Railway/Render/etc.
2. Update `ui/.env.production` with backend URL
3. Rebuild and push to GitHub
4. Visit: https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/
5. Should show: ✅ Backend API Connected

## Costs

**Free Tier Options (Good for testing):**
- Railway: 500 hours/month free
- Render: 750 hours/month free
- Fly.io: 3 VMs free

**With Credit Card Required:**
- Azure App Service: ~$13/month (Basic tier)
- AWS Elastic Beanstalk: ~$24/month (t3.small)
- Heroku: $7/month (Eco Dynos)

## Security

When deploying backend, ensure:

1. **Environment Variables**: Never commit API keys to Git
2. **CORS**: Only allow your GitHub Pages domain
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Authentication**: Consider adding auth if handling sensitive data

## Recommended: Railway Deployment

**Why Railway?**
- ✅ Easy GitHub integration
- ✅ Automatic deployments on push
- ✅ Environment variables management
- ✅ Free tier (500 hrs/month)
- ✅ Simple setup (5-10 minutes)

**Quick Start:**
1. Visit https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo and branch
4. Add environment variables
5. Get your URL
6. Update `.env.production`
7. Push to GitHub
8. ✅ Live!

## Troubleshooting

### Frontend shows "Backend Not Available"

**Check:**
1. Is backend actually running? Test: `curl https://your-backend-url.com/api/health`
2. Is CORS configured correctly?
3. Is `.env.production` set with correct URL?
4. Did you rebuild after changing env variables?

### "Failed to fetch" error

**Check:**
1. Backend URL accessible in browser?
2. CORS headers allowing GitHub Pages domain?
3. SSL certificate valid (must be HTTPS)?

### Environment variable not updating

```powershell
# Clear build cache
cd ui
rm -rf build node_modules/.cache
npm run build
```

---

**Next Steps:**
1. ✅ Choose deployment option (Railway recommended)
2. ✅ Deploy backend with environment variables
3. ✅ Update `ui/.env.production` with backend URL
4. ✅ Rebuild and push to GitHub
5. ✅ Share your link: https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/
6. ✅ Anyone can now use it! 🎉
