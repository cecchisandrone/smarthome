# Vue 3 Migration Plan

Status: **complete.** All five phases are done and the app runs on Vue 3.
Written 2026-08-02 against commit `fe13150` (branch `master`).

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

What remains is mechanical. Note that this table counts removed *syntax* only —
it missed the removed component `v-model` contract, which turned out to be the
largest single piece of phase 3. See the phase 3 deviations.

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
| `vue` | 3.5.x | bumped 2.6.14 → 2.7.16 in phase 1, → 3.x in phase 3 | done |
| `vue-router` | 4.6.x | was 2.2.0 | done in phase 3; hash mode kept |
| `vuex` | — | held one boolean that nothing read | **removed** in phase 2 |
| `vue2-simplert` | — | Vue 2 only, unmaintained | **removed** in phase 2, replaced by in-repo `ConfirmDialog.vue` |
| `v-click-outside` | — | Vue 2 only, used in zero templates | **removed** in phase 2 |
| `chartist` | 0.10.1 | framework-agnostic, works | Keep at 0.10 through the migration. Bump to 1.x as separate work |
| `bootstrap` | 3.3.7 | EOL 2019 | **Leave alone.** Not a Vue 3 blocker. Separate project |
| `axios` | 1.19.x | was 0.24.0 | done in phase 4 |
| karma / mocha / nightwatch / sinon | — | dead, and crashing on startup | **removed**, replaced by Playwright |
| `eslint` | 9.39.x | was 3.19.0 | done in phase 4: flat config + `eslint-plugin-vue` 10 + `neostandard` |

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
      the confirm dialog (confirm **and** dismiss)
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
| `Overview/Relay.vue` | `getGlobalStatus()` returns `'Ok'` while `relaysStatus` is still `undefined`, so `getStatus()` dereferences `undefined`. A Vue render error on every overview visit. **The dereference was fixed in phase 3** — Vue 3 rethrows it — but the premature `'Ok'` remains. |
| `NotificationPlugin/Notifications.vue` | `v-for` uses the notification object itself as `:key`. |
| `Logout.vue` | `<a href="#">` with no `.prevent`; the anchor default overwrites the router push, so `?loggedOut=true` is lost. Landed on `#/` under vue-router 2, `#/login` under vue-router 4. |
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

## Phase 2 — remove Vue-2-locked dependencies (still Vue 2) — **DONE**

Goal: reach a state where nothing in `package.json` blocks a Vue 3 bump.
**Playwright: 35/35 green** (one test added, see below).

- [x] Deleted the `v-click-outside` import and `Vue.use(vClickOutside)` from
      `src/main.js` — the directive was used nowhere. Dependency removed
- [x] Built `src/components/UIComponents/Modal/ConfirmDialog.vue` on top of the
      existing `Modal.vue`
- [x] Replaced `vue2-simplert` everywhere and removed the dependency:
  - [x] `Views/Cameras.vue` and `Views/Inverters.vue` — imported and registered
        `Simplert` but never used it in their templates. Dead imports, deleted
  - [x] `Configuration/Camera.vue`, `Inverter.vue`, `Relay.vue`, `WellPump.vue`
        — real users, all four migrated to `ConfirmDialog`
- [x] Deleted `src/components/store.js` and the `vuex` dependency

### Vuex was deleted outright, not ported

The plan said to move `isLoggedIn` into `authService` as a `reactive({loggedIn})`
export. That turned out to be unnecessary: `isLoggedIn` is **written twice and
read nowhere**. `Login.vue` and `Logout.vue` each called
`$store.commit('setLoggedIn', false)`, and no component, computed or template
ever consumed the value. Auth state is already derived from localStorage by
`authService.checkAuth()`, which is what the router guard uses.

Porting it would have created a second source of truth for something nothing
reads. The two `commit` calls were deleted with the store.

### ConfirmDialog keeps an imperative API

`ConfirmDialog.open(options)` mirrors `simplert.openSimplert(obj)` — same option
keys (`title`, `message`, `type`, `onConfirm`) — so each of the four delete
handlers changed by one line instead of being restructured. An event-based API
would be more idiomatic, but this phase is about removing a dependency, not
redesigning the call sites; phase 3 can revisit it.

It is written with Vue 2.7's `<template #header>` slot syntax rather than the
deprecated `slot="header"`, so it needs no work in phase 3.

### Test changes

The confirm dialog is a different component, so its selectors necessarily
changed — but the *behaviour* assertions are unchanged: confirmation is still
required before deletion, dismissing still leaves the data alone, and the
notification text is identical. `.simplert--shown` / `.simplert__confirm` /
`.simplert__close` became accessible-role queries against `.modal-container`.

One test was added. The four `Configuration/*.vue` files were edited by script,
and only `Relay.vue`'s dialog was covered, so a camera-delete test now proves a
second wiring works end to end.

### Results

Runtime dependencies are down to six, of which only two are Vue-coupled:

```
axios, bootstrap, chartist, es6-promise, vue, vue-router
```

Bundle drops from 291 kB to 265 kB. `npm audit` from 11 to 10.

**Exit criteria:** met — Playwright green, zero Vue-2-only packages installed.

---

## Phase 3 — the flip — **DONE**

Vue 2.7 → Vue 3.5, vue-router 2 → 4, in one change. **Playwright: 35/35 green,
stable over `--repeat-each=3`.** No `@vue/compat` step was needed.

1. [x] `vue@3.5`, `vue-router@4.6`, `@vitejs/plugin-vue@6`; removed
       `@vitejs/plugin-vue2` and `es6-promise`.
       `template: { transformAssetUrls: false }` was **kept** — the five bare
       `static/img/...` references were not rewritten
2. [x] Rewrote `src/main.js`: `createApp(App).mount('#app')`, `createRouter`,
       `app.use(...)` × 4 (`VueRouter` is no longer a plugin install),
       `app.config.globalProperties.$Chartist`
3. [x] All three plugins now take `install(app)`:
   - [x] `src/globalComponents.js` — `app.component(...)` × 4
   - [x] `SidebarPlugin/index.js` — `Vue.mixin` and the `$sidebar` prototype
         getter both gone; `SidebarStore` is a `reactive()` object on
         `app.config.globalProperties`
   - [x] `NotificationPlugin/index.js` — same treatment for `$notifications`
4. [x] Codemodded all 60 `slot="x"` occurrences → `<template #x>` across the
       22 listed files
5. [x] Renamed the transition classes (`.x-enter` → `.x-enter-from`) in the
       4 listed files
6. [x] Dropped `.native` from `@click.native` in `DashboardLayout.vue`
7. [x] `SideBar.vue` — `<router-link custom v-slot>` wrapping the `<li>`;
       `:ref="link.name"` dropped as planned
8. [x] `src/routes/routes.js` — `path: '/:pathMatch(.*)*'`
9. [x] Replaced all 10 `$set(obj, key, value)` calls with `obj[key] = value`
10. [x] `routeUrl()` left alone — hash mode was kept, see below
11. [x] Chart `$refs` still resolve; the six-chart overview assertion passes
        unchanged

### Deviations from the plan

**Hash mode was kept.** The plan sketched `createWebHistory()`. Phase 3 uses
`createWebHashHistory()` instead, which is what vue-router 2 defaulted to. Going
to history mode is a *deployment* change — it needs a `try_files` rule in
`nginx/default` and invalidates every existing `#/...` link — and folding it in
would have mixed a framework failure mode with a serving failure mode. It stays
available as a one-line change plus an nginx rule.

**`fg-input` had to be rewritten, and the plan did not list it.** The survey
counted the removed *syntax* but missed a removed *contract*: Vue 3 renamed
component `v-model` from `value` + `input` to `modelValue` +
`update:modelValue`. Left alone, all ~50 `<fg-input v-model="…">` call sites
would have gone silently read-only — the login form included.

Worse, Vue 2 applied the `.number` and `.trim` v-model modifiers itself, even
for component v-model. Vue 3 only forwards them as a `modelModifiers` prop and
leaves the cast to the component. The 24 `v-model.number` bindings in
`Configuration/*` would have started sending strings to the API, which no test
would have caught. `formGroupInput.vue` now renames the prop and applies the
modifiers itself, so every call site is untouched.

**`Overview/Relay.vue`'s render crash was fixed, not baselined.** Its
`getStatus()` dereferenced `relaysStatus[name]` before the per-relay GET
resolved. Vue 2 caught the TypeError and logged it, so phase 0 baselined it;
Vue 3 rethrows it as an uncaught exception, which failed 14 tests. Fixing the
dereference was better than teaching the guard to ignore an uncaught
`TypeError`, which would have blunted it for the rest of the migration. The
underlying `getGlobalStatus()` reporting `'Ok'` while loading is untouched —
it is cosmetic, and it stays a phase 4 item.

**Three latent problems surfaced that the survey had not counted:**

- `SideBar.vue` contained a stray `</span>` inside `<ul>`. Vue 2's parser
  ignored it; Vue 3's rejects it and the build fails
- `PaperTable.vue` had `v-for` and `v-if` on the same `<td>`. Vue 3 reverses
  the precedence, so `column` would be undefined. Split into a `<template
  v-for>`. The component is imported by nothing — worth deleting in phase 4
- `<transition-group>` renders a fragment in Vue 3 where Vue 2 always emitted a
  wrapper `<span>`. `tag="span"` is now explicit in `Notifications.vue`

**One behaviour change, in a pre-existing defect.** `Logout.vue`'s
un-`.prevent`ed `<a href="#">` still loses the `?loggedOut=true` query, but the
landing URL moved from `#/` to `#/login`: vue-router 4 pushes through the
history API, so the anchor's `#` no longer resets the whole route. The auth spec
asserts the new observed behaviour and the defect stays on the phase 4 list.

### The e2e guard had to be widened to stay as strong

Vue 2 raised framework warnings through `console.error`; Vue 3 raises them
through `console.warn`. The guard watched errors only, so after the flip it
would have silently stopped enforcing `[Vue warn]` — the single most useful
signal in the suite. `fixtures/test.js` now also fails on a `console.warn`
containing `[Vue warn]`.

`KNOWN_PRE_EXISTING_ERRORS` is down to one entry (the object-as-`:key` in
`Notifications.vue`), and even that is inert: Vue 3 does not warn about it.

### Results

| | Vue 2.7 | Vue 3.5 |
| --- | --- | --- |
| production build | ~1.4 s | ~1.5 s |
| bundle | 265 kB JS + 192 kB CSS | 259 kB JS + 192 kB CSS |
| Playwright | 35/35 | 35/35 |

Verified: `npm run build`, `npm run lint`, `npm ci --dry-run`, the Playwright
suite at `--repeat-each=3` (105/105), and a full `docker build` with the image's
bundle carrying the right `GIT_VERSION`.

**Exit criteria:** met.

---

## Phase 4 — cleanup — **DONE**

**Playwright: 36/36 green** (one test added), stable over `--repeat-each=3`.
`npm run lint`: 0 errors.

- [x] ~~Vitest replaces karma; delete nightwatch~~ — **done early**, see
      "Legacy test removal" above. Nothing was ported: all four legacy specs
      were dead. A Vitest layer can be added later if unit coverage is wanted,
      but it is no longer blocking anything
- [x] eslint 9 flat config (`eslint.config.js`) + `eslint-plugin-vue` 10 +
      `neostandard`. Dropped eslint 3 and its six plugins, deleted
      `.eslintrc.json`
- [x] `axios` 0.24 → 1.19. No service file needed a change: they all use
      `res.data` and `err.message`, neither of which moved
- [x] Converted all 47 `process.env.*` reads to `import.meta.env.*`
- [x] Updated `README.md`
- [x] Fixed the last four pre-existing defects and emptied
      `KNOWN_PRE_EXISTING_ERRORS`
- [x] Deleted `UIComponents/PaperTable.vue`
- [x] Declared `emits` on all 16 components that `$emit`

### The eslint upgrade was worth more than a version bump

The old stack could not see inside a `.vue` file at all. `eslint-plugin-html`
extracted `<script>` blocks and nothing else, so **no template had ever been
linted** — which is exactly why phase 3 found unbalanced tags and a `v-for` /
`v-if` clash by hand, one compiler error at a time.

Turning `eslint-plugin-vue` on surfaced 55 template findings the previous 251
commits had never had a chance to see:

| Finding | Count | Outcome |
| --- | --- | --- |
| `vue/require-v-for-key` | 19 | fixed — every `v-for` now has a `:key` |
| `vue/no-mutating-props` | 26 | left as warnings, see below |
| `vue/no-unused-components` | 3 | dead imports and registrations deleted |
| `vue/no-unused-vars` | 2 | unused `index` bindings dropped from `v-for` |
| `vue/require-toggle-inside-transition` | 1 | `Modal.vue`, see below |
| `vue/no-deprecated-destroyed-lifecycle` | 1 | **a live Vue 3 bug**, see below |

**`CameraView.vue` had a dead lifecycle hook.** Its `beforeDestroy()` has not
run since phase 3 — Vue 3 renamed it `beforeUnmount`. Phase 3's survey grepped
for it and then failed to act on it; nothing failed loudly, because the hook
only reset an image source. Renaming it exposed a second, older bug in the same
place: the `setInterval` that refreshes an sv3c or microcam still image was
never stored and never cleared, so every visit to the cameras page left another
timer polling forever. The hook now clears it.

**`Modal.vue`'s transition never ran.** Every call site toggles the whole
`<modal>` with `v-if`, so the `<transition>` inside it never saw its own child
appear or disappear — the `.modal-enter-from` rules phase 3 carefully renamed
were dead either way. `appear` makes the enter transition run on mount, which
is the moment the dialog opens.

### What was deliberately not fixed

**26 `vue/no-mutating-props`, kept as warnings.** The nine `Configuration/*`
device forms `v-model` straight into a prop object owned by
`Configuration.vue`. It works because the object is shared by reference, and
the `*Modified` events exist to tell the parent to re-render. Fixing it means
giving each component a local copy and pushing changes up — a data-flow
redesign across nine components with real regression risk, and no user-visible
change. `npm run lint` is error-free, and this is the only warning class left.

**The stylistic layer was tuned to the code, not the other way round.**
`@stylistic/indent` reported 1823 violations, every one of them in a `.vue`
`<script>` block, because this codebase indents SFC scripts one level deeper
than the default. That is a consistent house style; reformatting ~1800 lines
would have buried the 55 real findings above. The rule is off for `.vue`.
`vue/multi-word-component-names` (39 hits) is off for the same reason — every
component here has been single-word since 2017.

Everything else auto-fixable was fixed with `eslint --fix`: trailing
whitespace, object-literal spacing, quoted property keys, `var` → `let`/`const`.
That diff is whitespace and keywords only; `git diff -w` shows almost nothing.

### `import.meta.env` replaced the `process.env` shim

`vite.config.js` had been replacing the whole `process.env` expression, exactly
as webpack's `DefinePlugin` did. It now defines just the two keys the app
actually reads:

```js
define: {
  'import.meta.env.API_ENDPOINT': JSON.stringify(...),
  'import.meta.env.GIT_VERSION': JSON.stringify(gitVersion())
}
```

Vite substitutes `process.env.NODE_ENV` for dependencies on its own, so nothing
was lost. `window.environment` still exists for console debugging, but it is now
an explicit three-key object: `define` is a *textual* substitution, so the keys
are not real properties of `import.meta.env` and spreading the object would have
produced an empty result.

A test was added for this. `ContentFooter.vue` is the only place a build-time
constant reaches the DOM, and nothing had ever asserted on it.

### `npm ci` resolves cleanly again, and `--legacy-peer-deps` is gone

Installing `@eslint/js` picked up 10.x against eslint 9, which made `npm ci`
fail with `ERESOLVE`. Pinned to `^9`.

CI would not have caught that. Both `npm ci` invocations carried
`--legacy-peer-deps`, which silences exactly this class of error — a leftover
from the eslint 3 stack, whose plugin set no longer exists. The flag was dropped
from `.circleci/config.yml` and from the `Dockerfile`, so a future peer conflict
fails the build instead of being installed around.

Verified with a plain `npm ci` from the lockfile alone in an empty directory,
and with a `docker build --no-cache`, which is the same install CI performs on
linux.

### Results

| | before phase 4 | after |
| --- | --- | --- |
| bundle | 259 kB JS | 291 kB JS (axios 1.x is larger) |
| lint | eslint 3, templates unchecked | eslint 9, 0 errors, 26 known warnings |
| runtime dependencies | 5 | 5 |
| Playwright | 35/35 | 36/36 |

Verified: `npm run build`, `npm run lint`, `npm ci --dry-run`, Playwright at
`--repeat-each=3` (108/108), and a `docker build` whose bundle carries the right
`GIT_VERSION`.

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
| 1 — Vite | ~~1–2 d~~ done |
| 2 — dependency removal | ~~1.5 d~~ done |
| 3 — the flip | ~~2–3 d~~ done |
| 4 — cleanup | ~~1.5 d~~ done |
| **Total** | **~8–10 d** |

---

## What is left

Nothing in this plan. The items below were out of scope throughout and remain
so; they are listed here so the next person does not have to re-derive them.

- Bootstrap 3 → 5 / design system replacement
- Chartist 0.10 → 1.x
- Composition API / `<script setup>` conversion, TypeScript
- The 26 `vue/no-mutating-props` warnings in `Configuration/*`
- `Overview/Relay.vue`'s `getGlobalStatus()` reporting `'Ok'` while loading
- `authService.renewToken()` is unexported, unused, and passes its headers as
  the request *body* — delete it or fix it
