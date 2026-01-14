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
        <input
          id="password"
          v-model="formData.password"
          type="password"
          placeholder="Enter your password"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.password }"
        />
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

    <div class="auth-links">
      <router-link to="/register" class="auth-link">Don't have an account? Register</router-link>
      <router-link to="/forgot-password" class="auth-link">Forgot password?</router-link>
    </div>

    <div v-if="isLoggedIn" class="success-message">
      <p>✓ Successfully logged in!</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

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
    // Simulate API call - Replace this with your actual API endpoint
    const response = await mockLogin(formData.email, formData.password)
    
    if (response.success) {
      // Store authentication token (in real app, use secure storage)
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      isLoggedIn.value = true
      errorMessage.value = ''
      
      // Reset form
      formData.email = ''
      formData.password = ''
      
      // Redirect to main app
      router.push('/home')
    } else {
      errorMessage.value = response.message || 'Login failed. Please check your credentials.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// Mock login function - Replace with actual API call
const mockLogin = (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation - Replace with actual API call
      if (email === 'admin@example.com' && password === 'password123') {
        resolve({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            email: email,
            name: 'Admin User'
          }
        })
      } else if (email === 'user@example.com' && password === 'password123') {
        resolve({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 2,
            email: email,
            name: 'Regular User'
          }
        })
      } else {
        resolve({
          success: false,
          message: 'Invalid email or password'
        })
      }
    }, 1000) // Simulate network delay
  })
}

// Logout logic
const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  errorMessage.value = ''
  router.push('/')
}

// Check if user is already logged in on mount
const checkAuthStatus = () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    isLoggedIn.value = true
  }
}

// Initialize
checkAuthStatus()
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