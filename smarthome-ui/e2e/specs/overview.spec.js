const { test, expect, gotoAuthenticated } = require('../fixtures/test')

/** The overview is a grid of StatsCards; find one by its header heading. */
const statsCard = (page, heading) =>
  page.locator('.card').filter({ has: page.getByRole('heading', { name: heading, exact: true }) })

test.describe('overview', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAuthenticated(page, '/admin/overview')
  })

  test('renders the sensor readings returned by the API', async ({ page }) => {
    await expect(statsCard(page, 'Outdoor Temperature')).toContainText('21.53 °C')
    await expect(statsCard(page, 'Outdoor Humidity')).toContainText('63.25 %')
    await expect(statsCard(page, 'Heater Temperature')).toContainText('54.75 °C')
    await expect(statsCard(page, 'Basement Water Level')).toContainText('12.75 cm')
    await expect(statsCard(page, 'Rainfall')).toContainText('3.40 mm')
    // PowerMeter renders the absolute value and colours the underline.
    await expect(statsCard(page, 'Power')).toContainText('430.5 W')
    await expect(statsCard(page, 'Inverters')).toContainText('2222 W')
  })

  test('renders a chartist chart per scheduled series', async ({ page }) => {
    // Six chart cards: temperature, humidity, rain gauge, raspsonar, heater, power.
    await expect(page.locator('.ct-chart')).toHaveCount(6)
    await expect(page.locator('.ct-chart svg.ct-chart-line').first()).toBeVisible()
    // Six points per series, from makeScheduledMeasurements().
    await expect(page.locator('.ct-chart').first().locator('.ct-series .ct-line')).toHaveCount(1)
  })

  test('toggling a relay channel round-trips through the API', async ({ page, api }) => {
    const card = statsCard(page, 'Relays')
    await expect(card).toContainText('Garden (Ok)')
    await expect(card).toContainText('Lights (Ok)')

    // Buttons are laid out relay by relay: Garden ch1, Garden ch2, Lights ch1.
    const gardenChannel1 = card.getByRole('button').nth(0)
    await expect(gardenChannel1).not.toHaveClass(/active/)

    await gardenChannel1.click()

    await expect(card).toContainText('Relay Garden(1) activated')
    await expect(gardenChannel1).toHaveClass(/active/)
    expect(api.relayStatus['1']).toEqual({ 0: true, 1: false })

    await gardenChannel1.click()

    await expect(card).toContainText('Relay Garden(1) deactivated')
    await expect(gardenChannel1).not.toHaveClass(/active/)
    expect(api.relayStatus['1']).toEqual({ 0: false, 1: false })
  })

  test('toggling the well pump round-trips through the API', async ({ page, api }) => {
    const card = statsCard(page, 'Well Pumps')
    const pump = card.getByRole('button', { name: 'Off (Well)' })
    await expect(pump).toBeVisible()

    await pump.click()

    await expect(card).toContainText('Well Pump Well activated')
    await expect(card.getByRole('button', { name: 'On (Well)' })).toBeVisible()
    expect(api.wellPumpStatus['1']).toBe(1)
  })

  test('toggling the alarm reports the cameras it covers', async ({ page, api }) => {
    const card = statsCard(page, 'Alarm')
    await expect(card.getByRole('button', { name: 'Off' })).toBeVisible()

    await card.getByRole('button', { name: 'Off' }).click()

    await expect(card.getByRole('button', { name: 'On' })).toBeVisible()
    // Only the 'Front' camera has AlarmEnabled set in the fixture.
    await expect(card).toContainText('Enabled on Front')
    expect(api.alarm.enabled).toBe(true)
  })

  test('opening the gate posts to the API and confirms', async ({ page, api }) => {
    const card = statsCard(page, 'Gate')

    await card.getByRole('button', { name: 'Open' }).click()

    await expect(card).toContainText('Gate opened')
    expect(api.gateOpenCount).toBe(1)
  })

  test('toggling the basement pump reports its activation time', async ({ page, api }) => {
    const card = statsCard(page, 'Basement Pump')
    await expect(card.getByRole('button', { name: 'Off' })).toBeVisible()

    await card.getByRole('button', { name: 'Off' }).click()

    await expect(card.getByRole('button', { name: 'On' })).toBeVisible()
    await expect(card).toContainText('Pump activated at')
    expect(api.raspsonarRelay.relayStatus).toBe(true)
  })
})
