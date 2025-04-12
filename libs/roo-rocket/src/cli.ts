import { rm } from 'node:fs/promises'
import simpleWriteFileWithDirs from '@local/common/src/utils/fs/simpleWriteFileWithDirs'
import { defineCommand, runMain } from 'citty'
import { strFromU8, unzip } from 'fflate'
import { join } from 'pathe'
import { logger } from '~/helpers/logger'
import { rocketAssemble } from '~/rocket/assemble'

async function unpackFromUrl(url: string) {
  logger.info(`Downloading config pack from ${url}`)

  const res = await fetch(url)

  if (!res.ok)
    throw new Error(`Failed to download config pack from ${url}`)

  const configPackBuffer = new Uint8Array(await res.arrayBuffer())

  logger.start('Extracting config pack to `.tmp`...')
  await new Promise<void>((resolvePromise, rejectPromise) => {
    unzip(configPackBuffer, async (err, unzipped) => {
      if (err) {
        return rejectPromise(new Error('Failed to extract the config pack.'))
      }

      if (!unzipped['rocket.config.json5'])
        return rejectPromise(new Error('Invalid config pack: "rocket.config.json5" not found.'))

      for (const [key, value] of Object.entries(unzipped))
        await simpleWriteFileWithDirs(join('.tmp', key), strFromU8(value))

      resolvePromise()
    })
  })
  logger.success('Extracted successfully.')

  logger.start('Assembling the config according to `rocketConfig`...')
  await rocketAssemble({
    frameDir: join('.tmp', 'frame'),
    fuelDir: join('.tmp', 'fuel'),
    outDir: '.',
  })
  logger.start('Assembled successfully, removing temporary files...')
  await rm('.tmp', { recursive: true })
  logger.success('All done, enjoy your new config!')
}

const main = defineCommand({
  meta: {
    name: 'roo-rocket',
    description: 'Roo Rocket CLI',
  },
  args: {
    url: {
      type: 'string',
      description: 'The direct URL to the config pack',
    },
    repo: {
      type: 'string',
      description: 'The github repository slug (e.g: NamesMT/roo-rocket)',
    },
  },
  async run({ args }) {
    const { url, repo } = args

    if (!url && !repo)
      throw new Error('`url` or `repo` is required')

    if (url)
      return await unpackFromUrl(url)
  },
})

runMain(main)
