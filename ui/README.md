# Playwright AI Workflow - Web UI

Beautiful web interface for the Jira→AI→TestRail→Automation workflow.

## 🚀 Features

- **Simple Input**: Just enter a Jira Story ID (e.g., ED-2)
- **Visual Progress**: See each workflow step in real-time
- **Live Logs**: Monitor execution with detailed logging
- **Results Summary**: View comprehensive metrics after completion
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

### Frontend (React)
- **WorkflowUI**: Main component with input and orchestration
- **StepProgress**: Visual progress indicator for workflow stages
- **LogViewer**: Real-time log display with color-coded messages

### Backend (Express API)
- **Endpoints**: 6 REST API endpoints for each workflow step
- **Integration**: Connects to Jira, TestRail, OpenRouter AI, and Playwright

## 📦 Installation

### Frontend Setup

```bash
cd ui
npm install
npm start
```

The UI will open at `http://localhost:3000`

### Backend Setup

```bash
cd server
npm install
npm start
```

The API will run on `http://localhost:3001`

## 🌐 Deployment to GitHub Pages

### Automatic Deployment

Push to `main` or `Mcp_with_test_rail_jira_api` branch:

```bash
git add .
git commit -m "Deploy UI"
git push origin main
```

GitHub Actions will automatically build and deploy to:
- **URL**: https://viplove29.github.io/playwright-ai-framework

### Manual Deployment

```bash
cd ui
npm run build
npm run deploy
```

## 🔧 Configuration

### Backend API URL

Update the API URL in `src/components/WorkflowUI.js`:

```javascript
// For local development
const API_URL = 'http://localhost:3001';

// For production (update with your backend URL)
const API_URL = 'https://your-backend-url.com';
```

### Environment Variables

Create `.env` file in the `ui/` directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

## 📊 Workflow Steps

1. **Fetch Jira Story** 📋
   - Retrieves user story and acceptance criteria
   
2. **Generate Test Cases** 🤖
   - AI creates comprehensive test cases
   
3. **Push to TestRail** 📊
   - Syncs test cases with TestRail
   
4. **Generate Test Scripts** ⚙️
   - Creates executable Playwright tests
   
5. **Execute Tests** 🚀
   - Runs automated tests
   
6. **Update Results** ✅
   - Posts results back to Jira

## 🎨 UI Components

### Input Section
- Story ID input field
- Run button with loading state
- Validation and error handling

### Progress Indicators
- 6-step visual progress bar
- Animated icons for active steps
- Completed state with checkmarks

### Log Viewer
- Real-time streaming logs
- Color-coded by type (info, success, error)
- Auto-scroll to latest entries

### Results Summary
- Metrics grid with key numbers
- Pass/fail statistics
- TestRail sync counts
- Execution duration

## 🛠️ Development

### File Structure

```
ui/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── WorkflowUI.js
│   │   ├── WorkflowUI.css
│   │   ├── StepProgress.js
│   │   ├── StepProgress.css
│   │   ├── LogViewer.js
│   │   └── LogViewer.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## 📱 Responsive Design

- Desktop: Full-width layout with side-by-side elements
- Tablet: Adjusted spacing and font sizes
- Mobile: Stacked layout with touch-friendly buttons

## 🎯 Usage Example

1. Open the UI: `https://viplove29.github.io/playwright-ai-framework`
2. Enter Story ID: `ED-2`
3. Click **Run Workflow**
4. Watch the progress indicators
5. Review logs in real-time
6. See results summary

## 🔐 Security Notes

- Never commit API keys to the repository
- Use environment variables for sensitive data
- Backend should validate all inputs
- Implement rate limiting for API endpoints

## 📝 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/workflow/fetch-jira` | POST | Fetch Jira story |
| `/api/workflow/generate-tests` | POST | Generate test cases |
| `/api/workflow/push-testrail` | POST | Push to TestRail |
| `/api/workflow/generate-scripts` | POST | Generate scripts |
| `/api/workflow/execute-tests` | POST | Execute tests |
| `/api/workflow/update-results` | POST | Update Jira |

## 🐛 Troubleshooting

### UI not loading
- Check if React dev server is running on port 3000
- Clear browser cache
- Check console for errors

### API connection errors
- Ensure backend server is running on port 3001
- Check CORS settings
- Verify API URL in WorkflowUI.js

### Tests not executing
- Confirm Playwright is installed in parent directory
- Check file paths in workflow-api.js
- Verify test file generation in `src/tests/`

## 🚀 Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Authentication and user management
- [ ] Test history and analytics
- [ ] Bulk story processing
- [ ] Custom workflow configuration
- [ ] Dark/light theme toggle
- [ ] Export results to PDF/Excel

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📧 Support

For issues or questions, please open a GitHub issue.
