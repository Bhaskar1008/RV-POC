<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Collections & Processing</h1>
        <v-card class="pa-4">
          <CollectionsForm @submit="handleSubmit" @cancel="handleCancel" />
        </v-card>
      </v-col>
    </v-row>

    <SuccessModal
      v-model="showSuccessModal"
      :batch-id="batchId"
      @close="handleModalClose"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import CollectionsForm from '../components/Collections/CollectionsForm.vue'
import SuccessModal from '../components/Collections/SuccessModal.vue'

const showSuccessModal = ref(false)
const batchId = ref('')

const handleSubmit = (formData) => {
  batchId.value = `BATCH-${uuidv4().slice(0, 8).toUpperCase()}`
  showSuccessModal.value = true
  console.log('Form submitted:', { ...formData, batchId: batchId.value })
}

const handleCancel = () => {
  console.log('Form cancelled')
}

const handleModalClose = () => {
  showSuccessModal.value = false
  batchId.value = ''
}
</script>