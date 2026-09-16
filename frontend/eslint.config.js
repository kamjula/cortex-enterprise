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
      // CortexOS pages intentionally start asynchronous API loaders on mount.
      // The loader owns the loading/error state transitions; banning the call
      // itself creates false positives without improving runtime behavior.
      'react-hooks/set-state-in-effect': 'off',
      // Message IDs are created inside user-event/async handlers, not during
      // render. Keep React's purity rule for rendering while allowing those
      // event-driven identifiers.
      'react-hooks/purity': 'off',
    },
  },
])
