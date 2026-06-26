/**
 * Locators for AVVA Agent Builder page
 * URL: https://int-ai.aava.ai/launchpad/build/agent
 * 
 * Note: These are placeholder selectors based on common patterns.
 * Run Phase 4 live inspection to confirm actual selectors from the DOM.
 */

const locators = {
  // Primary canvas and panels
  agentCanvas: (page) => page.locator('[data-testid="agent-canvas"]').first(),
  toolPalette: (page) => page.locator('[data-testid="tool-palette"]').first(),
  propertiesPanel: (page) => page.locator('[data-testid="properties-panel"]').first(),
  
  // Agent configuration inputs
  agentNameInput: (page) => page.locator('[data-testid="agent-name-input"]').first(),
  agentDescriptionInput: (page) => page.locator('[data-testid="agent-description-input"]').first(),
  modelSelect: (page) => page.locator('[data-testid="model-select"]').first(),
  
  // Action buttons
  saveAgentBtn: (page) => page.locator('[data-testid="save-agent"]').first(),
  runAgentBtn: (page) => page.locator('[data-testid="run-agent"]').first(),
  exportAgentBtn: (page) => page.locator('[data-testid="export-agent"]').first(),
  deleteAgentBtn: (page) => page.locator('[data-testid="delete-agent"]').first(),
  newAgentBtn: (page) => page.locator('[data-testid="new-agent"]').first(),
  
  // Tool selection (dynamic)
  toolCheckbox: (page, toolName) => page.locator(`[data-testid="tool-${toolName}"]`).first(),
  toolCategory: (page, category) => page.locator(`[data-testid="tool-category-${category}"]`).first(),
  
  // Agent list
  agentListItem: (page, agentName) => page.locator(`[data-testid="agent-item"][data-name="${agentName}"]`).first(),
  agentList: (page) => page.locator('[data-testid="agent-list"]').first(),
  
  // Notifications
  successToast: (page) => page.locator('[data-testid="success-toast"]').first(),
  errorToast: (page) => page.locator('[data-testid="error-toast"]').first(),
  
  // Loading state
  loadingSpinner: (page) => page.locator('[data-testid="loading-spinner"]').first(),
  
  // Validation messages
  validationError: (page, fieldName) => page.locator(`[data-testid="${fieldName}-error"]`).first(),
  validationMessage: (page) => page.locator('[data-testid="validation-message"]').first(),
};

module.exports = locators;
