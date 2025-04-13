import path from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [...configDefaults.include, 'test/**'],
    coverage: {
      exclude: [...configDefaults.coverage.exclude!, 'shared.config.ts'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
})
