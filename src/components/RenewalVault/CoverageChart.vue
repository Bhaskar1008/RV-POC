<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="selectedView" mandatory>
        <v-btn value="chart" icon="mdi-chart-pie"></v-btn>
        <v-btn value="table" icon="mdi-table"></v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-card-text>
      <div v-if="selectedView === 'chart'" class="chart-container">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
      <v-table v-else>
        <thead>
          <tr>
            <th>Coverage Name</th>
            <th class="text-right">Count</th>
            <th class="text-right">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in coverageData" :key="index">
            <td>{{ item.name }}</td>
            <td class="text-right">{{ item.value.toLocaleString() }}</td>
            <td class="text-right">{{ calculatePercentage(item.value) }}%</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  title: {
    type: String,
    default: 'Coverage Distribution'
  },
  coverageData: {
    type: Array,
    required: true
  }
})

const selectedView = ref('chart')

const chartData = computed(() => ({
  labels: props.coverageData.map(item => item.name),
  datasets: [{
    data: props.coverageData.map(item => item.value),
    backgroundColor: [
      '#4CAF50',
      '#2196F3',
      '#FFC107',
      '#9C27B0',
      '#FF5722'
    ]
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const calculatePercentage = (value) => {
  const total = props.coverageData.reduce((sum, item) => sum + item.value, 0)
  return ((value / total) * 100).toFixed(1)
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}
</style>