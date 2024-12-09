<template>
  <v-container fluid class="renewal-vault pa-4">
    <!-- Header with Filters -->
    <v-card class="mb-4" elevation="1">
      <v-card-text class="py-2">
        <v-row align="center" no-gutters>
          <v-col cols="12" sm="6" md="4">
            <div class="text-h6">Welcome back, {{ userName }}!</div>
            <div class="text-caption text-medium-emphasis">
              Last login: {{ formatDate(lastLogin) }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="8" class="d-flex justify-end align-center">
            <v-select
              v-model="selectedProduct"
              :items="products"
              label="Dashboard of"
              density="compact"
              hide-details
              class="product-select mx-2"
              @update:model-value="handleProductChange"
            ></v-select>
            <v-select
              v-model="selectedDateRange"
              :items="dateRanges"
              label="Date Range"
              density="compact"
              hide-details
              class="date-select"
              @update:model-value="handleDateRangeChange"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Metrics Cards -->
    <v-row dense>
      <v-col v-for="metric in metrics" :key="metric.label" cols="12" sm="6" md="3">
        <MetricsCard :metric="metric" class="mb-4" />
      </v-col>
    </v-row>

    <!-- Collapsible Sections -->
    <div v-for="section in sections" :key="section.id" class="mb-4">
      <v-card elevation="1">
        <v-card-title 
          class="py-2 px-4 d-flex align-center cursor-pointer" 
          @click="section.isExpanded = !section.isExpanded"
        >
          <span class="text-subtitle-1">{{ section.title }}</span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="section.hasExport"
            icon="mdi-download"
            size="small"
            variant="text"
            class="mr-2"
            @click.stop="handleExport(section.id)"
          ></v-btn>
          <v-icon>{{ section.isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-card-title>

        <v-expand-transition>
          <div v-show="section.isExpanded">
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <!-- Coverage Charts -->
              <v-row v-if="section.id === 'coverage'" dense>
                <v-col cols="12" md="6">
                  <CoverageChart
                    title="Top 5 Covers"
                    :coverage-data="coverageData"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <CoverageChart
                    title="Coverage Distribution"
                    :coverage-data="coverageWiseData"
                  />
                </v-col>
              </v-row>

              <!-- LOB Chart -->
              <div v-else-if="section.id === 'lob'" style="height: 300px">
                <Bar :data="lobChartData" :options="lobChartOptions" />
              </div>

              <!-- Batch List -->
              <BatchList
                v-else-if="section.id === 'batches'"
                :loading="loading"
                :batches="batchData"
                @download="handleBatchDownload"
              />
              
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </div>
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

// Sections Configuration
const sections = ref([
  { 
    id: 'coverage', 
    title: 'Coverage Analysis', 
    isExpanded: true,
    hasExport: false 
  },
  { 
    id: 'batches', 
    title: 'Collection & Processing Batches', 
    isExpanded: true,
    hasExport: true 
  },
  { 
    id: 'lob', 
    title: 'LOB-wise Renewal Activity', 
    isExpanded: true,
    hasExport: true 
  }
])

// Selections
const selectedProduct = ref('MOTOR')
const selectedDateRange = ref('Q4 - FY2023')

const products = [
  { title: 'Travel', value: 'TRAVEL' },
  { title: 'Bharat Griha Raksha', value: 'BGR' },
  { title: 'Motor', value: 'MOTOR' },
  { title: 'Personal Accident', value: 'PA' },
  { title: 'GCV', value: 'GCV' },
  { title: 'PCV', value: 'PCV' }
]

const dateRanges = ['Q1 - FY2023', 'Q2 - FY2023', 'Q3 - FY2023', 'Q4 - FY2023']

// Dynamic Data
const metrics = ref([])
const coverageData = ref([])
const coverageWiseData = ref([])
const batchData = ref([])
const lobChartData = ref({ labels: [], datasets: [] })

const lobChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  }
}

// Methods
const formatDate = (date) => format(date, 'dd MMM yyyy, HH:mm')

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

const handleExport = (sectionId) => {
  if (sectionId === 'batches') {
    const data = prepareBatchDataForExport(batchData.value[0])
    exportToExcel(data.Policies, `batch_report_${new Date().getTime()}.xlsx`)
  } else if (sectionId === 'lob') {
    const data = prepareLOBDataForExport(lobChartData.value)
    exportToExcel(data, `lob_activity_${selectedDateRange.value}.xlsx`)
  }
}

const handleBatchDownload = (batch) => {
  const data = prepareBatchDataForExport(batch)
  exportToExcel(data.Policies, `batch_${batch.id}_report.xlsx`)
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
  max-width: 200px;
}

.date-select {
  max-width: 150px;
}

.cursor-pointer {
  cursor: pointer;
}

:deep(.v-card) {
  border-radius: 8px;
}

:deep(.v-card-title) {
  font-size: 1rem;
  font-weight: 500;
}

:deep(.v-card-text) {
  padding: 12px;
}
</style>