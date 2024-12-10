<template>
  <v-navigation-drawer
    class="custom-drawer"
    v-model="navigationStore.drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item
      prepend-avatar="../../assets/logo/iorta-logo.png"
      :title="rail ? '' : 'IORTA Insurance'"
      nav
    >
      <template v-slot:append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navigationItems"
        :key="item.title"
        :value="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="rail ? '' : item.title"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>

<script setup>
import { ref } from 'vue'
import { useNavigationStore } from '../../stores/navigation'

const navigationStore = useNavigationStore()
const rail = ref(true)

const navigationItems = [
  {
    title: 'Policy Summary',
    icon: 'mdi-view-dashboard',
    to: '/'
  },
  {
    title: 'Collections & Processing',
    icon: 'mdi-cash-register',
    to: '/collections'
  },
  {
    title: 'API Request Mapper',
    icon: 'mdi-account-group',
    to: '/json-mapper'
  },
  {
    title: 'Renewal Notice Generation',
    icon: 'mdi-file-document-outline',
    to: '/renewal-notice'
  },
  {
    title: 'Renewal Vault Dashboard',
    icon: 'mdi-chart-line',
    to: '/renewal-vault'
  },
  {
    title: 'User Management',
    icon: 'mdi-account-group',
    to: '/user-management'
  }
]
</script>

<style scoped>
.custom-drawer {
  background-color: rgb(230, 240, 255); /* Lighter blue shade */
  color: rgb(33, 37, 41); /* Dark gray for professional text color */
}

.custom-drawer .v-list-item-title {
  font-weight: 500; /* Slightly bold for better readability */
}

.custom-drawer .v-list-item {
  color: rgb(33, 37, 41); /* Consistent text color */
}

.custom-drawer .v-list-item:hover {
  background-color: rgba(7, 69, 142, 0.1); /* Subtle hover effect */
}

</style>