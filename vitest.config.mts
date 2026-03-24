import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**'],
    },
  },
})
