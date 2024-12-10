<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a href="#" class="text-gray-700 hover:text-gray-900">Home</a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <a href="#" class="text-gray-700 hover:text-gray-900">JSON Mapping</a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-blue-600">Create New Json Mapping</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Step indicator -->
      <div class="text-center mb-8">
        <h1 class="text-xl font-semibold text-gray-900">Step {{ currentStep }} / 3</h1>
        <h2 class="text-lg text-blue-600 font-medium mt-2">Upload JSON - Request Mapping</h2>
      </div>

      <!-- Form Content -->
      <div v-if="currentStep === 1">
        <JsonForm ref="jsonForm" />
      </div>

      <div v-if="currentStep === 2">
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Upload Table</h3>
            <JsonUploader @file-selected="handleTableUpload" />
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Create New Table</h3>
            <button @click="createNewTable" class="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900">
              Click to Create Table
            </button>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Upload Json - Response Mapping</h3>
            <JsonUploader @file-selected="handleResponseJsonUpload" />
          </div>
        </div>
      </div>

      <div v-if="currentStep === 3">
        <MappingTable />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonUploader from '../components/Mapper/JsonUploader.vue'
import JsonForm from '../components/Mapper/JsonForm.vue'
import MappingTable from '../components/Mapper/MappingTable.vue'

const currentStep = ref(1)
const jsonForm = ref<InstanceType<typeof JsonForm> | null>(null)

const handleTableUpload = (file: File) => {
  console.log('Table file uploaded:', file)
}

const handleResponseJsonUpload = (file: File) => {
  console.log('Response JSON uploaded:', file)
}

const createNewTable = () => {
  console.log('Creating new table')
}
</script>