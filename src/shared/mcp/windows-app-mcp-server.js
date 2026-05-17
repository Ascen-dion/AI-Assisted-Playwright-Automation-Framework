#!/usr/bin/env node
// === FILE: src/shared/mcp/windows-app-mcp-server.js ===
/**
 * Windows App MCP Server
 *
 * An MCP (Model Context Protocol) server that connects to your running
 * Appium + WinAppDriver session and exposes element-discovery tools
 * — the Windows equivalent of @mobilenext/mobile-mcp.
 *
 * Tools exposed:
 *   windows_take_screenshot       — capture the current screen
 *   windows_list_elements         — dump all visible UI elements with locators
 *   windows_find_element          — find elements by AutomationId, name, or class
 *   windows_get_element_tree      — return the element hierarchy as a tree
 *   windows_click                 — click a located element
 *   windows_type_text             — type text into a located element
 *   windows_launch_app            — launch a Windows app and start a session
 *   windows_close_session         — close the current Appium session
 *
 * Usage (stdio, used by VS Code MCP):
 *   node src/shared/mcp/windows-app-mcp-server.js
 *
 * Or via the VS Code mcp.json entry (see .vscode/mcp.json).
 *
 * Prerequisites:
 *   - Appium running on port 4723 (npm run appium:start)
 *   - WinAppDriver installed
 *   - A Windows app session already launched OR use windows_launch_app tool
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// ─── MCP Protocol constants ───────────────────────────────────────────────────
const JSONRPC_VERSION = '2.0';
const MCP_PROTOCOL_VERSION = '2024-11-05';

// ─── Appium / WinAppDriver config ─────────────────────────────────────────────
const APPIUM_HOST = process.env.WINDOWS_APPIUM_HOST || '127.0.0.1';
const APPIUM_PORT = parseInt(process.env.WINDOWS_APPIUM_PORT || '4723', 10);
const SCREENSHOTS_DIR = path.resolve(__dirname, '../../../test-results/windows/screenshots');

let currentSessionId = null;

// ─── Appium HTTP helpers ───────────────────────────────────────────────────────

function appiumRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: APPIUM_HOST,
      port: APPIUM_PORT,
      path: urlPath,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve({ value: raw });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function ensureSession() {
  if (!currentSessionId) {
    throw new Error(
      'No active Windows app session. Use the windows_launch_app tool first, ' +
      'or set WINDOWS_APP env var and start a session manually.'
    );
  }
}

// ─── Tool implementations ─────────────────────────────────────────────────────

/**
 * Launch a Windows application and create an Appium session.
 */
async function launchApp({ app, appArguments }) {
  const capabilities = {
    platformName: 'Windows',
    'appium:automationName': 'Windows',
    'appium:app': app || process.env.WINDOWS_APP || 'Root',
    ...(appArguments ? { 'appium:appArguments': appArguments } : {}),
    'appium:ms:waitForAppLaunch': 10,
  };

  const response = await appiumRequest('POST', '/session', {
    capabilities: { alwaysMatch: capabilities },
  });

  if (response.value && response.value.sessionId) {
    currentSessionId = response.value.sessionId;
    return {
      success: true,
      sessionId: currentSessionId,
      message: `Session started for app: ${app || 'Root'}`,
      capabilities: response.value.capabilities,
    };
  }

  throw new Error(
    `Failed to create session: ${JSON.stringify(response.value?.message || response)}`
  );
}

/**
 * Take a screenshot of the current Windows app.
 */
async function takeScreenshot({ outputPath }) {
  await ensureSession();

  const response = await appiumRequest(
    'GET',
    `/session/${currentSessionId}/screenshot`
  );

  const base64 = response.value;
  if (!base64) throw new Error('No screenshot data returned from Appium');

  // Save to file if requested
  if (outputPath || SCREENSHOTS_DIR) {
    const savePath = outputPath || path.join(
      SCREENSHOTS_DIR,
      `screenshot-${Date.now()}.png`
    );
    fs.mkdirSync(path.dirname(savePath), { recursive: true });
    fs.writeFileSync(savePath, Buffer.from(base64, 'base64'));
    return { saved: savePath, base64 };
  }

  return { base64 };
}

/**
 * List all visible UI elements, formatted as locator candidates.
 */
async function listElements({ maxDepth = 5 }) {
  await ensureSession();

  // Find all elements using a broad XPath
  const response = await appiumRequest(
    'POST',
    `/session/${currentSessionId}/elements`,
    { using: 'xpath', value: '//*' }
  );

  const elements = response.value || [];
  const results = [];

  for (const el of elements.slice(0, 200)) { // cap at 200 to avoid overload
    try {
      const [nameRes, classRes, tagRes, autoIdRes, enabledRes, displayedRes] =
        await Promise.all([
          appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/name`),
          appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/attribute/ClassName`),
          appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/attribute/LocalizedControlType`),
          appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/attribute/AutomationId`),
          appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/enabled`),
          appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/displayed`),
        ]);

      const name = nameRes.value || '';
      const className = classRes.value || '';
      const controlType = tagRes.value || '';
      const automationId = autoIdRes.value || '';
      const enabled = enabledRes.value;
      const displayed = displayedRes.value;

      if (!displayed) continue; // skip hidden elements

      results.push({
        elementId: el.ELEMENT,
        automationId,
        name,
        className,
        controlType,
        enabled,
        // Recommended locators (best first)
        locators: {
          byAutomationId: automationId ? `~${automationId}` : null,
          byName: name ? `~${name}` : null,
          byClassName: className ? `.${className}` : null,
          byXPath: automationId
            ? `//*[@AutomationId="${automationId}"]`
            : name
            ? `//*[@Name="${name}"]`
            : `//*[@ClassName="${className}"]`,
        },
      });
    } catch {
      // skip elements that error during attribute fetch
    }
  }

  return {
    totalFound: elements.length,
    displayed: results.length,
    elements: results,
    tip: 'Use locators.byAutomationId for the most stable selectors (equivalent to CSS id in web).',
  };
}

/**
 * Find elements by a specific attribute value.
 */
async function findElement({ by, value }) {
  await ensureSession();

  const strategyMap = {
    automationId: ['accessibility id', value],
    name: ['name', value],
    className: ['class name', value],
    xpath: ['xpath', value],
  };

  const [using, val] = strategyMap[by] || ['accessibility id', value];

  const response = await appiumRequest(
    'POST',
    `/session/${currentSessionId}/elements`,
    { using, value: val }
  );

  const elements = response.value || [];
  const results = [];

  for (const el of elements) {
    const [nameRes, classRes, autoIdRes, displayedRes] = await Promise.all([
      appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/name`),
      appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/attribute/ClassName`),
      appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/attribute/AutomationId`),
      appiumRequest('GET', `/session/${currentSessionId}/element/${el.ELEMENT}/displayed`),
    ]);

    results.push({
      elementId: el.ELEMENT,
      automationId: autoIdRes.value || '',
      name: nameRes.value || '',
      className: classRes.value || '',
      displayed: displayedRes.value,
      locators: {
        byAutomationId: autoIdRes.value ? `~${autoIdRes.value}` : null,
        byName: nameRes.value ? `~${nameRes.value}` : null,
        byXPath: autoIdRes.value
          ? `//*[@AutomationId="${autoIdRes.value}"]`
          : `//*[@Name="${nameRes.value}"]`,
      },
    });
  }

  return { count: results.length, elements: results };
}

/**
 * Click an element located by the given strategy.
 */
async function clickElement({ by, value }) {
  await ensureSession();

  const strategyMap = {
    automationId: ['accessibility id', value],
    name: ['name', value],
    className: ['class name', value],
    xpath: ['xpath', value],
  };

  const [using, val] = strategyMap[by] || ['accessibility id', value];

  const findRes = await appiumRequest(
    'POST',
    `/session/${currentSessionId}/element`,
    { using, value: val }
  );

  const elementId = findRes.value?.ELEMENT;
  if (!elementId) throw new Error(`Element not found: ${by}="${value}"`);

  await appiumRequest('POST', `/session/${currentSessionId}/element/${elementId}/click`, {});

  return { success: true, elementId, clicked: `${by}="${value}"` };
}

/**
 * Type text into an element.
 */
async function typeText({ by, value, text }) {
  await ensureSession();

  const strategyMap = {
    automationId: ['accessibility id', value],
    name: ['name', value],
    xpath: ['xpath', value],
  };

  const [using, val] = strategyMap[by] || ['accessibility id', value];

  const findRes = await appiumRequest(
    'POST',
    `/session/${currentSessionId}/element`,
    { using, value: val }
  );

  const elementId = findRes.value?.ELEMENT;
  if (!elementId) throw new Error(`Element not found: ${by}="${value}"`);

  // Clear then send keys
  await appiumRequest('POST', `/session/${currentSessionId}/element/${elementId}/clear`, {});
  await appiumRequest('POST', `/session/${currentSessionId}/element/${elementId}/value`, {
    text,
    value: text.split(''),
  });

  return { success: true, typed: text, into: `${by}="${value}"` };
}

/**
 * Close the current Appium session.
 */
async function closeSession() {
  if (!currentSessionId) return { message: 'No active session to close.' };

  await appiumRequest('DELETE', `/session/${currentSessionId}`);
  const closed = currentSessionId;
  currentSessionId = null;

  return { success: true, closedSession: closed };
}

// ─── MCP Protocol handler ─────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'windows_launch_app',
    description: 'Launch a Windows application and start an Appium session. Required before any other tool.',
    inputSchema: {
      type: 'object',
      properties: {
        app: {
          type: 'string',
          description: 'Full path to .exe (Win32/WPF/WinForms) or AUMID string (UWP). Examples: "C:\\Windows\\System32\\notepad.exe", "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App". Use "Root" to attach to the entire Windows desktop.',
        },
        appArguments: { type: 'string', description: 'Optional CLI arguments to pass to the app.' },
      },
    },
    handler: launchApp,
  },
  {
    name: 'windows_take_screenshot',
    description: 'Take a screenshot of the current Windows application screen.',
    inputSchema: {
      type: 'object',
      properties: {
        outputPath: { type: 'string', description: 'Optional absolute path to save the PNG file.' },
      },
    },
    handler: takeScreenshot,
  },
  {
    name: 'windows_list_elements',
    description: 'List all visible UI elements on the current screen with their AutomationId, Name, ClassName, ControlType, and recommended WDIO locators. Use this to discover locators for your screen objects.',
    inputSchema: {
      type: 'object',
      properties: {
        maxDepth: { type: 'number', description: 'Max element tree depth to traverse (default 5).', default: 5 },
      },
    },
    handler: listElements,
  },
  {
    name: 'windows_find_element',
    description: 'Find specific UI elements by a given attribute. Returns matching elements with their locators.',
    inputSchema: {
      type: 'object',
      properties: {
        by: {
          type: 'string',
          description: 'Attribute to search by.',
          enum: ['automationId', 'name', 'className', 'xpath'],
        },
        value: { type: 'string', description: 'The attribute value to match.' },
      },
      required: ['by', 'value'],
    },
    handler: findElement,
  },
  {
    name: 'windows_click',
    description: 'Click a UI element located by automationId, name, className, or xpath.',
    inputSchema: {
      type: 'object',
      properties: {
        by: { type: 'string', enum: ['automationId', 'name', 'className', 'xpath'] },
        value: { type: 'string', description: 'The locator value.' },
      },
      required: ['by', 'value'],
    },
    handler: clickElement,
  },
  {
    name: 'windows_type_text',
    description: 'Type text into a UI element (clears existing content first).',
    inputSchema: {
      type: 'object',
      properties: {
        by: { type: 'string', enum: ['automationId', 'name', 'xpath'] },
        value: { type: 'string', description: 'The locator value.' },
        text: { type: 'string', description: 'The text to type.' },
      },
      required: ['by', 'value', 'text'],
    },
    handler: typeText,
  },
  {
    name: 'windows_close_session',
    description: 'Close the current Windows app Appium session.',
    inputSchema: { type: 'object', properties: {} },
    handler: closeSession,
  },
];

// ─── stdio JSON-RPC message loop ───────────────────────────────────────────────

async function handleMessage(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    return {
      jsonrpc: JSONRPC_VERSION,
      id,
      result: {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'windows-app-mcp', version: '1.0.0' },
      },
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: JSONRPC_VERSION,
      id,
      result: {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({
          name, description, inputSchema,
        })),
      },
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params;
    const tool = TOOLS.find((t) => t.name === name);

    if (!tool) {
      return {
        jsonrpc: JSONRPC_VERSION,
        id,
        error: { code: -32601, message: `Unknown tool: ${name}` },
      };
    }

    try {
      const result = await tool.handler(args);
      return {
        jsonrpc: JSONRPC_VERSION,
        id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        },
      };
    } catch (err) {
      return {
        jsonrpc: JSONRPC_VERSION,
        id,
        error: { code: -32000, message: err.message },
      };
    }
  }

  // notifications/ping — no response needed
  if (!id) return null;

  return {
    jsonrpc: JSONRPC_VERSION,
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

// Read newline-delimited JSON from stdin
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop(); // keep incomplete last line

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let msg;
    try {
      msg = JSON.parse(trimmed);
    } catch {
      continue;
    }

    const response = await handleMessage(msg);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  }
});

process.stdin.on('end', () => process.exit(0));
process.stderr.write('[windows-app-mcp] Server started. Waiting for MCP messages...\n');
