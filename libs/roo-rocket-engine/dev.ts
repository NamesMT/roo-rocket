import { mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'pathe'
import { simpleRocketAssemble } from '~/rocket/assemble'

export interface createDevEnvironmentOptions {
  /**
   * The path in which the dev environment should be created at.
   * @default `.roo-rocket/` relative to the current `dev` file.
   */
  path?: string
}
async function createDevEnvironment(options: createDevEnvironmentOptions = {}) {
  const {
    path = resolve(import.meta.dirname, '.roo-rocket/'),
  } = options

  await mkdir(path, { recursive: true })
}

async function entry() {
  await createDevEnvironment()

  await simpleRocketAssemble({
    frameDir: resolve(import.meta.dirname, 'src/roos-zoo/main/frame'),
    variables: {
      '{{MEMORY_BANK_LOAD}}': await readFile(resolve(import.meta.dirname, 'src/roos-zoo/main/fuel/instruct_memory-bank-load.md'), { encoding: 'utf8' }),
    },
    outDir: resolve(import.meta.dirname, '.roo-rocket/'),
  })
}
await entry()
