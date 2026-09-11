const { test, expect, gotoAuthenticated } = require('../fixtures/test')

const field = (page, label) =>
  page.locator('.form-group').filter({ hasText: label }).locator('input')

test.describe('rental', () => {
  test('generates an access link for a booking', async ({ page }) => {
    await gotoAuthenticated(page, '/admin/rental')

    await expect(page.locator('.bordered-div')).toHaveText('Click on generate to get the link')

    await field(page, 'Start date').fill('2026-09-01')
    await field(page, 'End date').fill('2026-09-08')
    await field(page, 'Email').fill('guest@example.com')
    await page.getByRole('button', { name: 'Generate' }).click()

    await expect(page.locator('.notifications')).toContainText('Link generated')
    await expect(page.locator('.bordered-div')).toHaveText(
      'http://rental.invalid/access/guest%40example.com'
    )
  })
})
