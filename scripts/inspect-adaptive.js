const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto('https://login.adaptiveplanning.com/app', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 });

  // Capture login page elements
  const loginInputs = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, button[type=submit], button, a');
    return Array.from(inputs).slice(0, 20).map(el => ({
      tag: el.tagName, type: el.type, name: el.name, id: el.id,
      class: String(el.className).substring(0, 80),
      placeholder: el.placeholder,
      text: String(el.textContent).trim().substring(0, 50),
      dataTestId: el.getAttribute('data-testid'),
    }));
  });
  console.log('=== LOGIN ELEMENTS ===');
  console.log(JSON.stringify(loginInputs, null, 2));

  // List all inputs
  const inputs = await page.locator('input').all();
  console.log('Input count:', inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i];
    const attrs = await inp.evaluate(el => ({ name: el.name, type: el.type, id: el.id, placeholder: el.placeholder }));
    console.log('Input ' + i + ':', JSON.stringify(attrs));
  }

  // Fill login using confirmed selectors
  await page.locator('#inputEmail').fill('northsales@ptrial-ascendion.com');
  await page.locator('#inputPassword').fill('xQNyc1y9');
  await page.locator('#submit').click();
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  await page.waitForTimeout(10000);

  console.log('=== POST-LOGIN URL ===');
  console.log(page.url());
  await page.screenshot({ path: 'screenshots/adaptive-dashboard.png', fullPage: false });

  // Discover main page structure
  const mainElements = await page.evaluate(() => {
    const els = document.querySelectorAll('[role=tab], [role=tablist], [role=tabpanel], [role=navigation], [role=menuitem], [role=treeitem], nav, [class*=tab], [class*=Tab], [class*=sheet], [class*=Sheet], [class*=menu], [class*=Menu]');
    return Array.from(els).slice(0, 60).map(el => ({
      tag: el.tagName, role: el.getAttribute('role'),
      text: String(el.textContent).trim().substring(0, 80),
      class: String(el.className).substring(0, 100),
      id: el.id,
      ariaLabel: el.getAttribute('aria-label'),
      ariaSelected: el.getAttribute('aria-selected'),
    }));
  });
  console.log('=== MAIN PAGE STRUCTURE ===');
  console.log(JSON.stringify(mainElements, null, 2));

  // Find any links/items with budget/sheet/sales/instruction in text
  const budgetItems = await page.evaluate(() => {
    const all = document.querySelectorAll('a, span, div, button, li, td, th');
    const items = [];
    for (const el of all) {
      const t = String(el.textContent).trim();
      if (t.length > 2 && t.length < 80 && /budget|sales|sheet|instruction|revenue|expense|workforce|pipeline|travel|capital|variance|review/i.test(t) && el.children.length < 3) {
        items.push({
          tag: el.tagName, text: t.substring(0, 80),
          class: String(el.className).substring(0, 60),
          id: el.id, role: el.getAttribute('role'),
          href: el.getAttribute('href'),
        });
      }
    }
    return items.slice(0, 50);
  });
  console.log('=== BUDGET/SHEET ITEMS ===');
  console.log(JSON.stringify(budgetItems, null, 2));

  // Capture full list of all navigation/sidebar links
  const navLinks = await page.evaluate(() => {
    const els = document.querySelectorAll('a, [role=menuitem], [role=treeitem], [role=link]');
    return Array.from(els).slice(0, 40).map(el => ({
      tag: el.tagName,
      text: String(el.textContent).trim().substring(0, 60),
      href: el.getAttribute('href'),
      class: String(el.className).substring(0, 60),
      role: el.getAttribute('role'),
    }));
  });
  console.log('=== ALL NAV LINKS ===');
  console.log(JSON.stringify(navLinks, null, 2));

  await browser.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
