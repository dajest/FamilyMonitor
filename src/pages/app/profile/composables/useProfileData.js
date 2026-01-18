import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../../../lib/supabaseClient.js'
import { useUserStore } from '../../../../stores/user.js'

export function useProfileData(formData, originalData) {
  const router = useRouter()
  const userStore = useUserStore()

  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const loadProfileData = async () => {
    loading.value = true
    errorMessage.value = ''
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      const userData = session.user
      
      formData.name = ''
      formData.title = ''
      formData.address = ''
      formData.phone = ''
      formData.email = ''
      
      try {
        const { data: churchData, error: churchError } = await supabase
          .from('churches')
          .select('id, UID, email, title, adress, pastors_name, phone')
          .eq('UID', userData.id)
          .maybeSingle()
        
        if (!churchError && churchData) {
          if (churchData.email) {
            formData.email = churchData.email
            originalData.email = churchData.email
          } else {
            formData.email = userData.email || ''
            originalData.email = formData.email
          }
          if (churchData.pastors_name) {
            formData.name = churchData.pastors_name
            originalData.name = churchData.pastors_name
          }
          if (churchData.title) {
            formData.title = churchData.title
            originalData.title = churchData.title
          }
          if (churchData.adress) {
            formData.address = churchData.adress
            originalData.address = churchData.adress
          }
          if (churchData.phone) {
            formData.phone = churchData.phone
            originalData.phone = churchData.phone
          }
        } else {
          formData.email = userData.email || ''
          originalData.email = formData.email
        }
      } catch (err) {
        console.log('Could not load church data (this is optional):', err)
      }
    } catch (error) {
      errorMessage.value = error.message || 'Failed to load profile data.'
      console.error('Error loading profile:', error)
    } finally {
      loading.value = false
    }
  }

  const saveProfileData = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    loading.value = true

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/auth/login')
        return
      }

      try {
        const { data: existingChurch, error: findError } = await supabase
          .from('churches')
          .select('id, UID')
          .eq('UID', session.user.id)
          .maybeSingle()

        if (findError && findError.code !== 'PGRST116') {
          errorMessage.value = findError.message || 'Failed to find church record.'
          console.error('Error finding church record:', findError)
          return
        }

        if (existingChurch) {
          const { error: churchError } = await supabase
            .from('churches')
            .update({
              email: formData.email || null,
              pastors_name: formData.name || null,
              title: formData.title || null,
              adress: formData.address || null,
              phone: formData.phone || null
            })
            .eq('UID', session.user.id)

          if (churchError) {
            errorMessage.value = churchError.message || 'Failed to update church record.'
            console.error('Error updating church record:', churchError)
            return
          }
        } else {
          const { error: churchError } = await supabase
            .from('churches')
            .insert([
              {
                UID: session.user.id,
                email: formData.email || null,
                pastors_name: formData.name || null,
                title: formData.title || null,
                adress: formData.address || null,
                phone: formData.phone || null
              }
            ])

          if (churchError) {
            errorMessage.value = churchError.message || 'Failed to create church record.'
            console.error('Error creating church record:', churchError)
            return
          }
        }
      } catch (err) {
        errorMessage.value = err.message || 'An error occurred while saving church data.'
        console.error('Error saving church data:', err)
        return
      }

      originalData.email = formData.email
      originalData.name = formData.name
      originalData.title = formData.title
      originalData.address = formData.address
      originalData.phone = formData.phone

      await userStore.updateUserData()

      successMessage.value = 'Profile updated successfully!'
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } catch (error) {
      errorMessage.value = error.message || 'An error occurred. Please try again.'
      console.error('Error saving profile:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMessage,
    successMessage,
    loadProfileData,
    saveProfileData
  }
}
