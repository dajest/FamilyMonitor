<template>
  <div class="reset-password-card">
    <h2>{{ $t('auth.resetPassword.title') }}</h2>
    
    <form @submit.prevent="handleResetPassword" class="reset-password-form">
      <div class="form-group">
        <label for="newPassword">{{ $t('auth.resetPassword.newPassword') }}</label>
        <div class="password-input-wrapper">
          <input
            id="newPassword"
            v-model="formData.newPassword"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.resetPassword.newPasswordPlaceholder')"
            required
            :disabled="loading"
            class="form-input"
            :class="{ 'error': errors.newPassword }"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="password-toggle"
            :disabled="loading"
            tabindex="-1"
          >
            <Icon v-if="showPassword" name="eye-off" size="20" />
            <Icon v-else name="eye" size="20" />
          </button>
        </div>
        <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">{{ $t('auth.resetPassword.confirmPassword') }}</label>
        <div class="password-input-wrapper">
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('auth.resetPassword.confirmPasswordPlaceholder')"
            required
            :disabled="loading"
            class="form-input"
            :class="{ 'error': errors.confirmPassword }"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="password-toggle"
            :disabled="loading"
            tabindex="-1"
          >
            <Icon v-if="showConfirmPassword" name="eye-off" size="20" />
            <Icon v-else name="eye" size="20" />
          </button>
        </div>
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>

      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-banner">
        {{ successMessage }}
      </div>

      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="submit-button"
        :class="{ 'loading': loading }"
      >
        <span v-if="loading">{{ $t('auth.resetPassword.resettingPassword') }}</span>
        <span v-else>{{ $t('auth.resetPassword.resetPasswordButton') }}</span>
      </button>
    </form>

    <div class="auth-links">
      <router-link to="/auth/login" class="auth-link">{{ $t('auth.resetPassword.backToLogin') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '../../lib/supabaseClient'
import Icon from '../../components/Icon.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const formData = reactive({
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = reactive({
  newPassword: '',
  confirmPassword: ''
})

const validatePassword = (password) => {
  if (!password) return t('auth.resetPassword.passwordRequired')
  if (password.length < 6) return t('auth.resetPassword.passwordMinLength')
  return ''
}

const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return t('auth.resetPassword.pleaseConfirmPassword')
  if (password !== confirmPassword) return t('auth.resetPassword.passwordsDoNotMatch')
  return ''
}

const isFormValid = computed(() => {
  return formData.newPassword &&
         formData.confirmPassword &&
         !errors.newPassword &&
         !errors.confirmPassword
})

const validateForm = () => {
  errors.newPassword = validatePassword(formData.newPassword)
  errors.confirmPassword = validateConfirmPassword(formData.newPassword, formData.confirmPassword)
}

// Check if we have the hash from Supabase email link
onMounted(async () => {
  // Supabase sends the token in the URL hash fragment (#access_token=...&type=recovery)
  // Parse the hash fragment
  const hash = window.location.hash.substring(1)
  const hashParams = new URLSearchParams(hash)
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')
  const type = hashParams.get('type')
  
  if (accessToken && type === 'recovery') {
    // Set the session with the recovery token from email
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || ''
      })
      
      if (error) {
        errorMessage.value = t('auth.resetPassword.invalidOrExpiredLink')
        console.error('Session error:', error)
        return
      }
      
      // Clear the hash from URL after processing
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    } catch (error) {
      errorMessage.value = t('auth.resetPassword.invalidOrExpiredLink')
      console.error('Error setting session:', error)
    }
  } else {
    // Check if we have a valid session (user might have already set it)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      errorMessage.value = t('auth.resetPassword.invalidOrExpiredLink')
    }
  }
})

const handleResetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  validateForm()

  if (!isFormValid.value) return

  loading.value = true

  try {
    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword
    })
    
    if (error) {
      errorMessage.value = error.message || t('auth.resetPassword.failedToResetPassword')
      return
    }
    
    successMessage.value = t('auth.resetPassword.passwordResetSuccessfully')
    formData.newPassword = ''
    formData.confirmPassword = ''
    
    // Redirect to login after successful password reset
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message || t('auth.resetPassword.errorOccurred')
    console.error('Reset password error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

h2 {
  margin: 0 0 2rem 0;
  color: #213547;
  font-size: 2rem;
  text-align: center;
  font-weight: 600;
}

.reset-password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #213547;
  font-size: 0.9rem;
  text-align: left;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background-color: #fff;
  color: #213547;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input.error {
  border-color: #e74c3c;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .form-input {
  padding-right: 3rem;
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.3s ease;
  z-index: 1;
}

.password-toggle:hover:not(:disabled) {
  color: #667eea;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  text-align: left;
  margin-top: -0.25rem;
}

.error-banner {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #fcc;
  font-size: 0.9rem;
  text-align: center;
}

.success-banner {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  font-size: 0.9rem;
  text-align: center;
}

.submit-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button.loading {
  position: relative;
  color: transparent;
}

.submit-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .reset-password-card {
    background: rgba(26, 26, 26, 0.95);
  }

  h2, label {
    color: rgba(255, 255, 255, 0.87);
  }

  .form-input {
    background-color: #1a1a1a;
    color: rgba(255, 255, 255, 0.87);
    border-color: #333;
  }

  .form-input:focus {
    border-color: #667eea;
  }

  .password-toggle {
    color: rgba(255, 255, 255, 0.6);
  }

  .password-toggle:hover:not(:disabled) {
    color: #667eea;
  }

  .error-banner {
    background-color: #3a1f1f;
    color: #ff6b6b;
    border-color: #5a2a2a;
  }

  .success-banner {
    background-color: #1a3a1a;
    border-color: #2a5a2a;
    color: #90ee90;
  }
}

@media (max-width: 480px) {
  .reset-password-card {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>