/**
 * Page Object for AVVA Agent Builder
 * URL: https://int-ai.aava.ai/launchpad/build/agent
 */

const AVVABasePage = require('./base.page');
const loc = require('./locators/agent-builder.locators');

const URL = 'https://int-ai.aava.ai/launchpad/build/agent';

class AgentBuilderPage extends AVVABasePage {
  /**
   * Navigate to Agent Builder page
   */
  async goto() {
    await super.goto(URL);
    await loc.agentCanvas(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Check if agent canvas is visible
   * @returns {Promise<boolean>}
   */
  async isCanvasVisible() {
    try {
      await loc.agentCanvas(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.agentCanvas(this.page).isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Enter agent name
   * @param {string} name - Agent name
   */
  async enterAgentName(name) {
    await loc.agentNameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.agentNameInput(this.page).clear();
    await loc.agentNameInput(this.page).fill(name);
  }

  /**
   * Enter agent description
   * @param {string} description - Agent description
   */
  async enterAgentDescription(description) {
    await loc.agentDescriptionInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.agentDescriptionInput(this.page).clear();
    await loc.agentDescriptionInput(this.page).fill(description);
  }

  /**
   * Select model from dropdown
   * @param {string} modelName - Model name (e.g., "Claude Sonnet 4.6")
   */
  async selectModel(modelName) {
    await loc.modelSelect(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.modelSelect(this.page).selectOption({ label: modelName });
  }

  /**
   * Select a tool by name
   * @param {string} toolName - Tool identifier (e.g., 'browser', 'vscode-runCommand')
   */
  async selectTool(toolName) {
    await loc.toolCheckbox(this.page, toolName).waitFor({ state: 'visible', timeout: 15000 });
    await loc.toolCheckbox(this.page, toolName).check();
  }

  /**
   * Deselect a tool by name
   * @param {string} toolName - Tool identifier
   */
  async deselectTool(toolName) {
    await loc.toolCheckbox(this.page, toolName).waitFor({ state: 'visible', timeout: 15000 });
    await loc.toolCheckbox(this.page, toolName).uncheck();
  }

  /**
   * Click Save Agent button
   */
  async clickSave() {
    await loc.saveAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.saveAgentBtn(this.page).click();
    await this.waitForLoaderToDisappear();
  }

  /**
   * Click Run Agent button
   */
  async clickRun() {
    await loc.runAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.runAgentBtn(this.page).click();
  }

  /**
   * Click New Agent button
   */
  async clickNewAgent() {
    await loc.newAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.newAgentBtn(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Click Delete Agent button
   */
  async clickDelete() {
    await loc.deleteAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.deleteAgentBtn(this.page).click();
  }

  /**
   * Get success toast message after save
   * @returns {Promise<string>}
   */
  async getSuccessMessage() {
    await loc.successToast(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.successToast(this.page).textContent();
  }

  /**
   * Get error toast message
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await loc.errorToast(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.errorToast(this.page).textContent();
  }

  /**
   * Get validation error for a specific field
   * @param {string} fieldName - Field name (e.g., 'agent-name')
   * @returns {Promise<string>}
   */
  async getValidationError(fieldName) {
    await loc.validationError(this.page, fieldName).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.validationError(this.page, fieldName).textContent();
  }

  /**
   * Check if tool is selected
   * @param {string} toolName - Tool identifier
   * @returns {Promise<boolean>}
   */
  async isToolSelected(toolName) {
    await loc.toolCheckbox(this.page, toolName).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.toolCheckbox(this.page, toolName).isChecked();
  }

  /**
   * Get current agent name value
   * @returns {Promise<string>}
   */
  async getAgentName() {
    await loc.agentNameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.agentNameInput(this.page).inputValue();
  }

  /**
   * Check if Save button is enabled
   * @returns {Promise<boolean>}
   */
  async isSaveButtonEnabled() {
    await loc.saveAgentBtn(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.saveAgentBtn(this.page).isEnabled();
  }
}

module.exports = AgentBuilderPage;
