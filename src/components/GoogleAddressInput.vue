<template>
  <div class="address-input-wrapper">
    <input
      :id="id"
      ref="addressInput"
      v-model="addressText"
      type="text"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="address-input form-input"
      :class="{ 'error': hasError }"
      @input="handleInput"
      @blur="handleBlur"
    />
    <span v-if="hasError && errorMessage" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

const { t } = useI18n()

const props = defineProps({
  id: {
    type: String,
    default: 'address'
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter your address'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  apiKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'place-selected'])

const addressInput = ref(null)
const addressText = ref(props.modelValue)
const autocomplete = ref(null)
const hasError = ref(false)
const errorMessage = ref('')

if (!window.__googleMapsOptionsSet) {
  window.__googleMapsOptionsSet = false
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== addressText.value) {
    addressText.value = newValue
  }
})

watch(() => props.error, (newValue) => {
  errorMessage.value = newValue
  hasError.value = !!newValue
})

const handleInput = () => {
  emit('update:modelValue', addressText.value)
  hasError.value = false
  errorMessage.value = ''
}

const handleBlur = () => {
  if (props.required && !addressText.value.trim()) {
    hasError.value = true
    errorMessage.value = t('googleAddress.addressRequired')
  }
}

onMounted(async () => {
  if (!addressInput.value) return
  
  const apiKey = props.apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.warn('Google Maps API key not found. Address autocomplete will not work.')
    return
  }

  try {
    if (!window.__googleMapsOptionsSet) {
      setOptions({
        key: apiKey,
        version: 'weekly'
      })
      window.__googleMapsOptionsSet = true
    }

    await importLibrary('places')

    if (!window.google?.maps?.places) {
      throw new Error('Google Maps Places API failed to load')
    }

    autocomplete.value = new google.maps.places.Autocomplete(addressInput.value, {
      types: ['address'],
      componentRestrictions: { country: [] } 
    })

    autocomplete.value.addListener('place_changed', () => {
      const place = autocomplete.value.getPlace()
      
      if (place.formatted_address) {
        addressText.value = place.formatted_address
        emit('update:modelValue', place.formatted_address)
        emit('place-selected', {
          address: place.formatted_address,
          place: place,
          geometry: place.geometry
        })
      }
    })
  } catch (error) {
    console.error('Error loading Google Maps API:', error)
  }
})

onUnmounted(() => {
  if (autocomplete.value) {
    google.maps.event.clearInstanceListeners(autocomplete.value)
  }
})
</script>

<style scoped>
.address-input-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.address-input-wrapper .form-input {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.address-input-wrapper .form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.address-input-wrapper .form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.address-input-wrapper .form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  text-align: left;
  margin-top: -0.25rem;
  display: block;
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .address-input-wrapper .form-input {
    background-color: #fff;
    color: #213547;
    border: 2px solid #e0e0e0;
  }

  .address-input-wrapper .form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .address-input-wrapper .form-input.error {
    border-color: #e74c3c;
  }

  .error-message {
    color: #e74c3c;
  }
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme]) .address-input-wrapper .form-input {
    background-color: #fff;
    color: #213547;
    border: 2px solid #e0e0e0;
  }

  :root:not([data-theme]) .address-input-wrapper .form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  :root:not([data-theme]) .address-input-wrapper .form-input.error {
    border-color: #e74c3c;
  }

  :root:not([data-theme]) .address-input-wrapper .error-message {
    color: #e74c3c;
  }
}

[data-theme="dark"] {
  .address-input-wrapper .form-input {
    background-color: #1a1a1a;
    color: rgba(255, 255, 255, 0.87);
    border: 2px solid #333;
  }

  .address-input-wrapper .form-input:focus {
    border-color: #667eea;
  }

  .address-input-wrapper .form-input.error {
    border-color: #e74c3c;
  }

  .error-message {
    color: #ff6b6b;
  }
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) .address-input-wrapper .form-input {
    background-color: #1a1a1a;
    color: rgba(255, 255, 255, 0.87);
    border: 2px solid #333;
  }

  :root:not([data-theme]) .address-input-wrapper .form-input:focus {
    border-color: #667eea;
  }

  :root:not([data-theme]) .address-input-wrapper .form-input.error {
    border-color: #e74c3c;
  }

  :root:not([data-theme]) .address-input-wrapper .error-message {
    color: #ff6b6b;
  }
}
</style>
