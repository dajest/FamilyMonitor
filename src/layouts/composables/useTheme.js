import { ref, onMounted } from 'vue'

/**
 * Composable for theme management
 * Handles theme switching, persistence, and application
 */
export function useTheme() {
  const theme = ref('light') // 'light' or 'dark'

  const applyTheme = (themeValue) => {
    const html = document.documentElement
    if (themeValue === 'dark') {
      html.setAttribute('data-theme', 'dark')
      html.style.colorScheme = 'dark'
    } else {
      html.setAttribute('data-theme', 'light')
      html.style.colorScheme = 'light'
    }
  }

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    applyTheme(theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
    localStorage.setItem('theme', theme.value)
  }

  // Load theme on mount
  onMounted(() => {
    loadTheme()
  })

  return {
    theme,
    toggleTheme,
    applyTheme,
    loadTheme
  }
}
