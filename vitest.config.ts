import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json-summary'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/__tests__/**'],
      // Thresholds intentionally unset — coverage is tracked, not enforced yet.
    },
  },
})
