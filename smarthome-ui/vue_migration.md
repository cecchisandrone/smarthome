# Vue 3 Migration Plan

Status: **phases 0 and 1 complete**, phases 2-4 not started. Written 2026-08-02
against commit `fe13150` (branch `master`).

This document is written to be picked up cold. It records the decision, the
evidence behind it, and a phase-by-phase checklist with the exact files that
need to change.

---

## Decision: migrate incrementally, do not rewrite

The business logic is thin and already framework-free. All 710 LOC in
`src/services/*.js` is plain `axios` with zero Vue imports, so it carries over
untouched. The remaining ~6000 LOC of `.vue` is mostly template markup, much of
it near-duplicate (the `Overview/*` stat cards, the `Configuration/*` CRUD
forms).

A rewrite buys nothing and discards 251 commits' worth of device-specific
behaviour — poll intervals, chart shapes, inverter/sonar payload handling —
that is not documented anywhere else.

The decision splits in two:

- **Rewrite the tooling.** The webpack config, karma, and nightwatch setups are
  dead ends.
- **Migrate the application code.** Options API is fully supported in Vue 3; no
  Composition API rewrite is required.

### Cost comparison

| Approach | Estimate | Risk |
| --- | --- | --- |
| Incremental migration (this plan) | ~8–10 days | Low, gated by e2e suite at each phase |
| Rewrite from scratch | ~6–8 weeks | High: re-derive every device integration |

Both approaches land on the same Vue 3 endpoint.

### When a rewrite *would* be right

Only if you also want to drop Bootstrap 3 + the Paper Dashboard theme for a
modern design system. That is a UI redesign, not a framework migration. Even
then: migrate first, redesign second, so the two failure modes never overlap.

---

## Survey results

The expensive Vue 3 breaking changes are **all absent** from this codebase.
Verified by grep over `src/` at commit `fe13150`:

| Vue 2 pattern removed in Vue 3 | Occurrences |
| --- | --- |
| `filters:` | 0 |
| Event bus (`$on` / `$off` / `$once`) | 0 |
| `Vue.set` / `Vue.delete` / `$delete` | 0 |
| `.sync` modifier | 0 |
| `$children` / `$listeners` / `$scopedSlots` | 0 |
| `functional` components | 0 |

What remains is mechanical:

| Item | Count | Fix |
| --- | --- | --- |
| `slot="x"` old syntax | 60 uses across 22 files | `<template #x>` |
| `$set` | 10 uses across 4 files | plain assignment (proxy reactivity) |
| Transition classes `.x-enter` | 4 files | `.x-enter-from` |
| `@click.native` | 1 | drop the modifier |
| `router-link tag="li"` + `:ref` in `v-for` | 1 | `custom` + `v-slot` |
| `Vue.prototype` globals | 3 | `app.config.globalProperties` |
| `Vue.use` plugin installs | 5 | `app.use` |
| `Vue.mixin` sidebar store | 1 | shared `reactive` module |

`$set` files: `Views/Inverters.vue` (2), `Overview/Relay.vue` (3),
`Overview/WellPump.vue` (3), `Overview/Inverter.vue` (2). All of the form
`$set(obj, key, value)` on a plain object, so each becomes `obj[key] = value`.

---

## Dependency triage

| Dependency | Current | Status | Action |
| --- | --- | --- | --- |
| `vue` | 2.7.16 | bumped from 2.6.14 in phase 1 | → 3.x (phase 3) |
| `vue-router` | 2.2.0 | two majors behind | → 4.x. Rewrite router init; `path: '*'` → `/:pathMatch(.*)*` |
| `vuex` | 3.6.2 | store holds one boolean | **Delete.** Replace with `reactive()` in `authService` |
| `vue2-simplert` | 0.5.8 | Vue 2 only, unmaintained | **Blocker.** Replace with in-repo `Modal.vue` (phase 2) |
| `v-click-outside` | 0.0.8 | Vue 2 only | Imported in `main.js`, **used in zero templates** — just delete the import |
| `chartist` | 0.10.1 | framework-agnostic, works | Keep at 0.10 through the migration. Bump to 1.x as separate work |
| `bootstrap` | 3.3.7 | EOL 2019 | **Leave alone.** Not a Vue 3 blocker. Separate project |
| `axios` | 0.24.0 | old but fine | → 1.x in phase 4 |
| karma / mocha / nightwatch / sinon | — | dead, and crashing on startup | **removed**, replaced by Playwright |
| `eslint` | 3.19.0 | ancient | → eslint 9 flat config + `eslint-plugin-vue` |

---

## Phase 0 — safety net (on Vue 2) — **DONE**

Existing coverage was near zero: three karma specs (`paper-table`, `fgInput`,
`Overview`) and one nightwatch spec. Not enough to detect a broken migration.

A Playwright suite now drives the Vue 2 app against a fully mocked backend.
**34 tests, green, stable over `--repeat-each=3`.** It is the migration oracle:
it must pass identically after every phase. See `e2e/README.md`.

- [x] Install Playwright, point it at the dev server (port 8090)
- [x] Login flow (valid credentials → `/admin/overview`), invalid credentials,
      logout, expired-token rejection
- [x] Auth guard (unauthenticated `/admin/*` → `/login`)
- [x] Each of the 9 routes renders without console errors, plus the 404 route
- [x] Relay channel toggle round-trips against the mock (and toggles back)
- [x] Well pump, alarm, gate and basement pump round-trips
- [x] Configuration form save; relay create/edit/delete through `Modal.vue` and
      the `vue2-simplert` confirm dialog (confirm **and** dismiss)
- [x] Sidebar navigation, active-link marking, moving arrow, and the mobile
      off-canvas sidebar open/close
- [x] Chartist renders one chart per scheduled series
- [x] Rental access-link generation
- [x] Wire into CI — `test_ui` job added to `.circleci/config.yml`, gating
      `build_ui`

Files added: `playwright.config.js`, `e2e/` (fixtures + 6 spec files),
`e2e/README.md`. `package.json` gains `dev:test`, `e2e`, `e2e:ui` and a
`@playwright/test` devDependency. No `src/` file was touched.

**Guards.** Beyond its assertions, every test fails on an uncaught exception, a
`console.error` (including `[Vue warn]`), or an API call the mock does not
recognise. That last one means a service gaining a new endpoint breaks the
suite instead of silently 404ing.

**Exit criteria:** met.

### Pre-existing defects found while writing the suite

None were fixed — phase 0 changes no app code — but each is now pinned as
*observed* behaviour so the migration is compared like for like. The first two
are baselined in `KNOWN_PRE_EXISTING_ERRORS` in `e2e/fixtures/test.js`; remove
the entry when you fix the bug and the guard starts enforcing it.

| Where | Defect |
| --- | --- |
| `Overview/Relay.vue` | `getGlobalStatus()` returns `'Ok'` while `relaysStatus` is still `undefined`, so `getStatus()` dereferences `undefined`. A Vue render error on every overview visit. |
| `NotificationPlugin/Notifications.vue` | `v-for` uses the notification object itself as `:key`. |
| `Logout.vue` | `<a href="#">` with no `.prevent`; the anchor default overwrites the router push, so logout lands on `#/`, not `#/login?loggedOut=true`. |
| `Configuration/Slack.vue` | The **Test** button is inside a `<form>` with no `type="button"`, so the form submits and the page reloads before the result notification is readable. |
| device tables in `Configuration/*.vue` | `<th>` sits directly under `<thead>` with no `<tr>`; Vue builds the DOM programmatically, so no header row exists. |

Worth fixing, but as their own change — not folded into a migration phase.

### Legacy test removal (done after phase 0, before phase 1)

The karma and nightwatch setups were deleted rather than migrated. They were
not "old but working" — both crashed on startup:

| Suite | Why it could not run |
| --- | --- |
| `npm run e2e` (nightwatch) | `test/e2e/runner.js` requires `build/dev-server.js`, which does not exist. `MODULE_NOT_FOUND` before anything starts. `nightwatch.conf.js` also requires `selenium-server`, `chromedriver` and `babel-register`, none of which are in `package.json`. |
| `npm run unit` (karma) | `karma.conf.js` asks for the PhantomJS browser; `karma-phantomjs-launcher` is not installed, so the server throws while starting launchers. PhantomJS itself has been unmaintained since 2018. |

The specs were equally stale:

- `test/e2e/specs/test.js` asserted `.hello` and the text *"Welcome to Your
  Vue.js PrettyCheckbox"* — untouched scaffolding from the original template,
  never true of this app.
- `Overview.spec.js` expected 4 stats cards and 1 chart card; the real overview
  renders 12 and 6.
- `paper-table.spec.js` tested `UIComponents/PaperTable.vue`, which nothing in
  `src/` imports.
- `fgInput.spec.js` was the only spec still testing live behaviour, and the
  Playwright suite covers `fg-input` binding through the login, configuration
  and rental forms.

Removed: `test/`, `build/webpack.test.conf.js`, `config/test.env.js`, the
`env.test` block in `babel.config.js`, and 16 devDependencies (`karma` ×6,
`mocha`, `chai`, `sinon`, `sinon-chai`, `lolex`, `vue-unit`, `nightwatch`,
`babel-plugin-istanbul`, `inject-loader`, `function-bind`, `cross-spawn`).

`build/webpack.prod.conf.js` had a `NODE_ENV === 'testing'` branch that existed
only for the nightwatch runner; it now always uses `config.build.env`.

Scripts are now `e2e` (Playwright), `e2e:ui`, and `test` as an alias for `e2e`.
`lint` no longer targets the deleted `test` directory.

### Also corrected in this document

- `$set` **is** used (10 times, 4 files). The original survey said zero; that
  grep was wrong. Added to the mechanical-work table and to phase 3.
- `dist/` is **not** tracked by git — it is already in `.gitignore`. The phase 4
  item to remove it was unnecessary and has been dropped.

---

## Phase 1 — replace the build (still Vue 2) — **DONE**

Webpack swapped for Vite 7 while staying on Vue 2. **Playwright: 34/34 green.**

- [x] Add `vite@7`, `@vitejs/plugin-vue2@2`
- [x] `vite.config.js`: aliases `src`, `assets`, `components` ported
- [x] Sass pipeline via Vite's built-in support (`api: 'modern-compiler'`);
      no deprecation warnings on Dart Sass 1.79
- [x] Env vars: `define` replaces the whole `process.env` expression, exactly
      as webpack's `DefinePlugin` did. All 47 `process.env.*` reads and
      `window['environment'] = process.env` in `main.js` still work untouched
- [x] `GIT_VERSION` injection ported from `build/utils.js` into
      `vite.config.js`; `Dockerfile` `ARG GIT_VERSION` still flows through
- [x] `index.html` moved to Vite's root-entry convention
- [x] `Dockerfile` builds and the image serves correctly
- [x] Deleted `build/`, `config/`, `babel.config.js`
- [x] Dropped the whole babel + webpack toolchain

### Deviations from the original plan

**Vue 2.6.14 → 2.7.16 was mandatory.** `@vitejs/plugin-vue2` declares
`peerDependencies.vue: ^2.7.0-0` — it needs `@vue/compiler-sfc`, which only
ships from 2.7. This was not in the plan but is a hard requirement, and 2.7 is
the right place to be: it is the terminal 2.x release and is semantically
closer to 3.x. `vue-template-compiler` was removed with it. The suite caught
nothing, so the bump was clean.

**`postcss.config.js` was kept, not deleted.** The plan said "Vite handles
postcss". Vite *loads* a postcss config but does not add autoprefixer of its
own, so deleting the file would have silently dropped vendor prefixing.
`postcss.config.js` and `autoprefixer` both stay.

**`transformAssetUrls` had to be disabled.** vue-loader 15 only rewrote asset
URLs starting with `./`, `~` or `@`, so it left this app's five bare
`static/img/...` references alone. `@vitejs/plugin-vue2` is less conservative
and tried to bundle them, failing the build. Turned off in `vite.config.js`;
nothing in `src/` imports an image, so nothing is lost.

**`static/` moved to `public/static/`.** Vite copies `publicDir` to the *root*
of `outDir`. Pointing it at `static/` would have emitted `dist/img/...` and
broken every `static/img/...` template reference. Nesting it one level deeper
keeps the emitted paths byte-identical.

**One `src/` change:** `main.js` now imports `./App.vue` instead of `./App`.
Vite deliberately does not resolve extensionless `.vue` specifiers. It was the
only such import in the codebase.

**A `.dockerignore` was added.** Rollup and esbuild resolve platform-specific
optional binaries, so a host `node_modules` copied into the linux builder
leaves the wrong ones in place. The Dockerfile also now uses `npm ci` rather
than `npm install`, for the same reason.

### Known behaviour change

Babel used to transpile to the `browserslist` targets (`> 1%, last 2 versions,
not dead`). Vite's default build target is modern browsers, so the bundle is
now ES2020+ modules and no longer runs on older engines. Acceptable for this
app; `@vitejs/plugin-legacy` is the escape hatch if that ever changes. The
`browserslist` key is still honoured by autoprefixer for CSS.

### Results

| | webpack | Vite |
| --- | --- | --- |
| production build | ~4.2 s | ~1.4 s |
| bundle | 473 kB app + vendor + manifest | 291 kB JS + 192 kB CSS |
| devDependencies | 35 | 14 |

Verified: `npm run build`, `npm run lint`, `npm ci --dry-run`, the Playwright
suite against the dev server, `vite preview` serving every static asset, and a
full `docker build` + `docker run` with nginx serving the bundle and
`GIT_VERSION` correctly substituted.

**Exit criteria:** met.

---

## Phase 2 — remove Vue-2-locked dependencies (still Vue 2)

Goal: reach a state where nothing in `package.json` blocks a Vue 3 bump.

- [ ] Delete the `v-click-outside` import and `Vue.use(vClickOutside)` from
      `src/main.js:3,27` — the directive is used nowhere. Remove the dependency
- [ ] Build `src/components/UIComponents/Modal/ConfirmDialog.vue` on top of the
      existing `Modal.vue`
- [ ] Replace `vue2-simplert` in all 6 files:
  - [ ] `src/components/Dashboard/Views/Cameras.vue`
  - [ ] `src/components/Dashboard/Views/Inverters.vue`
  - [ ] `src/components/Dashboard/Views/Configuration/Camera.vue` (`$refs.simplert.openSimplert` at :204)
  - [ ] `src/components/Dashboard/Views/Configuration/Inverter.vue` (:159)
  - [ ] `src/components/Dashboard/Views/Configuration/Relay.vue` (:183)
  - [ ] `src/components/Dashboard/Views/Configuration/WellPump.vue` (:183)
  - [ ] Remove the dependency
- [ ] Delete `src/components/store.js` and the `vuex` dependency. Move
      `isLoggedIn` into `src/services/authService.js` as a `reactive({loggedIn})`
      export. Update the consumers of `store.commit('setLoggedIn', …)`

**Exit criteria:** Playwright green, zero Vue-2-only packages installed.

---

## Phase 3 — the flip

The app is broken mid-phase; that is expected. Land it as one reviewed change.

1. [ ] `vue@3`, `vue-router@4`, `@vitejs/plugin-vue`. Remove
       `@vitejs/plugin-vue2` (`vue-template-compiler` already went in phase 1).
       Drop `template: { transformAssetUrls: false }` from `vite.config.js` only
       if the five bare `static/img/...` template references are rewritten too —
       otherwise keep it
2. [ ] Rewrite `src/main.js`:
   - `createApp(App)` instead of `new Vue({el: '#app'})`
   - `createRouter({history: createWebHistory(), routes, linkActiveClass: 'active'})`
   - `Vue.use(...)` × 5 → `app.use(...)`
   - `Object.defineProperty(Vue.prototype, '$Chartist', …)` (:45) →
     `app.config.globalProperties.$Chartist`
   - Drop `es6-promise/auto`
3. [ ] Rewrite the three plugins to the `install(app)` signature:
   - [ ] `src/globalComponents.js` — `app.component(...)` × 4
   - [ ] `src/components/UIComponents/SidebarPlugin/index.js` — the `Vue.mixin`
         at :50 and `Vue.prototype.$sidebar` at :58 both go; make `SidebarStore`
         a `reactive()` object and expose it via `app.config.globalProperties`
   - [ ] `src/components/UIComponents/NotificationPlugin/index.js` — same
         treatment for `$notifications` at :17
4. [ ] Codemod the 60 `slot="x"` occurrences → `<template #x>`. Affected files:
   - `Configuration/`: `Camera.vue`, `Inverter.vue`, `Relay.vue`, `WellPump.vue`
   - `Overview/`: `Alarm.vue`, `Gate.vue`, `Heater.vue`, `HeaterChart.vue`,
     `Humidity.vue`, `HumidityChart.vue`, `Inverter.vue`, `PowerMeter.vue`,
     `PowerMeterChart.vue`, `Pump.vue`, `RainGauge.vue`, `RainGaugeChart.vue`,
     `Raspsonar.vue`, `RaspsonarChart.vue`, `Relay.vue`, `Temperature.vue`,
     `TemperatureChart.vue`, `WellPump.vue`
5. [ ] Rename transition classes (`.x-enter` → `.x-enter-from`) in 4 files:
   - [ ] `src/components/Dashboard/Layout/Content.vue:20` (`.fade-enter`)
   - [ ] `src/components/UIComponents/NotificationPlugin/Notification.vue:86` (`.fade-enter`)
   - [ ] `src/components/UIComponents/NotificationPlugin/Notifications.vue:41` (`.list-enter`)
   - [ ] `src/components/UIComponents/Modal/Modal.vue:95,103` (`.modal-enter`)
6. [ ] `src/components/Dashboard/Layout/DashboardLayout.vue:12` — drop
       `.native` from `@click.native`
7. [ ] `src/components/UIComponents/SidebarPlugin/SideBar.vue:23` — `tag="li"`
       is removed in vue-router 4. Rewrite as `<router-link custom v-slot>`
       wrapping an `<li>`. The `:ref="link.name"` on that element is never read
       anywhere; drop it rather than porting it
8. [ ] `src/routes/routes.js` — `path: '*'` → `path: '/:pathMatch(.*)*'`
9. [ ] Replace the 10 `$set(obj, key, value)` calls with `obj[key] = value` in
       `Views/Inverters.vue`, `Overview/Relay.vue`, `Overview/WellPump.vue`,
       `Overview/Inverter.vue`
10. [ ] Point `routeUrl()` in `e2e/fixtures/test.js` at history-mode paths if
        this phase also adopts `createWebHistory()`; the dev server already has
        `historyApiFallback` on, but `nginx/default` needs a matching
        `try_files` rule before the built image can serve deep links
11. [ ] Verify `$refs` on the chart components still resolve
       (`*Chart.vue:46-48`, `$refs.xChart.initChart()`) — ref timing differs
       slightly in Vue 3

**On `@vue/compat`:** given how small the breakage surface is, a straight flip
is faster than a compat-mode intermediate step. Reach for `@vue/compat` only if
step 3 turns out noisier than expected.

**Exit criteria:** Playwright green on Vue 3.

---

## Phase 4 — cleanup

- [x] ~~Vitest replaces karma; delete nightwatch~~ — **done early**, see
      "Legacy test removal" below. Nothing was ported: all four legacy specs
      were dead. A Vitest layer can be added later if unit coverage is wanted,
      but it is no longer blocking anything
- [ ] eslint 9 flat config + `eslint-plugin-vue` v9. Drop the eslint 3 plugin set
- [ ] `axios` 0.24 → 1.x (check the 16 service files for response-shape changes)
- [ ] Optionally convert `process.env.*` → `import.meta.env.*`
- [ ] Update `README.md` (dev/build commands changed in phase 1)
- [ ] Revisit the pre-existing defects listed under phase 0 and clear the
      `KNOWN_PRE_EXISTING_ERRORS` baseline in `e2e/fixtures/test.js`

---

## Out of scope

Tracked separately, deliberately not part of this migration:

- Bootstrap 3 → 5 / design system replacement
- Chartist 0.10 → 1.x
- Composition API / `<script setup>` conversion
- TypeScript

---

## Effort

| Phase | Estimate |
| --- | --- |
| 0 — Playwright safety net | ~~2 d~~ done |
| 1 — Vite | 1–2 d |
| 2 — dependency removal | 1.5 d |
| 3 — the flip | 2–3 d |
| 4 — cleanup | 1.5 d |
| **Total** | **~8–10 d** |
