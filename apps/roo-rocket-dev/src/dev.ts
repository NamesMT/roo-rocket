import { mkdir, rm } from 'node:fs/promises'
import { resolve } from 'pathe'
import { rocketAssemble } from 'roo-rocket'

export interface createDevEnvironmentOptions {
  /**
   * The path in which the dev environment should be created at.
   * @default `.roo-rocket/` in the root directory
   */
  path?: string

  /**
   * Whether to clean old available files before spitting out the new ones.
   */
  clean?: boolean
}
async function createDevEnvironment(options: createDevEnvironmentOptions = {}) {
  const {
    path = resolve(import.meta.dirname, '../.roo-rocket/'),
    clean,
  } = options

  if (clean)
    await rm(path, { recursive: true, force: true })

  await mkdir(path, { recursive: true })
}

async function entry() {
  await createDevEnvironment({ clean: true })

  await rocketAssemble({
    frameDir: resolve(import.meta.dirname, 'troops/main/frame'),
    fuelDir: resolve(import.meta.dirname, 'troops/fuel-garage'),
    outDir: resolve(import.meta.dirname, '../.roo-rocket'),
  })
}
await entry()
