import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { execSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'

const resolve = dir => fileURLToPath(new URL(dir, import.meta.url))

const API_ENDPOINT = {
  development: 'http://localhost:8080/api/v1',
  production: 'http://smarthome.cecchisandrone.net:8080/api/v1'
}

/**
 * Short commit of the build. GIT_VERSION is preferred so the Docker build can
 * be told the revision: the image is built with `smarthome-ui` as the context,
 * which puts the repo's .git one level above it and out of reach of `git` in
 * the container. Falls back to asking git directly for local builds.
 */
function gitVersion () {
  if (process.env.GIT_VERSION) {
    return process.env.GIT_VERSION.trim().slice(0, 7)
  }
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch (e) {
    return 'unknown'
  }
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      vue({
        // vue-loader 15 only rewrote asset URLs that began with './', '~' or
        // '@'. Every image reference in this app is a bare 'static/img/...'
        // public path, which it therefore left alone. plugin-vue2 is less
        // conservative and would try to bundle them, so turn the transform off
        // to keep the old behaviour. Nothing in src/ imports an image.
        template: { transformAssetUrls: false }
      })
    ],

    // Relative asset URLs, so the built bundle does not care what path nginx
    // serves it from. Matches the old config.build.assetsPublicPath of ''.
    base: './',

    resolve: {
      // The webpack build resolved bare 'src/...', 'components/...' and
      // 'assets/...' specifiers; ~90 imports across src/ still use them.
      alias: {
        src: resolve('./src'),
        assets: resolve('./src/assets'),
        components: resolve('./src/components')
      }
    },

    /**
     * The 16 service files and ContentFooter.vue read process.env.* directly,
     * exactly as webpack's DefinePlugin used to substitute it. Replacing the
     * whole `process.env` expression keeps them working untouched; main.js
     * also does `window['environment'] = process.env`.
     *
     * Phase 4 may convert these to import.meta.env.
     */
    define: {
      'process.env': JSON.stringify({
        NODE_ENV: isProduction ? 'production' : 'development',
        API_ENDPOINT: isProduction ? API_ENDPOINT.production : API_ENDPOINT.development,
        GIT_VERSION: gitVersion()
      })
    },

    // Was `static/` at the repo root, copied to dist/static by webpack. Vite
    // copies publicDir to the root of outDir, so it lives one level deeper to
    // keep the emitted paths (and every `static/img/...` template reference)
    // identical.
    publicDir: 'public',

    css: {
      preprocessorOptions: {
        scss: {
          // Dart Sass' legacy JS API is slated for removal in 2.0.
          api: 'modern-compiler'
        }
      }
    },

    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: true,
      // Bootstrap 3 plus the theme is a big single chunk; the old webpack build
      // warned about it too. Raised so the warning does not read as an error.
      chunkSizeWarningLimit: 1000
    },

    server: {
      port: Number(process.env.PORT) || 8090,
      strictPort: true
    },

    preview: {
      port: Number(process.env.PORT) || 8090,
      strictPort: true
    }
  }
})
