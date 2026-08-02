const { test, expect, gotoAuthenticated } = require('../fixtures/test')

/** Each device gets its own `col-md-12` block headed by an h3. */
const section = (page, heading) =>
  page.locator('.col-md-12').filter({ has: page.getByRole('heading', { name: heading, exact: true }) })

/** fg-input renders `.form-group > label + input`, with no `for` attribute. */
const field = (scope, label) =>
  scope.locator('.form-group').filter({ hasText: label }).locator('input')

test.describe('configuration', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAuthenticated(page, '/admin/configuration')
  })

  test('renders the configuration returned by the API', async ({ page }) => {
    // The device tables put <th> directly under <thead> with no <tr>, and Vue
    // builds them with the DOM API, so no header row is ever created. These
    // counts are therefore body rows only.
    await expect(section(page, 'Relays').getByRole('row')).toHaveCount(2)
    await expect(section(page, 'Cameras').getByRole('row')).toHaveCount(3)
    await expect(section(page, 'Inverters').getByRole('row')).toHaveCount(1)
    await expect(section(page, 'Well Pumps').getByRole('row')).toHaveCount(1)
    await expect(field(page, 'Notification channel')).toHaveValue('#smarthome')
    await expect(field(page, 'Duration')).toHaveValue('1.5')
  })

  test('editing a field reveals Save and persists the configuration', async ({ page, api }) => {
    const save = page.getByRole('button', { name: 'Save', exact: true })
    await expect(save).toHaveCount(0)

    await field(page, 'Notification channel').fill('#new-channel')
    await expect(save).toBeVisible()

    await save.click()

    await expect(page.locator('.notifications')).toContainText('Configuration saved')
    expect(api.configuration.Slack.NotificationChannel).toBe('#new-channel')
  })

  test('the Slack test button calls the notification endpoint', async ({ page, api }) => {
    await page.getByRole('button', { name: 'Test' }).click()

    // Known defect: the button sits inside <form> with no type="button", so the
    // form submits and the page reloads before the success notification can be
    // seen. The request still goes out, which is what this pins down.
    await expect(page).toHaveURL(/\?#\/admin\/configuration$/)
    expect(api.slackTestCount).toBe(1)
  })

  test('creating a relay through the modal posts it and reloads the table', async ({ page, api }) => {
    const relays = section(page, 'Relays')
    await relays.getByRole('button', { name: 'Create' }).click()

    const modal = page.locator('.modal-container')
    await expect(modal).toBeVisible()

    await field(modal, 'Name').fill('Pool')
    await field(modal, 'Host').fill('192.168.1.32')
    await field(modal, 'Port').fill('8080')
    await field(modal, 'Channels').fill('1')
    await modal.getByRole('button', { name: 'Save' }).click()

    await expect(modal).toHaveCount(0)
    await expect(page.locator('.notifications')).toContainText('Relay created successfully')
    await expect(relays.getByRole('row').filter({ hasText: 'Pool' })).toBeVisible()
    expect(api.configuration.Relays.map(r => r.Name)).toEqual(['Garden', 'Lights', 'Pool'])
  })

  test('editing a relay through the modal updates it', async ({ page, api }) => {
    const relays = section(page, 'Relays')
    await relays.getByRole('row').filter({ hasText: 'Garden' }).getByRole('button', { name: 'Edit' }).click()

    const modal = page.locator('.modal-container')
    await expect(modal).toContainText('Relay: Garden')
    await expect(field(modal, 'ID')).toHaveValue('1')

    await field(modal, 'Host').fill('192.168.1.99')
    await modal.getByRole('button', { name: 'Save' }).click()

    await expect(modal).toHaveCount(0)
    await expect(page.locator('.notifications')).toContainText('Relay updated successfully')
    expect(api.configuration.Relays[0].Host).toBe('192.168.1.99')
  })

  test('deleting a relay asks for confirmation first', async ({ page, api }) => {
    const relays = section(page, 'Relays')
    await relays.getByRole('row').filter({ hasText: 'Garden' }).getByRole('button', { name: 'Delete' }).click()

    const confirm = page.locator('.simplert--shown')
    await expect(confirm).toBeVisible()
    await expect(confirm.locator('.simplert__title')).toHaveText('Delete relay Garden?')
    // Nothing is deleted until the dialog is confirmed.
    expect(api.configuration.Relays).toHaveLength(2)

    await confirm.locator('.simplert__confirm').click()

    await expect(page.locator('.notifications')).toContainText('Relay deleted successfully')
    await expect(relays.getByRole('row')).toHaveCount(1)
    expect(api.configuration.Relays.map(r => r.Name)).toEqual(['Lights'])
  })

  test('dismissing the delete confirmation leaves the relay alone', async ({ page, api }) => {
    const relays = section(page, 'Relays')
    await relays.getByRole('row').filter({ hasText: 'Garden' }).getByRole('button', { name: 'Delete' }).click()

    const confirm = page.locator('.simplert--shown')
    await confirm.locator('.simplert__close').click()

    await expect(confirm).toHaveCount(0)
    await expect(relays.getByRole('row')).toHaveCount(2)
    expect(api.configuration.Relays).toHaveLength(2)
  })
})
