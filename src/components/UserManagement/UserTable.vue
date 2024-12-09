<template>
  <v-card class="mb-4 user-card">
    <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4 d-flex justify-space-between align-center">
      <span>Users</span>
      <v-btn
        icon
        variant="text"
        class="collapse-btn"
        @click="isCollapsed = !isCollapsed"
        :aria-label="isCollapsed ? 'Expand' : 'Collapse'"
      >
        <v-icon>{{ isCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-show="!isCollapsed">
      <v-data-table
        :headers="headers"
        :items="users"
        density="compact"
        hover
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  headers: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

// Collapsible state
const isCollapsed = ref(true);

// Sample data
const users = [
  {
    id: 'U001',
    name: 'Alice Johnson',
    mobile: '+123456789',
    email: 'alice.johnson@example.com',
    lob: 'Finance',
    assignedBy: 'Admin',
  },
  {
    id: 'U002',
    name: 'Bob Smith',
    mobile: '+987654321',
    email: 'bob.smith@example.com',
    lob: 'HR',
    assignedBy: 'Manager A',
  },
  {
    id: 'U003',
    name: 'Charlie Brown',
    mobile: '+1122334455',
    email: 'charlie.brown@example.com',
    lob: 'IT',
    assignedBy: 'Manager B',
  },
  {
    id: 'U004',
    name: 'Dana White',
    mobile: '+5566778899',
    email: 'dana.white@example.com',
    lob: 'Marketing',
    assignedBy: 'Admin',
  },
  {
    id: 'U005',
    name: 'Ethan James',
    mobile: '+3344556677',
    email: 'ethan.james@example.com',
    lob: 'Operations',
    assignedBy: 'Manager C',
  },
];
</script>

<style scoped>
.user-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.collapse-btn {
  color: black;
  transition: background-color 0.2s ease-in-out;
}

.collapse-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.v-data-table {
  max-height: 400px;
  overflow-y: auto;
}
</style>
