<template>
  <div class="login-card">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin" class="login-form">
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
            <Icon v-if="showPassword" name="eye-off" size="20" />
            <Icon v-else name="eye" size="20" />
          </button>
        </div>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="login-button"
        :class="{ 'loading': loading }"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
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
      <Icon name="google" size="20" class="google-icon" />
      <span>Continue with Google</span>
    </button>

    <div class="auth-links">
      <router-link to="/auth/register" class="auth-link">Don't have an account? Register</router-link>
      <router-link to="/auth/forgot-password" class="auth-link">Forgot password?</router-link>
    </div>

    <div v-if="isLoggedIn" class="success-message">
      <p>✓ Successfully logged in!</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabaseClient.js'
import Icon from '../../components/Icon.vue'

const router = useRouter()

// Form data
const formData = reactive({
  email: '',
  password: ''
})

// State
const loading = ref(false)
const errorMessage = ref('')
const isLoggedIn = ref(false)
const showPassword = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

// Validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    return 'Email is required'
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return ''
}

const validatePassword = (password) => {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return ''
}

const isFormValid = computed(() => {
  return formData.email && 
         formData.password && 
         !errors.email && 
         !errors.password
})

// Watch for real-time validation
const validateForm = () => {
  errors.email = validateEmail(formData.email)
  errors.password = validatePassword(formData.password)
}

// Login logic
const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = ''
  validateForm()

  // Check if form is valid
  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    })
    
    if (error) {
      errorMessage.value = error.message || 'Login failed. Please check your credentials.'
      return
    }
    
    if (data.user) {
      isLoggedIn.value = true
      errorMessage.value = ''
      
      // Reset form
      formData.email = ''
      formData.password = ''
      
      // Redirect to main app
      router.push('/home')
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// Google OAuth login
const handleGoogleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

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

// Logout logic
const handleLogout = async () => {
  await supabase.auth.signOut()
  isLoggedIn.value = false
  errorMessage.value = ''
  router.push('/auth/login')
}

// Check if user is already logged in on mount
const checkAuthStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    isLoggedIn.value = true
  }
}

// Initialize
onMounted(() => {
  checkAuthStatus()
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      isLoggedIn.value = true
      router.push('/home')
    } else if (event === 'SIGNED_OUT') {
      isLoggedIn.value = false
    }
  })
})
</script>

<style scoped>
.login-card {
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

.login-form {
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

.login-button {
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

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-button.loading {
  position: relative;
  color: transparent;
}

.login-button.loading::after {
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.success-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  color: #155724;
  text-align: center;
}

.success-message p {
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #5a6268;
}

@media (prefers-color-scheme: dark) {
  .login-card {
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

  .error-banner {
    background-color: #3a1f1f;
    color: #ff6b6b;
    border-color: #5a2a2a;
  }

  .success-message {
    background-color: #1a3a1a;
    border-color: #2a5a2a;
    color: #90ee90;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>