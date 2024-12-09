<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4">
      Module Access
    </v-card-title>
    <v-card-text class="pt-4">
      <div class="mb-4">
        <div class="text-subtitle-2 mb-2">Automation Modules</div>
        <v-data-table
          :headers="headers"
          :items="automationModules"
          item-value="id"
          show-select
          density="compact"
          hover
        >
        </v-data-table>
      </div>

      <div>
        <div class="text-subtitle-2 mb-2">Manual Modules</div>
        <v-data-table
          :headers="headers"
          :items="manualModules"
          item-value="id"
          show-select
          density="compact"
          hover
        >
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true
  },
  automationModules: {
    type: Array,
    required: true
  },
  manualModules: {
    type: Array,
    required: true
  }
})

const headers = [
  { text: 'Module Name', align: 'start', key: 'name', sortable: true },
  { text: 'Description', key: 'description', sortable: false }
]

// Example data for automation and manual modules
const automationModules = [
  { id: 'BRE-PENDING', name: 'BRE-PENDING', description: 'Pending BRE status' },
  { id: 'BRE-SUCCESS', name: 'BRE-SUCCESS', description: 'Successful BRE completion' },
  { id: 'BRE-FAILED', name: 'BRE-FAILED', description: 'Failed BRE status' },
  { id: 'PT-MODIFICATION QUEUE', name: 'PT-MODIFICATION QUEUE', description: 'Queue for PT modifications' },
  { id: 'RETENTION-APPROVAL-QUEUE', name: 'RETENTION-APPROVAL-QUEUE', description: 'Queue for retention approval' },
  { id: 'RN-GENERATED', name: 'RN-GENERATED', description: 'Generated Renewal Notice' }
]

const manualModules = [
  { id: 'Collection & Processing', name: 'Collection & Processing', description: 'Collection and processing modules' },
  { id: 'Renewal Notice Generation', name: 'Renewal Notice Generation', description: 'Modules for generating renewal notices' },
  { id: 'Renewal Vault Dashboard', name: 'Renewal Vault Dashboard', description: 'Dashboard for the renewal vault' }
]
</script>
