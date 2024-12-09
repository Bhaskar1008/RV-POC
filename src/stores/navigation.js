import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  const drawer = ref(true)

  const toggleDrawer = () => {
    drawer.value = !drawer.value
  }

  return {
    drawer,
    toggleDrawer
  }
})