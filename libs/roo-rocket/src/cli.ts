import { defineCommand, runMain } from 'citty'
import { logger } from '~/helpers/logger'

const main = defineCommand({
  args: {
    friendly: {
      type: 'boolean',
      description: 'Use friendly greeting',
    },
  },
  run({ args }) {
    logger.log(`${args.friendly ? 'Hi' : 'Greetings'}!`)
  },
})

runMain(main)
