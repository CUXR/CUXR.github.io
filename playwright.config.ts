import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:4321', browserName: 'chromium', viewport: { width: 1440, height: 1000 } },
  // Keep Astro attached so Playwright can manage its lifecycle in CI.
  webServer: { command: 'pnpm exec astro dev --ignore-lock --host 127.0.0.1 --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
});
