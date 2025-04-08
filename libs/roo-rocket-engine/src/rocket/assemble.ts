import { readFile } from 'node:fs/promises'
import simpleWriteFileWithDirs from '@local/common/src/utils/fs/simpleWriteFileWithDirs'
import { replaceMap } from '@namesmt/utils'
import { resolve } from 'pathe'
import { glob } from 'tinyglobby'

export interface simpleRocketAssembleOptions {
  /**
   * Path to the rocket frame directory.
   */
  frameDir: string

  /**
   * The config variables map to put into the frame.
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
