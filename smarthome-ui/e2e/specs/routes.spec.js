const { test, expect, routeUrl, seedAuth, gotoAuthenticated } = require('../fixtures/test')

/**
 * One case per route in src/routes/routes.js. Each asserts something the route
 * can only render if its component mounted and its data arrived, so a
 * migration that breaks a single view fails a single test.
 *
 * The shared `page` fixture additionally fails any of these on a console error,
 * an uncaught exception, or an API call the mock does not know about.
 */
const ROUTES = [
  {
    path: '/admin/overview',
    name: 'overview',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Gate', exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Relays', exact: true })).toBeVisible()
      // exact:true so this does not also match the chart card's
      // 'Basement water level (cm)' heading.
      await expect(page.getByRole('heading', { name: 'Basement Water Level', exact: true })).toBeVisible()
    }
  },
  {
    path: '/admin/configuration',
    name: 'configuration',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Slack', exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Relays', exact: true })).toBeVisible()
      await expect(page.getByRole('row').filter({ hasText: 'Garden' })).toBeVisible()
    }
  },
  {
    path: '/admin/cameras',
    name: 'cameras',
    assert: async page => {
      // 'Disabled' is Enabled:false in the fixture and must not render.
      await expect(page.locator('.camera-name')).toHaveText(['Front', 'Backyard'])
    }
  },
  {
    path: '/admin/inverters',
    name: 'inverters',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Roof' })).toBeVisible()
      await expect(page.getByText('Total (W):')).toBeVisible()
      await expect(page.getByText('2221.75')).toBeVisible()
    }
  },
  {
    path: '/admin/stats',
    name: 'stats',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible()
    }
  },
  {
    path: '/admin/notifications',
    name: 'notifications',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Notifications Style' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Top Right' })).toBeVisible()
    }
  },
  {
    path: '/admin/webradio',
    name: 'webradio',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Web Radio' })).toBeVisible()
      await expect(page.locator('audio')).toHaveCount(1)
    }
  },
  {
    path: '/admin/metrics',
    name: 'metrics',
    assert: async page => {
      await expect(page.locator('iframe')).toHaveCount(1)
    }
  },
  {
    path: '/admin/rental',
    name: 'rental',
    assert: async page => {
      await expect(page.getByRole('heading', { name: 'Booking' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible()
    }
  }
]

test.describe('routes', () => {
  for (const route of ROUTES) {
    test(`${route.path} renders`, async ({ page }) => {
      await gotoAuthenticated(page, route.path)

      await expect(page).toHaveURL(new RegExp(`#${route.path}$`))
      // TopNavbar derives its title from the route name.
      await expect(page.locator('.navbar-brand')).toHaveText(
        route.name.charAt(0).toUpperCase() + route.name.slice(1)
      )
      await route.assert(page)
    })
  }

  test('an unknown route renders the not-found page', async ({ page }) => {
    await seedAuth(page)
    await page.goto(routeUrl('/admin/does-not-exist'))

    await expect(page.getByRole('heading', { name: '404 Not Found' })).toBeVisible()
    await expect(page.locator('.main-panel')).toHaveCount(0)
  })
})
