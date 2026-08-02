/**
 * Shared Playwright fixtures.
 *
 * Every test gets:
 *   - `api`: fresh mock-server state it can read and mutate
 *   - `page`: already wired to the mock, and guarded so that uncaught
 *     exceptions, console errors and un-mocked API calls fail the test
 *
 * The guards are the point of this suite: during the Vue 3 migration a broken
 * plugin or a dropped lifecycle hook usually shows up as a console error long
 * before it shows up as a missing element.
 */

const base = require('@playwright/test')
const { createApiState, installMockApi } = require('./mock-api')
const { AUTH_USER, CREDENTIALS } = require('./data')

/**
 * Console noise that is expected and not a regression signal:
 * third-party requests we abort on purpose, and the 401 the failed-login test
 * deliberately provokes. Chromium reports both as console errors.
 */
const IGNORED_CONSOLE_ERRORS = [
  /Failed to load resource/i,
  /net::ERR_/i
]

/**
 * Defects that already exist at the start of the migration. They are baselined
 * here so the console guard is usable, NOT because they are acceptable.
 *
 * The two Overview/Relay.vue entries went with phase 3: Vue 2 caught that
 * render TypeError and logged it, Vue 3 rethrows it as an uncaught exception,
 * so it had to be fixed rather than baselined.
 *
 * Delete an entry here as soon as its bug is fixed; the guard will then start
 * enforcing it.
 */
const KNOWN_PRE_EXISTING_ERRORS = [
  // NotificationPlugin/Notifications.vue uses the notification object itself
  // as the v-for :key.
  /non-primitive value as key/
]

const isIgnorableConsoleError = text =>
  IGNORED_CONSOLE_ERRORS.some(re => re.test(text)) ||
  KNOWN_PRE_EXISTING_ERRORS.some(re => re.test(text))

const test = base.test.extend({
  api: async ({}, use) => {
    await use(createApiState())
  },

  page: async ({ page, api, baseURL }, use) => {
    const consoleErrors = []
    const pageErrors = []

    // Vue 2 raised its framework warnings through console.error; Vue 3 raises
    // them through console.warn. Both are watched, so '[Vue warn]' keeps
    // failing tests exactly as it did before the flip while ordinary
    // console.warn noise stays ignored.
    page.on('console', message => {
      const type = message.type()
      const text = message.text()
      if (type !== 'error' && !(type === 'warning' && text.includes('[Vue warn]'))) return
      if (!isIgnorableConsoleError(text)) consoleErrors.push(text)
    })
    page.on('pageerror', error => pageErrors.push(error.message))

    await installMockApi(page, api, baseURL)

    await use(page)

    const problems = []
    if (pageErrors.length) {
      problems.push(`Uncaught page errors:\n  - ${pageErrors.join('\n  - ')}`)
    }
    if (consoleErrors.length) {
      problems.push(`Console errors:\n  - ${consoleErrors.join('\n  - ')}`)
    }
    if (api.unmatched.length) {
      problems.push(
        'API calls with no mock handler (add one to e2e/fixtures/mock-api.js):\n  - ' +
        api.unmatched.join('\n  - ')
      )
    }
    base.expect(problems.join('\n\n')).toBe('')
  }
})

/**
 * main.js builds the router with createWebHashHistory(), matching the hash mode
 * vue-router 2 defaulted to, so every route lives behind '/#'. If the app ever
 * moves to createWebHistory(), routeUrl() is the single place that changes -
 * along with a try_files rule in nginx/default.
 */
const routeUrl = path => `/#${path}`

/**
 * Puts a valid session in localStorage before any app code runs, so tests that
 * are not about login can start on an authenticated route. Mirrors what
 * authService.login() persists.
 */
async function seedAuth (page) {
  await page.addInitScript(user => {
    // Init scripts run in every frame, including the opaque-origin documents
    // left behind by the third-party iframes the mock aborts (cameras, grafana).
    // Touching localStorage there throws, so stay in the top frame.
    if (window.top !== window.self) return
    window.localStorage.setItem('smarthomeUser', JSON.stringify(user))
  }, AUTH_USER)
}

/** Seed a session and land on `path`, waiting for the dashboard chrome. */
async function gotoAuthenticated (page, path) {
  await seedAuth(page)
  await page.goto(routeUrl(path))
  await base.expect(page.locator('.main-panel')).toBeVisible()
}

/** Drive the real login form. Used by the auth spec; other specs seed instead. */
async function loginThroughForm (page, credentials = CREDENTIALS) {
  await page.goto(routeUrl('/login'))
  // fg-input declares `name` as a prop and forwards it with v-bind="$props",
  // so it lands on the <input>. The `id` attribute is not a prop and falls
  // through to the wrapping .form-group div instead - do not select on it.
  await page.locator('input[name="username"]').fill(credentials.username)
  await page.locator('input[name="password"]').fill(credentials.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
}

module.exports = {
  test,
  expect: base.expect,
  routeUrl,
  seedAuth,
  gotoAuthenticated,
  loginThroughForm
}
