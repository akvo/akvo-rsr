import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-xhr-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor'

const getLanguage = () => i18n.language || 'en'
const currentlang = getLanguage()
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(Backend)
  .use(intervalPlural)
  .init({
    nsSeparator: '~',
    keySeparator: '::',
    backend: {
      loadPath: `/${currentlang}/project-dir-translations.json`
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  })

export default i18n
