var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge').merge
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var child_process = require('child_process')

var getGitVersion = function () {
  try {
    return child_process.execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch (e) {
    return 'unknown'
  }
}

var devEnv = Object.assign({}, config.dev.env)
devEnv.GIT_VERSION = '"' + getGitVersion() + '"'

// http-proxy-middleware style table -> webpack-dev-server 5 proxy array
var proxy = Object.keys(config.dev.proxyTable).map(function (context) {
  var entry = config.dev.proxyTable[context]
  var options = typeof entry === 'string' ? { target: entry } : Object.assign({}, entry)
  options.context = options.filter || context
  delete options.filter
  return options
})

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-cheap-module-source-map is faster for development
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': devEnv
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  devServer: {
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    // HotModuleReplacementPlugin is added by the dev server itself
    hot: true,
    historyApiFallback: true,
    client: {
      // warnings are reported in the terminal; only errors are worth
      // covering the app with a full-screen overlay
      overlay: {
        errors: true,
        warnings: false
      }
    },
    // serve pure static assets
    static: {
      directory: path.resolve(__dirname, '../static'),
      publicPath: path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
    },
    proxy: proxy.length ? proxy : undefined
  }
})
