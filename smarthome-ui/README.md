# [Vue Paper Dashboard](https://cristijora.github.io/vue-paper-dashboard/) [![version][version-badge]][CHANGELOG] [![license][license-badge]][LICENSE]

> Admin dashboard based on paper dashboard UI template + vue-router

This project is a vue version of [Paper-dashboard](https://www.creative-tim.com/product/paper-dashboard)
designed for vue js. Built on Vue 3 with vue-router 4, using the Options API.

Check the [Live Demo here](https://cristijora.github.io/vue-paper-dashboard).

![](http://i.imgur.com/3iC1hOs.gif)

## Documentation
Link to [Documentation](https://cristijora.github.io/vue-paper-dashboard-docs/#/)

## Build Setup

Built with [Vite](https://vite.dev/). Requires Node `^20.19.0 || >=22.12.0`.

| Command | What it does |
| --- | --- |
| `npm install` | install dependencies |
| `npm run dev` | dev server with HMR at localhost:8090, opens a browser |
| `npm run dev:test` | same, without opening a browser |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the built `dist/` locally |
| `npm run e2e` | Playwright end-to-end suite (see [e2e/README.md](./e2e/README.md)) |
| `npm run e2e:ui` | the same suite in Playwright's UI mode |
| `npm run lint` | eslint 9 (flat config) over `src/`, templates included |
| `npm run lint:fix` | the same, applying the auto-fixable rules |

`public/static/` is copied verbatim to `dist/static/`, which is why templates
reference images as `static/img/...`.

Build-time constants reach the app as `import.meta.env.API_ENDPOINT` and
`import.meta.env.GIT_VERSION`, both substituted by `vite.config.js`.

The Vue 2 → Vue 3 migration is complete; [vue_migration.md](./vue_migration.md)
records what changed and why.

## Contribution guide
* `npm install`
* If you use 3rd party libraries/components in more than 1 place make sure to define them globally for ease of use.
  Register them on the app instance in `src/main.js`:
  ```js
  app.config.globalProperties.$Chartist = Chartist
  ```
* Please don't use jQuery or jQuery based plugins since there are many pure Vue alternatives
* Cover new behaviour with an end-to-end spec in `e2e/specs/`
* `npm run lint` must be error-free. It reports 26 known
  `vue/no-mutating-props` warnings in `Configuration/*` — see
  [vue_migration.md](./vue_migration.md); don't add more

[CHANGELOG]: ./CHANGELOG.md
[LICENSE]: ./LICENSE.md
[version-badge]: https://img.shields.io/badge/version-1.0.0-blue.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
