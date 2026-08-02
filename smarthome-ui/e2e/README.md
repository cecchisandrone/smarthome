# End-to-end suite

Playwright suite that drives the app against a **fully mocked backend**. It is
the oracle for the Vue 3 migration (see `../vue_migration.md`): it must pass
identically before and after every phase.

## Running

```bash
npm test                # alias for npm run e2e
npm run e2e             # headless, starts the dev server itself
npm run e2e:ui          # interactive UI mode
npx playwright test e2e/specs/overview.spec.js   # one file
npx playwright test --repeat-each=3              # flake check
```

This is the only test suite in the repo. The karma unit specs and the
nightwatch e2e scaffold that used to live in `test/` were removed — both had
been crashing on startup for years (see `../vue_migration.md`).

The config starts `npm run dev:test` (the dev server without auto-open) on port
8090 and reuses an already-running one locally. Override with `E2E_PORT` or
`E2E_BASE_URL`.

## Layout

```
e2e/
  fixtures/data.js      payload factories, shaped after ../../smarthome-server
  fixtures/mock-api.js  the request router: mocks the API, blocks third parties
  fixtures/test.js      Playwright fixtures, guards, auth helpers
  specs/                the tests
```

## The mock

One `page.route('**/*')` handler classifies every request:

| Request | Handling |
| --- | --- |
| `http://localhost:8080/api/v1/**` | answered from in-memory state |
| the app's own origin | passed through to the dev server |
| anything else | aborted |

Blocking third parties (Google Fonts, the FontAwesome CDN, Google Maps, the
camera hosts, the grafana iframe, the radio stream) keeps runs hermetic and
fast, and means a test failure is always about the app.

Payload shapes come from the real Go server in `../../smarthome-server`:
entities embed `gorm.Model` so they serialise with `ID`/`CreatedAt` and
PascalCase fields; measurement endpoints return `{timestamp, value}`; scheduled
endpoints return a `map[time.Time]float64`; inverter metrics use snake_case.

State is per test. `api` is exposed as a fixture, so a test can assert on what
the server received:

```js
test('...', async ({ page, api }) => {
  await card.getByRole('button', { name: 'Open' }).click()
  expect(api.gateOpenCount).toBe(1)
})
```

**Unmatched API calls fail the test.** If a service starts calling a new
endpoint, the suite says so instead of silently 404ing.

## Guards

Every test additionally fails on:

- an uncaught exception in the page
- a `console.error` (including `[Vue warn]`)
- an API call with no mock handler

Two allow-lists live in `fixtures/test.js`:

- `IGNORED_CONSOLE_ERRORS` - resource-load failures from the third parties we
  abort on purpose, and the 401 the failed-login test provokes.
- `KNOWN_PRE_EXISTING_ERRORS` - bugs that already exist on Vue 2. Each is
  pinned to its component so new errors in the same file are still caught.
  **Delete an entry as soon as its bug is fixed.**

## Pre-existing defects this suite documents

Found while writing the suite. None were fixed - phase 0 changes no app code -
but each is asserted as *observed* behaviour so the migration is compared like
for like. Search the specs for "Known defect".

| Where | Defect |
| --- | --- |
| `Overview/Relay.vue` | `getGlobalStatus()` returns `'Ok'` while `relaysStatus` is still `undefined`, so `getStatus()` dereferences `undefined` on the first render pass. Logged as a Vue render error on every visit to the overview. |
| `NotificationPlugin/Notifications.vue` | `v-for` uses the notification object itself as `:key`. |
| `Logout.vue` | `<a href="#">` with no `.prevent`, so the anchor's default action overwrites the router push. Logout lands on `#/` instead of `#/login?loggedOut=true`. |
| `Configuration/Slack.vue` | The **Test** button sits inside a `<form>` with no `type="button"`, so the form submits and the page reloads before the result notification can be read. |
| device tables in `Configuration/*.vue` | `<th>` elements are placed directly under `<thead>` with no `<tr>`. Vue builds the DOM programmatically, so no header row is ever created. |

## Notes for the migration

- `routeUrl()` in `fixtures/test.js` is the single place that knows the router
  is in hash mode. Phase 3 switches it when `createWebHistory()` lands.
- `navigation.spec.js` pins the behaviour of `SidebarPlugin` (`Vue.mixin` +
  `Vue.prototype.$sidebar`) and of `@click.native`, all of which phase 3
  rewrites.
- `configuration.spec.js` exercises `Modal.vue` slots and `ConfirmDialog.vue`
  (which replaced `vue2-simplert` in phase 2).
