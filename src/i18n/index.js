import { createI18n } from 'vue-i18n'
import ru from './locales/ru.js'
import en from './locales/en.js'
import lt from './locales/lt.js'

// Load saved language preference or default to browser language
const getDefaultLocale = () => {
  try {
    const saved = localStorage.getItem('locale')
    if (saved && ['ru', 'en', 'lt'].includes(saved)) {
      return saved
    }
  } catch (e) {
    // localStorage might not be available
    console.warn('localStorage not available:', e)
  }
  
  // Try to detect browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('ru')) return 'ru'
    if (browserLang.startsWith('lt')) return 'lt'
  }
  return 'en' // Default to English
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode (required for vue-i18n v11)
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    ru,
    en,
    lt
  },
  globalInjection: true // Enable $t in templates
})

export default i18n
