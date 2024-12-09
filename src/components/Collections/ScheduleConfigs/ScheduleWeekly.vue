<template>
  <v-row>
    <!-- Select Day of Week -->
    <v-col cols="6">
      <v-select
        v-model="config.day"
        :items="weekDays"
        item-text="title"
        item-value="value"
        label="Day of Week"
        variant="outlined"
        hide-details
        class="mb-4"
      ></v-select>
    </v-col>
    <!-- Select Time -->
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
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const weekDays = [
  { title: 'Sunday', value: 0 },
  { title: 'Monday', value: 1 },
  { title: 'Tuesday', value: 2 },
  { title: 'Wednesday', value: 3 },
  { title: 'Thursday', value: 4 },
  { title: 'Friday', value: 5 },
  { title: 'Saturday', value: 6 }
]

const config = ref({
  day: props.modelValue.day || '', // Default to an empty string for now
  time: props.modelValue.time || ''
})

// Set the default day to today's day
onMounted(() => {
  const today = new Date()
  const todayDay = today.getDay() // Get today's day (0-6, where 0 = Sunday, 1 = Monday, etc.)
  
  if (!props.modelValue.day) {
    config.value.day = todayDay
  }
})

watch(config, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>
