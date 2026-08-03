import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import neostandard from 'neostandard'
import globals from 'globals'

/**
 * Flat config, replacing the eslint 3 setup that `.eslintrc.json` carried.
 *
 * The old stack could not see inside a .vue file at all: `eslint-plugin-html`
 * only extracted <script> blocks, so nothing ever checked a template. That is
 * the main reason for this upgrade - `eslint-plugin-vue` parses templates, and
 * would have caught several of the problems phase 3 found by hand (v-for
 * without :key, v-if and v-for on one element, unbalanced tags).
 *
 * `vue/flat/essential` is deliberate: it is the error-prevention tier only.
 * `vue/flat/recommended` adds house-style rules (attribute order, self-closing
 * tags, multi-word component names) that would rewrite most of this codebase
 * for no behavioural gain.
 */
export default [
  { ignores: ['dist/**', 'test-results/**', 'playwright-report/**'] },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // neostandard is the flat-config successor to eslint-config-standard, which
  // is what this project used before.
  ...neostandard({ semi: false }),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // Every component here is a single word (Relay, Overview, Gate...) and
      // has been since 2017. Renaming 39 files and their call sites to satisfy
      // a naming convention buys nothing.
      'vue/multi-word-component-names': 'off'
    }
  },

  {
    files: ['**/*.vue'],
    rules: {
      // The SFC house style indents <script> contents one extra level. It is
      // consistent across the codebase; reformatting ~1800 lines to satisfy the
      // default would bury every real finding in whitespace.
      '@stylistic/indent': 'off',

      // Real, and pervasive: the Configuration/* device forms v-model straight
      // into a prop object owned by Configuration.vue. Fixing it means giving
      // those nine components their own local copy and emitting changes up,
      // which is a data-flow redesign rather than cleanup. Kept visible as a
      // warning so it does not get forgotten.
      'vue/no-mutating-props': 'warn'
    }
  }
]
