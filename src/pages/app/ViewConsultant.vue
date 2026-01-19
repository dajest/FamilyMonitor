<template>
  <div class="view-consultant-page">
    <div class="page-header">
      <h2>{{ consultant?.name || $t('consultants.view.title') }}</h2>
      <router-link to="/consultants" class="back-button">
        {{ $t('consultants.view.backToConsultantsList') }}
      </router-link>
    </div>

    <div v-if="loading && !consultant" class="loading-state">
      {{ $t('consultants.view.loading') }}
    </div>
    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-else-if="consultant" class="consultant-details">
      <div class="details-container">
        <div class="detail-item">
          <label>{{ $t('consultants.form.name') }}</label>
          <div class="detail-value">{{ consultant.name }}</div>
        </div>
        <div class="detail-item">
          <label>{{ $t('consultants.form.position') }}</label>
          <div class="detail-value">{{ consultant.position }}</div>
        </div>
        <div class="detail-item">
          <label>{{ $t('consultants.form.status') }}</label>
          <div class="detail-value">
            <span 
              class="status-badge" 
              :class="consultant.status === 'active' ? 'status-active' : 'status-inactive'"
            >
              {{ consultant.status === 'active' ? $t('consultants.status.active') : $t('consultants.status.inactive') }}
            </span>
          </div>
        </div>
        <div class="detail-actions">
          <router-link 
            :to="`/consultants/edit-consultant/${consultant.id}`" 
            class="edit-button"
          >
            {{ $t('consultants.view.edit') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { supabase } from '../../lib/supabaseClient.js'

const route = useRoute()
const userStore = useUserStore()

const consultant = ref(null)
const loading = ref(false)
const errorMessage = ref('')

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
  } catch (error) {
    console.error('Error loading consultant:', error)
    errorMessage.value = error.message || 'Ошибка при загрузке консультанта'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadConsultant()
})
</script>

<style lang="scss" scoped>
@use '../../styles/mixins' as *;

.view-consultant-page {
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

.consultant-details {
  @include card-container;
}

.details-container {
  .detail-item {
    margin-bottom: $spacing-xl;

    &:last-of-type {
      margin-bottom: $spacing-lg;
    }

    label {
      display: block;
      margin-bottom: $spacing-xs;
      color: $text-dark-label;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      color: $text-dark;
      font-size: 1.125rem;
      font-weight: 400;
    }
  }
}

.status-badge {
  @include status-badge;

  &.status-active {
    background-color: rgba($success, 0.2);
    color: $success;
  }

  &.status-inactive {
    background-color: rgba($error, 0.2);
    color: $error;
  }
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: $spacing-xl;
  padding-top: $spacing-xl;
  border-top: 1px solid $border-dark;
}

.edit-button {
  @include button-base;
  background-color: $primary;
  color: white;

  &:hover {
    background-color: $primary-hover;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($primary, 0.3);
  }

  &:active {
    transform: translateY(0);
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

  .consultant-details {
    background-color: $bg-light;
    border-color: $border-light;
  }

  .details-container .detail-item {
    label {
      color: $text-secondary;
    }

    .detail-value {
      color: $text-primary;
    }
  }

  .detail-actions {
    border-top-color: $border-light;
  }

  .error-message {
    background-color: rgba($error, 0.1);
    color: $error-light;
    border-color: rgba($error, 0.2);
  }
}
</style>
