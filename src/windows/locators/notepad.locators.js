// === FILE: src/windows/locators/notepad.locators.js ===
/**
 * Locators for Windows Notepad — used as a working smoke-test target.
 *
 * To find AutomationIds for your own app:
 *   - Use Accessibility Insights for Windows (free, from Microsoft)
 *   - Or use inspect.exe from the Windows SDK
 *   - Or use the WDIO REPL: npx wdio repl windows --config wdio.windows.config.js
 */

module.exports = {
  // Main editor text area
  EDITOR:      '~15',               // AutomationId '15' (Notepad text editor)

  // Menu bar items
  MENU_FILE:   '~MenuBar > ~File',
  MENU_EDIT:   '~MenuBar > ~Edit',
  MENU_FORMAT: '~MenuBar > ~Format',

  // File menu items
  FILE_NEW:    '~New',
  FILE_SAVE:   '~Save',
  FILE_EXIT:   '~Exit',

  // Title bar (used to verify the window title)
  TITLE_BAR:   '.TitleBar',
};
