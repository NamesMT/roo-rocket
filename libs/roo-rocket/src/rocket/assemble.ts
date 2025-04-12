import { readFile } from 'node:fs/promises'
import simpleWriteFileWithDirs from '@local/common/src/utils/fs/simpleWriteFileWithDirs'
import { replaceMap } from '@namesmt/utils'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'
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
   * Output directory.
   */
  outDir: string
}
export async function simpleRocketAssemble(options: simpleRocketAssembleOptions) {
  const {
    frameDir,
    variables,
    outDir,
  } = options

  const frameFiles = await glob(resolve(frameDir, '**'), { dot: true, cwd: frameDir })

  for (const filePath of frameFiles) {
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

  const { resolvedVariables } = await parseRocketConfig(rocketConfigPath)

  const fueledVariables = await supplyFuel(resolvedVariables, fuelDir)

  await simpleRocketAssemble({
    frameDir,
    variables: fueledVariables,
    outDir,
  })
}
