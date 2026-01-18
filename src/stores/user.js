import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient.js'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)

  const normalizeUser = async (sessionUser) => {
    if (!sessionUser) return null
    
    const userData = {
      email: sessionUser.email,
      name: sessionUser.user_metadata?.full_name || 
            sessionUser.user_metadata?.name || 
            sessionUser.user_metadata?.display_name ||
            sessionUser.email?.split('@')[0] ||
            sessionUser.email,
      id: sessionUser.id,
      pastorsName: '',
      churchName: ''
    }

    try {
      const { data: churchData, error: churchError } = await supabase
        .from('churches')
        .select('pastors_name, title, email, adress, phone')
        .eq('UID', sessionUser.id)
        .maybeSingle()
      
      if (!churchError && churchData) {
        userData.pastorsName = churchData.pastors_name || ''
        userData.churchName = churchData.title || ''
        userData.email = churchData.email || userData.email
        userData.address = churchData.adress || ''
        userData.phone = churchData.phone || ''
      }
    } catch (err) {
      console.log('Could not load church data:', err)
    }

    return userData
  }

  const loadUser = async () => {
    loading.value = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        user.value = await normalizeUser(session.user)
      } else {
        user.value = null
      }
    } catch (error) {
      console.error('Error loading user:', error)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  const updateUserData = async () => {
    if (!user.value?.id) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        user.value = await normalizeUser(session.user)
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  return {
    user,
    loading,
    loadUser,
    setUser,
    clearUser,
    updateUserData
  }
})
