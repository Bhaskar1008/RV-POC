<template>
  <div class="w-full">
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div class="text-center">
        <div class="flex justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="mt-1 text-xs text-gray-600">Drop Files To Upload or</p>
        <button
          @click="triggerFileInput"
          class="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Browse
        </button>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept=".xlsx"
          @change="handleFileUpload"
        >
        <p class="mt-1 text-xs text-gray-500">Max 5MB of Excel (.xlsx)</p>
        <p class="text-xs text-gray-500">only one JSON file in excel format can be uploaded</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['file-selected'])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit')
      return
    }
    emit('file-selected', file)
  }
}
</script>