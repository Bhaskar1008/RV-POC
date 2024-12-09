<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      Collection & Processing Batch Lists
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        density="compact"
        class="search-field"
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="batches"
        :search="search"
        :loading="loading"
        density="comfortable"
      >
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.raw.status)"
            :text-color="getStatusTextColor(item.raw.status)"
            size="small"
          >
            {{ item.raw.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            :disabled="item.raw.status === 'Processing'"
            color="primary"
            size="small"
            variant="text"
            @click="$emit('download', item.raw)"
          >
            <v-icon start>mdi-download</v-icon>
            Export
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  batches: {
    type: Array,
    required: true
  }
})

defineEmits(['download'])

const search = ref('')

const headers = [
  { title: 'Batch ID', key: 'id', align: 'start', sortable: true },
  { title: 'Scheduled Date/Time', key: 'scheduled', align: 'start', sortable: true },
  { title: 'Status', key: 'status', align: 'start', sortable: true },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false }
]

const getStatusColor = (status) => {
  const colors = {
    'Completed': 'success',
    'Processing': 'warning',
    'Scheduled': 'info',
    'Failed': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusTextColor = (status) => {
  return ['Completed', 'Processing', 'Failed'].includes(status) ? 'white' : 'default'
}
</script>

<style scoped>
.search-field {
  max-width: 300px;
}
</style>