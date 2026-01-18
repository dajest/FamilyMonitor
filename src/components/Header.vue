<template>
  <header class="main-header">
    <div class="header-content">
      <div class="header-left">
        <button 
          @click="$emit('toggleSidebar')" 
          class="burger-menu-button"
          :aria-label="$t('header.openMenu')"
        >
          <Icon name="burger-menu" size="24" />
        </button>
        <h1 class="main-title">{{ title }}</h1>
      </div>
      <div class="navbar-right">
        <div class="language-dropdown">
          <button 
            @click="toggleLanguageDropdown" 
            class="language-button"
            :class="{ 'active': isLanguageDropdownOpen }"
            @blur="handleLanguageBlur"
            :aria-label="$t('language.select')"
          >
            <span class="flag-icon">{{ getFlag(currentLanguage.code) }}</span>
          </button>
          <div 
            v-if="isLanguageDropdownOpen" 
            class="language-dropdown-menu"
            @mousedown.prevent
          >
            <button 
              v-for="lang in availableLanguages" 
              :key="lang.code"
              @click="handleLanguageSelect(lang.code)"
              class="language-dropdown-item"
            >
              <span class="flag-icon">{{ getFlag(lang.code) }}</span>
              <span>{{ lang.nativeName }}</span>
            </button>
          </div>
        </div>
        <div class="profile-dropdown" v-if="user">
          <button 
            @click="toggleDropdown" 
            class="profile-button"
            :class="{ 'active': isDropdownOpen }"
            @blur="handleBlur"
          >
            <div class="profile-icon">
              <Icon name="user" size="24" />
            </div>
          </button>
          <div 
            v-if="isDropdownOpen" 
            class="dropdown-menu"
            @mousedown.prevent
          >
            <div class="dropdown-header">
              <div class="user-name">{{ user?.pastorsName || user?.name || '' }}</div>
              <div class="user-email">{{ user?.churchName || user?.email || '' }}</div>
            </div>
            <button @click="goToProfile" class="dropdown-item">
              <Icon name="user" size="18" />
              <span>{{ $t('common.profile') }}</span>
            </button>
            <button @click="handleToggleTheme" class="dropdown-item">
              <Icon v-if="theme === 'light'" name="sun" size="18" />
              <Icon v-else name="moon" size="18" />
              <span>{{ theme === 'light' ? $t('theme.dark') : $t('theme.light') }}</span>
            </button>
            <button @click="handleLogout" class="dropdown-item logout-item">
              <Icon name="logout" size="18" />
              <span>{{ $t('common.logout') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user.js'
import { useLanguage } from '../layouts/composables/useLanguage.js'
import Icon from './Icon.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Main App'
  },
  theme: {
    type: String,
    default: 'light'
  }
})

const userStore = useUserStore()
const user = computed(() => userStore.user)

const emit = defineEmits(['toggleSidebar', 'toggleTheme', 'logout', 'changeLanguage'])

const router = useRouter()
const { t } = useI18n()
const { currentLanguage, languages, setLanguage } = useLanguage()
const isDropdownOpen = ref(false)
const isLanguageDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  isLanguageDropdownOpen.value = false
}

const handleBlur = (event) => {
  const target = event.currentTarget
  setTimeout(() => {
    if (target && !target.contains(document.activeElement)) {
      isDropdownOpen.value = false
    }
  }, 200)
}

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
  isDropdownOpen.value = false
}

const handleLanguageBlur = (event) => {
  const target = event.currentTarget
  setTimeout(() => {
    if (target && !target.contains(document.activeElement)) {
      isLanguageDropdownOpen.value = false
    }
  }, 200)
}

const goToProfile = () => {
  isDropdownOpen.value = false
  router.push('/home/profile')
}

const getFlag = (langCode) => {
  const flags = {
    'ru': '🇷🇺',
    'en': '🇬🇧',
    'lt': '🇱🇹'
  }
  return flags[langCode] || '🌐'
}

const availableLanguages = computed(() => {
  return languages.filter(lang => lang.code !== currentLanguage.value.code)
})

const handleLanguageSelect = (langCode) => {
  setLanguage(langCode)
  isLanguageDropdownOpen.value = false
  emit('changeLanguage', langCode)
}

const handleToggleTheme = () => {
  isDropdownOpen.value = false
  emit('toggleTheme')
}

const handleLogout = () => {
  isDropdownOpen.value = false
  emit('logout')
}

const handleClickOutside = (event) => {
  const profileDropdown = document.querySelector('.profile-dropdown')
  const languageDropdown = document.querySelector('.language-dropdown')
  
  if (profileDropdown && !profileDropdown.contains(event.target)) {
    isDropdownOpen.value = false
  }
  
  if (languageDropdown && !languageDropdown.contains(event.target)) {
    isLanguageDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-header {
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.burger-menu-button {
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

.main-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.87);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-dropdown {
  position: relative;
}

.language-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.87);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

.flag-icon {
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.language-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  overflow: hidden;
  animation: slideDown 0.2s ease;
  z-index: 101;
}

.language-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.87);
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .flag-icon {
    font-size: 1.25rem;
    width: auto;
    height: auto;
  }
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.87);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

.profile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #444;
}

.user-name {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.87);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.87);
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.logout-item {
    color: #ff6b6b;

    &:hover {
      background-color: rgba(255, 107, 107, 0.1);
    }
  }

  &.language-item {
    justify-content: space-between;

    .chevron {
      transition: transform 0.2s ease;
      margin-left: auto;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  svg {
    flex-shrink: 0;
  }
}

[data-theme="light"],
:root:not([data-theme="dark"]) {
  .main-header {
    background-color: #ffffff;
    border-bottom-color: #e0e0e0;
  }

  .main-title {
    color: #213547;
  }

  .burger-menu-button {
    color: #213547;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .language-button {
    color: #213547;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .profile-button {
    color: #213547;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .language-dropdown-menu {
    background-color: #ffffff;
    border-color: #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .language-dropdown-item {
    color: #213547;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .dropdown-menu {
    background-color: #ffffff;
    border-color: #e0e0e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .dropdown-header {
    border-bottom-color: #e0e0e0;
  }

  .user-name {
    color: #213547;
  }

  .user-email {
    color: #666;
  }

  .dropdown-item {
    color: #213547;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &.logout-item {
      color: #e74c3c;

      &:hover {
        background-color: rgba(231, 76, 60, 0.1);
      }
    }
  }
}
</style>
