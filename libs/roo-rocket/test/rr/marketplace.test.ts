import type { MarketplaceContext } from '~/rr/marketplace'
import { Buffer } from 'node:buffer'
import { Hookable } from 'hookable'
import { describe, expect, it } from 'vitest'
import { registerMarketplaceHooks } from '~/rr/marketplace'

describe('registerMarketplaceHooks', () => {
  it('should register hooks without errors', () => {
    const hookable = new Hookable()
    const context: MarketplaceContext = { target: 'project' }
    expect(() => registerMarketplaceHooks(hookable, context)).not.toThrow()
  })

  describe('onExtract hook', () => {
    it('should allow only specific files for global target', async () => {
      const hookable = new Hookable()
      const context: MarketplaceContext = {
        target: 'global',
        globalFileNames: { mcp: 'global-mcp.json', mode: 'global.roomodes' },
      }
      registerMarketplaceHooks(hookable, context)

      const validPayload = { unzipped: { '.roo/mcp.json': Buffer.from('{}'), '.roomodes': Buffer.from('') } }
      await expect(hookable.callHook('onExtract', validPayload)).resolves.not.toThrow()

      const invalidPayload = { unzipped: { 'some-other-file.txt': Buffer.from('test') } }
      await expect(hookable.callHook('onExtract', invalidPayload)).rejects.toThrow('Unsupported file for global installation: some-other-file.txt')

      const mixedPayload = { unzipped: { '.roo/mcp.json': Buffer.from('{}'), 'invalid.file': Buffer.from('') } }
      await expect(hookable.callHook('onExtract', mixedPayload)).rejects.toThrow('Unsupported file for global installation: invalid.file')
    })

    it('should not restrict files for local target (implicitly, as hook logic is conditional)', async () => {
      // While the hook is registered, the logic inside only applies to global.
      // We test this by ensuring no error is thrown when the hook is called,
      // even though the internal logic wouldn't run for local.
      const hookable = new Hookable()
      const context: MarketplaceContext = { target: 'project' }
      registerMarketplaceHooks(hookable, context)

      const payload = { unzipped: { 'any-file.txt': Buffer.from('test') } }
      // The hook itself doesn't throw for local, the check is inside
      await expect(hookable.callHook('onExtract', payload)).resolves.not.toThrow()
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
