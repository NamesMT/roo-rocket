import { defineRocketConfig } from '~/rocket/config'

export default defineRocketConfig({
  parameters: [{
    id: 'MEMORY_BANK_LOAD-disabled',
    resolver: {
      operation: 'prompt',
      label: 'Disable "Memory Bank Load" instruction?',
      type: 'confirm',
      initial: false,
    },
  }],

  variablesResolver: {
    '{{MEMORY_BANK_LOAD}}': {
      type: 'match',
      subject: 'MEMORY_BANK_LOAD-disabled',
      condition: false,
      result: 'fuel:instruct_memory-bank-load.md',
    },
  },
})
