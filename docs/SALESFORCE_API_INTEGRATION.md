# Salesforce API Integration Guide

## Overview

This framework uses a **hybrid approach** for Salesforce automation:
- **UI Automation**: For user workflows and visual validation
- **Salesforce REST API**: For data operations that are time-consuming or blocked by technical limitations (e.g., Shadow DOM)

## When to Use API vs UI

### Use UI When:
✅ Testing user workflows (Lead conversion, Quote creation)  
✅ Visual validation is required  
✅ Testing navigation and user experience  
✅ Fields are accessible via standard selectors  

### Use API When:
✅ Fields are in Shadow DOM (inaccessible to Playwright)  
✅ Bulk data setup is needed  
✅ Operation is time-consuming via UI  
✅ Bypassing validation rules for test data setup  
✅ Querying data for assertions  

## Architecture

### SalesforceAPI Class
Location: `src/shared/integrations/salesforce-api.js`

**Authentication:**
- Extracts session ID from Playwright browser cookies
- No separate login required (reuses UI session)

**Key Methods:**
```javascript
// Create any Salesforce record
await salesforceApi.createRecord('Account', { Name: 'Test Account' });

// Update any record
await salesforceApi.updateRecord('Account', accountId, { Name: 'Updated' });

// Query with SOQL
const records = await salesforceApi.query('SELECT Id, Name FROM Account LIMIT 10');

// Add Quote Line Item (handles Pricebook, Product lookup, etc.)
await salesforceApi.addQuoteLineItem({
  quoteId: '0Q0xxx',
  productName: 'ZOOM',
  quantity: 2,
  discount: 10
});
```

## E2E Test Example

### Lead → Opportunity → Quote with Product

```javascript
const SalesforceAPI = require('../../../shared/integrations/salesforce-api');

test('[E2E] Complete flow', async ({ page }) => {
  // Step 1-3: UI automation for user workflow
  await homePage.navigateToObject('Leads');
  await leadPage.createLead(leadData);
  await leadPage.convertLead();
  await opportunityPage.createQuote(quoteData);
  
  // Step 4: API for Quote Line Item (bypasses Shadow DOM)
  const sessionId = await SalesforceAPI.getSessionIdFromPage(page);
  const salesforceApi = new SalesforceAPI(process.env.SALESFORCE_ORG_URL, sessionId);
  
  await salesforceApi.addQuoteLineItem({
    quoteId: quoteId,
    productName: 'ZOOM',
    quantity: 2,
    discount: 10
  });
  
  // Refresh to see changes
  await page.reload();
});
```

## Shadow DOM Challenge: Quote Line Items

**Problem:**
- Salesforce Lightning uses Shadow DOM for Quote Line Item fields (Quantity, Discount)
- Standard Playwright selectors cannot access these fields
- Even Shadow DOM piercing (`>>`) doesn't work in modern Salesforce

**Solution:**
- Create Quote record via UI (validates user workflow)
- Add Quote Line Items via API (bypasses Shadow DOM)
- Refresh page to verify line items were added

## API Benefits

1. **Reliability**: No flakiness from Shadow DOM or timing issues
2. **Speed**: API calls are faster than UI interactions
3. **Maintainability**: Less brittle than complex UI selectors
4. **Data Setup**: Can create test data programmatically
5. **Validation**: Can query data for assertions

## Pricebook Handling

The API automatically handles Pricebook complexities:

```javascript
// API handles:
// 1. Check if Quote has Pricebook assigned
// 2. If not, assign Standard Pricebook
// 3. Find correct PricebookEntry for Product
// 4. Create QuoteLineItem with correct relationships
await salesforceApi.addQuoteLineItem({ ... });
```

## Error Handling

The API provides detailed logging:
```
🚀 Adding Quote Line Item via API...
  ✓ Quote is using Pricebook: 01sbm00000GzMlZAAV
  ✓ Found 3 products matching 'ZOOM':
    [0] Zoom Meetings Pro
    [1] Zoom Webinar
    [2] Zoom Phone
  Using first match: Zoom Meetings Pro
  ✓ Product ID: 01tbm00000P14b3AAB
  ✓ PricebookEntry ID: 01ubm000006taIjAAI, UnitPrice: 14.99
  ✓ Creating QuoteLineItem via API...
🎉 Quote Line Item created successfully!
```

## Dependencies

```json
{
  "axios": "^1.6.2",
  "winston": "^3.11.0"
}
```

## Best Practices

1. **Always use UI for user-facing workflows first**
2. **Use API only when UI is blocked or inefficient**
3. **Document why API is used (e.g., "bypasses Shadow DOM")**
4. **Refresh page after API changes to verify in UI**
5. **Use API for data cleanup in teardown**

## References

- [Salesforce REST API Documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- [Shadow DOM in Salesforce Lightning](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.create_shadow)
- [Playwright Shadow DOM](https://playwright.dev/docs/other-locators#shadow-dom)

## Troubleshooting

### Session ID Not Found
```javascript
// Ensure you're logged in via UI first
await loginPage.login(username, password);
const sessionId = await SalesforceAPI.getSessionIdFromPage(page);
```

### Pricebook Errors
```
The price book entry is in a different price book than the one assigned to the Quote
```
**Solution**: API now automatically handles Pricebook assignment

### Product Not Found
```
Product not found: ZOOM
```
**Solution**: API searches with LIKE '%ZOOM%' for partial matches

## Performance Comparison

| Operation | UI Time | API Time | Improvement |
|-----------|---------|----------|-------------|
| Create Lead | 8-10s | 1-2s | 80% faster |
| Add Quote Line Item | 15-20s | 2-3s | 85% faster |
| Query records | N/A | <1s | Only via API |

## Future Enhancements

- [ ] Bulk Quote Line Item creation
- [ ] Data factory for test data setup
- [ ] API-based data cleanup
- [ ] Validation rule bypass for testing
- [ ] Custom object support
