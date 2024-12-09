<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="config.time"
        label="Daily Time"
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

const config = ref({
  time: props.modelValue.time || ''
})

// Function to round the time to the next future 30-minute increment
function getNextRoundedTime() {
  const now = new Date()
  const minutes = now.getMinutes()
  
  // Round to the next 30-minute increment
  let roundedMinutes = Math.ceil(minutes / 30) * 30
  if (roundedMinutes === 60) {
    // If the rounded time is 60 minutes, set to the next hour
    now.setHours(now.getHours() + 1)
    roundedMinutes = 0
  }
  
  // Set the rounded time
  now.setMinutes(roundedMinutes)
  now.setSeconds(0)
  
  // Format as hh:mm (24-hour format)
  const hours = String(now.getHours()).padStart(2, '0')
  const mins = String(now.getMinutes()).padStart(2, '0')
  
  return `${hours}:${mins}`
}

// Set the default rounded time when the component is mounted
onMounted(() => {
  const nextTime = getNextRoundedTime()
  config.value.time = nextTime
})

watch(config, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>
