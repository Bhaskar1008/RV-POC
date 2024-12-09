<template>
  <v-container fluid class="renewal-vault pa-6">
    <!-- Header Section -->
    <v-row>
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold">
          Hello {{ userName }}, welcome back!
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Last logged in: {{ formatDate(lastLogin) }}
        </p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center justify-end">
        <v-select
          v-model="selectedProduct"
          :items="products"
          label="Dashboard of"
          density="comfortable"
          hide-details
          class="product-select"
          @update:model-value="handleProductChange"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Metrics Section -->
    <v-row class="mt-6">
      <v-col v-for="metric in metrics" :key="metric.label" cols="12" sm="6" lg="3">
        <MetricsCard :metric="metric" />
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <CoverageChart
          title="Top 5 Covers Taken"
          :coverage-data="coverageData"
        />
      </v-col>
      <v-col cols="12" md="6">
        <CoverageChart
          title="Coverage Wise Report"
          :coverage-data="coverageWiseData"
        />
      </v-col>
    </v-row>

    <!-- Batch List Section -->
    <v-row class="mt-6">
      <v-col cols="12">
        <BatchList
          :loading="loading"
          :batches="batchData"
          @download="handleBatchDownload"
        />
      </v-col>
    </v-row>

    <!-- LOB Renewal Activity -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            LOB-wise Renewal Activity
            <v-spacer></v-spacer>
            <v-select
              v-model="selectedDateRange"
              :items="dateRanges"
              label="Date Range"
              density="comfortable"
              hide-details
              class="date-range-select"
              @update:model-value="handleDateRangeChange"
            ></v-select>
            <v-btn
              color="primary"
              class="ml-4"
              prepend-icon="mdi-download"
              @click="exportLOBData"
            >
              Export
            </v-btn>
          </v-card-title>
          <v-card-text>
            <Bar :data="lobChartData" :options="lobChartOptions" height="300" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import MetricsCard from '../components/RenewalVault/MetricsCard.vue'
import CoverageChart from '../components/RenewalVault/CoverageChart.vue'
import BatchList from '../components/RenewalVault/BatchList.vue'
import { 
  generateMetricsData, 
  generateCoverageData, 
  generateBatchData, 
  generateLOBData 
} from '../utils/renewalVault/dataGenerators'
import { 
  exportToExcel, 
  prepareLOBDataForExport, 
  prepareBatchDataForExport 
} from '../utils/renewalVault/exportUtils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// User Data
const userName = ref('John')
const lastLogin = ref(new Date())
const loading = ref(false)

// Product Selection
const selectedProduct = ref('MOTOR')
const products = [
  { title: 'Travel', value: 'TRAVEL' },
  { title: 'Bharat Griha Raksha', value: 'BGR' },
  { title: 'Motor', value: 'MOTOR' },
  { title: 'Personal Accident', value: 'PA' },
  { title: 'GCV', value: 'GCV' },
  { title: 'PCV', value: 'PCV' }
]

// Dynamic Data
const metrics = ref([])
const coverageData = ref([])
const coverageWiseData = ref([])
const batchData = ref([])
const lobChartData = ref({
  labels: [],
  datasets: []
})

// Date Range Selection
const selectedDateRange = ref('Q4 - FY2023')
const dateRanges = ['Q1 - FY2023', 'Q2 - FY2023', 'Q3 - FY2023', 'Q4 - FY2023']

const lobChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Methods
const formatDate = (date) => {
  return format(date, 'dd MMM yyyy, HH:mm')
}

const handleProductChange = () => {
  loading.value = true
  setTimeout(() => {
    metrics.value = generateMetricsData(selectedProduct.value)
    coverageData.value = generateCoverageData(selectedProduct.value)
    coverageWiseData.value = generateCoverageData(selectedProduct.value)
    loading.value = false
  }, 500)
}

const handleDateRangeChange = () => {
  loading.value = true
  setTimeout(() => {
    lobChartData.value = generateLOBData(selectedDateRange.value)
    batchData.value = generateBatchData(selectedDateRange.value)
    loading.value = false
  }, 500)
}

const handleBatchDownload = (batch) => {
  const data = prepareBatchDataForExport(batch)
  exportToExcel(data.Policies, `batch_${batch.id}_report.xlsx`)
}

const exportLOBData = () => {
  const data = prepareLOBDataForExport(lobChartData.value)
  exportToExcel(data, `lob_renewal_activity_${selectedDateRange.value}.xlsx`)
}

// Initialize data
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    handleProductChange()
    handleDateRangeChange()
  }, 500)
})

// Watch for changes
watch(selectedProduct, handleProductChange)
watch(selectedDateRange, handleDateRangeChange)
</script>

<style scoped>
.renewal-vault {
  background-color: #f5f5f5;
}

.product-select {
  max-width: 300px;
}

.date-range-select {
  max-width: 200px;
}

:deep(.v-card) {
  border-radius: 8px;
}

:deep(.v-card-title) {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 16px;
}
</style>