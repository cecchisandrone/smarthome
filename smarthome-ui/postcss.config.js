// Autoprefixer used to run inside vue-loader 10 (see the old
// build/vue-loader.conf.js). vue-loader 15 dropped that hook, so postcss is
// wired up explicitly here instead. Browser targets come from the
// `browserslist` key in package.json.
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
