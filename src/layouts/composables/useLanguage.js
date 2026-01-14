import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

/**
 * Composable for language management
 * Handles language switching and persistence
 */
export function useLanguage() {
  const { locale } = useI18n()

  const languages = [
    { code: 'ru', name: 'Русский', nativeName: 'Русский' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' }
  ]

  const setLanguage = (langCode) => {
    if (['ru', 'en', 'lt'].includes(langCode)) {
      locale.value = langCode
      localStorage.setItem('locale', langCode)
    }
  }

  const currentLanguage = computed(() => {
    return languages.find(lang => lang.code === locale.value) || languages[1] // Default to English
  })

  return {
    locale,
    languages,
    setLanguage,
    currentLanguage
  }
}
