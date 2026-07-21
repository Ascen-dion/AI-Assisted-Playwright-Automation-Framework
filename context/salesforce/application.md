# Application Context - Salesforce Lightning

## Base Configuration

**Target URL**: https://as1783480463162.lightning.force.com/lightning/page/home
**Application Type**: Salesforce Lightning Experience (Lightning Web Components)
**Environment**: Production/Sandbox
**Domain**: Salesforce CRM Platform
**Instance ID**: as1783480463162

---

## Salesforce Lightning Structure

The Salesforce Lightning Experience is a modern, component-based user interface built on Lightning Web Components (LWC) and Aura components.

### Key Lightning Components

| Component Type | Purpose | Typical Locator Strategy |
|---|---|---|
| Lightning App Launcher | Navigate between apps | `button[title="App Launcher"]` |
| Lightning Navigation | Top navigation bar | `nav.slds-context-bar` |
| Lightning Record Page | View/edit records | `article.slds-card` |
| Lightning List View | Object list views | `table.slds-table` |
| Lightning Modal | Modal dialogs | `div.slds-modal` |
| Lightning Combobox | Dropdown selections | `lightning-combobox` |
| Lightning Button | Action buttons | `button.slds-button` |
| Lightning Input | Form fields | `lightning-input` |

---

## Navigation Patterns

### App Launcher Navigation
1. Click App Launcher icon (waffle icon)
2. Search for app or object
3. Click app/object name from results

### Tab Navigation
- **Standard Objects**: Home, Chatter, Accounts, Contacts, Leads, Opportunities, Cases, Reports, Dashboards
- **Custom Objects**: Defined by org configuration
- **Related Lists**: Displayed on record detail pages

### URL Patterns
- Home: `/lightning/page/home`
- Object List View: `/lightning/o/{ObjectName}/list`
- Record Detail: `/lightning/r/{ObjectName}/{RecordId}/view`
- Record Edit: `/lightning/r/{ObjectName}/{RecordId}/edit`
- New Record: `/lightning/o/{ObjectName}/new`

---

## Common Salesforce Objects

### Standard Objects
- **Account**: Companies/organizations
- **Contact**: People associated with accounts
- **Lead**: Potential customers
- **Opportunity**: Sales deals
- **Case**: Customer support tickets
- **Task**: To-do items
- **Event**: Calendar events

### Custom Objects
- Custom objects follow naming convention: `CustomObject__c`
- Custom fields follow naming convention: `CustomField__c`

---

## Lightning Component Locator Strategies

### Recommended Locator Hierarchy (most stable first)
1. **Data Attributes**: `[data-id="..."]`, `[data-target="..."]`
2. **ARIA Labels**: `[aria-label="..."]`, `[role="..."]`
3. **Title Attributes**: `[title="..."]`
4. **Class Combinations**: `.slds-button.slds-button--neutral`
5. **Component Names**: `lightning-input[field-name="FirstName"]`

### Shadow DOM Navigation
Lightning Web Components use Shadow DOM. Use:
- `page.locator('component').shadow().locator('inner-element')`
- Or pierce selector: `component >> inner-element`

### Dynamic IDs
Salesforce generates dynamic IDs. **AVOID** selectors like `#input-123`.
Instead, use stable attributes like `data-id`, `aria-label`, `title`, or `field-name`.

---

## Form Field Patterns

### Text Input
```js
await page.locator('lightning-input[field-name="FirstName"]').locator('input').fill('John');
```

### Combobox/Picklist
```js
await page.locator('lightning-combobox[data-id="Status"]').click();
await page.locator('lightning-base-combobox-item[data-value="New"]').click();
```

### Checkbox
```js
await page.locator('lightning-input[data-id="IsActive"]').locator('input[type="checkbox"]').check();
```

### Lookup Field
```js
await page.locator('input[title="Search Accounts"]').fill('Acme Corp');
await page.locator('lightning-base-combobox-item:has-text("Acme Corp")').click();
```

---

## Common Actions

### Create a New Record
1. Navigate to object list view
2. Click "New" button
3. Fill form fields
4. Click "Save" button
5. Verify success toast: `div.forceVisualMessageQueue`

### Edit an Existing Record
1. Navigate to record detail page
2. Click "Edit" button or click field inline (if enabled)
3. Modify fields
4. Click "Save"
5. Verify success toast

### Delete a Record
1. Navigate to record detail page
2. Click dropdown menu (☰) → Delete
3. Confirm in modal
4. Verify redirect to list view

### Search Records
1. Use global search (top nav bar)
2. Enter search term
3. Select result from dropdown

---

## Authentication

### Login Flow
1. Navigate to login URL: `https://{instance}.lightning.force.com/`
2. Fill username: `input#username`
3. Fill password: `input#password`
4. Click "Log In": `input#Login`
5. Handle MFA if required (SMS/Authenticator)
6. Wait for navigation to home page

### Session Management
- Save `storageState` after login for test reuse
- Session timeout: typically 2 hours (configurable per org)

---

## Error Handling

### Common Salesforce Errors
- **"This record is locked"**: Record is being edited by another user
- **"Insufficient privileges"**: User lacks permission
- **"Required field missing"**: Validation error on save
- **"Duplicate record detected"**: Duplicate rule triggered

### Toast Messages
- Success: `div.toastMessage.forceActionsText` (green)
- Error: `div.toastMessage.forceActionsText` (red)
- Warning: `div.toastMessage.forceActionsText` (yellow)

---

## Page Load Indicators

### Lightning Spinner
Wait for spinner to disappear:
```js
await page.waitForSelector('lightning-spinner', { state: 'detached' });
```

### Navigation Complete
Wait for specific element visibility:
```js
await page.waitForSelector('article.slds-card', { state: 'visible' });
```

---

## Test Data Considerations

### Dynamic Record Names
Use timestamps or UUIDs to avoid conflicts:
```js
const accountName = `Test Account ${Date.now()}`;
```

### Cleanup Strategy
- Delete test records after each test
- Use Salesforce REST API or Bulk API for bulk cleanup
- Or use UI delete action in `afterEach` hook

### Governor Limits
- Be mindful of Salesforce org limits (API calls, storage, etc.)
- Avoid creating excessive test data
