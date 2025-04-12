import { mkdir } from 'node:fs/promises'
import { resolve } from 'pathe'
import { rocketAssemble } from 'roo-rocket'

export interface createDevEnvironmentOptions {
  /**
   * The path in which the dev environment should be created at.
   * @default `.roo-rocket/` in the root directory
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

  await rocketAssemble({
    frameDir: resolve(import.meta.dirname, 'roos-zoo/main/frame'),
    fuelDir: resolve(import.meta.dirname, 'roos-zoo/fuel-garage'),
    outDir: resolve(import.meta.dirname, '../.roo-rocket'),
  })
}
await entry()
