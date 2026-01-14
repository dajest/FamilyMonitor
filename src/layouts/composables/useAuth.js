import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient.js'

/**
 * Composable for authentication management in components
 * Handles user session, auth state changes, and logout
 */
export function useAuth() {
  const router = useRouter()
  const user = ref(null)
  let authSubscription = null

  const normalizeUser = (sessionUser) => {
    if (!sessionUser) return null
    
    return {
      email: sessionUser.email,
      name: sessionUser.user_metadata?.full_name || 
            sessionUser.user_metadata?.name || 
            sessionUser.user_metadata?.display_name ||
            sessionUser.email?.split('@')[0] ||
            sessionUser.email,
      id: sessionUser.id
    }
  }

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      user.value = normalizeUser(session.user)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        user.value = null
        router.push('/auth/login')
      } else if (session?.user) {
        user.value = normalizeUser(session.user)
      }
    })
    
    authSubscription = subscription
  }

  onMounted(async () => {
    await loadUser()
    setupAuthListener()
  })

  onUnmounted(() => {
    if (authSubscription) {
      authSubscription.unsubscribe()
    }
  })

  return {
    user,
    handleLogout,
    loadUser
  }
}
