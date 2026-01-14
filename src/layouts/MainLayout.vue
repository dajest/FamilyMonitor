<template>
  <div class="main-layout">
    <header class="main-header">
      <h1 class="main-title">{{ title }}</h1>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const title = ref('Main App')

// You can customize the title based on the route if needed
onMounted(() => {
  // Title can be set dynamically based on route
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background-color: #1a1a1a;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #333;
}

.main-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.87);
}

.main-content {
  flex: 1;
  padding: 2rem;
}

@media (prefers-color-scheme: light) {
  .main-header {
    background-color: #ffffff;
    border-bottom-color: #e0e0e0;
  }

  .main-title {
    color: #213547;
  }
}
</style>