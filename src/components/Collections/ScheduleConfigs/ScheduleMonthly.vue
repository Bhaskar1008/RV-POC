<template>
  <v-row>
    <v-col cols="6">
      <v-select
        v-model="config.date"
        :items="monthDays"
        label="Date of Month"
        variant="outlined"
        hide-details
        class="mb-4"
      ></v-select>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="config.time"
        label="Time"
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

// Function to get the day suffix (e.g., 1st, 2nd, 3rd, 4th)
function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

// Calculate the 1st day of the next month
const currentDate = new Date()
const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) // 1st of next month
const formattedNextMonthDate = nextMonthDate.getDate() // Ensure the date is the 1st

// Add 15 minutes to the current time for the default time
const currentTime = addMinutes(currentDate, 0)
const formattedTime = format(currentTime, 'HH:mm')

// Create monthDays for the next month (31 days)
const daysInNextMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate()
const monthDays = Array.from({ length: daysInNextMonth }, (_, i) => ({
  title: `${i + 1}${getDaySuffix(i + 1)}`,
  value: i + 1
}))

const config = ref({
  date: props.modelValue.date || formattedNextMonthDate,
  time: props.modelValue.time || formattedTime
})

watch(config, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>
