import { configDefaults, defineConfig } from 'vitest/config'
import sharedConfig from './shared.config'

export default defineConfig({
  test: {
    include: [...configDefaults.include, 'test/**'],
    coverage: {
      exclude: [...configDefaults.coverage.exclude!, 'shared.config.ts'],
    },
  },
  resolve: {
    alias: sharedConfig.alias,
  },
  ...sharedConfig,
})
