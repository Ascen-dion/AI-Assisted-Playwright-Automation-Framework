# 🌐 Web UI - Complete Feature Guide

## Overview

The Playwright AI Framework Web UI provides a beautiful, intuitive interface for the complete Jira→TestRail workflow. Enter a story ID and watch as AI generates tests, syncs to TestRail, executes automation, and updates results.

## 🎯 Key Features

### 1. **Single Input Workflow**
- Just enter a Jira story ID (e.g., `ED-2`)
- Click "Run Workflow"
- Everything else happens automatically

### 2. **Visual Progress Tracking**
- 6-step progress indicator with animated icons
- Real-time status updates
- Completion checkmarks

### 3. **Live Execution Logs**
- Color-coded messages (info, success, error)
- Timestamps for each operation
- Auto-scroll to latest entry

### 4. **Results Dashboard**
- Test case counts
- TestRail sync statistics
- Pass/fail metrics
- Execution duration

### 5. **Responsive Design**
- Works on desktop, tablet, and mobile
- Touch-friendly interface
- Adaptive layout

## 🏗️ Architecture

### Frontend (React)

```
ui/
├── src/
│   ├── components/
│   │   ├── WorkflowUI.js          # Main workflow orchestration
│   │   ├── WorkflowUI.css         # Main styling
│   │   ├── StepProgress.js        # 6-step visual progress
│   │   ├── StepProgress.css       # Progress styling
│   │   ├── LogViewer.js           # Real-time log display
│   │   └── LogViewer.css          # Log styling
│   ├── App.js                     # Root component
│   ├── App.css                    # Global app styles
│   ├── index.js                   # Entry point
│   └── index.css                  # Global CSS
└── public/
    └── index.html                 # HTML template
```

**Technology Stack:**
- React 18.2 (Functional components + Hooks)
- Axios for HTTP requests
- CSS3 with gradients and animations
- Responsive grid layouts

### Backend (Express API)

```
server/
├── workflow-api.js                # Express REST API
└── package.json                   # Dependencies
```

**API Endpoints:**
- `GET /api/health` - Health check
- `POST /api/workflow/fetch-jira` - Fetch Jira story
- `POST /api/workflow/generate-tests` - Generate test cases
- `POST /api/workflow/push-testrail` - Sync to TestRail
- `POST /api/workflow/generate-scripts` - Generate Playwright code
- `POST /api/workflow/execute-tests` - Run tests
- `POST /api/workflow/update-results` - Update Jira

**Integrations:**
- Jira REST API v3
- TestRail API v2
- OpenRouter AI API
- Playwright Test Runner

## 📊 Workflow Steps (Detailed)

### Step 1: Fetch Jira Story 📋

**What happens:**
1. UI sends story ID to `/api/workflow/fetch-jira`
2. Backend calls Jira API
3. Extracts title, description, acceptance criteria
4. Returns structured story data

**Response:**
```json
{
  "success": true,
  "story": {
    "id": "ED-2",
    "title": "Endpoint Clinical Demo Frontend",
    "description": "...",
    "acceptanceCriteria": ["...", "..."],
    "status": "In Progress",
    "type": "Story"
  }
}
```

### Step 2: Generate Test Cases 🤖

**What happens:**
1. UI sends story to `/api/workflow/generate-tests`
2. Backend sends prompt to AI engine (OpenRouter)
3. AI generates comprehensive test plan
4. Parses test cases from AI response

**AI Prompt:**
```
Generate test cases for this user story:
Title: [Story Title]
Description: [Story Description]

Acceptance Criteria:
- [Criterion 1]
- [Criterion 2]

Generate a comprehensive test plan with test cases covering all acceptance criteria.
```

**Response:**
```json
{
  "success": true,
  "testCases": [
    {
      "id": 1,
      "title": "Verify login with valid credentials",
      "steps": "1. Navigate to login\n2. Enter credentials\n3. Click submit",
      "expectedResult": "User is logged in successfully"
    }
  ],
  "message": "Generated 5 test cases"
}
```

### Step 3: Push to TestRail 📊

**What happens:**
1. UI sends test cases to `/api/workflow/push-testrail`
2. Backend checks for existing test cases (duplicate detection)
3. Creates new or updates existing in TestRail
4. Returns sync statistics

**Smart Duplicate Detection:**
- Matches by test case title
- Updates existing instead of creating duplicates
- Maintains test case IDs and history

**Response:**
```json
{
  "success": true,
  "created": 0,
  "updated": 5,
  "message": "TestRail sync complete: 0 created, 5 updated"
}
```

### Step 4: Generate Test Scripts ⚙️

**What happens:**
1. UI sends test cases to `/api/workflow/generate-scripts`
2. Backend sends prompt to AI with test case details
3. AI generates complete Playwright test file
4. Saves to `src/tests/[story-id]-automated.spec.js`

**Generated File:**
```javascript
// ed-2-automated.spec.js
const { test, expect } = require('@playwright/test');

test.describe('ED-2: Endpoint Clinical Demo', () => {
  test('Verify login with valid credentials', async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password');
    await page.click('#submit');
    await expect(page).toHaveURL(/dashboard/);
  });
  
  // ... more tests
});
```

**Response:**
```json
{
  "success": true,
  "filename": "ed-2-automated.spec.js",
  "filepath": "src/tests/ed-2-automated.spec.js",
  "message": "Generated test script: ed-2-automated.spec.js"
}
```

### Step 5: Execute Tests 🚀

**What happens:**
1. UI sends filename to `/api/workflow/execute-tests`
2. Backend runs: `npx playwright test src/tests/[filename]`
3. Captures stdout/stderr
4. Parses Playwright output for results

**Execution:**
```bash
npx playwright test src/tests/ed-2-automated.spec.js
```

**Response:**
```json
{
  "success": true,
  "passed": 5,
  "failed": 0,
  "total": 5,
  "duration": "12.45",
  "output": "Running 5 tests...\n✓ Test 1 passed\n..."
}
```

### Step 6: Update Results ✅

**What happens:**
1. UI sends results to `/api/workflow/update-results`
2. Backend formats comment with metrics
3. Posts comment to Jira ticket
4. Confirms success

**Jira Comment:**
```
✅ Automated Test Execution Results

**Tests Executed:** 5
**Passed:** 5 ✓
**Failed:** 0 ✗
**Duration:** 12.45s

Execution completed at: 2/20/2026, 3:45:30 PM
```

**Response:**
```json
{
  "success": true,
  "message": "Results posted to Jira ticket ED-2"
}
```

## 🎨 UI Components (Deep Dive)

### WorkflowUI Component

**State Management:**
```javascript
const [storyId, setStoryId] = useState('');           // Input value
const [isRunning, setIsRunning] = useState(false);    // Execution state
const [currentStep, setCurrentStep] = useState(0);    // Progress (0-6)
const [logs, setLogs] = useState([]);                 // Log entries
const [results, setResults] = useState(null);         // Final results
```

**Key Functions:**
- `runWorkflow()` - Orchestrates all 6 steps sequentially
- `addLog(message, type)` - Adds timestamped log entry
- Error handling for each step
- State updates for progress indicator

### StepProgress Component

**Features:**
- Visual representation of workflow progress
- Animated pulse effect for active step
- Color coding: gray → purple (active) → green (completed)
- Responsive layout with connector lines

**Props:**
```javascript
{
  steps: [
    { id: 1, name: 'Fetch Jira Story', icon: '📋' },
    ...
  ],
  currentStep: 3  // Currently active step
}
```

### LogViewer Component

**Features:**
- Auto-scrolling to latest entry
- Color-coded by type:
  - `info` - Blue
  - `success` - Green
  - `error` - Red
  - `warning` - Yellow
- Monospace font for technical readability
- Dark theme for reduced eye strain

**Log Entry Structure:**
```javascript
{
  timestamp: '3:45:30 PM',
  message: 'Generated 5 test cases',
  type: 'success'
}
```

## 🚀 Deployment Options

### GitHub Pages (Recommended for UI)

**Setup:**
1. Push to main branch
2. GitHub Actions builds React app
3. Deploys to `gh-pages` branch
4. Accessible at `https://viplove29.github.io/playwright-ai-framework`

**Configuration:**
- See `.github/workflows/deploy-ui.yml`
- Automatic on push to `main` or `Mcp_with_test_rail_jira_api`
- Manual trigger via Actions tab

### Backend Hosting Options

| Platform | Free Tier | Deployment Time | Best For |
|----------|-----------|-----------------|----------|
| **Vercel** | Yes | 2 mins | Quick deployment |
| **Railway** | Yes (500 hrs/mo) | 5 mins | Persistent apps |
| **Render** | Yes | 10 mins | Production apps |
| **Heroku** | No (paid only) | 5 mins | Enterprise |

**Vercel Deployment (Recommended):**
```powershell
npm install -g vercel
cd server
vercel
```

## 🔧 Configuration

### Update API URL

**Development:**
```javascript
// ui/src/components/WorkflowUI.js (line 16)
const API_URL = 'http://localhost:3001';
```

**Production:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.vercel.app';
```

Or create `ui/.env`:
```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

### CORS Configuration

Backend CORS settings in `server/workflow-api.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',                              // Local dev
    'https://viplove29.github.io'                        // GitHub Pages
  ]
}));
```

## 📱 Responsive Breakpoints

```css
/* Desktop: 1920x1080 */
.workflow-container { max-width: 1200px; }

/* Laptop:  1440x900 */
@media (max-width: 1440px) { }

/* Tablet: 768x1024 */
@media (max-width: 768px) {
  .input-section { flex-direction: column; }
  .step { flex: 0 0 calc(50% - 0.5rem); }
}

/* Mobile: 375x667 */
@media (max-width: 480px) {
  .App-header h1 { font-size: 1.8rem; }
}
```

## 🎯 Usage Examples

### Example 1: ED-2 Story

```
Input: ED-2
Expected Duration: ~26 seconds
Expected Output:
- 5 test cases generated
- 0 created, 5 updated in TestRail
- 5/5 tests passed
- Results posted to Jira
```

### Example 2: New Story

```
Input: PROJ-456
Expected Duration: ~30 seconds
Expected Output:
- 8 test cases generated
- 8 created, 0 updated in TestRail
- 7/8 tests passed
- Failure analysis in logs
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Failed to fetch"**
- Cause: Backend not running
- Solution: Run `cd server && node workflow-api.js`

**Issue: "CORS policy blocked"**
- Cause: Backend CORS not configured
- Solution: Add your domain to CORS whitelist

**Issue: "Network request failed"**
- Cause: Wrong API URL
- Solution: Check API_URL in WorkflowUI.js

**Issue: Tests not executing**
- Cause: Playwright not installed
- Solution: Run `npm install` in root directory

## 🔐 Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Backend validation** - Validate all inputs server-side
3. **Rate limiting** - Implement rate limiting on API
4. **Authentication** - Add auth for production deployments
5. **HTTPS only** - Use HTTPS in production
6. **Input sanitization** - Sanitize story IDs and outputs

## 📊 Performance Metrics

**UI Performance:**
- Initial load: < 2 seconds
- React render: < 50ms
- Log updates: < 10ms per entry

**Workflow Performance:**
- ED-2 (5 tests): ~26 seconds
- Average story: ~30 seconds
- API response time: < 200ms per endpoint

## 🚀 Future Enhancements

- [ ] WebSocket for real-time updates (no polling)
- [ ] User authentication (Auth0/Firebase)
- [ ] Test run history with charts
- [ ] Bulk story processing queue
- [ ] Custom workflow configuration
- [ ] Dark/light theme toggle
- [ ] Export results to PDF/Excel
- [ ] Scheduled test execution
- [ ] Slack/Teams notifications
- [ ] Multi-project support

## 📝 API Documentation

Full API reference: [server/workflow-api.js](server/workflow-api.js)

**Base URL:** `http://localhost:3001/api`

**Authentication:** None (add for production)

**Rate Limiting:** None (implement for production)

**Error Format:**
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

## 🤝 Contributing

To add features to the UI:

1. **Frontend**: Edit files in `ui/src/components/`
2. **Backend**: Edit `server/workflow-api.js`
3. **Test locally**: `cd ui && npm start`
4. **Deploy**: Push to main branch

## 📧 Support

For UI-specific issues:
1. Check [UI_SETUP_GUIDE.md](UI_SETUP_GUIDE.md)
2. Review browser console (F12)
3. Check backend terminal output
4. Open GitHub issue with screenshots

---

**Built with ❤️ using React, Express, Playwright, and AI**
