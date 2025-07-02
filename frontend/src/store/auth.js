import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt') || null
  }),
  actions: {
    setToken(t) {
      this.token = t
      localStorage.setItem('jwt', t)
    },
    logout() {
      this.token = null
      localStorage.removeItem('jwt')
    }
  }
})
