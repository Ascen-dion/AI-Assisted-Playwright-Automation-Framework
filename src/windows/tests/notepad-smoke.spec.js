// === FILE: src/windows/tests/notepad-smoke.spec.js ===
/**
 * Notepad Smoke Test — Windows App Automation
 *
 * A self-contained smoke test that:
 *   1. Launches Notepad (via wdio.windows.config.js capability)
 *   2. Types text into the editor
 *   3. Asserts the text was entered correctly
 *   4. Verifies the window title
 *
 * Run:
 *   WINDOWS_APP="C:\\Windows\\System32\\notepad.exe" npm run test:windows
 *
 * Prerequisites:
 *   - WinAppDriver running, OR Appium + appium-windows-driver installed
 *   - Developer Mode enabled on Windows 10/11
 */

const notepad = require('../screens/notepad.screen.js');

describe('Notepad Smoke Tests', () => {
  it('[TC-WIN-001] should launch Notepad and display the editor', async () => {
    const isVisible = await notepad.isVisible('~15');
    expect(isVisible).toBe(true);
  });

  it('[TC-WIN-002] should type text into the editor and retrieve it', async () => {
    const testText = 'Hello from AI-Assisted Playwright Framework!';
    await notepad.typeInEditor(testText);
    const editorContent = await notepad.getEditorText();
    expect(editorContent).toContain(testText);
  });

  it('[TC-WIN-003] should show correct window title', async () => {
    const title = await notepad.getWindowTitle();
    expect(title).toContain('Notepad');
  });

  it('[TC-WIN-004] should open File menu without error', async () => {
    await expect(notepad.openFileMenu()).resolves.not.toThrow();
  });
});
