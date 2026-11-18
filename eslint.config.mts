import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import eslintPluginPlaywright from 'eslint-plugin-playwright'
import tsEslintParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'app/dist/',
      'test-results/',
      'coverage/',
      '*.min.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Playwright rules do not apply to the Vitest unit tests, which use a different test API.
  {
    ...eslintPluginPlaywright.configs['flat/recommended'],
    ignores: ['unit/**'],
  },
  {
    files: ['tests/**/*.{ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
    },
  },
  {
    files: ['app/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['app/**/*.mjs', 'app/vite.config.mts'],
    languageOptions: { globals: globals.node },
  },
  prettierConfig,
])
