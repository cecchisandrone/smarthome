/**
 * In-browser mock of the smarthome-server REST API.
 *
 * A single page.route('**\/*') handler classifies every request:
 *   - API_BASE            -> answered from the in-memory state below
 *   - the app's own origin -> passed through to the dev server
 *   - anything else        -> aborted, so the suite is hermetic (no fonts CDN,
 *                             no Google Maps, no real cameras, no grafana iframe)
 *
 * Unmatched API calls are recorded rather than guessed at. The shared `page`
 * fixture asserts that list is empty, so a new endpoint added to a service
 * fails the suite instead of silently returning a 404 the UI swallows.
 */

const {
  CONFIGURATION_ID,
  NOW,
  CREDENTIALS,
  AUTH_USER,
  AUTH_CLAIMS,
  MEASUREMENTS,
  makeConfiguration,
  makeInverterMetrics,
  makeScheduledMeasurements
} = require('./data')

// Matches config/dev.env.js - the bundle bakes this in at build time.
const API_BASE = 'http://localhost:8080/api/v1'

function createApiState () {
  return {
    configuration: makeConfiguration(),
    // relay id -> {channelIndex: bool}; the Go handler binds map[int]bool
    relayStatus: { 1: { 0: false, 1: false }, 2: { 0: true } },
    // well pump id -> 0 | 1
    wellPumpStatus: { 1: 0 },
    alarm: { enabled: false, cameras: [] },
    raspsonarRelay: { relayStatus: false, activationTime: NOW },
    gateOpenCount: 0,
    slackTestCount: 0,
    /** Every API request seen, as 'METHOD /path'. */
    requests: [],
    /** API requests with no handler - asserted empty by the page fixture. */
    unmatched: []
  }
}

const json = (body, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(body)
})

const notFound = message => json({ status: 404, message }, 404)

function requestJson (request) {
  try {
    return request.postDataJSON()
  } catch (e) {
    return null
  }
}

/**
 * Route table. Patterns match the pathname only; query strings are read from
 * `url` inside the handlers. More specific paths come first, and every pattern
 * is anchored, so '/relays/1/relay' can never fall through to '/relays/1'.
 */
const ROUTES = [
  // --- authentication -------------------------------------------------
  ['POST', /^\/auth$/, (m, { request }) => {
    const body = requestJson(request) || {}
    if (body.username === CREDENTIALS.username && body.password === CREDENTIALS.password) {
      return json({ code: AUTH_USER.code, expire: AUTH_USER.expire, token: AUTH_USER.token })
    }
    return json({ code: 401, message: 'incorrect Username or Password' }, 401)
  }],
  ['GET', /^\/auth\/$/, () => json({ claims: AUTH_CLAIMS })],
  ['PUT', /^\/auth$/, () => json({ ...AUTH_USER })],

  // --- configuration --------------------------------------------------
  ['GET', /^\/configurations\/(\d+)$/, (m, { state }) => json(state.configuration)],
  ['PUT', /^\/configurations\/(\d+)$/, (m, { state, request }) => {
    const body = requestJson(request)
    if (body) state.configuration = body
    return json(state.configuration)
  }],

  // --- alarm ----------------------------------------------------------
  ['GET', /^\/configurations\/(\d+)\/alarm\/$/, (m, { state }) =>
    json({ status: 200, alarmEnabled: state.alarm.enabled, cameras: state.alarm.cameras })],
  ['PUT', /^\/configurations\/(\d+)\/alarm\/$/, (m, { state, url }) => {
    state.alarm.enabled = url.searchParams.get('status') === '1'
    state.alarm.cameras = state.alarm.enabled
      ? state.configuration.Cameras.filter(c => c.AlarmEnabled).map(c => c.Name)
      : []
    return json({ status: 200, cameras: state.alarm.cameras })
  }],

  // --- gate -----------------------------------------------------------
  ['POST', /^\/configurations\/(\d+)\/gate\/open$/, (m, { state }) => {
    state.gateOpenCount += 1
    return json({ status: 200 })
  }],

  // --- raspsonar (measurement + basement pump relay) ------------------
  ['GET', /^\/configurations\/(\d+)\/raspsonar\/relay$/, (m, { state }) => json(state.raspsonarRelay)],
  ['PUT', /^\/configurations\/(\d+)\/raspsonar\/relay$/, (m, { state, url }) => {
    state.raspsonarRelay = {
      relayStatus: url.searchParams.get('relayStatus') === 'true',
      activationTime: NOW
    }
    return json(state.raspsonarRelay)
  }],

  // --- relays ---------------------------------------------------------
  ['GET', /^\/configurations\/(\d+)\/relays\/(\d+)\/relay$/, (m, { state }) => {
    const status = state.relayStatus[m[2]]
    if (!status) return notFound(`Can't find Relay with ID ${m[2]}`)
    return json({ status })
  }],
  ['PUT', /^\/configurations\/(\d+)\/relays\/(\d+)\/relay$/, (m, { state, request }) => {
    const body = requestJson(request)
    if (!body) return json({ message: 'Unable to parse request' }, 400)
    state.relayStatus[m[2]] = body
    // The real handler echoes the requested channel map back.
    return json(body)
  }],
  ['GET', /^\/configurations\/(\d+)\/relays\/$/, (m, { state }) => json(state.configuration.Relays)],
  ['POST', /^\/configurations\/(\d+)\/relays\/$/, (m, { state, request }) => {
    const relay = { ...requestJson(request), ID: nextId(state.configuration.Relays) }
    state.configuration.Relays.push(relay)
    state.relayStatus[relay.ID] = emptyChannels(relay.Channels)
    return json(relay, 201)
  }],
  ['PUT', /^\/configurations\/(\d+)\/relays\/(\d+)$/, (m, { state, request }) =>
    json(replaceById(state.configuration.Relays, m[2], requestJson(request)), 202)],
  ['DELETE', /^\/configurations\/(\d+)\/relays\/(\d+)$/, (m, { state }) => {
    if (!removeById(state.configuration.Relays, m[2])) return notFound(`Can't find Relay with ID ${m[2]}`)
    delete state.relayStatus[m[2]]
    return json('Deleted')
  }],

  // --- well pumps -----------------------------------------------------
  ['GET', /^\/configurations\/(\d+)\/well-pumps\/(\d+)\/relay$/, (m, { state }) => {
    const status = state.wellPumpStatus[m[2]]
    if (status === undefined) return notFound(`Can't find WellPump with ID ${m[2]}`)
    return json({ status })
  }],
  ['PUT', /^\/configurations\/(\d+)\/well-pumps\/(\d+)\/relay$/, (m, { state, url }) => {
    const status = Number(url.searchParams.get('status') || 0)
    state.wellPumpStatus[m[2]] = status
    return json({ status })
  }],
  ['GET', /^\/configurations\/(\d+)\/well-pumps\/$/, (m, { state }) => json(state.configuration.WellPumps)],
  ['POST', /^\/configurations\/(\d+)\/well-pumps\/$/, (m, { state, request }) => {
    const pump = { ...requestJson(request), ID: nextId(state.configuration.WellPumps) }
    state.configuration.WellPumps.push(pump)
    state.wellPumpStatus[pump.ID] = 0
    return json(pump, 201)
  }],
  ['PUT', /^\/configurations\/(\d+)\/well-pumps\/(\d+)$/, (m, { state, request }) =>
    json(replaceById(state.configuration.WellPumps, m[2], requestJson(request)), 202)],
  ['DELETE', /^\/configurations\/(\d+)\/well-pumps\/(\d+)$/, (m, { state }) => {
    if (!removeById(state.configuration.WellPumps, m[2])) return notFound(`Can't find WellPump with ID ${m[2]}`)
    delete state.wellPumpStatus[m[2]]
    return json('Deleted')
  }],

  // --- cameras --------------------------------------------------------
  ['GET', /^\/configurations\/(\d+)\/cameras\/$/, (m, { state }) => json(state.configuration.Cameras)],
  ['POST', /^\/configurations\/(\d+)\/cameras\/$/, (m, { state, request }) => {
    const camera = { ...requestJson(request), ID: nextId(state.configuration.Cameras) }
    state.configuration.Cameras.push(camera)
    return json(camera, 201)
  }],
  ['PUT', /^\/configurations\/(\d+)\/cameras\/(\d+)$/, (m, { state, request }) =>
    json(replaceById(state.configuration.Cameras, m[2], requestJson(request)), 202)],
  ['DELETE', /^\/configurations\/(\d+)\/cameras\/(\d+)$/, (m, { state }) => {
    if (!removeById(state.configuration.Cameras, m[2])) return notFound(`Can't find Camera with ID ${m[2]}`)
    return json('Deleted')
  }],

  // --- inverters ------------------------------------------------------
  ['GET', /^\/configurations\/(\d+)\/inverters\/(\d+)\/metrics$/, (m, { state }) => {
    const known = state.configuration.Inverters.some(i => String(i.ID) === m[2])
    if (!known) return json({ message: `Can't find Inverter with ID ${m[2]}` }, 400)
    return json({ metrics: makeInverterMetrics() })
  }],
  ['GET', /^\/configurations\/(\d+)\/inverters\/$/, (m, { state }) => json(state.configuration.Inverters)],
  ['POST', /^\/configurations\/(\d+)\/inverters\/$/, (m, { state, request }) => {
    const inverter = { ...requestJson(request), ID: nextId(state.configuration.Inverters) }
    state.configuration.Inverters.push(inverter)
    return json(inverter, 201)
  }],
  ['PUT', /^\/configurations\/(\d+)\/inverters\/(\d+)$/, (m, { state, request }) =>
    json(replaceById(state.configuration.Inverters, m[2], requestJson(request)), 202)],
  ['DELETE', /^\/configurations\/(\d+)\/inverters\/(\d+)$/, (m, { state }) => {
    if (!removeById(state.configuration.Inverters, m[2])) return notFound(`Can't find Inverter with ID ${m[2]}`)
    return json('Deleted')
  }],

  // --- notifications / rental ------------------------------------------
  ['POST', /^\/configurations\/(\d+)\/notification\/slack$/, (m, { state }) => {
    state.slackTestCount += 1
    return json({ status: 200 })
  }],
  ['POST', /^\/configurations\/(\d+)\/rental\/generate-access-link$/, (m, { request }) => {
    const booking = requestJson(request) || {}
    return json({ link: `http://rental.invalid/access/${encodeURIComponent(booking.Email || 'guest')}` })
  }]
]

// Measurement endpoints all share one shape, so they are generated rather than
// repeated: GET /<sensor>/ returns the last reading, ?scheduled=true the series.
for (const sensor of Object.keys(MEASUREMENTS)) {
  ROUTES.push([
    'GET',
    new RegExp(`^\\/configurations\\/(\\d+)\\/${sensor}\\/$`),
    (m, { url }) => url.searchParams.get('scheduled') === 'true'
      ? json(makeScheduledMeasurements(MEASUREMENTS[sensor].scheduled))
      : json({ timestamp: NOW, value: MEASUREMENTS[sensor].last })
  ])
}

function nextId (collection) {
  return collection.reduce((max, item) => Math.max(max, item.ID), 0) + 1
}

function emptyChannels (channels) {
  const out = {}
  for (let i = 0; i < (channels || 1); i++) out[i] = false
  return out
}

function replaceById (collection, id, replacement) {
  const index = collection.findIndex(item => String(item.ID) === String(id))
  if (index === -1) return replacement
  collection[index] = { ...collection[index], ...replacement }
  return collection[index]
}

function removeById (collection, id) {
  const index = collection.findIndex(item => String(item.ID) === String(id))
  if (index === -1) return false
  collection.splice(index, 1)
  return true
}

function handleApi (path, url, request, state) {
  const method = request.method()
  state.requests.push(`${method} ${path}`)

  for (const [routeMethod, pattern, handler] of ROUTES) {
    if (routeMethod !== method) continue
    const match = pattern.exec(path)
    if (match) return handler(match, { state, request, url })
  }

  state.unmatched.push(`${method} ${path}`)
  return json({ status: 404, message: `No mock handler for ${method} ${path}` }, 404)
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {ReturnType<typeof createApiState>} state
 * @param {string} appOrigin origin the dev server is serving the app from
 */
async function installMockApi (page, state, appOrigin) {
  const apiUrl = new URL(API_BASE)
  const appUrl = new URL(appOrigin)

  await page.route('**/*', async route => {
    const request = route.request()
    const url = new URL(request.url())

    if (url.origin === apiUrl.origin && url.pathname.startsWith(apiUrl.pathname)) {
      const path = url.pathname.slice(apiUrl.pathname.length) || '/'
      return route.fulfill(handleApi(path, url, request, state))
    }

    if (url.origin === appUrl.origin) return route.continue()

    // Third-party: fonts, CDN stylesheets, Google Maps, cameras, grafana, radio.
    return route.abort()
  })
}

module.exports = { API_BASE, CONFIGURATION_ID, createApiState, installMockApi }
