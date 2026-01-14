import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for sidebar management
 * Handles sidebar open/close state and keyboard shortcuts
 */
export function useSidebar() {
  const isSidebarOpen = ref(false)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  // Handle Escape key to close sidebar
  const handleEscape = (event) => {
    if (event.key === 'Escape' && isSidebarOpen.value) {
      closeSidebar()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscape)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar
  }
}
