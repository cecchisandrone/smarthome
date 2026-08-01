// Browser targets come from the `browserslist` key in package.json.
module.exports = {
  presets: [
    ['@babel/preset-env', {
      // let webpack handle ES modules so it can tree-shake
      modules: false
    }]
  ],
  plugins: ['@babel/plugin-transform-runtime'],
  comments: false,
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ],
      plugins: ['babel-plugin-istanbul']
    }
  }
}
