import { bundleConfigPack } from 'config-rocket'
import { resolve } from 'pathe'

async function entry() {
  await bundleConfigPack({
    frameDir: resolve(import.meta.dirname, 'troops/main/frame'),
    fuelDir: resolve(import.meta.dirname, 'troops/@fuel-garage'),
    outDir: resolve(import.meta.dirname, '../dist'),
  })
}
await entry()
