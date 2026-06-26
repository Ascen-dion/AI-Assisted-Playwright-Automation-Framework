/**
 * AVVA Agent Builder Smoke Tests
 * 
 * Tests critical paths for creating and configuring agents in AVVA Console.
 * 
 * Prerequisites:
 * - User authenticated via Microsoft SSO (storageState configured)
 * - AVVA_TOKEN set in .env
 * 
 * Run: npx playwright test src/web/tests/avva/avva-agent-builder-smoke.spec.js --grep "@smoke"
 */

const { test, expect } = require('../../../shared/fixtures');
const AgentBuilderPage = require('../../pages/avva/agent-builder.page');
const TD = require('../../../shared/data/test-data-avva');

test.describe('[UI] AVVA Agent Builder Smoke', { tag: ['@smoke', '@avva'] }, () => {
  let agentPage;

  test.beforeEach(async ({ page }) => {
    agentPage = new AgentBuilderPage(page);
    await agentPage.goto();
  });

  test('[C0] Test Case 1: Agent Builder page loads successfully', async ({ page }) => {
    // Assert — canvas and key elements are visible
    const isCanvasVisible = await agentPage.isCanvasVisible();
    expect(isCanvasVisible).toBe(true);
    
    await expect(page).toHaveTitle(TD.avva.pageTitles.agentBuilder, { timeout: 15000 });
    await expect(page).toHaveURL(TD.avva.urls.agentBuilder, { timeout: 15000 });
  });

  test('[C0] Test Case 2: User creates agent with minimal configuration', async ({ page }) => {
    // Arrange
    const agentName = TD.avva.testData.uniqueAgentName();

    // Act
    await agentPage.enterAgentName(agentName);
    await agentPage.selectTool('browser');
    await agentPage.clickSave();

    // Assert
    const successMsg = await agentPage.getSuccessMessage();
    expect(successMsg).toContain(TD.avva.messages.agentSavedSuccess);
    
    // Verify redirect to agent detail page
    await expect(page).toHaveURL(TD.avva.urlPatterns.agentDetail, { timeout: 15000 });
  });

  test('[C0] Test Case 3: Validation error shown for empty agent name', async ({ page }) => {
    // Act — try to save without entering name
    await agentPage.enterAgentName(''); // Explicitly clear
    await agentPage.clickSave();

    // Assert
    const errorMsg = await agentPage.getValidationError('agent-name');
    expect(errorMsg).toContain(TD.avva.messages.validationErrorName);
  });

  test('[C0] Test Case 4: User selects multiple tools successfully', async ({ page }) => {
    // Arrange
    const agentName = TD.avva.testData.uniqueAgentName();
    const tools = ['browser', 'vscode-runCommand', 'edit-createFile'];

    // Act
    await agentPage.enterAgentName(agentName);
    
    for (const tool of tools) {
      await agentPage.selectTool(tool);
    }

    // Assert — verify all tools are checked
    for (const tool of tools) {
      const isSelected = await agentPage.isToolSelected(tool);
      expect(isSelected).toBe(true);
    }
  });

  test('[C0] Test Case 5: User selects model from dropdown', async ({ page }) => {
    // Arrange
    const agentName = TD.avva.testData.uniqueAgentName();
    const model = TD.avva.agent.defaultModel;

    // Act
    await agentPage.enterAgentName(agentName);
    await agentPage.selectModel(model);
    await agentPage.selectTool('browser');
    await agentPage.clickSave();

    // Assert
    const successMsg = await agentPage.getSuccessMessage();
    expect(successMsg).toContain(TD.avva.messages.agentSavedSuccess);
  });
});

test.describe('[UI] AVVA Agent Builder Validation', { tag: ['@regression', '@avva'] }, () => {
  let agentPage;

  test.beforeEach(async ({ page }) => {
    agentPage = new AgentBuilderPage(page);
    await agentPage.goto();
  });

  test('[C0] Test Case 6: Agent name too short shows validation error', async ({ page }) => {
    // Act
    await agentPage.enterAgentName('AB'); // Only 2 chars (min is 3)
    await agentPage.clickSave();

    // Assert
    const errorMsg = await agentPage.getValidationError('agent-name');
    expect(errorMsg).toContain(TD.avva.messages.validationErrorNameLength);
  });

  test('[C0] Test Case 7: Agent name too long shows validation error', async ({ page }) => {
    // Act
    const longName = 'A'.repeat(101); // Max is 100 chars
    await agentPage.enterAgentName(longName);
    await agentPage.clickSave();

    // Assert
    const errorMsg = await agentPage.getValidationError('agent-name');
    expect(errorMsg).toContain(TD.avva.messages.validationErrorNameLength);
  });

  test('[C0] Test Case 8: No tools selected shows validation error', async ({ page }) => {
    // Act
    const agentName = TD.avva.testData.uniqueAgentName();
    await agentPage.enterAgentName(agentName);
    // Do NOT select any tools
    await agentPage.clickSave();

    // Assert
    const errorMsg = await agentPage.getErrorMessage();
    expect(errorMsg).toContain(TD.avva.messages.validationErrorTools);
  });
});

/**
 * NOTE: These tests use [C0] placeholder IDs.
 * 
 * To assign real TestRail case IDs:
 * 1. Create Jira story with acceptance criteria
 * 2. Run @avva-automation-agent with the story key
 * 3. Agent will create TestRail cases and update these [C0] IDs
 * 
 * Example: @avva-automation-agent Generate tests for AVVA-42
 */
