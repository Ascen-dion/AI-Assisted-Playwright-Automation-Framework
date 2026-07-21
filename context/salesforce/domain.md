# Domain Knowledge — Salesforce CRM

## Business Domain
Salesforce is the world's leading Customer Relationship Management (CRM) platform. It provides cloud-based software for sales, service, marketing, analytics, and more. The Lightning Experience is the modern user interface for Salesforce.

---

## Core Business Concepts

### Sales Cloud

#### Leads
- **Definition**: Potential customers who have expressed interest
- **Lifecycle**: Lead → Converted to Account/Contact/Opportunity
- **Key Fields**: Name, Company, Email, Phone, Lead Status, Lead Source
- **Conversion**: Convert button creates Account, Contact, and Opportunity records

#### Accounts
- **Definition**: Companies or organizations
- **Types**: 
  - **B2B**: Business accounts (companies)
  - **B2C**: Person accounts (individuals)
- **Key Fields**: Account Name, Type, Industry, Annual Revenue, Phone, Website
- **Relationships**: Parent-child hierarchies supported

#### Contacts
- **Definition**: People associated with accounts
- **Key Fields**: First Name, Last Name, Email, Phone, Title, Account (lookup)
- **Relationships**: Many contacts can be associated with one account

#### Opportunities
- **Definition**: Sales deals or revenue-generating possibilities
- **Key Fields**: Opportunity Name, Amount, Close Date, Stage, Probability, Account (lookup)
- **Sales Stages**: Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost
- **Pipeline Management**: Track progress through sales stages

---

### Service Cloud

#### Cases
- **Definition**: Customer support tickets or issues
- **Key Fields**: Subject, Description, Status, Priority, Case Origin, Contact (lookup), Account (lookup)
- **Statuses**: New → Working → Escalated → Closed
- **Case Escalation**: Automatically escalate cases based on rules

#### Knowledge Base
- **Definition**: Articles for self-service support
- **Types**: How-To, FAQ, Troubleshooting
- **Visibility**: Public, Internal, or Partner

---

### Activities

#### Tasks
- **Definition**: To-do items or action items
- **Key Fields**: Subject, Due Date, Status, Priority, Related To (lookup)
- **Statuses**: Not Started → In Progress → Completed → Deferred

#### Events
- **Definition**: Calendar appointments or meetings
- **Key Fields**: Subject, Start Date/Time, End Date/Time, Related To (lookup)
- **Invitees**: Can invite contacts or users

---

## Key Salesforce Concepts

### Record Types
- Different page layouts and picklist values for same object
- Example: "Enterprise Opportunity" vs. "SMB Opportunity"

### Page Layouts
- Define which fields appear on record detail/edit pages
- Controlled by profile and record type

### Profiles & Permissions
- **Profile**: Defines baseline permissions (Standard User, System Administrator)
- **Permission Sets**: Grant additional permissions beyond profile

### Validation Rules
- Enforce data quality (e.g., "Close Date cannot be in the past")
- Display error message on save

### Workflow & Process Automation
- **Workflow Rules**: Simple if-then automation
- **Process Builder**: Visual automation tool
- **Flow**: Advanced automation and guided processes
- **Apex Triggers**: Code-based automation

### Approval Processes
- Multi-step approval workflows (e.g., discount approval for opportunities)

---

## Customer Journey & Use Cases

### Sales Journey
1. **Lead Capture**: Lead created from web form or manual entry
2. **Lead Qualification**: Sales rep qualifies lead
3. **Lead Conversion**: Convert lead to Account, Contact, Opportunity
4. **Opportunity Management**: Move opportunity through sales stages
5. **Close Deal**: Mark opportunity as "Closed Won"
6. **Post-Sale**: Create tasks for onboarding, contracts, etc.

### Service Journey
1. **Case Creation**: Customer submits case via email, web, phone, or chat
2. **Case Assignment**: Case routed to appropriate queue or agent
3. **Case Resolution**: Agent works case, communicates with customer
4. **Case Closure**: Agent closes case with resolution notes
5. **Follow-Up**: Survey sent to customer for feedback

### Marketing Journey
1. **Campaign Creation**: Marketing creates campaign
2. **Lead Generation**: Leads associated with campaign
3. **Campaign Response**: Track which leads converted
4. **ROI Analysis**: Report on campaign effectiveness

---

## Business Validation Points

### Data Integrity
- **Required Fields**: Ensure required fields are filled on save
- **Field Validation**: Validate email format, phone format, etc.
- **Duplicate Detection**: Check for duplicate leads, accounts, contacts
- **Referential Integrity**: Ensure lookups reference valid records

### Navigation Validation
- **App Launcher**: All apps and objects accessible
- **Tab Navigation**: Standard and custom tabs load correctly
- **Related Lists**: Related records display on parent record
- **List Views**: Custom list views filter and display correctly

### Functional Validation
- **CRUD Operations**: Create, Read, Update, Delete records
- **Search**: Global search returns expected results
- **Reports & Dashboards**: Visualizations render correctly
- **Chatter**: Social collaboration features work
- **Files**: Attach, view, download files

---

## Test Data Rules

### Naming Conventions
- Use dynamic names to avoid conflicts: `Test Account ${Date.now()}`
- Prefix test records: `[TEST]` or `QA-`

### Test Data Sources
- All URLs, object names, and assertion values must come from `src/shared/data/salesforce-test-data.js`
- Never hardcode Salesforce URLs or record IDs in test specs

### Cleanup Strategy
- Delete test records after each test to avoid clutter
- Use Salesforce APIs for bulk cleanup in CI/CD pipelines

---

## Edge Cases & Considerations

### Lightning Experience Specifics
- **Dynamic IDs**: Never rely on element IDs — use stable attributes
- **Shadow DOM**: Lightning Web Components use Shadow DOM — requires pierce selectors
- **Lazy Loading**: Components load dynamically — always wait for visibility
- **Toast Notifications**: Success/error messages appear briefly — capture immediately

### Session & Authentication
- **Session Timeout**: 2 hours default (configurable)
- **Multi-Factor Authentication**: Handle MFA prompts gracefully
- **IP Restrictions**: Some orgs restrict access by IP range
- **Profile Permissions**: Tests may fail due to insufficient permissions

### Data Limits
- **Storage Limits**: Be mindful of org storage limits
- **API Limits**: Salesforce enforces API call limits per 24 hours
- **Governor Limits**: Apex code has execution limits

---

## Glossary

- **Org**: Salesforce organization (instance)
- **Sandbox**: Copy of production org for testing
- **Lightning**: Modern Salesforce UI framework
- **Classic**: Legacy Salesforce UI (being phased out)
- **Trailhead**: Salesforce's learning platform
- **Apex**: Salesforce's proprietary programming language
- **Visualforce**: Legacy page framework (being replaced by Lightning)
- **SLDS**: Salesforce Lightning Design System (CSS framework)
- **LWC**: Lightning Web Components (modern component framework)
- **Aura**: Legacy Lightning component framework
