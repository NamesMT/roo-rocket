/**
 * @module rr/marketplace
 * @description This module contains special instructions and functions for Roo Marketplace use.
 */

import type { UnpackOptions } from 'config-rocket/cli'
import { logger } from '~/helpers/logger'

export type MarketplaceContext = (
  {
    target: 'project'
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

  if (context.target !== 'global' && context.target !== 'project')
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

export function registerMarketplaceHooks(hookable: NonNullable<UnpackOptions['hookable']>, context: MarketplaceContext) {
  hookable.hook('onFrameFile', ({ filePath, skipFile }) => {
    const allowedFiles = new Set(['.roo/mcp.json', '.roomodes'])
    if (context.target === 'global') {
      if (!allowedFiles.has(filePath)) {
        logger.warn(`Unsupported file for global installation: ${filePath}, skipping...`)
        skipFile()
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
