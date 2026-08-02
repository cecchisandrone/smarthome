# [Vue Paper Dashboard](https://cristijora.github.io/vue-paper-dashboard/) [![version][version-badge]][CHANGELOG] [![license][license-badge]][LICENSE]

> Admin dashboard based on paper dashboard UI template + vue-router

This project is a vue version of [Paper-dashboard](https://www.creative-tim.com/product/paper-dashboard)
designed for vue js.The dashboard includes vue-router and vuex

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
| `npm run lint` | eslint over `src/` |

`public/static/` is copied verbatim to `dist/static/`, which is why templates
reference images as `static/img/...`.

A Vue 3 migration is in progress — see [vue_migration.md](./vue_migration.md).

## Contribution guide
* `npm install` or `yarn install`
* If you use 3rd party libraries/components in more than 1 place make sure to define them globally for ease of use
  Example
  ```js
  Object.defineProperty(Vue.prototype, '$Chartist', {
    get() {
      return Chartist;
    }
  });
  ```
* Please don't use jQuery or jQuery based plugins since there are many pure Vue alternatives
* Cover new behaviour with an end-to-end spec in `e2e/specs/`

[CHANGELOG]: ./CHANGELOG.md
[LICENSE]: ./LICENSE.md
[version-badge]: https://img.shields.io/badge/version-1.0.0-blue.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
