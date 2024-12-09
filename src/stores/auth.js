import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  // Default credentials
  const DEFAULT_CREDENTIALS = {
    username: 'admin@iorta.com',
    password: 'admin123'
  }

  const login = async (credentials) => {
    if (
      credentials.username === DEFAULT_CREDENTIALS.username &&
      credentials.password === DEFAULT_CREDENTIALS.password
    ) {
      isAuthenticated.value = true
      user.value = {
        email: credentials.username,
        name: 'Admin User',
        role: 'Administrator'
      }
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const checkAuth = () => {
    const savedAuth = localStorage.getItem('isAuthenticated')
    const savedUser = localStorage.getItem('user')
    
    if (savedAuth === 'true' && savedUser) {
      isAuthenticated.value = true
      user.value = JSON.parse(savedUser)
      return true
    }
    return false
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
    DEFAULT_CREDENTIALS
  }
})