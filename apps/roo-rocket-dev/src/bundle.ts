import { resolve } from 'pathe'
import { bundleConfigPack } from 'roo-rocket'

async function entry() {
  await bundleConfigPack({
    frameDir: resolve(import.meta.dirname, 'troops/main/frame'),
    fuelDir: resolve(import.meta.dirname, 'troops/fuel-garage'),
    outDir: resolve(import.meta.dirname, '../dist'),
  })
}
await entry()
