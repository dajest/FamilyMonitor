<template>
  <div class="main-layout">
    <Sidebar 
      :isOpen="isSidebarOpen"
      @close="closeSidebar"
    />
    
    <Header
      :title="title"
      :user="user"
      :theme="theme"
      @toggleSidebar="toggleSidebar"
      @toggleTheme="toggleTheme"
      @logout="handleLogout"
    />
    
    <main class="main-content" :class="{ 'content-shifted': isSidebarOpen }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { useTheme } from './composables/useTheme.js'
import { useSidebar } from './composables/useSidebar.js'
import { useAuth } from './composables/useAuth.js'

const { t } = useI18n()
const title = computed(() => t('common.mainApp'))

// Use composables
const { theme, toggleTheme } = useTheme()
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar()
const { user, handleLogout } = useAuth()
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease;

  &.content-shifted {
    margin-left: 0;
  }
}
</style>