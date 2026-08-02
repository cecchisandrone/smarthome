const { test, expect, gotoAuthenticated } = require('../fixtures/test')

/**
 * The sidebar is a plugin (SidebarPlugin) that installs a global `$sidebar`
 * store via Vue.mixin + Vue.prototype - both of which phase 3 has to replace.
 * These tests pin its observable behaviour.
 */
test.describe('navigation', () => {
  test('the sidebar links navigate and mark the active route', async ({ page }) => {
    await gotoAuthenticated(page, '/admin/overview')

    const sidebar = page.locator('.sidebar')
    await expect(sidebar.locator('.nav li')).toHaveText([
      'Dashboard', 'Cameras', 'Inverters', 'Config', 'Metrics', 'Rental', 'Notifications'
    ])

    await sidebar.getByText('Cameras').click()
    await expect(page).toHaveURL(/#\/admin\/cameras$/)
    await expect(sidebar.locator('li.active')).toHaveText('Cameras')

    await sidebar.getByText('Rental').click()
    await expect(page).toHaveURL(/#\/admin\/rental$/)
    await expect(sidebar.locator('li.active')).toHaveText('Rental')
  })

  test('the moving arrow follows the active link', async ({ page }) => {
    await gotoAuthenticated(page, '/admin/overview')

    const arrow = page.locator('.sidebar .moving-arrow')
    await expect(arrow).toHaveAttribute('style', /translate3d\(0px, 0px, 0px\)/)

    // linkHeight is 60px and Config is the fourth link.
    await page.locator('.sidebar').getByText('Config').click()
    await expect(arrow).toHaveAttribute('style', /translate3d\(0px, 180px, 0px\)/)
  })

  test('the navbar toggle opens and closes the off-canvas sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 900 })
    await gotoAuthenticated(page, '/admin/overview')

    // App.vue puts `nav-open` on its own root; Vue replaces #app on mount, so
    // match on the class rather than on an id that no longer exists.
    const navOpen = page.locator('div.nav-open')
    const toggle = page.locator('.navbar-toggle')
    await expect(navOpen).toHaveCount(0)

    await toggle.click()
    await expect(navOpen).toHaveCount(1)
    await expect(toggle).toHaveClass(/toggled/)

    await toggle.click()
    await expect(navOpen).toHaveCount(0)
  })

  test('clicking the content area closes an open off-canvas sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 900 })
    await gotoAuthenticated(page, '/admin/overview')

    await page.locator('.navbar-toggle').click()
    await expect(page.locator('div.nav-open')).toHaveCount(1)

    // DashboardLayout listens with @click.native on <dashboard-content>, which
    // phase 3 has to rewrite as a plain @click. With the sidebar open the panel
    // is slid off-canvas and covered by the overlay, so dispatch the event
    // rather than doing a real mouse click: the handler wiring is the point.
    // '.content' alone also matches every card body, hence the child selector.
    await page.locator('.main-panel > .content').dispatchEvent('click')
    await expect(page.locator('div.nav-open')).toHaveCount(0)
  })
})
