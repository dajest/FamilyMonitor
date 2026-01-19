<template>
  <div class="edit-consultant-page">
    <div class="page-header">
      <h2>{{ $t('consultants.edit.title') }}</h2>
      <router-link to="/consultants" class="back-button">
        {{ $t('consultants.edit.back') }}
      </router-link>
    </div>

    <div v-if="loading && !consultant" class="loading-state">
      {{ $t('consultants.edit.loading') }}
    </div>
    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-else-if="consultant" class="form-container">
      <form @submit.prevent="updateConsultant" class="consultant-form">
        <div class="form-group">
          <label>{{ $t('consultants.form.name') }}</label>
          <input 
            v-model="form.name" 
            type="text" 
            :placeholder="$t('consultants.form.namePlaceholder')"
            required
          />
        </div>
        <div class="form-group">
          <label>{{ $t('consultants.form.position') }}</label>
          <input 
            v-model="form.position" 
            type="text" 
            :placeholder="$t('consultants.form.positionPlaceholder')"
            required
          />
        </div>
        <div class="form-group">
          <label>{{ $t('consultants.form.status') }}</label>
          <select v-model="form.status" required>
            <option value="active">{{ $t('consultants.status.active') }}</option>
            <option value="inactive">{{ $t('consultants.status.inactive') }}</option>
          </select>
        </div>
        <div v-if="saveErrorMessage" class="error-message">
          {{ saveErrorMessage }}
        </div>
        <div class="form-actions">
          <router-link to="/consultants" class="cancel-button" :class="{ 'disabled': saving }">
            {{ $t('consultants.edit.cancel') }}
          </router-link>
          <button type="submit" class="save-button" :disabled="saving">
            {{ saving ? $t('consultants.edit.saving') : $t('consultants.edit.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { supabase } from '../../lib/supabaseClient.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  name: '',
  position: '',
  status: 'active'
})

const consultant = ref(null)
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const saveErrorMessage = ref('')

const loadConsultant = async () => {
  const consultantId = route.params.id
  
  if (!consultantId) {
    errorMessage.value = 'ID консультанта не указан'
    return
  }

  if (!userStore.user?.id) {
    await userStore.loadUser()
  }

  if (!userStore.user?.id) {
    errorMessage.value = 'Пользователь не авторизован'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('id', consultantId)
      .eq('UID', userStore.user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      errorMessage.value = 'Консультант не найден'
      return
    }

    consultant.value = data
    form.name = data.name || ''
    form.position = data.position || ''
    form.status = data.status || 'active'
  } catch (error) {
    console.error('Error loading consultant:', error)
    errorMessage.value = error.message || 'Ошибка при загрузке консультанта'
  } finally {
    loading.value = false
  }
}

const updateConsultant = async () => {
  const consultantId = route.params.id
  
  if (!consultantId) {
    saveErrorMessage.value = 'ID консультанта не указан'
    return
  }

  if (!userStore.user?.id) {
    await userStore.loadUser()
  }

  if (!userStore.user?.id) {
    saveErrorMessage.value = 'Пользователь не авторизован'
    return
  }

  saving.value = true
  saveErrorMessage.value = ''

  try {
    const { error } = await supabase
      .from('consultants')
      .update({
        name: form.name,
        position: form.position,
        status: form.status
      })
      .eq('id', consultantId)
      .eq('UID', userStore.user.id)

    if (error) {
      throw error
    }

    router.push(`/consultants/${consultantId}`)
  } catch (error) {
    console.error('Error updating consultant:', error)
    saveErrorMessage.value = error.message || 'Ошибка при обновлении консультанта'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadConsultant()
})
</script>

<style lang="scss" scoped>
@use '../../styles/mixins' as *;

.edit-consultant-page {
  max-width: $max-width-lg;
  margin: 0 auto;
  padding: $spacing-xl;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;

  h2 {
    margin: 0;
    color: $text-dark;
    font-size: 1.75rem;
  }
}

.back-button {
  @include button-base;
  background-color: $bg-dark-hover;
  color: $text-dark;

  &:hover {
    background-color: $bg-dark-active;
  }
}

.loading-state {
  text-align: center;
  padding: $spacing-xxl;
  color: $text-dark-muted;
}

.form-container {
  @include card-container;
}

.consultant-form {
  .form-group {
    margin-bottom: $spacing-lg;

    label {
      display: block;
      margin-bottom: $spacing-xs;
      color: $text-dark;
      font-weight: 500;
    }

    input,
    select {
      @include form-input;
    }

    select {
      cursor: pointer;
    }
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: flex-end;
  margin-top: $spacing-xl;
}

.cancel-button,
.save-button {
  @include button-base;
}

.cancel-button {
  background-color: $bg-dark-hover;
  color: $text-dark;

  &:hover {
    background-color: $bg-dark-active;
  }

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.save-button {
  background-color: $primary;
  color: white;

  &:hover:not(:disabled) {
    background-color: $primary-hover;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error-message {
  @include error-message;
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .page-header h2 {
    color: $text-primary;
  }

  .back-button {
    background-color: $bg-light-hover;
    color: $text-primary;

    &:hover {
      background-color: $bg-light-active;
    }
  }

  .loading-state {
    color: $text-secondary;
  }

  .form-container {
    background-color: $bg-light;
    border-color: $border-light;
  }

  .consultant-form .form-group {
    label {
      color: $text-primary;
    }

    input,
    select {
      background-color: $bg-light;
      border-color: $border-light;
      color: $text-primary;

      &:focus {
        background-color: $bg-light-focus;
        border-color: $primary;
      }

      &::placeholder {
        color: $text-muted;
      }
    }
  }

  .cancel-button {
    background-color: $bg-light-hover;
    color: $text-primary;

    &:hover {
      background-color: $bg-light-active;
    }
  }

  .error-message {
    background-color: rgba($error, 0.1);
    color: $error-light;
    border-color: rgba($error, 0.2);
  }
}
</style>
