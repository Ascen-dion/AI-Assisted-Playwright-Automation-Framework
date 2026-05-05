// === FILE: mobilewright.config.mjs ===
import { defineConfig } from 'mobilewright';

export default defineConfig({
  platform: 'android',
  url: 'ws://127.0.0.1:12000/ws',
  autoStart: false,
  bundleId: 'com.google.android.youtube',
  timeout: 30000,
  testDir: './mobile/tests',
  testMatch: '**/*.spec.{js,mjs}',
  outputDir: './test-results/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'mobile/reports/html', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./src/integrations/testrail-reporter.js']
  ],
  retries: 0,
});
