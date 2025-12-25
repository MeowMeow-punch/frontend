import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isAuthenticated as checkAuth } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(checkAuth())

  function updateAuthStatus() {
    isLoggedIn.value = checkAuth()
  }

  return { isLoggedIn, updateAuthStatus }
})
