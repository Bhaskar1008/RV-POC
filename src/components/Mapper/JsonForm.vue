<template>
  <div class="bg-gray-50 p-8">
    <div class="space-y-6">
      <!-- Excel Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Excel Name</label>
        <div class="mt-1 relative">
          <input
            v-model="excelName"
            type="text"
            class="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            readonly
          />
          <button 
            @click="clearExcelName"
            class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          >
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- JSON Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700">JSON Name</label>
        <input
          v-model="jsonName"
          type="text"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- JSON Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700">JSON Description</label>
        <textarea
          v-model="jsonDescription"
          rows="4"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <p class="mt-1 text-sm text-gray-500 text-right">{{ descriptionLength }} / 500</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between pt-4">
        <button
          @click="cancel"
          class="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button
          @click="proceed"
          class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Proceed
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const excelName = ref('ABCD.xlsx')
const jsonName = ref('CarModel')
const jsonDescription = ref('')

const descriptionLength = computed(() => jsonDescription.value.length)

const clearExcelName = () => {
  excelName.value = ''
}

const cancel = () => {
  // Implement cancel logic
}

const proceed = () => {
  // Implement proceed logic
}

defineExpose({
  jsonName,
  jsonDescription,
  excelName
})
</script>