import { readFile } from 'node:fs/promises'
import simpleWriteFileWithDirs from '@local/common/src/utils/fs/simpleWriteFileWithDirs'
import { replaceMap } from '@namesmt/utils'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'
import { logger } from '~/helpers/logger'
import { parseRocketConfig, supplyFuel } from './config'

export interface simpleRocketAssembleOptions {
  /**
   * Path to the rocket frame directory.
   */
  frameDir: string

  /**
   * The variables map to put into the frame.
   */
  variables: Record<string, string>

  /**
   * The excludes map to skip files from the frame.
   */
  excludes: Record<string, boolean>

  /**
   * Output directory.
   */
  outDir: string
}
export async function simpleRocketAssemble(options: simpleRocketAssembleOptions) {
  const {
    frameDir,
    variables,
    excludes,
    outDir,
  } = options

  const frameFiles = await glob(resolve(frameDir, '**'), { dot: true, cwd: frameDir })

  for (const filePath of frameFiles) {
    if (excludes[filePath]) {
      logger.debug(`Skipping excluded file: ${filePath}`)
      continue
    }

    if (!/^\.(?:roomodes|roo\/.*)$/.test(filePath)) {
      logger.warn(`Unallowed frame structure found: ${filePath}, skipping...`)
      continue
    }

    const fileContent = await readFile(resolve(frameDir, filePath), { encoding: 'utf8' })
      .then(content => replaceMap(content, variables))

    await simpleWriteFileWithDirs(resolve(outDir, filePath), fileContent)
  }
}

export interface rocketAssembleOptions {
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
   * The
   */

  /**
   * Output directory.
   */
  outDir: string
}
export async function rocketAssemble(options: rocketAssembleOptions) {
  const {
    frameDir,
    rocketConfig,
    fuelDir,
    outDir,
  } = options

  const rocketConfigPath = rocketConfig ?? resolve(frameDir, '../rocket.config')

  const { resolvedVariables, resolvedExcludes } = await parseRocketConfig(rocketConfigPath)

  const fueledVariables = await supplyFuel(resolvedVariables, fuelDir)

  await simpleRocketAssemble({
    frameDir,
    variables: fueledVariables,
    excludes: resolvedExcludes,
    outDir,
  })
}
