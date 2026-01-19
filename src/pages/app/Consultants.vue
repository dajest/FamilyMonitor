<template>
  <div class="consultants-page">
    <div class="consultants-header">
      <h2>{{ $t('consultants.title') }}</h2>
      <router-link 
        to="/consultants/create-consultant" 
        class="create-button"
      >
        {{ $t('consultants.createButton') }}
      </router-link>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="loading" class="loading-state">
      {{ $t('consultants.loading') }}
    </div>
    <div v-else class="consultants-table-container">
      <table class="consultants-table">
        <thead>
          <tr>
            <th>{{ $t('consultants.table.name') }}</th>
            <th>{{ $t('consultants.table.position') }}</th>
            <th>{{ $t('consultants.table.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="consultants.length === 0 && !loading">
            <td colspan="3" class="empty-state">
              {{ $t('consultants.emptyState') }}
            </td>
          </tr>
          <tr v-for="consultant in consultants" :key="consultant.id">
            <td>
              <router-link 
                :to="`/consultants/${consultant.id}`" 
                class="consultant-name-link"
              >
                {{ consultant.name }}
              </router-link>
            </td>
            <td>{{ consultant.position }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="consultant.status === 'active' ? 'status-active' : 'status-inactive'"
              >
                {{ consultant.status === 'active' ? $t('consultants.status.active') : $t('consultants.status.inactive') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useUserStore } from '../../stores/user.js'
import { supabase } from '../../lib/supabaseClient.js'

const userStore = useUserStore()
const consultants = ref([])
const loading = ref(false)
const errorMessage = ref('')

const loadConsultants = async () => {
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
      .eq('UID', userStore.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    consultants.value = data || []
  } catch (error) {
    console.error('Error loading consultants:', error)
    errorMessage.value = error.message || 'Ошибка при загрузке консультантов'
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadConsultants()
})

onActivated(() => {
  loadConsultants()
})
</script>

<style lang="scss" scoped>
@use '../../styles/mixins' as *;

.consultants-page {
  max-width: $max-width-sm;
  margin: 0 auto;
  padding: $spacing-xl;
}

.consultants-header {
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

.create-button {
  @include button-primary;
}

.consultants-table-container {
  @include card-container-table;
}

.consultants-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: $bg-dark;
  }

  th {
    padding: $spacing-md;
    text-align: left;
    font-weight: 600;
    color: $text-dark;
    border-bottom: 1px solid $border-dark;
  }

  td {
    padding: $spacing-md;
    color: $text-dark-muted;
    border-bottom: 1px solid $border-dark-light;
  }

  tbody tr {
    transition: background-color $transition;

    &:hover {
      background-color: $bg-dark-hover-table;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  .empty-state {
    text-align: center;
    padding: $spacing-xxl;
    color: $text-dark-empty;
  }
}

.loading-state {
  text-align: center;
  padding: $spacing-xxl;
  color: $text-dark-muted;
}

.error-message {
  @include error-message;
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

.consultant-name-link {
  color: $primary;
  text-decoration: none;
  font-weight: 500;
  transition: $transition;

  &:hover {
    color: $primary-hover;
    text-decoration: underline;
  }
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .consultants-header h2 {
    color: $text-primary;
  }

  .consultants-table-container {
    background-color: $bg-light;
    border-color: $border-light;
  }

  .consultants-table {
    thead {
      background-color: $bg-light-hover;
    }

    th {
      color: $text-primary;
      border-bottom-color: $border-light;
    }

    td {
      color: $text-secondary;
      border-bottom-color: $border-light;
    }

    tbody tr:hover {
      background-color: $bg-light-table-hover;
    }

    .empty-state {
      color: $text-muted;
    }
  }

  .consultant-name-link {
    color: $primary;

    &:hover {
      color: $primary-hover;
      text-decoration: none;
    }
  }

  .loading-state {
    color: $primary;
  }

  .error-message {
    background-color: rgba($error, 0.1);
    color: $error-light;
    border-color: rgba($error, 0.2);
  }
}
</style>
