<template>
  <div class="profile-page">
    <div class="profile-card">
      <h2>{{ $t('profile.title') }}</h2>
      
      <form @submit.prevent="handleSave" class="profile-form">
        <div class="form-group">
          <label for="name">
            {{ $t('profile.name') }}
            <span v-if="requiredFields.find(f => f.key === 'name') && (!formData.name || !formData.name.trim())" class="required">*</span>
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            :placeholder="$t('profile.namePlaceholder')"
            :disabled="loading"
            required
            class="form-input"
            :class="{ 'error': errors.name }"
            @blur="validateFieldOnBlur('name')"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="title">
            {{ $t('profile.title') }}
            <span v-if="requiredFields.find(f => f.key === 'title') && (!formData.title || !formData.title.trim())" class="required">*</span>
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            :placeholder="$t('profile.titlePlaceholder')"
            :disabled="loading"
            class="form-input"
            :class="{ 'error': errors.title }"
            @blur="validateFieldOnBlur('title')"
          />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label for="address">
            {{ $t('profile.address') }}
            <span v-if="requiredFields.find(f => f.key === 'address') && (!formData.address || !formData.address.trim())" class="required">*</span>
          </label>
          <GoogleAddressInput
            id="address"
            v-model="formData.address"
            :placeholder="$t('profile.addressPlaceholder')"
            :required="!!requiredFields.find(f => f.key === 'address')"
            :disabled="loading"
            :error="errors.address"
            @place-selected="handleAddressSelected"
            @blur="validateFieldOnBlur('address')"
          />
          <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
        </div>

        <div class="form-group">
          <label for="phone">
            {{ $t('profile.phone') }}
            <span v-if="requiredFields.find(f => f.key === 'phone') && (!formData.phone || !formData.phone.trim())" class="required">*</span>
          </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            :placeholder="$t('profile.phonePlaceholder')"
            :disabled="loading"
            class="form-input"
            :class="{ 'error': errors.phone }"
            @blur="validateFieldOnBlur('phone')"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="email">{{ $t('profile.email') }}</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            disabled
            class="form-input disabled"
          />
          <span class="field-hint">{{ $t('profile.emailHint') }}</span>
        </div>

        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-banner">
          {{ successMessage }}
        </div>

        <div v-if="showBlockModal" class="modal-overlay" @click.self="showBlockModal = false">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ $t('profile.blockTitle') }}</h3>
            </div>
            <div class="modal-body">
              <p>{{ $t('profile.blockMessage') }}</p>
            </div>
            <div class="modal-footer">
              <button @click="showBlockModal = false" class="modal-button">
                {{ $t('profile.understand') }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="handleCancel"
            :disabled="loading"
            class="cancel-button"
          >
            {{ $t('profile.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading || !hasChanges || !isFormValid"
            class="save-button"
            :class="{ 'loading': loading }"
          >
            <span v-if="loading">{{ $t('profile.saving') }}</span>
            <span v-else>{{ $t('profile.save') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import GoogleAddressInput from '../../../components/GoogleAddressInput.vue'
import { useUserStore } from '../../../stores/user.js'
import { useProfileValidation } from './composables/useProfileValidation.js'
import { useProfileData } from './composables/useProfileData.js'
import { useProfileNavigation } from './composables/useProfileNavigation.js'
import { useProfileForm } from './composables/useProfileForm.js'

const userStore = useUserStore()

const formData = reactive({
  email: '',
  name: '',
  title: '',
  address: '',
  phone: ''
})

const originalData = reactive({
  email: '',
  name: '',
  title: '',
  address: '',
  phone: ''
})

const {
  errors,
  requiredFields,
  validateForm,
  validateFieldOnBlur,
  areRequiredFieldsFilled,
  hasValidationErrors
} = useProfileValidation(formData)

const {
  loading,
  errorMessage,
  successMessage,
  loadProfileData,
  saveProfileData
} = useProfileData(formData, originalData)

const { showBlockModal } = useProfileNavigation(areRequiredFieldsFilled)

const {
  hasChanges,
  isFormValid,
  createHandleAddressSelected,
  createHandleCancel
} = useProfileForm(formData, originalData, areRequiredFieldsFilled, hasValidationErrors)

const handleAddressSelected = createHandleAddressSelected(formData, errors)
const handleCancel = createHandleCancel(formData, originalData, errors, errorMessage, successMessage)

const handleSave = async () => {
  if (!validateForm()) {
    return
  }
  await saveProfileData()
}

const loadDataFromStore = () => {
  if (userStore.user) {
    formData.email = userStore.user.email || ''
    formData.name = userStore.user.pastorsName || ''
    formData.title = userStore.user.churchName || ''
    formData.address = userStore.user.address || ''
    formData.phone = userStore.user.phone || ''
    
    originalData.email = formData.email
    originalData.name = formData.name
    originalData.title = formData.title
    originalData.address = formData.address
    originalData.phone = formData.phone
  }
}

watch(() => userStore.user, (newUser) => {
  if (newUser) {
    loadDataFromStore()
  }
}, { immediate: true })

onMounted(() => {
  if (userStore.user) {
    loadDataFromStore()
  } else {
    loadProfileData()
  }
})
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
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

.profile-form {
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

.form-input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-input.error {
  border-color: #e74c3c;
}

.field-hint {
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
}

.required {
  color: #e74c3c;
  margin-left: 0.25rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-button {
  padding: 0.875rem 1.5rem;
  background: #f5f5f5;
  color: #213547;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover:not(:disabled) {
  background: #e0e0e0;
  border-color: #ccc;
}

.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-button.loading {
  position: relative;
  color: transparent;
}

.save-button.loading::after {
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

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .profile-card {
    background: rgba(255, 255, 255, 0.95);
  }

  h2, label {
    color: #213547;
  }

  .form-input {
    background-color: #fff;
    color: #213547;
    border-color: #e0e0e0;
  }

  .form-input.disabled {
    background-color: #f5f5f5;
    opacity: 0.8;
  }

  .field-hint {
    color: #666;
  }

  .required {
    color: #e74c3c;
  }

  .error-message {
    color: #e74c3c;
  }

  .error-banner {
    background-color: #fee;
    color: #c33;
    border-color: #fcc;
  }

  .success-banner {
    background-color: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
  }

  .cancel-button {
    background: #f5f5f5;
    color: #213547;
    border-color: #e0e0e0;
  }

  .cancel-button:hover:not(:disabled) {
    background: #e0e0e0;
    border-color: #ccc;
  }
}

[data-theme="dark"] {
  .profile-card {
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

  .form-input.disabled {
    background-color: #2a2a2a;
    opacity: 0.7;
  }

  .field-hint {
    color: rgba(255, 255, 255, 0.6);
  }

  .required {
    color: #ff6b6b;
  }

  .error-message {
    color: #ff6b6b;
  }

  .error-banner {
    background-color: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    border-color: rgba(255, 107, 107, 0.3);
  }

  .success-banner {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.3);
  }

  .cancel-button {
    background: #2a2a2a;
    color: rgba(255, 255, 255, 0.87);
    border-color: #444;
  }

  .cancel-button:hover:not(:disabled) {
    background: #333;
    border-color: #555;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #213547;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.modal-body p {
  margin: 0;
  color: #213547;
  font-size: 1rem;
  line-height: 1.6;
}

.modal-footer {
  padding: 1rem 2rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .modal-content {
    background: rgba(255, 255, 255, 0.95);
  }

  .modal-header {
    border-bottom-color: #e0e0e0;
  }

  .modal-header h3 {
    color: #213547;
  }

  .modal-body p {
    color: #213547;
  }

  .modal-footer {
    border-top-color: #e0e0e0;
  }
}

[data-theme="dark"] {
  .modal-content {
    background: rgba(26, 26, 26, 0.95);
  }

  .modal-header {
    border-bottom-color: #333;
  }

  .modal-header h3 {
    color: rgba(255, 255, 255, 0.87);
  }

  .modal-body p {
    color: rgba(255, 255, 255, 0.87);
  }

  .modal-footer {
    border-top-color: #333;
  }
}
</style>
