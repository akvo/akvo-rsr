import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import Backend from 'i18next-xhr-backend'
// Temporarily importing translations directly instead of using the Backend module
import section1 from './locales/en/section1.json'
import section6 from './locales/en/section6.json'

const resources = {
  en: {
    section1, section6
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  // .use(Backend)
  .init({
    resources,
    lng: 'en',

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    // backend: {
    //   // for all available options read the backend's repository readme file
    //   loadPath: '/locales/{{lng}}/{{ns}}.json'
    // }
  })

export default i18n
