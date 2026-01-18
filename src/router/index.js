import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import ChangePassword from '../pages/auth/ChangePassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import Home from '../pages/app/Home.vue'
import Profile from '../pages/app/profile/Profile.vue'
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
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
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
  if (to.path === '/auth/reset-password' && to.meta.allowWithoutAuth) {
    next()
    return
  }
  
  // Check if route is an auth page (login, register, etc.)
  if (to.path.startsWith('/auth')) {
    await requireGuest(next, '/home')
  } 
  // Check if route requires authentication
  else if (to.meta.requiresAuth || to.path.startsWith('/home')) {
    await requireAuth(next, '/auth/login')
  } 
  else {
    next()
  }
})

export default router