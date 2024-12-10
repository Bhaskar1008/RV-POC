<template>
  <v-app-bar color="#07458E" density="compact">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="navigationStore.toggleDrawer"></v-app-bar-nav-icon>
      <img src="../../assets/logo/iorta-logo.png" style="width: 38px" />
    </template>
    <v-divider
      inset
      vertical
      color="#ffffff"
      :thickness="2"
      class="border-opacity-100 ms-2"
    ></v-divider>

    <v-app-bar-title>
      <img src="../../assets/logo/renewalvaultlogo.png" style="width: 155px; margin-top: 3px" />
    </v-app-bar-title>

    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="authStore.logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useNavigationStore } from '../../stores/navigation'
import { useAuthStore } from '../../stores/auth'

const navigationStore = useNavigationStore()
const authStore = useAuthStore()
</script>