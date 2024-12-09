<template>
  <v-card class="metric-card" elevation="2">
    <v-card-text>
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h4 font-weight-bold">{{ formatValue(metric.value) }}</div>
          <div class="text-subtitle-1 mt-2">{{ metric.label }}</div>
        </div>
        <v-icon :color="getTrendColor" size="x-large">
          {{ getTrendIcon }}
        </v-icon>
      </div>
      <v-divider class="my-3"></v-divider>
      <div class="d-flex align-center">
        <span :class="['percentage', getTrendColor + '--text']">
          {{ metric.percentage }}%
        </span>
        <span class="ml-2 text-caption">vs last month</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metric: {
    type: Object,
    required: true
  }
})

const getTrendColor = computed(() => {
  return props.metric.trend === 'up' ? 'success' : 'error'
})

const getTrendIcon = computed(() => {
  return props.metric.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'
})

const formatValue = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return value
}
</script>

<style scoped>
.metric-card {
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.percentage {
  font-weight: bold;
  font-size: 1.1em;
}
</style>