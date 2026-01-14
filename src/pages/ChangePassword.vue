<template>
  <div class="change-password-card">
    <h2>Change Password</h2>
    
    <form @submit.prevent="handleChangePassword" class="change-password-form">
      <div class="form-group">
        <label for="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          v-model="formData.currentPassword"
          type="password"
          placeholder="Enter your current password"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.currentPassword }"
        />
        <span v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</span>
      </div>

      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input
          id="newPassword"
          v-model="formData.newPassword"
          type="password"
          placeholder="Enter your new password"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.newPassword }"
        />
        <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          required
          :disabled="loading"
          class="form-input"
          :class="{ 'error': errors.confirmPassword }"
        />
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
        <span v-if="loading">Changing Password...</span>
        <span v-else>Change Password</span>
      </button>
    </form>

    <div class="auth-links">
      <router-link to="/" class="auth-link">Back to Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return ''
}

const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

const isFormValid = computed(() => {
  return formData.currentPassword &&
         formData.newPassword &&
         formData.confirmPassword &&
         !errors.currentPassword &&
         !errors.newPassword &&
         !errors.confirmPassword
})

const validateForm = () => {
  errors.currentPassword = validatePassword(formData.currentPassword)
  errors.newPassword = validatePassword(formData.newPassword)
  errors.confirmPassword = validateConfirmPassword(formData.newPassword, formData.confirmPassword)
  
  if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password'
  }
}

const handleChangePassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  validateForm()

  if (!isFormValid.value) return

  loading.value = true

  try {
    const response = await mockChangePassword(formData)
    if (response.success) {
      successMessage.value = 'Password changed successfully!'
      formData.currentPassword = ''
      formData.newPassword = ''
      formData.confirmPassword = ''
    } else {
      errorMessage.value = response.message || 'Failed to change password. Please try again.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const mockChangePassword = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Password changed successfully'
      })
    }, 1000)
  })
}
</script>

<style scoped>
.change-password-card {
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

.change-password-form {
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
  .change-password-card {
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
}
</style>