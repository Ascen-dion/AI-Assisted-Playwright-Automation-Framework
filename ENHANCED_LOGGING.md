# Enhanced Logging Features

## Overview

The workflow UI now provides detailed logging at every step, giving you complete visibility into test case creation, execution, and self-healing processes.

## What's New

### 1. Detailed TestRail Test Case Logging

**Before:**
```
✓ TestRail: 4 created, 2 updated
```

**Now:**
```
✓ TestRail: 4 created, 2 updated
   Created test cases:
     1. Verify homepage headline visibility
     2. Verify headline on mobile devices
     3. Test headline text content
     4. Verify headline styling
   Updated test cases:
     1. C1234 - Verify navigation menu
     2. C1235 - Test footer links
```

### 2. Individual Test Execution Results

**Before:**
```
✓ Tests completed: 4/6 passed
```

**Now:**
```
   Test Results:
     ✓ Verify homepage headline visibility (1234ms)
     ✓ Verify headline on mobile devices (2345ms)
     ✗ Test headline text content (3456ms)
     ✓ Verify headline styling (987ms)
   
✓ Tests completed: 4/6 passed
```

### 3. Detailed Self-Healing Information

**Before:**
```
🔧 Self-healing applied after 1 failed attempt(s)
```

**Now:**
```
🔧 Self-healing applied after attempt 1
   Error Analysis:
     - Strict mode violations: 3
     - Selector issues: 1
     - Navigation timeout detected
   Fixes Applied:
     ✓ Added .first() to multi-match locators
     ✓ Increased navigation timeout to 30000ms
     ✓ Improved selector reliability
   Agent: healer (MCP: enabled)
```

## Technical Details

### Backend Enhancements

#### 1. `/api/workflow/push-testrail` Response

Now includes:
- `createdCases`: Array of `{ id, title }` for newly created test cases
- `updatedCases`: Array of `{ id, title }` for updated test cases

```json
{
  "success": true,
  "created": 4,
  "updated": 2,
  "createdCases": [
    { "id": "new", "title": "Test Case 1" },
    { "id": "new", "title": "Test Case 2" }
  ],
  "updatedCases": [
    { "id": "C1234", "title": "Updated Test" }
  ]
}
```

#### 2. `/api/workflow/execute-tests` Response

Now includes:
- `testResults`: Array of individual test outcomes
- `healingDetails`: Comprehensive healing information with error analysis

```json
{
  "success": true,
  "passed": 4,
  "failed": 2,
  "total": 6,
  "testResults": [
    {
      "title": "Verify homepage headline",
      "status": "passed",
      "duration": 1234
    }
  ],
  "healingApplied": true,
  "healingDetails": {
    "agentUsed": "healer",
    "mcpEnabled": true,
    "errorAnalysis": {
      "strictModeViolations": 3,
      "selectorIssues": 1,
      "navigationIssues": true,
      "cssIssues": 0,
      "textMismatches": 0
    },
    "fixesApplied": [
      "Added .first() to multi-match locators",
      "Increased navigation timeout to 30000ms",
      "Improved selector reliability"
    ]
  }
}
```

#### 3. Enhanced `parsePlaywrightOutput()` Function

The output parser now:
- Extracts individual test results from Playwright output
- Captures test names, status (passed/failed), and duration
- Handles multiple output formats (success and error cases)

### Frontend Enhancements

#### 1. Hierarchical Log Display

Logs now support indentation for better readability:
- Main actions at base level
- Details indented by 2 spaces
- Sub-details indented by 4 spaces

#### 2. Enhanced LogViewer Component

- **Auto-indent detection**: Automatically calculates indent level from leading spaces
- **Hover effects**: Highlight log entries on hover for easier reading
- **Better formatting**: Improved spacing and visual hierarchy

#### 3. Detailed Workflow Progress

Each workflow step now shows:
- **TestRail Sync**: Individual test case names and IDs
- **Test Execution**: Each test result with timing
- **Self-Healing**: Error analysis and applied fixes

## Usage Example

### Running a Test

1. **Enter Jira ID or Requirements**
2. **View Detailed Progress:**

```
[1:34:11 PM] ✓ Generated 6 test cases
[1:34:11 PM] Syncing test cases to TestRail...
[1:34:34 PM] ✓ TestRail: 4 created, 2 updated
[1:34:34 PM]    Created test cases:
[1:34:34 PM]      1. Verify Sign In button is visible
[1:34:34 PM]      2. Verify Sign In button is clickable
[1:34:34 PM]      3. Test Sign In button color
[1:34:34 PM]      4. Verify Sign In button on mobile
[1:34:34 PM]    Updated test cases:
[1:34:34 PM]      1. C789 - Verify homepage loads
[1:34:34 PM]      2. C790 - Test navigation menu
[1:34:43 PM] ✓ Generated test script: ed-5-automated.spec.js
[1:34:43 PM] Executing Playwright tests with self-healing...
[1:36:59 PM]    Test Results:
[1:36:59 PM]      ✓ Verify Sign In button is visible (1234ms)
[1:36:59 PM]      ✓ Verify Sign In button is clickable (987ms)
[1:36:59 PM]      ✗ Test Sign In button color (2345ms)
[1:36:59 PM]      ✓ Verify Sign In button on mobile (1567ms)
[1:36:59 PM] 🔧 Self-healing applied after attempt 1
[1:36:59 PM]    Error Analysis:
[1:36:59 PM]      - CSS assertion issues: 1
[1:36:59 PM]    Fixes Applied:
[1:36:59 PM]      ✓ Removed CSS exact value assertions
[1:36:59 PM]    Agent: healer (MCP: enabled)
[1:36:59 PM] ♻️ Test execution took 2 attempt(s)
[1:36:59 PM] ✓ Tests completed: 4/6 passed
```

## Benefits

### 1. **Better Visibility**
- See exactly which test cases were created/updated in TestRail
- Know which specific tests passed or failed
- Understand what errors occurred and how they were fixed

### 2. **Easier Debugging**
- Detailed error analysis helps identify patterns
- See what fixes were applied during self-healing
- Track execution timing for performance insights

### 3. **Enhanced Transparency**
- Full visibility into MCP agent usage
- Clear indication when agents are active
- Detailed breakdown of healing strategies

### 4. **Improved UX**
- Hierarchical log structure improves readability
- Hover effects make logs easier to navigate
- Color-coded messages (success, error, warning, info)

## Configuration

No additional configuration needed! The enhanced logging is automatically enabled and works with your existing setup.

The logging system respects your MCP configuration:
- With `USE_MCP=true`: Shows "Agent: healer (MCP: enabled)"
- Without MCP: Shows "Agent: healer (MCP: disabled)"

## Next Steps

To see the enhanced logging in action:

1. **Start the backend:**
   ```bash
   cd server
   node workflow-api.js
   ```

2. **Start the frontend:**
   ```bash
   cd ui
   npm start
   ```

3. **Run a workflow** and watch the detailed logs appear in real-time!

---

**Last Updated:** February 20, 2026
**Version:** 2.0 with Enhanced Logging
