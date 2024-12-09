<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        Success
      </v-card-title>
      <v-card-text class="pa-4">
        <p>Your job has been scheduled successfully!</p>
        <p class="mt-4">Batch ID: <strong>{{ batchId }}</strong></p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  batchId: String
})

defineEmits(['update:modelValue', 'close'])
</script>