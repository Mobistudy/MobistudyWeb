import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

// read about 18n
// https://blog.flycode.com/step-by-step-how-to-create-a-vue-multi-language-app-with-vue-i18n
// https://quasar.dev/options/app-internationalization

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages
})

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})
