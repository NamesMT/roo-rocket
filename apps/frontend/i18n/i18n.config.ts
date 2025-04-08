import en from '@local/locales/dist/en.json'
import vi from '@local/locales/dist/vi.json'
import { defaultOptions } from '@local/locales/src/index'

export default defineI18nConfig(() => ({
  ...defaultOptions,
  messages: {
    en,
    vi,
  },
}))
