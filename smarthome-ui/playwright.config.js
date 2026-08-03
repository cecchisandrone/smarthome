const { defineConfig, devices } = require('@playwright/test')

const PORT = process.env.E2E_PORT || '8090'
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`

/**
 * End-to-end suite for the Vue 3 migration (see vue_migration.md, phase 0).
 *
 * It runs against the dev server with a fully mocked backend, so it must pass
 * identically before and after every migration phase.
 */
module.exports = defineConfig({
  testDir: './e2e/specs',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'e2e-report' }]]
    : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    // dev:test is `dev` without the auto-open-browser flag.
    command: 'npm run dev:test',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // First webpack build on a cold cache is slow.
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe'
  }
})
