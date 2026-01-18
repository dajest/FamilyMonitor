import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient.js'
import { useUserStore } from '../../stores/user.js'

/**
 * Composable for authentication management in components
 * Handles user session, auth state changes, and logout
 */
export function useAuth() {
  const router = useRouter()
  const userStore = useUserStore()
  let authSubscription = null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    userStore.clearUser()
    router.push('/auth/login')
  }

  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        userStore.clearUser()
        router.push('/auth/login')
      } else if (session?.user) {
        await userStore.loadUser()
      }
    })
    
    authSubscription = subscription
  }

  onMounted(async () => {
    await userStore.loadUser()
    setupAuthListener()
  })

  onUnmounted(() => {
    if (authSubscription) {
      authSubscription.unsubscribe()
    }
  })

  return {
    user: computed(() => userStore.user),
    handleLogout,
    loadUser: userStore.loadUser
  }
}
