import { createRouter, createWebHistory } from 'vue-router'
import PolicySummary from '../views/PolicySummary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'policy-summary',
      component: PolicySummary
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('../views/CollectionsView.vue')
    },
    {
      path: '/renewal-notice',
      name: 'renewal-notice',
      component: () => import('../views/RenewalNoticeView.vue')
    },
    {
      path: '/renewal-vault',
      name: 'renewal-vault',
      component: () => import('../views/RenewalVaultView.vue')
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: () => import('../views/UserManagementView.vue')
    }
  ]
})

export default router