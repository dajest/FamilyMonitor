<template>
  <div>
    <div 
      v-if="isOpen" 
      class="sidebar-overlay"
      @click="$emit('close')"
    ></div>
    
    <aside 
      class="sidebar"
      :class="{ 'sidebar-open': isOpen }"
    >
      <div class="sidebar-header">
        <h2 class="sidebar-title">{{ $t('sidebar.menu') }}</h2>
        <button 
          @click="$emit('close')" 
          class="sidebar-close-button"
          :aria-label="$t('sidebar.closeMenu')"
        >
          <Icon name="close" size="24" />
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link 
          to="/home" 
          class="sidebar-nav-item"
          @click="$emit('close')"
        >
          <Icon name="home" size="20" />
          <span>{{ $t('sidebar.home') }}</span>
        </router-link>
        <router-link 
          to="/consultants" 
          class="sidebar-nav-item"
          @click="$emit('close')"
        >
          <Icon name="user" size="20" />
          <span>{{ $t('sidebar.consultants') }}</span>
        </router-link>

      </nav>
    </aside>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close'])

</script>

<style lang="scss" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: #1a1a1a;
  border-right: 1px solid #333;
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);

  &.sidebar-open {
    transform: translateX(0);
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #333;
  }

  &-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.87);
  }

  &-close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.87);
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;

    &-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255, 255, 255, 0.87);
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        border-left-color: #667eea;
      }

      &.router-link-active {
        background-color: rgba(102, 126, 234, 0.1);
        border-left-color: #667eea;
        color: #667eea;
      }

      svg {
        flex-shrink: 0;
      }
    }
  }
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .sidebar-overlay {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .sidebar {
    background-color: #ffffff;
    border-right-color: #e0e0e0;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

    &-header {
      border-bottom-color: #e0e0e0;
    }

    &-title {
      color: #213547;
    }

    &-close-button {
      color: #213547;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    &-nav-item {
      color: #213547;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.router-link-active {
        background-color: rgba(102, 126, 234, 0.1);
        color: #667eea;
      }
    }
  }
}
</style>
