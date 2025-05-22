import type { MarketplaceContext } from '~/rr/marketplace'
import { Buffer } from 'node:buffer'
import { Hookable } from 'hookable'
import { describe, expect, it, vi } from 'vitest'
import { registerMarketplaceHooks } from '~/rr/marketplace'

describe('registerMarketplaceHooks', () => {
  it('should register hooks without errors', () => {
    const hookable = new Hookable()
    const context: MarketplaceContext = { target: 'project' }
    expect(() => registerMarketplaceHooks(hookable, context)).not.toThrow()
  })

  describe('onFrameFile hook', () => {
    it('should allow only specific files for global target and skip others', async () => {
      const hookable = new Hookable()
      const context: MarketplaceContext = {
        target: 'global',
        globalFileNames: { mcp: 'global-mcp.json', mode: 'global.roomodes' },
      }
      registerMarketplaceHooks(hookable, context)

      const skipFileMock = vi.fn()

      // Valid files
      await hookable.callHook('onFrameFile', { filePath: '.roo/mcp.json', skipFile: skipFileMock })
      expect(skipFileMock).not.toHaveBeenCalled()

      await hookable.callHook('onFrameFile', { filePath: '.roomodes', skipFile: skipFileMock })
      expect(skipFileMock).not.toHaveBeenCalled()

      // Invalid file
      skipFileMock.mockClear() // Clear previous calls if any (though there shouldn't be)
      await hookable.callHook('onFrameFile', { filePath: 'some-other-file.txt', skipFile: skipFileMock })
      expect(skipFileMock).toHaveBeenCalledTimes(1)

      // Mixed scenario (one valid, one invalid - though hook is called per file)
      // Test invalid file again to ensure skipFile is called
      skipFileMock.mockClear()
      await hookable.callHook('onFrameFile', { filePath: 'invalid.file', skipFile: skipFileMock })
      expect(skipFileMock).toHaveBeenCalledTimes(1)
    })

    it('should not skip files for project target', async () => {
      const hookable = new Hookable()
      const context: MarketplaceContext = { target: 'project' }
      registerMarketplaceHooks(hookable, context)

      const skipFileMock = vi.fn()
      await hookable.callHook('onFrameFile', { filePath: 'any-file.txt', skipFile: skipFileMock })
      expect(skipFileMock).not.toHaveBeenCalled()

      await hookable.callHook('onFrameFile', { filePath: '.roo/mcp.json', skipFile: skipFileMock })
      expect(skipFileMock).not.toHaveBeenCalled()
    })
  })

  describe('onFileOutput hook', () => {
    it('should rename files correctly for global target', async () => {
      const hookable = new Hookable()
      const context: MarketplaceContext = {
        target: 'global',
        globalFileNames: { mcp: 'custom-mcp-name.json', mode: 'custom-modes-file' },
      }
      registerMarketplaceHooks(hookable, context)

      const stateMcp = { filePath: '/output/path/.roo/mcp.json', content: Buffer.from('{}') }
      await hookable.callHook('onFileOutput', stateMcp)
      expect(stateMcp.filePath).toBe('/output/path/custom-mcp-name.json')

      const stateMode = { filePath: '/output/path/.roomodes', content: Buffer.from('') }
      await hookable.callHook('onFileOutput', stateMode)
      expect(stateMode.filePath).toBe('/output/path/custom-modes-file')

      const stateOther = { filePath: '/output/path/other.txt', content: Buffer.from('test') }
      await hookable.callHook('onFileOutput', stateOther)
      expect(stateOther.filePath).toBe('/output/path/other.txt') // Should not change
    })

    it('should not rename files for local target', async () => {
      const hookable = new Hookable()
      const context: MarketplaceContext = { target: 'project' }
      registerMarketplaceHooks(hookable, context)

      const stateMcp = { filePath: '/output/path/.roo/mcp.json', content: Buffer.from('{}') }
      await hookable.callHook('onFileOutput', stateMcp)
      expect(stateMcp.filePath).toBe('/output/path/.roo/mcp.json') // Should not change

      const stateMode = { filePath: '/output/path/.roomodes', content: Buffer.from('') }
      await hookable.callHook('onFileOutput', stateMode)
      expect(stateMode.filePath).toBe('/output/path/.roomodes') // Should not change
    })
  })
})
