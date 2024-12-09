<template>
  <v-card class="metric-card" elevation="1">
    <v-card-text class="pa-3">
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h6 font-weight-bold">{{ formatValue(metric.value) }}</div>
          <div class="text-caption mt-1">{{ metric.label }}</div>
        </div>
        <v-icon :color="getTrendColor" size="large">
          {{ getTrendIcon }}
        </v-icon>
      </div>
      <div class="d-flex align-center mt-2">
        <span :class="['percentage', getTrendColor + '--text']">
          {{ metric.percentage }}%
        </span>
        <span class="text-caption ml-2">vs last month</span>
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
  transform: translateY(-2px);
}

.percentage {
  font-weight: 600;
  font-size: 0.9rem;
}
</style>