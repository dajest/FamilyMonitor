<template>
  <div class="home-page">
    <h2>Welcome to the Main App</h2>
    <p>This is the main application page. You can add your content here.</p>
    
    <div v-if="user" class="user-info">
      <p>Logged in as: <strong>{{ user.name }}</strong> ({{ user.email }})</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  } else {
    // Redirect to login if not authenticated
    router.push('/')
  }
})

const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.87);
}

p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.user-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info p {
  margin: 0 0 1rem 0;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #5a6268;
}

@media (prefers-color-scheme: light) {
  h2 {
    color: #213547;
  }

  p {
    color: #666;
  }

  .user-info {
    background-color: #f5f5f5;
    border-color: #e0e0e0;
  }
}
</style>