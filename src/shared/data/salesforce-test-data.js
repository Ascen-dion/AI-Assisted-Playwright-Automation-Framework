/**
 * Salesforce Test Data Module
 * 
 * This module contains all hardcoded URLs, assertion values, and Salesforce-specific test data.
 * All test specs must import test data from this module — never hardcode values in specs.
 */

const salesforceTestData = {
  /**
   * Salesforce URLs
   */
  urls: {
    // Base URL for Salesforce instance
    base: 'https://as1783480463162.lightning.force.com',
    
    // Login page
    login: 'https://as1783480463162.lightning.force.com/login',
    
    // Home page
    home: 'https://as1783480463162.lightning.force.com/lightning/page/home',
    
    // Object list views
    accounts: 'https://as1783480463162.lightning.force.com/lightning/o/Account/list',
    contacts: 'https://as1783480463162.lightning.force.com/lightning/o/Contact/list',
    leads: 'https://as1783480463162.lightning.force.com/lightning/o/Lead/list',
    opportunities: 'https://as1783480463162.lightning.force.com/lightning/o/Opportunity/list',
    cases: 'https://as1783480463162.lightning.force.com/lightning/o/Case/list',
  },

  /**
   * URL patterns for assertions (regex)
   */
  urlPatterns: {
    home: /.*\/lightning\/page\/home/,
    accountList: /.*\/lightning\/o\/Account\/list/,
    accountDetail: /.*\/lightning\/r\/Account\/.*\/view/,
    contactList: /.*\/lightning\/o\/Contact\/list/,
    contactDetail: /.*\/lightning\/r\/Contact\/.*\/view/,
    leadList: /.*\/lightning\/o\/Lead\/list/,
    leadDetail: /.*\/lightning\/r\/Lead\/.*\/view/,
    opportunityList: /.*\/lightning\/o\/Opportunity\/list/,
    opportunityDetail: /.*\/lightning\/r\/Opportunity\/.*\/view/,
    caseList: /.*\/lightning\/o\/Case\/list/,
    caseDetail: /.*\/lightning\/r\/Case\/.*\/view/,
  },

  /**
   * Salesforce standard objects
   */
  objects: {
    account: 'Account',
    contact: 'Contact',
    lead: 'Lead',
    opportunity: 'Opportunity',
    case: 'Case',
    task: 'Task',
    event: 'Event',
    campaign: 'Campaign',
  },

  /**
   * Common field names
   */
  fields: {
    // Account fields
    accountName: 'Name',
    accountType: 'Type',
    accountIndustry: 'Industry',
    accountPhone: 'Phone',
    accountWebsite: 'Website',
    
    // Contact fields
    firstName: 'FirstName',
    lastName: 'LastName',
    contactEmail: 'Email',
    contactPhone: 'Phone',
    contactTitle: 'Title',
    
    // Lead fields
    leadFirstName: 'FirstName',
    leadLastName: 'LastName',
    leadCompany: 'Company',
    leadEmail: 'Email',
    leadStatus: 'Status',
    
    // Opportunity fields
    opportunityName: 'Name',
    opportunityAmount: 'Amount',
    opportunityCloseDate: 'CloseDate',
    opportunityStage: 'StageName',
    
    // Case fields
    caseSubject: 'Subject',
    caseStatus: 'Status',
    casePriority: 'Priority',
    caseOrigin: 'Origin',
  },

  /**
   * Picklist values for Status fields
   */
  statuses: {
    // Lead statuses
    leadOpen: 'Open - Not Contacted',
    leadWorking: 'Working - Contacted',
    leadQualified: 'Qualified',
    
    // Case statuses
    caseNew: 'New',
    caseWorking: 'Working',
    caseClosed: 'Closed',
    
    // Task statuses
    taskNotStarted: 'Not Started',
    taskInProgress: 'In Progress',
    taskCompleted: 'Completed',
  },

  /**
   * Opportunity stage values
   */
  stages: {
    prospecting: 'Prospecting',
    qualification: 'Qualification',
    needsAnalysis: 'Needs Analysis',
    valueProposition: 'Value Proposition',
    proposalQuote: 'Proposal/Price Quote',
    negotiationReview: 'Negotiation/Review',
    closedWon: 'Closed Won',
    closedLost: 'Closed Lost',
  },

  /**
   * Toast message patterns
   */
  toastMessages: {
    accountCreated: 'Account was created',
    accountUpdated: 'Account was updated',
    accountDeleted: 'Account was deleted',
    contactCreated: 'Contact was created',
    contactUpdated: 'Contact was updated',
    contactDeleted: 'Contact was deleted',
    leadCreated: 'Lead was created',
    leadConverted: 'Lead was converted',
    opportunityCreated: 'Opportunity was created',
    caseCreated: 'Case was created',
  },

  /**
   * Record type values (customize based on your org)
   */
  recordTypes: {
    // Add your org-specific record types here
  },
};

module.exports = salesforceTestData;
