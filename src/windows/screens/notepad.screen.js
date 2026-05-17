// === FILE: src/windows/screens/notepad.screen.js ===
/**
 * Screen object for Windows Notepad.
 *
 * Used as the reference / smoke-test screen.
 * Replace with your actual app screens following this same pattern.
 */

const WindowsBaseScreen = require('./windows-base.screen.js');
const locators = require('../locators/notepad.locators.js');

class NotepadScreen extends WindowsBaseScreen {
  /**
   * Type text into the Notepad editor.
   * @param {string} text
   */
  async typeInEditor(text) {
    await this.typeText(locators.EDITOR, text);
  }

  /**
   * Get the current text from the editor.
   * @returns {Promise<string>}
   */
  async getEditorText() {
    return this.getText(locators.EDITOR);
  }

  /**
   * Open the File menu.
   */
  async openFileMenu() {
    await this.click(locators.MENU_FILE);
  }

  /**
   * Click File → New to clear the editor.
   */
  async newFile() {
    await this.openFileMenu();
    await this.click(locators.FILE_NEW);
  }

  /**
   * Get the window title bar text.
   * @returns {Promise<string>}
   */
  async getWindowTitle() {
    return browser.getTitle();
  }
}

module.exports = new NotepadScreen();
