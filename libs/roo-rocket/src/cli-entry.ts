#!/usr/bin/env node

import type { UnpackOptions } from 'config-rocket/cli'
import { readFile } from 'node:fs/promises'
import { defineCommand, runMain } from 'citty'
import { getValidGhRepoReleaseAssets, promptSelectGhAsset, unpackFromUrl } from 'config-rocket/cli'
import defu from 'defu'
import { createHooks } from 'hookable'
import { logger } from '~/helpers/logger'

// Main hookable instance
const rooRocketUnpackHookable = createHooks() as NonNullable<UnpackOptions['hookable']>

// Hook to only allow specific file patterns
rooRocketUnpackHookable.hook('onFrameFile', ({ filePath, skipFile }) => {
  if (!/^\.(?:roomodes|roo\/.*)$/.test(filePath)) {
    logger.warn(`Unallowed frame structure found: ${filePath}, skipping...`)
    skipFile()
  }
})

// Hooks to handle .roomodes merging
rooRocketUnpackHookable.hook('onFileOutput', async (state) => {
  if (state.filePath.endsWith('.roomodes')) {
    state.mergeType = 'json'
    state.isValidFileToMerge = true
  }
})
rooRocketUnpackHookable.hook('onFileOutputJsonMerge', async (state) => {
  if (state.filePath.endsWith('.roomodes')) {
    const existingModeSlugs = new Set<string>()
    const oldData = JSON.parse(await readFile(state.filePath, 'utf8'))
    const newData = JSON.parse(state.data)
    const mergedData = defu(newData, oldData)
    const dedupedModes = mergedData.customModes.filter((mode: any) => {
      if (!existingModeSlugs.has(mode.slug))
        return existingModeSlugs.add(mode.slug)
      return false
    })

    const result = { ...mergedData, customModes: dedupedModes }
    state.mergeResult = JSON.stringify(result, null, 2)
  }
})

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
      return await unpackFromUrl(url, { hookable: rooRocketUnpackHookable })

    const repoPatternMatch = repo.match(/^([\w-]+)\/([\w-]+)$/)
    if (!repoPatternMatch)
      throw new Error('Invalid repo format, expected "owner/repo-name"')

    const [, owner, name] = repoPatternMatch
    const availableAssets = await getValidGhRepoReleaseAssets(owner, name)
    if (!availableAssets.length)
      throw new Error(`No assets found for "${owner}/${name}"'s latest release`)

    const selectedAsset = await promptSelectGhAsset(availableAssets)

    return await unpackFromUrl(selectedAsset.browser_download_url, { hookable: rooRocketUnpackHookable })
  },
})

runMain(main)
