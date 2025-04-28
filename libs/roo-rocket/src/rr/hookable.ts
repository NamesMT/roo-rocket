/**
 * @module rr/hookable
 * @description This module contains the main hookable instance of Roo Rocket, with default hooks registered.
 */

import type { UnpackOptions } from 'config-rocket/cli'
import { readFile } from 'node:fs/promises'
import defu from 'defu'
import { createHooks } from 'hookable'
import { logger } from '~/helpers/logger'

/**
 * Workaround for unjs/hookable#116
 */
export function createHookable(): NonNullable<UnpackOptions['hookable']> {
  const instance = createHooks() as NonNullable<UnpackOptions['hookable']>

  // Hook to only allow specific file patterns
  instance.hook('onFrameFile', ({ filePath, skipFile }) => {
    if (!/^\.(?:roomodes|roo\/.*)$/.test(filePath)) {
      logger.warn(`Unallowed frame structure found: ${filePath}, skipping...`)
      skipFile()
    }
  })

  // Hooks to handle .roomodes merging
  instance.hook('onFileOutput', async (state) => {
    if (state.filePath.endsWith('.roomodes')) {
      state.mergeType = 'json'
      state.isValidFileToMerge = true
    }
  })
  instance.hook('onFileOutputJsonMerge', async (state) => {
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
  instance.hook('onFileOutputJsonMerge', async (state) => {
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

  return instance
}

/**
 * Main hookable instance of Roo Rocket, with default hooks registered.
 */
export const hookable: NonNullable<UnpackOptions['hookable']> = createHookable()
