# AVVA Console Domain Knowledge

## Business Context

AVVA is an **enterprise AI platform for complete test activities** (QA & QE). It provides:
- AI-powered test case generation
- Intelligent agent builder for test automation workflows
- Centralized test case management
- Cross-platform test execution tracking
- Real-time results dashboard and reporting

---

## Core Business Rules

### Agent Builder

**Rule 1: Agent Naming**
- Agent names must be unique within a project
- Min length: 3 characters
- Max length: 100 characters
- Allowed characters: alphanumeric, hyphens, underscores
- No special characters or spaces

**Rule 2: Agent Configuration**
- Every agent must have at least one tool assigned
- Tools are grouped by category: vscode, execute, read, agent, edit, search, web, etc.
- Tool restrictions can be defined per agent
- Model selection is mandatory (default: Claude Sonnet 4.6)

**Rule 3: Agent Lifecycle**
- States: Draft → Active → Archived
- Draft agents can be edited freely
- Active agents require version control for changes
- Archived agents are read-only

### Test Case Management

**Rule 4: Test Case Structure**
- Required fields: Title, Preconditions, Steps, Expected Results
- Optional fields: Priority, Tags, Linked Stories
- Steps must be numbered sequentially
- Each step has: Action + Expected Result

**Rule 5: Test Case Linking**
- Test cases can link to Jira stories (1:N relationship)
- Test cases can link to TestRail cases (1:1 relationship)
- Bidirectional sync supported for linked cases

**Rule 6: Test Case Status**
- Valid statuses: Not Started, In Progress, Passed, Failed, Blocked, Skipped
- Status transitions must follow workflow: Not Started → In Progress → (Passed|Failed|Blocked|Skipped)
- Cannot transition back from terminal states (Passed/Failed) without reset

### Test Execution

**Rule 7: Test Run Creation**
- Test runs require: Name, Test Cases, Environment, Browser/Platform
- Run names must be unique within a project
- Runs can be scheduled or executed immediately

**Rule 8: Result Reporting**
- Results must include: Status, Duration, Error Message (if failed), Screenshot (optional)
- Pass/Fail determination is final once posted
- Historical results are immutable — new runs create new entries

### AI Test Generation

**Rule 9: Story-to-Test Conversion**
- Input: User story with acceptance criteria
- Output: Playwright/MobileWright/WDIO test code + TestRail cases
- Minimum: 1 AC required for generation
- Maximum: 20 ACs per story (best practice)

**Rule 10: Code Quality Guardrails**
- Generated tests must follow POM pattern
- No hardcoded values — all from test data modules
- Every test has [Cxxx] TestRail case ID in title
- Selectors prioritize data-testid > ARIA > text > CSS

---

## Acceptance Criteria Patterns

### Pattern 1: Navigation Tests
```
Given the user is logged into AVVA Console
When the user clicks the "Launchpad" menu item
Then the Launchpad page loads with Agent Builder visible
And the page title is "AVVA - Launchpad"
```

### Pattern 2: CRUD Operations
```
Given the user is on the Agent Builder page
When the user creates a new agent named "Test Agent 1"
And assigns tools: [browser, playwright/*]
And selects model "Claude Sonnet 4.6"
And clicks "Save"
Then the agent is saved successfully
And appears in the agent list with status "Draft"
```

### Pattern 3: Form Validation
```
Given the user is creating a new test case
When the user leaves the "Title" field empty
And clicks "Save"
Then a validation error appears: "Title is required"
And the form does not submit
```

### Pattern 4: Integration Tests
```
Given a Jira story "AVVA-42" with 3 acceptance criteria
When the user clicks "Generate Tests" in AVVA
Then AVVA creates 3 TestRail cases linked to AVVA-42
And generates 1 Playwright spec file with 3 test cases
And each test title contains a [Cxxx] case ID
```

---

## Edge Cases

### Edge Case 1: Concurrent Edits
**Scenario:** Two users edit the same agent simultaneously  
**Expected:** Last write wins; warning shown to second user  
**Handling:** Lock agent during edit; show "Agent locked by [user]" message

### Edge Case 2: Token Expiry Mid-Session
**Scenario:** JWT token expires while user is editing an agent  
**Expected:** Graceful re-auth without data loss  
**Handling:** Auto-save draft to localStorage; prompt re-login; restore on return

### Edge Case 3: Large Test Run (1000+ cases)
**Scenario:** User creates a test run with 1000 test cases  
**Expected:** UI remains responsive; results stream incrementally  
**Handling:** Paginated results; WebSocket for real-time updates

### Edge Case 4: Invalid Jira/TestRail Credentials
**Scenario:** User links AVVA to Jira but credentials are invalid  
**Expected:** Clear error message; fallback to manual case creation  
**Handling:** Test connection on link; show error; allow skip/retry

---

## Business Constraints

### Constraint 1: Rate Limiting
- AI test generation: 100 requests/hour per user
- API calls: 1000 requests/hour per user
- File uploads: Max 10MB per file

### Constraint 2: Data Retention
- Test results: Retained for 90 days
- Draft agents: Auto-deleted after 30 days of inactivity
- Audit logs: Retained for 1 year

### Constraint 3: User Roles & Permissions
- **Viewer:** Read-only access to all resources
- **Tester:** Create/edit test cases, run tests, view results
- **Admin:** Full access including user management, project settings

---

## Validation Rules

### Agent Validation
- Name: Required, 3-100 chars, alphanumeric + hyphen/underscore only
- Tools: At least 1 tool required
- Model: Must be from supported list (Claude Sonnet 4.6, GPT-4, etc.)

### Test Case Validation
- Title: Required, max 200 chars
- Preconditions: Optional, max 500 chars
- Steps: At least 1 step required, each step max 1000 chars
- Expected Result: Required per step, max 1000 chars

### Test Run Validation
- Name: Required, unique per project
- Test Cases: At least 1 case required
- Environment: Required (chromium, firefox, webkit, mobile, etc.)

---

## Data Relationships

```
Project
  ├── Agents (1:N)
  ├── Test Cases (1:N)
  │   └── Linked to Jira Story (N:1)
  │   └── Linked to TestRail Case (1:1)
  └── Test Runs (1:N)
      └── Contains Test Cases (N:M)
      └── Results (1:N per case)
```

---

## Error Messages & Handling

### Authentication Errors
- `401 Unauthorized`: Token expired → prompt re-login
- `403 Forbidden`: Insufficient permissions → show access denied page

### Validation Errors
- `400 Bad Request`: Invalid input → highlight field, show specific error
- `409 Conflict`: Duplicate name → suggest alternative name

### Server Errors
- `500 Internal Server Error`: Show generic error, log to Sentry
- `503 Service Unavailable`: Show maintenance message, retry after delay

---

## Test Scenarios Priority

### P0 (Smoke) — Must pass every deployment
- User login via Microsoft SSO
- Navigate to Agent Builder page
- Create a new agent with minimal config
- Save agent successfully

### P1 (Regression) — Run nightly
- All CRUD operations on agents
- All CRUD operations on test cases
- Test case linking to Jira/TestRail
- Test run creation and execution
- Result posting from Playwright

### P2 (Extended) — Run weekly
- AI test generation from Jira stories
- Bulk test case import/export
- Advanced agent configuration (tool restrictions, hooks)
- Report generation and export

---

## Domain-Specific Terminology

| Term | Definition |
|------|------------|
| **Agent** | AI-powered automation bot configured for specific test workflows |
| **Tool** | Capability assigned to an agent (e.g., browser control, file editing) |
| **Launchpad** | Section of AVVA for building agents and generating tests |
| **Traceability Chain** | Jira story → TestRail case → AVVA case → Playwright spec |
| **Spec Title** | Playwright test title with embedded [Cxxx] TestRail case ID |
| **POM** | Page Object Model — design pattern for test code organization |

---

## Compliance & Security

- **Data Privacy:** All user data encrypted at rest and in transit
- **GDPR:** User data export/delete available on request
- **SOC 2:** AVVA platform is SOC 2 Type II certified
- **RBAC:** Role-based access control enforced at API and UI levels

---

## Future Enhancements (Roadmap)

- Visual regression testing integration
- Mobile app testing (iOS/Android) via AVVA agents
- API mocking and stubbing capabilities
- CI/CD pipeline templates for popular platforms (GitHub Actions, GitLab CI, Jenkins)
