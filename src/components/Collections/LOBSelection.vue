<template>
  <div>
    <v-select
      v-model="selectedLOB"
      :items="LOB_OPTIONS"
      label="Select Line of Business"
      variant="outlined"
      hide-details
      class="mb-4"
      @update:model-value="handleLOBChange"
    ></v-select>

    <v-text-field
      :model-value="productCode"
      label="Product Code"
      variant="outlined"
      hide-details
      disabled
    ></v-text-field>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { LOB_OPTIONS } from '../../utils/collections/constants'

const props = defineProps({
  lob: String,
  productCode: String
})

const emit = defineEmits(['update:lob', 'update:productCode'])

const selectedLOB = ref(props.lob)

const handleLOBChange = (value) => {
  const selected = LOB_OPTIONS.find(option => option.value === value)
  emit('update:lob', value)
  emit('update:productCode', selected?.code || '')
}

watch(() => props.lob, (newValue) => {
  selectedLOB.value = newValue
})
</script>