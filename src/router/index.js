import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import ChangePassword from '../pages/auth/ChangePassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import Home from '../pages/app/Home.vue'
import { requireAuth, requireGuest } from '../middleware/auth'

const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: ChangePassword
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: { allowWithoutAuth: true }
      }
    ]
  },
  {
    path: '/home',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  // Allow reset-password page without auth (user comes from email link)
  if (to.path === '/auth/reset-password' && to.meta.allowWithoutAuth) {
    next()
    return
  }
  
  // Check if route is an auth page (login, register, etc.)
  if (to.path.startsWith('/auth')) {
    // Redirect authenticated users away from auth pages (including reset-password)
    // Unauthenticated users can access auth pages (e.g., reset-password from email link)
    await requireGuest(next, '/home')
  } 
  // Check if route requires authentication
  else if (to.meta.requiresAuth || to.path.startsWith('/home')) {
    // Protect the route - redirect to login if not authenticated
    await requireAuth(next, '/auth/login')
  } 
  else {
    next()
  }
})

export default router