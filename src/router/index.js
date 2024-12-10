import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PolicySummary from '../views/PolicySummary.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'policy-summary',
      component: PolicySummary,
      meta: { requiresAuth: true }
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/json-mapper',
      name: 'json-mapper',
      component: () => import('../views/JSONMapper.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/renewal-notice',
      name: 'renewal-notice',
      component: () => import('../views/RenewalNoticeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/renewal-vault',
      name: 'renewal-vault',
      component: () => import('../views/RenewalVaultView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: () => import('../views/UserManagementView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.checkAuth()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router