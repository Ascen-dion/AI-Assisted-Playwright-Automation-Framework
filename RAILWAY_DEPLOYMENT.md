# Railway Deployment Configuration Guide

## Issue Fixed
Railway was looking for `/app/index.js` but our backend entry point is `server/workflow-api.js`.

## Configuration Files Created

### 1. railway.json
Configures Railway deployment with custom build and start commands.

```json
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "cd server && npm install"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "on-failure",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Procfile
Alternative configuration for process management (Heroku-style).

```
web: cd server && node workflow-api.js
```

### 3. nixpacks.toml
Nixpacks-specific configuration for Railway.

```toml
[phases.setup]
nixPkgs = ['nodejs', 'npm']

[phases.install]
cmds = ['cd server && npm ci']

[phases.build]
cmds = ['echo "Backend build complete"']

[start]
cmd = 'cd server && npm start'
```

### 4. package.json (Root - Updated)
Added start script to root package.json:

```json
{
  "main": "server/workflow-api.js",
  "scripts": {
    "start": "cd server && node workflow-api.js",
    ...
  }
}
```

## Deployment Steps

### Step 1: Commit and Push Configuration Files
```bash
git add railway.json Procfile nixpacks.toml package.json
git commit -m "Add Railway deployment configuration"
git push origin main
```

### Step 2: Railway Will Auto-Deploy
Railway will detect the push and:
1. Use nixpacks.toml or railway.json configuration
2. Run `cd server && npm install` during build
3. Execute `cd server && npm start` to start the server
4. Expose the service on the generated Railway URL

### Step 3: Verify Environment Variables in Railway
Ensure these are set in Railway dashboard (Settings > Variables):

**Required:**
- `ANTHROPIC_API_KEY` - Your Claude API key
- `JIRA_BASE_URL` - Your Jira instance URL
- `JIRA_EMAIL` - Your Jira email
- `JIRA_API_TOKEN` - Your Jira API token
- `TESTRAIL_HOST` - Your TestRail instance URL
- `TESTRAIL_USER` - Your TestRail email
- `TESTRAIL_API_KEY` - Your TestRail API key
- `PORT` - Railway automatically sets this (usually 3001)

**Optional:**
- `OPENROUTER_API_KEY` - For OpenRouter AI models
- `AZURE_OPENAI_KEY` - For Azure OpenAI
- `AZURE_OPENAI_ENDPOINT` - Azure endpoint URL

### Step 4: Test the Deployment

Check backend health:
```bash
curl https://AI-Assisted-Playwright-Automation-Framework.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "mcp": {
    "testAgents": {
      "status": "available",
      "capabilities": ["test_healing", "element_backup", "test_generation"]
    }
  }
}
```

### Step 5: Test Frontend Connection

1. Visit your GitHub Pages URL
2. Look for the backend status indicator (should show green dot + "Connected")
3. Enter a Jira ID and run the workflow
4. Check logs for detailed execution information

## Troubleshooting

### Error: Cannot find module '/app/index.js'
**Solution:** This error means Railway can't find the configuration files. Make sure:
- railway.json, Procfile, or nixpacks.toml is in the root directory
- Files are committed and pushed to the repository
- Railway is connected to the correct repository branch

### Error: Module not found during build
**Solution:** Check that package.json dependencies in server/ folder are correct:
```bash
cd server
npm install
```

### Error: PORT not available
**Solution:** Railway automatically sets the PORT environment variable. Your server should use:
```javascript
const PORT = process.env.PORT || 3001;
```
(This is already configured in workflow-api.js)

### Backend shows "Not Available" in UI
**Possible causes:**
1. Railway service not started - Check Railway dashboard for deployment status
2. Environment variables missing - Verify all required vars are set
3. CORS issues - workflow-api.js already has CORS enabled for all origins
4. API endpoint mismatch - Ensure ui/.env.production has correct Railway URL

## Railway Dashboard Monitoring

### Check Logs
1. Go to Railway dashboard
2. Select your project
3. Click "Deployments" tab
4. View real-time logs

### Check Metrics
- CPU usage
- Memory usage
- Network traffic
- Response times

### Restart Service
If needed:
1. Go to Settings > Service
2. Click "Restart"
3. Wait for service to come back online

## Cost Considerations

**Railway Free Tier:**
- $5 free credits per month
- Covers ~500 hours of runtime
- Sleep after 30 minutes of inactivity (Pro plan removes this)

**Estimated Monthly Cost:**
- Free tier: $0 (within limits)
- Hobby plan: ~$5/month (always-on)
- Pro plan: ~$20/month (more resources)

## Alternative: Using ngrok for Testing

If Railway deployment fails, use ngrok for temporary backend access:

```powershell
# Install ngrok (if not installed)
choco install ngrok

# Start backend locally
cd server
node workflow-api.js

# In another terminal, expose it
ngrok http 3001
```

Update ui/.env.production with the ngrok URL:
```
REACT_APP_API_URL=https://abc123.ngrok.io
```

**Note:** ngrok URLs change on restart. Railway provides stable URLs.

## Success Indicators

✅ Railway deployment succeeds without errors
✅ Backend health endpoint returns 200 OK
✅ Frontend shows green "Connected" status
✅ Workflow runs successfully with Jira integration
✅ Enhanced logging displays detailed information

## Next Steps

1. **Commit these files** to your repository
2. **Push to GitHub** - Railway will auto-deploy
3. **Verify deployment** in Railway dashboard
4. **Test health endpoint** with curl
5. **Share GitHub Pages URL** with your team

