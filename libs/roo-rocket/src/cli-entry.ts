#!/usr/bin/env node

import { defineCommand, runMain } from 'citty'
import { getValidGhRepoReleaseAssets, promptSelectGhAsset, unpackFromUrl } from 'config-rocket/cli'
import { hookable } from '~/rr/hookable'
import { assertsMpContext, registerMarketplaceHooks } from '~/rr/marketplace'

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
        '  \t"true": will extract without asking',
        '  \t"false": will abort the process',
        '  \tDefault (not specified): will prompt user.\n',
      ].join('\n'),
      default: undefined,
    },
    sha256: {
      type: 'string',
      description: `If specified, will verify the downloaded archive's sha256 hash (base64url)`,
    },
    mp: {
      type: 'string',
      description: 'Special arg for Roo Marketplace use, accepts a JSON string for context options',
    },
  },
  async run({ args }) {
    const {
      url,
      repo,
      pack,
      nonAssemblyBehavior,
      sha256,
      mp,
    } = args

    if (!url && !repo)
      throw new Error('`url` or `repo` is required')

    if (mp) {
      const mpContext = JSON.parse(mp)
      assertsMpContext(mpContext)
      registerMarketplaceHooks(hookable, mpContext)
    }

    if (url) {
      return await unpackFromUrl(url, {
        nonAssemblyBehavior,
        sha256,
        hookable,
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
      hookable,
    })
  },
})

runMain(main)
