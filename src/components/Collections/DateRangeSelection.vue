<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="fromDateModel"
          label="From Date"
          type="date"
          variant="outlined"
          :error="error"
          :error-messages="error ? 'Invalid date range' : ''"
          :min="minDate"
          :max="toDateModel"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="toDateModel"
          label="To Date"
          type="date"
          variant="outlined"
          :error="error"
          :error-messages="error ? 'Invalid date range' : ''"
          :min="fromDateModel"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  fromDate: String,
  toDate: String,
  error: Boolean
})

const emit = defineEmits(['update:fromDate', 'update:toDate'])

const fromDateModel = ref(props.fromDate)
const toDateModel = ref(props.toDate)
const minDate = format(new Date(), 'yyyy-MM-dd')

watch(fromDateModel, (newValue) => {
  emit('update:fromDate', newValue)
})

watch(toDateModel, (newValue) => {
  emit('update:toDate', newValue)
})

watch(() => props.fromDate, (newValue) => {
  fromDateModel.value = newValue
})

watch(() => props.toDate, (newValue) => {
  toDateModel.value = newValue
})
</script>