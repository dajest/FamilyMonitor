import { reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function useProfileValidation(formData) {
  const { t } = useI18n()

  const errors = reactive({
    name: '',
    title: '',
    address: '',
    phone: ''
  })

  const requiredFields = [
    {
      key: 'name',
      minLength: 2,
      errorKey: 'name',
      errorRequired: 'profile.nameRequired',
      errorMinLength: 'profile.nameMinLength'
    },
    {
      key: 'title',
      minLength: 1,
      errorKey: 'title',
      errorRequired: 'profile.titleRequired',
      errorMinLength: 'profile.titleMinLength'
    },
    {
      key: 'address',
      minLength: 1,
      errorKey: 'address',
      errorRequired: 'profile.addressRequired',
      errorMinLength: 'profile.addressMinLength'
    },
    {
      key: 'phone',
      minLength: 5,
      errorKey: 'phone',
      errorRequired: 'profile.phoneRequired',
      errorMinLength: 'profile.phoneMinLength'
    }
  ]

  const validateField = (fieldConfig) => {
    const value = formData[fieldConfig.key]
    errors[fieldConfig.errorKey] = ''
    
    if (!value || !value.toString().trim()) {
      errors[fieldConfig.errorKey] = t(fieldConfig.errorRequired)
      return false
    }
    
    if (fieldConfig.minLength && value.toString().trim().length < fieldConfig.minLength) {
      errors[fieldConfig.errorKey] = t(fieldConfig.errorMinLength)
      return false
    }
    
    return true
  }

  const validateRequiredFields = () => {
    let isValid = true
    requiredFields.forEach(fieldConfig => {
      if (!validateField(fieldConfig)) {
        isValid = false
      }
    })
    return isValid
  }

  const areRequiredFieldsFilled = computed(() => {
    return requiredFields.every(fieldConfig => {
      const value = formData[fieldConfig.key]
      return value && value.toString().trim().length >= (fieldConfig.minLength || 1)
    })
  })

  const hasValidationErrors = computed(() => {
    return requiredFields.some(fieldConfig => {
      return !!errors[fieldConfig.errorKey]
    })
  })

  const validateForm = () => {
    Object.keys(errors).forEach(key => {
      if (!requiredFields.find(f => f.errorKey === key)) {
        errors[key] = ''
      }
    })
    
    return validateRequiredFields()
  }

  const validateFieldOnBlur = (fieldKey) => {
    const fieldConfig = requiredFields.find(f => f.key === fieldKey)
    if (fieldConfig) {
      validateField(fieldConfig)
    }
  }

  requiredFields.forEach(fieldConfig => {
    watch(() => formData[fieldConfig.key], () => {
      const value = formData[fieldConfig.key]
      if (value || errors[fieldConfig.errorKey]) {
        validateField(fieldConfig)
      }
    })
  })

  return {
    errors,
    requiredFields,
    validateField,
    validateRequiredFields,
    validateForm,
    validateFieldOnBlur,
    areRequiredFieldsFilled,
    hasValidationErrors
  }
}
