<template>
    <v-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      max-width="1200"
      scrollable
    >
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <span>{{ productName }} Details</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)"></v-btn>
        </v-card-title>
  
        <v-card-text class="pa-4">
          <!-- Filters -->
          <v-row dense class="mb-4">
            <v-col cols="12" sm="4">
              <v-select
                v-model="selectedDateRange"
                :items="dateRanges"
                label="Date Range"
                density="comfortable"
                variant="outlined"
                @update:model-value="handleFiltersChange"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="selectedInsuranceType"
                :items="insuranceTypes"
                label="Insurance Type"
                density="comfortable"
                variant="outlined"
                @update:model-value="handleFiltersChange"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                v-model="selectedRegion"
                :items="regions"
                label="Region"
                density="comfortable"
                variant="outlined"
                @update:model-value="handleFiltersChange"
              ></v-select>
            </v-col>
          </v-row>
  
          <v-row>
            <!-- Bar Chart -->
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-subtitle-1">Monthly Breakdown</v-card-title>
                <v-card-text>
                  <div style="height: 300px">
                    <Bar
                      v-if="!loading"
                      :data="barChartData"
                      :options="barChartOptions"
                    />
                    <v-progress-circular
                      v-else
                      indeterminate
                      color="primary"
                      class="ma-4"
                    ></v-progress-circular>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Line Chart -->
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-subtitle-1">Trend Analysis</v-card-title>
                <v-card-text>
                  <div style="height: 300px">
                    <Line
                      v-if="!loading"
                      :data="lineChartData"
                      :options="lineChartOptions"
                    />
                    <v-progress-circular
                      v-else
                      indeterminate
                      color="primary"
                      class="ma-4"
                    ></v-progress-circular>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Pie Chart -->
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-subtitle-1">Distribution Analysis</v-card-title>
                <v-card-text>
                  <div style="height: 300px">
                    <Pie
                      v-if="!loading"
                      :data="pieChartData"
                      :options="pieChartOptions"
                    />
                    <v-progress-circular
                      v-else
                      indeterminate
                      color="primary"
                      class="ma-4"
                    ></v-progress-circular>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Radar Chart -->
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-subtitle-1">Performance Metrics</v-card-title>
                <v-card-text>
                  <div style="height: 300px">
                    <Radar
                      v-if="!loading"
                      :data="radarChartData"
                      :options="radarChartOptions"
                    />
                    <v-progress-circular
                      v-else
                      indeterminate
                      color="primary"
                      class="ma-4"
                    ></v-progress-circular>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { Bar, Line, Pie, Radar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js'
  import { generateDetailedChartData } from '../../utils/renewalVault/chartGenerators'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
  )
  
  const props = defineProps({
    modelValue: Boolean,
    productName: String,
    productData: Object
  })
  
  defineEmits(['update:modelValue'])
  
  // State
  const loading = ref(false)
  const selectedDateRange = ref('Last 3 Months')
  const selectedInsuranceType = ref('All')
  const selectedRegion = ref('All')
  
  // Filter options
  const dateRanges = ['Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year']
  const insuranceTypes = ['All', 'Renewals', 'Endorsements', 'Claims']
  const regions = ['All', 'North', 'South', 'East', 'West']
  
  // Chart data
  const barChartData = ref(null)
  const lineChartData = ref(null)
  const pieChartData = ref(null)
  const radarChartData = ref(null)
  
  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  }
  
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  }
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: false }
    }
  }
  
  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true
      }
    }
  }
  
  // Methods
  const updateCharts = async () => {
    loading.value = true
    try {
      const data = await generateDetailedChartData(
        props.productName,
        selectedDateRange.value,
        selectedInsuranceType.value,
        selectedRegion.value
      )
      
      barChartData.value = data.barChart
      lineChartData.value = data.lineChart
      pieChartData.value = data.pieChart
      radarChartData.value = data.radarChart
    } catch (error) {
      console.error('Error updating charts:', error)
    } finally {
      loading.value = false
    }
  }
  
  const handleFiltersChange = () => {
    updateCharts()
  }
  
  // Watch for changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      updateCharts()
    }
  })
  </script>
  
  <style scoped>
  .v-card-title {
    font-size: 1.1rem;
    font-weight: 500;
  }
  </style>