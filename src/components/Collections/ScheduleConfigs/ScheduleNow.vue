<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="config.date"
        label="Start Date"
        type="date"
        variant="outlined"
        hide-details
        :min="minDate"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="config.time"
        label="Start Time"
        type="time"
        variant="outlined"
        hide-details
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from 'vue'
import { format, addMinutes } from 'date-fns'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

// Set the default date to today
const currentDate = new Date()
const formattedDate = format(currentDate, 'yyyy-MM-dd')

// Add 15 minutes to the current time
const currentTime = addMinutes(currentDate, 15)
const formattedTime = format(currentTime, 'HH:mm')

const config = ref({
  date: props.modelValue.date || formattedDate,
  time: props.modelValue.time || formattedTime
})

const minDate = formattedDate

watch(config, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>
