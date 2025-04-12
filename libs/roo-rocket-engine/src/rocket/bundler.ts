import type { Zippable } from 'fflate'
import type { RocketConfig } from './config'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { stringifyJSON5 } from 'confbox'
import { strToU8, zip } from 'fflate'
import { dirname, join, relative, resolve } from 'pathe'
import { logger } from '~/helpers/logger'
import { loadRocketConfig } from './config'

export async function extractReferencedFuels(rocketConfig: RocketConfig): Promise<string[]> {
  // Using a regexp string match for now, I'll see the feedbacks if we need to actually traverse the JSON tree.

  const rocketConfigStr = JSON.stringify(rocketConfig)

  // Matches strings like `fuel:path/to/fuel.txt` or `fuel:path/with"quotes".txt` within the stringified config
  const fuelMatches = rocketConfigStr.matchAll(/"fuel:((?:\\"|[^"])*)"/g) // Find "fuel:path" pattern, handling escaped quotes

  return Array.from(fuelMatches, m => m[1]).map(p => p.replace(/\\(.)/g, '$1'))
}

export interface bundleConfigPackOptions {
  /**
   * Path to the rocket frame directory.
   */
  frameDir: string

  /**
   * Path to the rocket config file.
   *
   * @default `rocket.config.ts` in parent of `frameDir`.
   */
  rocketConfig?: string

  /**
   * Path to the rocket fuel directory.
   */
  fuelDir: string

  /**
   * Output directory.
   */
  outDir: string
}
export async function bundleConfigPack(options: bundleConfigPackOptions) {
  const {
    frameDir,
    rocketConfig,
    fuelDir,
    outDir,
  } = options

  const rocketConfigPath = rocketConfig ?? resolve(frameDir, '../rocket.config.ts')

  const loadedRocketConfig = await loadRocketConfig(rocketConfigPath)

  const referencedFuels = (await extractReferencedFuels(loadedRocketConfig))

  const outputPath = join(outDir, 'rocket-bundle.zip')

  await createBundle({
    loadedRocketConfig,
    frameDir,
    fuelDir,
    referencedFuels,
    outputPath,
  })

  logger.success(`Rocket bundle created successfully at: ${outputPath}`)
}

interface createBundleOptions {
  loadedRocketConfig: RocketConfig
  frameDir: string
  fuelDir: string
  referencedFuels: string[]
  outputPath: string
}
async function createBundle(options: createBundleOptions): Promise<void> {
  const { loadedRocketConfig, frameDir, fuelDir, referencedFuels, outputPath } = options

  const zipData: Zippable = {}

  // 1. Add rocket.config.json5
  try {
    const configStr = stringifyJSON5(loadedRocketConfig, { space: 2 })
    zipData['rocket.config.json5'] = strToU8(configStr)
  }
  catch (error) {
    console.error('Error serializing rocket config:', error)
    throw new Error('Failed to serialize rocket config to JSON5.')
  }

  // 2. Add frame directory
  try {
    await addDirectoryToZip(zipData, frameDir, 'frame', frameDir)
  }
  catch (error) {
    console.error(`Error adding frame directory (${frameDir}):`, error)
    throw new Error('Failed to bundle frame directory.')
  }

  // 3. Add referenced fuels
  for (const fuelPath of referencedFuels) {
    const filePath = join(fuelDir, fuelPath)
    const zipPath = join('fuel', fuelPath)
    try {
      const content = await readFile(filePath)
      zipData[zipPath] = content
    }
    catch {
      throw new Error(`Failed to read fuel file: ${filePath}`)
    }
  }

  // 4. Create and write the zip file asynchronously
  await new Promise<void>((resolvePromise, rejectPromise) => {
    zip(zipData, async (err, data) => {
      if (err) {
        console.error(`Error during zip operation for ${outputPath}:`, err)
        return rejectPromise(new Error('Failed during zip operation.'))
      }

      // Create the output directory if it doesn't exist
      await mkdir(dirname(outputPath), { recursive: true })

      await writeFile(outputPath, data)
        .then(() => resolvePromise())
        .catch((writeErr) => {
          console.error(`Error writing zip file (${outputPath}):`, writeErr)
          rejectPromise(new Error('Failed to write zip bundle.'))
        })
    })
  })
}

async function addDirectoryToZip(
  zipData: Zippable,
  dirPath: string,
  zipPrefix: string,
  baseDir: string,
): Promise<void> {
  const entries = await readdir(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    const relativePath = relative(baseDir, fullPath)
    const zipPath = join(zipPrefix, relativePath)

    if (entry.isDirectory()) {
      await addDirectoryToZip(zipData, fullPath, zipPrefix, baseDir)
    }
    else if (entry.isFile()) {
      const content = await readFile(fullPath)
      zipData[zipPath] = content // fflate accepts Buffer directly
    }
  }
}
