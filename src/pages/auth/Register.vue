<template>
  <div class="register-card">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister" class="register-form">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="Enter your full name"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="Enter your email"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input-wrapper">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            required
            :disabled="loading"
            class="form-input"
            :class="{ 'error': errors.password }"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="password-toggle"
            :disabled="loading"
            tabindex="-1"
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <div class="password-input-wrapper">
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm your password"
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
            <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
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
        class="register-button"
        :class="{ 'loading': loading }"
      >
        <span v-if="loading">Registering...</span>
        <span v-else>Register</span>
      </button>
    </form>

    <div class="divider">
      <span>OR</span>
    </div>

    <button
      @click="handleGoogleLogin"
      :disabled="loading"
      class="google-button"
    >
      <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span>Continue with Google</span>
    </button>

    <div class="auth-links">
      <router-link to="/auth/login" class="auth-link">Already have an account? Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient.js'

const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateName = (name) => {
  if (!name) return 'Name is required'
  if (name.length < 2) return 'Name must be at least 2 characters'
  return ''
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return ''
}

const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return ''
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

const isFormValid = computed(() => {
  return formData.name &&
         formData.email &&
         formData.password &&
         formData.confirmPassword &&
         !errors.name &&
         !errors.email &&
         !errors.password &&
         !errors.confirmPassword
})

const validateForm = () => {
  errors.name = validateName(formData.name)
  errors.email = validateEmail(formData.email)
  errors.password = validatePassword(formData.password)
  errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
}

// Real-time validation for password fields
watch(() => formData.password, () => {
  errors.password = validatePassword(formData.password)
  // Re-validate confirm password when password changes
  if (formData.confirmPassword) {
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
  }
})

watch(() => formData.confirmPassword, () => {
  if (formData.confirmPassword || errors.confirmPassword) {
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword)
  }
})

// Real-time validation for other fields
watch(() => formData.name, () => {
  if (formData.name || errors.name) {
    errors.name = validateName(formData.name)
  }
})

watch(() => formData.email, () => {
  if (formData.email || errors.email) {
    errors.email = validateEmail(formData.email)
  }
})

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  validateForm()

  if (!isFormValid.value) return

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name
        }
      }
    })
    
    if (error) {
      errorMessage.value = error.message || 'Registration failed. Please try again.'
      return
    }
    
    if (data.user) {
      successMessage.value = 'Registration successful! Please check your email to verify your account. Redirecting to login...'
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
    console.error('Registration error:', error)
  } finally {
    loading.value = false
  }
}

// Google OAuth registration/login
const handleGoogleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`
      }
    })
    
    if (error) {
      errorMessage.value = error.message || 'Failed to sign in with Google.'
      loading.value = false
    }
    // Note: User will be redirected to Google, so we don't need to handle success here
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
    console.error('Google login error:', error)
    loading.value = false
  }
}
</script>

<style scoped>
.register-card {
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

.register-form {
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

.password-toggle svg {
  width: 20px;
  height: 20px;
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

.register-button {
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

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-button.loading {
  position: relative;
  color: transparent;
}

.register-button.loading::after {
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

.divider {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider span {
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.95);
}

.google-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.google-button:hover:not(:disabled) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-color: #c8ccd0;
}

.google-button:active:not(:disabled) {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.google-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  flex-shrink: 0;
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
  .register-card {
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

  .password-toggle {
    color: rgba(255, 255, 255, 0.6);
  }

  .password-toggle:hover:not(:disabled) {
    color: #667eea;
  }

  .divider::before,
  .divider::after {
    border-bottom-color: #333;
  }

  .divider span {
    color: rgba(255, 255, 255, 0.6);
    background-color: rgba(26, 26, 26, 0.95);
  }

  .google-button {
    background: #1a1a1a;
    color: rgba(255, 255, 255, 0.87);
    border-color: #333;
  }

  .google-button:hover:not(:disabled) {
    border-color: #444;
  }
}
</style>