<template>
  <div class="forgot-password-card">
    <h2>{{ $t('auth.forgotPassword.title') }}</h2>
    <p class="description">{{ $t('auth.forgotPassword.description') }}</p>
    
    <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
      <div class="form-group">
        <label for="email">{{ $t('auth.forgotPassword.email') }}</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-banner">
        {{ successMessage }}
      </div>

      <button
        type="submit"
        :disabled="loading || !formData.email"
        class="submit-button"
        :class="{ 'loading': loading }"
      >
        <span v-if="loading">{{ $t('auth.forgotPassword.sending') }}</span>
        <span v-else>{{ $t('auth.forgotPassword.sendResetLink') }}</span>
      </button>
    </form>

    <div class="auth-links">
      <router-link to="/auth/login" class="auth-link">{{ $t('auth.forgotPassword.backToLogin') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '../../lib/supabaseClient.js'

const { t } = useI18n()

const formData = reactive({
  email: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const errors = reactive({
  email: ''
})

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return t('auth.forgotPassword.emailRequired')
  if (!emailRegex.test(email)) return t('auth.forgotPassword.emailInvalid')
  return ''
}

const handleForgotPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  errors.email = validateEmail(formData.email)

  if (errors.email) return

  loading.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) {
      errorMessage.value = error.message || t('auth.forgotPassword.failedToSendResetLink')
      return
    }
    
    successMessage.value = t('auth.forgotPassword.resetLinkSent')
    formData.email = ''
  } catch (error) {
    errorMessage.value = error.message || t('auth.forgotPassword.errorOccurred')
    console.error('Forgot password error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

h2 {
  margin: 0 0 1rem 0;
  color: #213547;
  font-size: 2rem;
  text-align: center;
  font-weight: 600;
}

.description {
  margin: 0 0 2rem 0;
  color: #666;
  text-align: center;
  font-size: 0.95rem;
}

.forgot-password-form {
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
  .forgot-password-card {
    background: rgba(26, 26, 26, 0.95);
  }

  h2, label {
    color: rgba(255, 255, 255, 0.87);
  }

  .description {
    color: rgba(255, 255, 255, 0.6);
  }

  .form-input {
    background-color: #1a1a1a;
    color: rgba(255, 255, 255, 0.87);
    border-color: #333;
  }
}
</style>