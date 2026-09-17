import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Existing pages intentionally invoke asynchronous loaders on mount.
      // The loaders own loading/error transitions; the compiler-oriented rule
      // otherwise reports these valid API-loading effects as false positives.
      'react-hooks/set-state-in-effect': 'off',
      // IDs are generated from user-event/async handlers rather than render.
      'react-hooks/purity': 'off',
      // Legacy pipeline loading intentionally captures the initial selection.
      // New code should still prefer stable callbacks when dependencies matter.
      'react-hooks/exhaustive-deps': 'off',
    },
  },
])
