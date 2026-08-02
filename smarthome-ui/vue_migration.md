# Vue 3 Migration Plan

Status: **not started**. Written 2026-08-02 against commit `fe13150` (branch `master`).

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
| `Vue.set` / `Vue.delete` / `$set` / `$delete` | 0 |
| `.sync` modifier | 0 |
| `$children` / `$listeners` / `$scopedSlots` | 0 |
| `functional` components | 0 |

What remains is mechanical:

| Item | Count | Fix |
| --- | --- | --- |
| `slot="x"` old syntax | 60 uses across 22 files | `<template #x>` |
| Transition classes `.x-enter` | 4 files | `.x-enter-from` |
| `@click.native` | 1 | drop the modifier |
| `router-link tag="li"` + `:ref` in `v-for` | 1 | `custom` + `v-slot` |
| `Vue.prototype` globals | 3 | `app.config.globalProperties` |
| `Vue.use` plugin installs | 5 | `app.use` |
| `Vue.mixin` sidebar store | 1 | shared `reactive` module |

---

## Dependency triage

| Dependency | Current | Status | Action |
| --- | --- | --- | --- |
| `vue` | 2.6.14 | — | → 3.x (phase 3) |
| `vue-router` | 2.2.0 | two majors behind | → 4.x. Rewrite router init; `path: '*'` → `/:pathMatch(.*)*` |
| `vuex` | 3.6.2 | store holds one boolean | **Delete.** Replace with `reactive()` in `authService` |
| `vue2-simplert` | 0.5.8 | Vue 2 only, unmaintained | **Blocker.** Replace with in-repo `Modal.vue` (phase 2) |
| `v-click-outside` | 0.0.8 | Vue 2 only | Imported in `main.js`, **used in zero templates** — just delete the import |
| `chartist` | 0.10.1 | framework-agnostic, works | Keep at 0.10 through the migration. Bump to 1.x as separate work |
| `bootstrap` | 3.3.7 | EOL 2019 | **Leave alone.** Not a Vue 3 blocker. Separate project |
| `axios` | 0.24.0 | old but fine | → 1.x in phase 4 |
| karma / mocha / nightwatch / sinon | — | dead | → Vitest + Playwright |
| `eslint` | 3.19.0 | ancient | → eslint 9 flat config + `eslint-plugin-vue` |

---

## Phase 0 — safety net (on Vue 2)

Existing coverage is near zero: three karma specs (`paper-table`, `fgInput`,
`Overview`) and one nightwatch spec. That is not enough to detect a broken
migration.

Add a Playwright suite against the running Vue 2 app. This suite is the
migration oracle — it must pass identically before and after every phase.

- [ ] Install Playwright, point it at the dev server (port 8090)
- [ ] Login flow (valid credentials → redirect to `/admin/overview`)
- [ ] Auth guard (unauthenticated `/admin/*` → `/login`)
- [ ] Each of the 9 routes renders without console errors: `overview`,
      `configuration`, `cameras`, `inverters`, `stats`, `notifications`,
      `webradio`, `metrics`, `rental`
- [ ] One relay toggle round-trips against a stubbed API
- [ ] One `Configuration/*` form saves and shows the confirm dialog
- [ ] Sidebar navigation + the mobile off-canvas sidebar open/close
- [ ] Wire into CI (`.circleci/config.yml`)

**Exit criteria:** suite green on Vue 2, running in CI.

---

## Phase 1 — replace the build (still Vue 2)

Swap webpack for Vite *while still on Vue 2*, via `@vitejs/plugin-vue2`. One
variable moves at a time.

- [ ] Add `vite`, `@vitejs/plugin-vue2`
- [ ] `vite.config.js`: port aliases `src`, `assets`, `components` from
      `build/webpack.base.conf.js:32-37`
- [ ] Port the sass pipeline (`src/assets/sass/paper-dashboard.scss`)
- [ ] Env vars: 47 uses of `process.env.API_ENDPOINT` / `process.env.GIT_VERSION`
      across `src/`. Use Vite's `define` to keep the `process.env.*` strings
      working so the 16 service files stay untouched this phase. Convert to
      `import.meta.env` in phase 4 if desired
- [ ] Keep `GIT_VERSION` injection working (currently `build/utils.js` +
      `Dockerfile` `ARG GIT_VERSION`)
- [ ] Move `index.html` to Vite's root-entry convention
- [ ] `Dockerfile`: builder stage still runs `npm run build` and still emits
      `dist/` — nginx stage unchanged
- [ ] Delete `build/`, `config/`, `babel.config.js`, `postcss.config.js`
- [ ] Drop babel deps from `package.json`

**Exit criteria:** Playwright green, `docker build` produces a working image.

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
       `vue-template-compiler` and `@vitejs/plugin-vue2`
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
9. [ ] Verify `$refs` on the chart components still resolve
       (`*Chart.vue:46-48`, `$refs.xChart.initChart()`) — ref timing differs
       slightly in Vue 3

**On `@vue/compat`:** given how small the breakage surface is, a straight flip
is faster than a compat-mode intermediate step. Reach for `@vue/compat` only if
step 3 turns out noisier than expected.

**Exit criteria:** Playwright green on Vue 3.

---

## Phase 4 — cleanup

- [ ] Vitest replaces karma. Port the 3 existing specs
      (`test/unit/specs/{paper-table,fgInput,Overview}.spec.js`), drop
      `vue-unit`, `karma-*`, `mocha`, `chai`, `sinon`, `lolex`
- [ ] Delete `test/e2e/` (nightwatch runner + conf), superseded by Playwright
- [ ] eslint 9 flat config + `eslint-plugin-vue` v9. Drop the eslint 3 plugin set
- [ ] `axios` 0.24 → 1.x (check the 16 service files for response-shape changes)
- [ ] Optionally convert `process.env.*` → `import.meta.env.*`
- [ ] Remove the committed `dist/` directory from the repo and add to
      `.gitignore`
- [ ] Update `README.md` (dev/build commands changed in phase 1)

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
| 0 — Playwright safety net | 2 d |
| 1 — Vite | 1–2 d |
| 2 — dependency removal | 1.5 d |
| 3 — the flip | 2–3 d |
| 4 — cleanup | 1.5 d |
| **Total** | **~8–10 d** |
