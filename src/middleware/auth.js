import { supabase } from '../lib/supabaseClient.js'

/**
 * Middleware to check if user is authenticated
 * @returns {Promise<{isAuthenticated: boolean, session: any}>}
 */
export const checkAuth = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth check error:', error)
      return { isAuthenticated: false, session: null }
    }
    
    return { 
      isAuthenticated: !!session, 
      session 
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return { isAuthenticated: false, session: null }
  }
}

/**
 * Middleware to protect routes - redirects to login if not authenticated
 * @param {Function} next - Next function from router
 * @param {string} redirectTo - Where to redirect if not authenticated (default: '/auth/login')
 */
export const requireAuth = async (next, redirectTo = '/auth/login') => {
  const { isAuthenticated } = await checkAuth()
  
  if (!isAuthenticated) {
    next(redirectTo)
  } else {
    next()
  }
}

/**
 * Middleware to redirect authenticated users away from auth pages
 * @param {Function} next - Next function from router
 * @param {string} redirectTo - Where to redirect if authenticated (default: '/home')
 */
export const requireGuest = async (next, redirectTo = '/home') => {
  const { isAuthenticated } = await checkAuth()
  
  if (isAuthenticated) {
    next(redirectTo)
  } else {
    next()
  }
}