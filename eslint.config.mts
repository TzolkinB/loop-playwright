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
      'test-results/',
      'coverage/',
      '*.min.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPlaywright.configs['flat/recommended'],
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
  },
  prettierConfig,
])
