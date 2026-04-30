// === FILE: mobilewright.config.js ===
const { defineConfig } = require('mobilewright');

module.exports = defineConfig({
  platform: 'android',
  bundleId: 'com.google.android.youtube',
  timeout: 30000,
  testDir: './mobile/tests',
  testMatch: '**/*.spec.js',
  reporter: [['list'], ['html', { outputFolder: 'mobile/reports/html', open: 'never' }]],
  retries: 1,
});
