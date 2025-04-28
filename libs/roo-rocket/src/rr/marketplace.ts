/**
 * @module rr/marketplace
 * @description This module contains special instructions and functions for Roo Marketplace use.
 */

import type { Hookable } from 'hookable'

export type MarketplaceContext = (
  {
    target: 'local'
  } | {
    target: 'global'
    globalFileNames: {
      mcp: string
      mode: string
    }
  }
)

export function assertsMpContext(context: MarketplaceContext): asserts context is MarketplaceContext {
  // ### Target
  if (!context.target)
    throw new Error('`target` is required')

  if (context.target !== 'global' && context.target !== 'local')
    throw new Error('`target` must be either "global" or "local"')

  // ### Global File Names
  if (context.target === 'global') {
    if (!context.globalFileNames)
      throw new Error('`globalFileNames` is required when `target` is "global"')

    if (!context.globalFileNames.mcp)
      throw new Error('`globalFileNames.mcp` is required')

    if (!context.globalFileNames.mode)
      throw new Error('`globalFileNames.mode` is required')
  }
}

export function registerMarketplaceHooks(hookable: Hookable, context: MarketplaceContext) {
  hookable.hook('onExtract', ({ unzipped }) => {
    if (context.target === 'global') {
      const allowedFiles = new Set(['.roo/mcp.json', '.roomodes'])
      for (const key in unzipped) {
        if (!allowedFiles.has(key))
          throw new Error(`Unsupported file for global installation: ${key}`)
      }
    }
  })
  hookable.hook('onFileOutput', (state) => {
    if (context.target === 'global') {
      if (state.filePath.endsWith('/.roo/mcp.json'))
        state.filePath = state.filePath.replace('.roo/mcp.json', context.globalFileNames.mcp)
      else if (state.filePath.endsWith('/.roomodes'))
        state.filePath = state.filePath.replace('.roomodes', context.globalFileNames.mode)
    }
  })
}
