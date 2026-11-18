import { defineConfig } from 'vitest/config'

// Unit tests only. Vitest's default pattern would also match the Playwright
// specs, so name the folder explicitly and keep it outside the Playwright
// test directory.
export default defineConfig({
  test: {
    include: ['unit/**/*.test.ts'],
    environment: 'node',
  },
})
