<template>
  <div class="p-4">
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default Value</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mapping Method</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, index) in mappingRows" :key="index">
            <td class="px-6 py-4 whitespace-nowrap">
              <select v-model="row.dataType" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input v-model="row.sampleValue" type="text" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input v-model="row.defaultValue" type="text" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select v-model="row.mappingMethod" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="direct">Direct</option>
                <option value="transform">Transform</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select v-model="row.tableName" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="VechileDetails">VechileDetails</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select v-model="row.columnName" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="bodyType">bodyType</option>
                <option value="certificateNumber">certificateNumber</option>
                <option value="chasisNumber">chasisNumber</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MappingRow {
  dataType: string
  sampleValue: string
  defaultValue: string
  mappingMethod: string
  tableName: string
  columnName: string
}

const mappingRows = ref<MappingRow[]>([
  {
    dataType: '',
    sampleValue: '',
    defaultValue: '',
    mappingMethod: '',
    tableName: '',
    columnName: ''
  }
])
</script>