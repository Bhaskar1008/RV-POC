<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4">
      Roles
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="roles"
      density="compact"
      hover
    />
  </v-card>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true
  },
  roles: {
    type: Array,
    required: true
  }
})

const roles = [
  {
    id: 'R001',
    name: 'Administrator',
    description: 'Full access to all settings and configurations',
    lob: 'Finance',
    usersAssigned: 10
  },
  {
    id: 'R002',
    name: 'HR Manager',
    description: 'Manages employee records and payroll',
    lob: 'HR',
    usersAssigned: 5
  },
  {
    id: 'R003',
    name: 'IT Support',
    description: 'Handles IT-related issues and user accounts',
    lob: 'IT',
    usersAssigned: 8
  },
  {
    id: 'R004',
    name: 'Marketing Lead',
    description: 'Oversees all marketing campaigns and strategies',
    lob: 'Marketing',
    usersAssigned: 6
  },
  {
    id: 'R005',
    name: 'Operations Manager',
    description: 'Ensures daily operational workflow is maintained',
    lob: 'Operations',
    usersAssigned: 4
  }
]

</script>