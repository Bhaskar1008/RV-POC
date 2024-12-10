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
      <!-- Notification Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </template>
        <v-card style="min-width: 300px; max-height: 400px; overflow-y: auto;">
          <v-card-title
            class="d-flex justify-space-between align-center"
            style="font-size: 14px; padding: 10px;"
          >
            Notifications
            <v-btn small text color="primary" style="font-size: 8px; padding: 1px 4px;" @click="markAllAsRead">
              Mark All as Read
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item
              v-for="(notification, index) in notifications"
              :key="index"
              class="d-flex flex-column"
              style="padding: 10px; position: relative;"
            >
              <div class="d-flex flex-column">
                <span class="notification-item">
                  <strong>Batch ID: </strong>
                  <span class="batch-id">{{ notification.batchId }}</span>
                </span>
                <span class="notification-item">
                  <strong>Status: </strong>
                  <span
                    :class="{
                      'status-success': notification.status === 'Success',
                      'status-failed': notification.status === 'Failed',
                    }"
                  >
                    {{ notification.status }}
                  </span>
                </span>
              </div>
              <span class="timestamp">{{ notification.timeAgo }}</span>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <!-- Profile Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title style="font-size: 14px;">{{ authStore.user?.name }}</v-list-item-title>
            <v-list-item-subtitle style="font-size: 12px;">{{ authStore.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="authStore.logout">
            <v-list-item-title style="font-size: 14px;">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
<script setup>
import { ref } from 'vue'
import { useNavigationStore } from '../../stores/navigation'
import { useAuthStore } from '../../stores/auth'

// Stores
const navigationStore = useNavigationStore()
const authStore = useAuthStore()

// Random Notification Data
const notifications = ref(generateNotifications(5)) // Generate 5 notifications

function generateNotifications(count) {
  const statuses = ['Success', 'Failed']
  const times = ['30 min ago', '2 hrs ago', '5 hrs ago', '10 min ago', '1 hr 20 min ago']

  return Array.from({ length: count }, () => ({
    batchId: Math.floor(Math.random() * 900000000) + 100000000, // Generate random Batch ID
    status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
    timeAgo: times[Math.floor(Math.random() * times.length)] // Random time ago
  }))
}

// Mark all notifications as read
function markAllAsRead() {
  notifications.value = []
}
</script>
<style scoped>
.notification-item {
  font-size: 12px;
  margin-bottom: 4px;
}

.batch-id {
  color: #1a73e8; /* Blue */
}

.status-success {
  color: #34a853; /* Green */
}

.status-failed {
  color: #ea4335; /* Red */
}

.timestamp {
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 10px;
  color: gray;
}
.v-list-item__content {
    align-self: flex-start;
}
</style>
