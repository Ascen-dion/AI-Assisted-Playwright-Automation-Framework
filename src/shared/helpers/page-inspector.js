/**
 * Page Inspector - Inspects a live page using Playwright to extract DOM structure
 * before AI code generation, so the AI knows the actual selectors/elements on the page.
 */
const { chromium } = require('playwright');

class PageInspector {
  /**
   * Inspect a page and return a structured DOM summary for AI code generation.
   * @param {string} url - The URL to inspect
   * @param {object} options - Options like timeout, credentials, etc.
   * @returns {object} - Structured page info with elements, roles, selectors
   */
  static async inspect(url, options = {}) {
    const { timeout = 30000, credentials = null } = options;
    let browser = null;

    try {
      console.log(`[PAGE-INSPECTOR] 🔍 Inspecting: ${url}`);
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true
      });
      const page = await context.newPage();

      // Navigate to the page
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });

      // Try to dismiss consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 3000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      // Wait a moment for dynamic content
      await page.waitForTimeout(1500);

      // Extract comprehensive page structure
      const pageInfo = await page.evaluate(() => {
        const result = {
          title: document.title,
          url: window.location.href,
          headings: [],
          buttons: [],
          links: [],
          inputs: [],
          images: [],
          forms: [],
          textElements: [],
          landmarks: [],
          dropdowns: [],
          navigation: []
        };

        // Headings — cap at 15 for token efficiency
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        Array.from(allHeadings).slice(0, 15).forEach(el => {
          result.headings.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim().substring(0, 100),
            id: el.id || null,
            className: el.className ? el.className.substring(0, 80) : null
          });
        });

        // Buttons (including elements with role="button") — cap at 20 for token efficiency
        const allButtons = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]');
        Array.from(allButtons).slice(0, 20).forEach(el => {
          result.buttons.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || el.value || '').trim().substring(0, 80),
            id: el.id || null,
            name: el.name || null,
            type: el.type || null,
            ariaLabel: el.getAttribute('aria-label') || null,
            dataTestId: el.getAttribute('data-test') || el.getAttribute('data-testid') || el.getAttribute('data-cy') || null
          });
        });

        // Input fields
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.type === 'hidden') return;
          result.inputs.push({
            tag: el.tagName.toLowerCase(),
            type: el.type || 'text',
            id: el.id || null,
            name: el.name || null,
            placeholder: el.placeholder || null,
            ariaLabel: el.getAttribute('aria-label') || null,
            role: el.getAttribute('role') || null,
            dataTestId: el.getAttribute('data-test') || el.getAttribute('data-testid') || el.getAttribute('data-cy') || null,
            label: null // will be filled below
          });
        });

        // Match labels to inputs
        document.querySelectorAll('label').forEach(label => {
          const forId = label.getAttribute('for');
          if (forId) {
            const input = result.inputs.find(i => i.id === forId);
            if (input) input.label = label.textContent.trim().substring(0, 60);
          }
        });

        // Images — cap at 10 for token efficiency
        const allImages = document.querySelectorAll('img');
        Array.from(allImages).slice(0, 10).forEach(el => {
          result.images.push({
            alt: el.alt || null,
            src: el.src ? el.src.substring(0, 120) : null,
            role: el.getAttribute('role') || null,
            id: el.id || null
          });
        });

        // Links (top 20)
        const allLinks = document.querySelectorAll('a[href]');
        Array.from(allLinks).slice(0, 20).forEach(el => {
          result.links.push({
            text: el.textContent.trim().substring(0, 60),
            href: el.getAttribute('href')?.substring(0, 100) || null,
            ariaLabel: el.getAttribute('aria-label') || null
          });
        });

        // Forms
        document.querySelectorAll('form').forEach(el => {
          result.forms.push({
            id: el.id || null,
            action: el.action || null,
            method: el.method || null,
            name: el.name || null,
            fieldCount: el.querySelectorAll('input, textarea, select').length
          });
        });

        // Important text elements (spans/divs with specific classes or roles)
        document.querySelectorAll('[class*="title"], [class*="header"], [class*="product"], [class*="item"], [class*="card"], [class*="name"], [class*="price"]').forEach(el => {
          const text = el.textContent.trim().substring(0, 80);
          if (text && text.length > 1 && text.length < 100) {
            result.textElements.push({
              tag: el.tagName.toLowerCase(),
              text: text,
              className: el.className ? String(el.className).substring(0, 60) : null,
              role: el.getAttribute('role') || null,
              dataTestId: el.getAttribute('data-test') || el.getAttribute('data-testid') || null
            });
          }
        });
        // Deduplicate text elements
        const seen = new Set();
        result.textElements = result.textElements.filter(el => {
          const key = el.tag + el.text;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 25);

        // ARIA landmarks & navigation
        document.querySelectorAll('[role="navigation"], nav, [role="main"], [role="banner"], [role="contentinfo"]').forEach(el => {
          result.landmarks.push({
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || 'nav',
            ariaLabel: el.getAttribute('aria-label') || null,
            id: el.id || null
          });
        });

        // Select/Dropdown elements
        document.querySelectorAll('select, [role="listbox"], [role="combobox"]').forEach(el => {
          const options = Array.from(el.querySelectorAll('option')).map(o => o.textContent.trim()).slice(0, 10);
          result.dropdowns.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            name: el.name || null,
            ariaLabel: el.getAttribute('aria-label') || null,
            dataTestId: el.getAttribute('data-test') || el.getAttribute('data-testid') || null,
            options: options
          });
        });

        return result;
      });

      // If credentials are provided, try to log in and inspect the post-login page too
      let postLoginPageInfo = null;
      if (credentials && credentials.username && credentials.password) {
        try {
          console.log('[PAGE-INSPECTOR] 🔑 Attempting login to inspect post-login page...');
          
          // Find and fill username field
          const usernameSelectors = ['#user-name', '#username', '[name="user-name"]', '[name="username"]', 
            'input[placeholder*="user" i]', 'input[placeholder*="email" i]', 'input[type="text"]', 'input[type="email"]'];
          for (const sel of usernameSelectors) {
            try {
              const field = page.locator(sel).first();
              if (await field.isVisible({ timeout: 1000 })) {
                await field.fill(credentials.username);
                break;
              }
            } catch (e) { continue; }
          }

          // Find and fill password field
          const passwordSelectors = ['#password', '[name="password"]', 'input[type="password"]',
            'input[placeholder*="pass" i]'];
          for (const sel of passwordSelectors) {
            try {
              const field = page.locator(sel).first();
              if (await field.isVisible({ timeout: 1000 })) {
                await field.fill(credentials.password);
                break;
              }
            } catch (e) { continue; }
          }

          // Click login/submit button
          const loginSelectors = ['#login-button', '[type="submit"]', 'button:has-text("Login")', 
            'button:has-text("Sign in")', 'input[type="submit"]'];
          for (const sel of loginSelectors) {
            try {
              const btn = page.locator(sel).first();
              if (await btn.isVisible({ timeout: 1000 })) {
                await btn.click();
                break;
              }
            } catch (e) { continue; }
          }

          // Wait for navigation
          await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
          await page.waitForTimeout(2000);

          // Extract post-login page structure
          postLoginPageInfo = await page.evaluate(() => {
            const result = {
              title: document.title,
              url: window.location.href,
              headings: [],
              buttons: [],
              inputs: [],
              textElements: [],
              images: []
            };

            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
              result.headings.push({
                tag: el.tagName.toLowerCase(),
                text: el.textContent.trim().substring(0, 100)
              });
            });

            document.querySelectorAll('button, [role="button"], input[type="submit"]').forEach(el => {
              result.buttons.push({
                tag: el.tagName.toLowerCase(),
                text: (el.textContent || el.value || '').trim().substring(0, 80),
                id: el.id || null,
                dataTestId: el.getAttribute('data-test') || el.getAttribute('data-testid') || null
              });
            });

            document.querySelectorAll('[class*="title"], [class*="header"], [class*="product"], [class*="item"], [class*="card"], [class*="name"], [class*="price"]').forEach(el => {
              const text = el.textContent.trim().substring(0, 80);
              if (text && text.length > 1 && text.length < 100) {
                result.textElements.push({
                  tag: el.tagName.toLowerCase(),
                  text: text,
                  className: el.className ? String(el.className).substring(0, 60) : null,
                  dataTestId: el.getAttribute('data-test') || el.getAttribute('data-testid') || null
                });
              }
            });
            // Deduplicate
            const seen = new Set();
            result.textElements = result.textElements.filter(el => {
              const key = el.tag + el.text;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            }).slice(0, 25);

            document.querySelectorAll('img').forEach(el => {
              result.images.push({ alt: el.alt || null, src: el.src?.substring(0, 120) || null });
            });

            return result;
          });

          console.log(`[PAGE-INSPECTOR] ✅ Post-login page inspected: ${postLoginPageInfo.url}`);
        } catch (loginErr) {
          console.warn(`[PAGE-INSPECTOR] ⚠️ Login inspection failed: ${loginErr.message}`);
        }
      }

      await browser.close();

      const summary = PageInspector.formatSummary(pageInfo, postLoginPageInfo);
      console.log(`[PAGE-INSPECTOR] ✅ Inspection complete: ${pageInfo.headings.length} headings, ${pageInfo.buttons.length} buttons, ${pageInfo.inputs.length} inputs, ${pageInfo.images.length} images`);

      return {
        success: true,
        pageInfo,
        postLoginPageInfo,
        summary
      };

    } catch (error) {
      console.error(`[PAGE-INSPECTOR] ❌ Inspection failed: ${error.message}`);
      if (browser) await browser.close().catch(() => {});
      return {
        success: false,
        error: error.message,
        summary: `[Page inspection failed: ${error.message}. Generate tests using best-practice selectors.]`
      };
    }
  }

  /**
   * Format page info into a concise text summary for the AI prompt.
   */
  static formatSummary(pageInfo, postLoginPageInfo = null) {
    const lines = [];
    lines.push(`=== PAGE INSPECTION RESULTS ===`);
    lines.push(`Page Title: ${pageInfo.title}`);
    lines.push(`Current URL: ${pageInfo.url}`);

    if (pageInfo.headings.length > 0) {
      lines.push(`\nHEADINGS (use these tags, NOT assumed ones):`);
      pageInfo.headings.forEach(h => {
        lines.push(`  <${h.tag}>${h.text}</${h.tag}>${h.id ? ` [id="${h.id}"]` : ''}`);
      });
    }

    if (pageInfo.inputs.length > 0) {
      lines.push(`\nINPUT FIELDS (use these exact attributes for selectors):`);
      pageInfo.inputs.forEach(inp => {
        const attrs = [];
        if (inp.id) attrs.push(`id="${inp.id}"`);
        if (inp.name) attrs.push(`name="${inp.name}"`);
        if (inp.placeholder) attrs.push(`placeholder="${inp.placeholder}"`);
        if (inp.type) attrs.push(`type="${inp.type}"`);
        if (inp.ariaLabel) attrs.push(`aria-label="${inp.ariaLabel}"`);
        if (inp.dataTestId) attrs.push(`data-test="${inp.dataTestId}"`);
        if (inp.label) attrs.push(`label="${inp.label}"`);
        if (inp.role) attrs.push(`role="${inp.role}"`);
        lines.push(`  <${inp.tag} ${attrs.join(' ')}>`);
      });
    }

    if (pageInfo.buttons.length > 0) {
      lines.push(`\nBUTTONS:`);
      pageInfo.buttons.forEach(btn => {
        const attrs = [];
        if (btn.id) attrs.push(`id="${btn.id}"`);
        if (btn.name) attrs.push(`name="${btn.name}"`);
        if (btn.type) attrs.push(`type="${btn.type}"`);
        if (btn.ariaLabel) attrs.push(`aria-label="${btn.ariaLabel}"`);
        if (btn.dataTestId) attrs.push(`data-test="${btn.dataTestId}"`);
        lines.push(`  <${btn.tag} ${attrs.join(' ')}> "${btn.text}"`);
      });
    }

    if (pageInfo.images.length > 0) {
      lines.push(`\nIMAGES:`);
      pageInfo.images.slice(0, 10).forEach(img => {
        lines.push(`  <img alt="${img.alt || 'none'}"${img.id ? ` id="${img.id}"` : ''}>`);
      });
    }

    if (pageInfo.forms.length > 0) {
      lines.push(`\nFORMS:`);
      pageInfo.forms.forEach(f => {
        lines.push(`  <form${f.id ? ` id="${f.id}"` : ''}${f.name ? ` name="${f.name}"` : ''} method="${f.method}" fields=${f.fieldCount}>`);
      });
    }

    if (pageInfo.dropdowns.length > 0) {
      lines.push(`\nDROPDOWNS:`);
      pageInfo.dropdowns.forEach(dd => {
        const attrs = [];
        if (dd.id) attrs.push(`id="${dd.id}"`);
        if (dd.dataTestId) attrs.push(`data-test="${dd.dataTestId}"`);
        lines.push(`  <${dd.tag} ${attrs.join(' ')}> options: [${dd.options.join(', ')}]`);
      });
    }

    if (pageInfo.textElements.length > 0) {
      lines.push(`\nKEY TEXT ELEMENTS (spans, divs with title/product/item/card/price classes):`);
      pageInfo.textElements.slice(0, 15).forEach(el => {
        const attrs = [];
        if (el.className) attrs.push(`class="${el.className}"`);
        if (el.dataTestId) attrs.push(`data-test="${el.dataTestId}"`);
        if (el.role) attrs.push(`role="${el.role}"`);
        lines.push(`  <${el.tag} ${attrs.join(' ')}> "${el.text}"`);
      });
    }

    if (pageInfo.links.length > 0) {
      lines.push(`\nLINKS (first ${Math.min(pageInfo.links.length, 10)}):`);
      pageInfo.links.slice(0, 10).forEach(lnk => {
        lines.push(`  <a href="${lnk.href}"> "${lnk.text}"`);
      });
    }

    // Post-login page info
    if (postLoginPageInfo) {
      lines.push(`\n=== POST-LOGIN PAGE ===`);
      lines.push(`Page Title: ${postLoginPageInfo.title}`);
      lines.push(`URL: ${postLoginPageInfo.url}`);

      if (postLoginPageInfo.headings.length > 0) {
        lines.push(`\nPOST-LOGIN HEADINGS:`);
        postLoginPageInfo.headings.forEach(h => {
          lines.push(`  <${h.tag}>${h.text}</${h.tag}>`);
        });
      }

      if (postLoginPageInfo.textElements.length > 0) {
        lines.push(`\nPOST-LOGIN KEY ELEMENTS:`);
        postLoginPageInfo.textElements.slice(0, 15).forEach(el => {
          const attrs = [];
          if (el.className) attrs.push(`class="${el.className}"`);
          if (el.dataTestId) attrs.push(`data-test="${el.dataTestId}"`);
          lines.push(`  <${el.tag} ${attrs.join(' ')}> "${el.text}"`);
        });
      }

      if (postLoginPageInfo.buttons.length > 0) {
        lines.push(`\nPOST-LOGIN BUTTONS:`);
        postLoginPageInfo.buttons.forEach(btn => {
          const attrs = [];
          if (btn.id) attrs.push(`id="${btn.id}"`);
          if (btn.dataTestId) attrs.push(`data-test="${btn.dataTestId}"`);
          lines.push(`  <${btn.tag} ${attrs.join(' ')}> "${btn.text}"`);
        });
      }
    }

    lines.push(`\n=== END PAGE INSPECTION ===`);
    return lines.join('\n');
  }

  /**
   * Extract credentials from story text or acceptance criteria.
   * Looks for patterns like "username: X, password: Y"
   */
  static extractCredentials(story) {
    if (!story) return null;

    const allText = [
      story.title || '',
      story.description || '',
      ...(story.acceptanceCriteria || [])
    ].join(' ');

    // Common patterns: "username: standard_user, password: secret_sauce"
    const userPatterns = [
      /username[:\s]+['"]?([^\s,'"]+)/i,
      /user[:\s]+['"]?([^\s,'"]+)/i,
      /login[:\s]+['"]?([^\s,'"]+)/i,
      /email[:\s]+['"]?([^\s,'"]+)/i
    ];

    const passPatterns = [
      /password[:\s]+['"]?([^\s,'"]+)/i,
      /pass[:\s]+['"]?([^\s,'"]+)/i,
      /secret[:\s]+['"]?([^\s,'"]+)/i
    ];

    let username = null, password = null;

    for (const pattern of userPatterns) {
      const match = allText.match(pattern);
      if (match) { username = match[1]; break; }
    }

    for (const pattern of passPatterns) {
      const match = allText.match(pattern);
      if (match) { password = match[1]; break; }
    }

    if (username && password) {
      console.log(`[PAGE-INSPECTOR] 🔑 Extracted credentials for: ${username}`);
      return { username, password };
    }

    return null;
  }
}

module.exports = PageInspector;
