const { test, expect, routeUrl, seedAuth, loginThroughForm } = require('../fixtures/test')
const { CREDENTIALS } = require('../fixtures/data')

test.describe('authentication', () => {
  test('sends an unauthenticated visitor to the login page', async ({ page }) => {
    await page.goto(routeUrl('/admin/overview'))

    await expect(page).toHaveURL(/#\/login$/)
    await expect(page.getByRole('heading', { name: 'SmartHome Authentication' })).toBeVisible()
    await expect(page.locator('.main-panel')).toHaveCount(0)
  })

  test('reports invalid credentials and stays on the login page', async ({ page }) => {
    await loginThroughForm(page, { username: CREDENTIALS.username, password: 'wrong' })

    await expect(page.locator('h5.text-danger')).toContainText('401')
    await expect(page).toHaveURL(/#\/login$/)
  })

  test('logs in with valid credentials and lands on the overview', async ({ page }) => {
    await loginThroughForm(page)

    await expect(page).toHaveURL(/#\/admin\/overview$/)
    await expect(page.locator('.main-panel')).toBeVisible()
    await expect(page.locator('.sidebar')).toBeVisible()

    // The session authService.login() persisted is what the router guard reads.
    const stored = await page.evaluate(() => window.localStorage.getItem('smarthomeUser'))
    expect(JSON.parse(stored)).toMatchObject({ token: 'mock-jwt-token', configurationId: 1 })
  })

  test('logging out clears the session and returns to the login page', async ({ page }) => {
    await seedAuth(page)
    await page.goto(routeUrl('/admin/overview'))
    await expect(page.locator('.main-panel')).toBeVisible()

    await page.locator('.navbar-right-menu').getByText('Logout').click()

    // Known defect: Logout.vue renders <a href="#"> and its click handler has no
    // .prevent, so the anchor's default action rewrites the hash right after
    // $router.push. The app ends on '#/' rather than '#/login?loggedOut=true',
    // and only the guard's redirect puts the login form on screen. Asserted as
    // observed behaviour so the migration is compared like for like.
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByRole('heading', { name: 'SmartHome Authentication' })).toBeVisible()
    expect(await page.evaluate(() => window.localStorage.getItem('smarthomeUser'))).toBeNull()
    await expect(page.locator('.notifications')).toContainText('You have been successfully logged out')
  })

  test('an expired session is rejected by the router guard', async ({ page }) => {
    await page.addInitScript(() => {
      if (window.top !== window.self) return
      window.localStorage.setItem('smarthomeUser', JSON.stringify({
        token: 'expired-token',
        expire: '2020-01-01T00:00:00Z',
        configurationId: 1
      }))
    })

    await page.goto(routeUrl('/admin/overview'))

    await expect(page).toHaveURL(/#\/login$/)
    expect(await page.evaluate(() => window.localStorage.getItem('smarthomeUser'))).toBeNull()
  })
})
