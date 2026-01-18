import { ref, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useProfileNavigation(areRequiredFieldsFilled) {
  const { t } = useI18n()
  const showBlockModal = ref(false)

  onBeforeRouteLeave((to, from, next) => {
    if (!areRequiredFieldsFilled.value) {
      showBlockModal.value = true
      next(false)
    } else {
      next()
    }
  })

  const handleBeforeUnload = (e) => {
    if (!areRequiredFieldsFilled.value) {
      e.preventDefault()
      e.returnValue = t('profile.blockMessage')
      return e.returnValue
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  return {
    showBlockModal
  }
}
