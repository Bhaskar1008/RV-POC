<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4">
      Users
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
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
  users: {
    type: Array,
    required: true
  }
})

const users = [
  {
    id: 'U001',
    name: 'Alice Johnson',
    mobile: '+123456789',
    email: 'alice.johnson@example.com',
    lob: 'Finance',
    assignedBy: 'Admin'
  },
  {
    id: 'U002',
    name: 'Bob Smith',
    mobile: '+987654321',
    email: 'bob.smith@example.com',
    lob: 'HR',
    assignedBy: 'Manager A'
  },
  {
    id: 'U003',
    name: 'Charlie Brown',
    mobile: '+1122334455',
    email: 'charlie.brown@example.com',
    lob: 'IT',
    assignedBy: 'Manager B'
  },
  {
    id: 'U004',
    name: 'Dana White',
    mobile: '+5566778899',
    email: 'dana.white@example.com',
    lob: 'Marketing',
    assignedBy: 'Admin'
  },
  {
    id: 'U005',
    name: 'Ethan James',
    mobile: '+3344556677',
    email: 'ethan.james@example.com',
    lob: 'Operations',
    assignedBy: 'Manager C'
  }
]
</script>