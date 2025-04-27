import { defineBuildConfig } from 'unbuild'
import sharedConfig from './shared.config'

export default defineBuildConfig({
  entries: [
    // Main engine
    'src/index',

    // CLI app
    'src/cli-entry',
  ],
  declaration: 'node16',
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'esnext',
      // minify: true,
    },
  },
  ...sharedConfig,
})
