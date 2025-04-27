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
      if (existingModeSlugs.has(mode.slug)) {
        logger.info(`Present roomode entry overwritten: ${mode.slug}`)
        return false
      }

      return existingModeSlugs.add(mode.slug) && true
    })

    const result = { ...mergedData, customModes: dedupedModes }
    state.mergeResult = JSON.stringify(result, null, 2)
  }
})

// Hook to handle mcp.json merging
rooRocketUnpackHookable.hook('onFileOutputJsonMerge', async (state) => {
  if (state.filePath.endsWith('.roo/mcp.json')) {
    const oldData = JSON.parse(await readFile(state.filePath, 'utf8'))
    const newData = JSON.parse(state.data)
    const mergedData = structuredClone(newData)
    for (const [key, value] of Object.entries(oldData.mcpServers)) {
      if (key in mergedData.mcpServers) {
        logger.info(`Present mcp server entry overwritten: ${key}`)
        continue
      }

      mergedData.mcpServers[key] = value
    }

    state.mergeResult = JSON.stringify(mergedData, null, 2)
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
      description: 'The github repository slug (e.g: NamesMT/config-packs), will list out available archives from latest release.',
    },
    pack: {
      type: 'string',
      description: 'The config pack name to auto-select from the repo',
    },
    nonAssemblyBehavior: {
      type: 'boolean',
      description: [
        'Control the behavior when encountering non-assembly config packs:',
        '"true": will extract without asking',
        '"false": will abort the process',
        'Default (not specified): will prompt user',
      ].join('\n'),
      default: undefined,
    },
    sha256: {
      type: 'string',
      description: `If specified, will verify the downloaded archive's sha256 hash (base64url)`,
    },
  },
  async run({ args }) {
    const {
      url,
      repo,
      pack,
      nonAssemblyBehavior,
      sha256,
    } = args

    if (!url && !repo)
      throw new Error('`url` or `repo` is required')

    if (url) {
      return await unpackFromUrl(url, {
        nonAssemblyBehavior,
        sha256,
        hookable: rooRocketUnpackHookable,
      })
    }

    const repoPatternMatch = repo.match(/^([\w-]+)\/([\w-]+)$/)
    if (!repoPatternMatch)
      throw new Error('Invalid repo format, expected "owner/repo-name"')

    const [, owner, name] = repoPatternMatch
    const availableAssets = await getValidGhRepoReleaseAssets(owner, name)
    if (!availableAssets.length)
      throw new Error(`No assets found for "${owner}/${name}"'s latest release`)

    const selectedAsset = pack
      ? availableAssets.find(a => a.name === pack)
      : await promptSelectGhAsset(availableAssets)

    // This is only encountered if user provided a pack name, so error message is specific to it
    if (!selectedAsset)
      throw new Error(`pack "${pack}" is not found in the latest release of "${owner}/${name}"`)

    return await unpackFromUrl(selectedAsset.browser_download_url, {
      nonAssemblyBehavior,
      sha256,
      hookable: rooRocketUnpackHookable,
    })
  },
})

runMain(main)
