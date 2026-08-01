var path = require('path')
var config = require('../config')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  function cssLoader (importLoaders) {
    return {
      loader: 'css-loader',
      options: {
        sourceMap: options.sourceMap,
        importLoaders: importLoaders
      }
    }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate the loader chain used for a given preprocessor
  function generateLoaders (loader, loaderOptions) {
    // css-loader has to know how many loaders run before it so that
    // `@import`ed files get piped back through the same chain
    var loaders = [cssLoader(loader ? 2 : 1), postcssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS into its own file when that option is specified
    // (which is the case during production build). In development the
    // styles are injected at runtime so HMR can swap them out.
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders)
    }
    return ['vue-style-loader'].concat(loaders)
  }

  // sass-loader still defaults to Dart Sass' legacy JS API, which is slated
  // for removal in Dart Sass 2.0 - opt into the modern one. It derives the
  // indented syntax from the file extension, so `.sass` needs nothing extra.
  var sassOptions = { api: 'modern-compiler' }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', sassOptions),
    scss: generateLoaders('sass', sassOptions),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue).
// vue-loader routes <style> blocks through these same rules.
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loaders[extension]
    })
  }
  return output
}
