import { computed } from 'vue'

export function useProfileForm(formData, originalData, areRequiredFieldsFilled, hasValidationErrors) {
  const hasChanges = computed(() => {
    return formData.email !== originalData.email ||
           formData.name !== originalData.name ||
           formData.title !== originalData.title ||
           formData.address !== originalData.address ||
           formData.phone !== originalData.phone
  })

  const isFormValid = computed(() => {
    return areRequiredFieldsFilled.value && !hasValidationErrors.value
  })

  const createHandleAddressSelected = (formData, errors) => {
    return (placeData) => {
      formData.address = placeData.address
      errors.address = ''
    }
  }

  const createHandleCancel = (formData, originalData, errors, errorMessage, successMessage) => {
    return () => {
      formData.email = originalData.email
      formData.name = originalData.name
      formData.title = originalData.title
      formData.address = originalData.address
      formData.phone = originalData.phone
      errors.name = ''
      errors.title = ''
      errors.address = ''
      errors.phone = ''
      errorMessage.value = ''
      successMessage.value = ''
    }
  }

  return {
    hasChanges,
    isFormValid,
    createHandleAddressSelected,
    createHandleCancel
  }
}
