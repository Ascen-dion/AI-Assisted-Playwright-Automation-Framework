/**
 * Manual AVVA login script
 * 
 * This script opens a browser window where you can manually complete
 * the Microsoft SSO login flow. Once you reach the AVVA Console,
 * press Enter in the terminal to save the authenticated storage state.
 * 
 * Usage: node scripts/login-avva-manual.js
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const readline = require('readline');

const AVVA_URL = 'https://int-ai.aava.ai/';
const STORAGE_STATE_PATH = path.resolve(__dirname, '../playwright/.auth/avva-storageState.json');

async function manualLogin() {
  console.log('\n🚀 Opening browser for manual AVVA login...\n');
  
  const browser = await chromium.launch({ 
    headless: false,  // Always show browser for manual login
    slowMo: 500  // Slow down for visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log(`📍 Navigating to: ${AVVA_URL}\n`);
  await page.goto(AVVA_URL);
  
  console.log('📋 MANUAL LOGIN STEPS:');
  console.log('━'.repeat(60));
  console.log('1. Click "Enter with Enterprise Access" button');
  console.log('2. Complete Microsoft SSO login (mohan.r@ascendion.com)');
  console.log('3. Accept cookie consent if prompted');
  console.log('4. Wait until you see the AVVA Console (My-Space, Build, etc.)');
  console.log('5. Press ENTER in this terminal to save authentication');
  console.log('━'.repeat(60));
  console.log('\n⏳ Waiting for you to complete login...\n');
  
  // Wait for user to press Enter
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  await new Promise(resolve => {
    rl.question('Press ENTER when you have successfully logged in: ', () => {
      rl.close();
      resolve();
    });
  });
  
  console.log('\n💾 Saving authenticated storage state...');
  
  // Save the storage state (cookies, localStorage, sessionStorage)
  await context.storageState({ path: STORAGE_STATE_PATH });
  
  console.log(`✅ Storage state saved to: ${STORAGE_STATE_PATH}`);
  console.log('\n🎉 Success! Your authentication is now saved.');
  console.log('\n📌 Next steps:');
  console.log('   Run tests with: $env:AVVA_TEST="true"; npx playwright test src/web/tests/avva/');
  
  await browser.close();
}

manualLogin().catch(error => {
  console.error('\n❌ Error during manual login:', error);
  process.exit(1);
});
