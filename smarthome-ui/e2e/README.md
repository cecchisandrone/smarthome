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
- a `console.error`
- a `console.warn` containing `[Vue warn]`
- an API call with no mock handler

The warn arm was added in phase 3: Vue 2 raised framework warnings through
`console.error`, Vue 3 raises them through `console.warn`, so watching only
errors would have quietly stopped enforcing `[Vue warn]` after the flip.

Two allow-lists live in `fixtures/test.js`:

- `IGNORED_CONSOLE_ERRORS` - resource-load failures from the third parties we
  abort on purpose, and the 401 the failed-login test provokes.
- `KNOWN_PRE_EXISTING_ERRORS` - **now empty.** Add an entry only to park a bug
  that is scheduled to be fixed, and delete it again as soon as it is.

## Defects this suite found, and where they went

Each was discovered while writing the suite in phase 0, pinned as *observed*
behaviour so the migration could be compared like for like, and then fixed in
the phase that owned it. The specs now assert the fixed behaviour.

| Where | Defect | Fixed in |
| --- | --- | --- |
| `Overview/Relay.vue` | `getStatus()` dereferenced `relaysStatus[name]` before the per-relay GET resolved. Vue 2 logged the TypeError; Vue 3 rethrows it. | phase 3 |
| `NotificationPlugin/Notifications.vue` | `v-for` keyed on the notification object itself. Notifications now carry an `id`. | phase 4 |
| `Logout.vue` | `<a href="#">` with no `.prevent`, so the anchor's own navigation overwrote the router push and `?loggedOut=true` was lost. | phase 4 |
| `Configuration/Slack.vue` | The **Test** button had no `type="button"`, so its `<form>` submitted and the page reloaded before the result notification could be read. | phase 4 |
| device tables in `Configuration/*.vue` | `<th>` sat directly under `<thead>` with no `<tr>`, so no header row was ever built. | phase 4 |

One known issue is left, and it is cosmetic: `Overview/Relay.vue`'s
`getGlobalStatus()` still reports `'Ok'` while the per-relay GET is in flight.

## Notes

- `routeUrl()` in `fixtures/test.js` is the single place that knows the router
  is in hash mode. Phase 3 kept hash mode (`createWebHashHistory()`); moving to
  `createWebHistory()` needs this **and** a `try_files` rule in `nginx/default`.
- `navigation.spec.js` pins the behaviour of `SidebarPlugin`, the sidebar
  `router-link`s (both rewritten in phase 3) and the footer's build-time
  `GIT_VERSION`, which is the only place a vite `define` reaches the DOM.
- `configuration.spec.js` exercises `Modal.vue` slots and `ConfirmDialog.vue`
  (which replaced `vue2-simplert` in phase 2).
