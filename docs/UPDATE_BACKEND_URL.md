# Update Backend URL and Redeploy

## After Generating Railway Domain:

### Step 1: Update .env.production
```bash
# Edit ui/.env.production
# Replace with YOUR actual Railway domain
REACT_APP_API_URL=https://YOUR-ACTUAL-RAILWAY-DOMAIN.up.railway.app
```

### Step 2: Rebuild Frontend
```powershell
cd ui
npm run build
```

### Step 3: Commit and Push
```powershell
git add ui/.env.production
git commit -m "Update backend URL with actual Railway domain"
git push ascendion mcp_rail_jira_ui
```

### Step 4: Wait for GitHub Pages to Redeploy
- Check: https://github.com/Ascen-dion/AI-Assisted-Playwright-Automation-Framework/actions
- Wait 2-3 minutes for completion

### Step 5: Test
Visit: https://ascen-dion.github.io/AI-Assisted-Playwright-Automation-Framework/

The backend status should show green "Connected" ✅

## Quick Test Backend Health

Once you have the Railway domain:
```powershell
curl https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Workflow API is running",
  "agents": { ... }
}
```
