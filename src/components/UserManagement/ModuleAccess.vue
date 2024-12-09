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
        />
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
        />
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
</script>