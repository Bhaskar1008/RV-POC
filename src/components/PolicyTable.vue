<template>
  <v-card>
    <v-card-title class="text-subtitle-1 py-2">
      {{ status === 'Total Policies' ? 'All Policies' : status }} Details
    </v-card-title>
    
    <v-row class="px-4 py-2" align="center">
      <v-col cols="3">
        <v-select
          v-model="selectedBulkAction"
          :items="bulkActions"
          label="Bulk Actions"
          :disabled="!selectedItems.length"
          density="comfortable"
        ></v-select>
      </v-col>
      
      <v-col cols="2">
        <v-btn
          color="primary"
          :disabled="!selectedItems.length || !selectedBulkAction"
          @click="applyBulkAction"
          size="small"
        >
          Apply
        </v-btn>
      </v-col>

      <v-col cols="4">
        <v-text-field
          v-model="search"
          label="Search by Policy Number or Customer Name"
          density="comfortable"
          hide-details
          append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>

      <v-col cols="3" class="text-right">
        <v-btn
          color="success"
          :disabled="!selectedItems.length"
          @click="downloadSelected"
          size="small"
          prepend-icon="mdi-download"
        >
          Download Selected
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="filteredPolicyData"
      :items-per-page="10"
      show-select
      class="elevation-0"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.raw.status)"
          text-color="white"
          size="small"
        >
          {{ item.raw.status }}
        </v-chip>
      </template>
      <template v-slot:item.eaqCaq="{ item }">
        <v-btn
          v-if="item.raw.eaqCaq"
          color="primary"
          size="small"
          variant="text"
          @click="downloadPDF(item.raw.batchId)"
        >
          Download PDF
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import {
  generateBatchId,
  generatePolicyNumber,
  generateDate,
  generateCustomerName,
  generateRegistrationNumber,
  generateFailedResponse,
  generateRemarks
} from '../utils/dataGenerators'
import { POLICY_STATUSES } from '../constants/policyStatuses'

export default {
  name: 'PolicyTable',
  props: {
    status: {
      type: String,
      required: true,
      default: POLICY_STATUSES.ALL.label
    },
    lobName: {
      type: String,
      required: true,
      default: 'CommercialVehicleGCV'
    }
  },
  setup(props) {
    const headers = [
      { title: 'Batch ID', key: 'batchId', sortable: true },
      { title: 'Policy Number', key: 'policyNumber', sortable: true },
      { title: 'Expiration Date', key: 'expirationDate', sortable: true },
      { title: 'Product Name', key: 'productName', sortable: true },
      { title: 'Customer Name', key: 'customerName', sortable: true },
      { title: 'Start Date', key: 'startDate', sortable: true },
      { title: 'End Date', key: 'endDate', sortable: true },
      { title: 'Workflow Status', key: 'workflowStatus', sortable: true },
      { title: 'Status', key: 'status', sortable: true },
      { title: 'Remarks', key: 'remarks', sortable: true },
      { title: 'Registration Number', key: 'registrationNumber', sortable: true },
      { title: 'Failed Response', key: 'failedResponse', sortable: true },
      { title: 'EAQ/CAQ', key: 'eaqCaq', sortable: false }
    ]

    const policyData = ref([])
    const selectedItems = ref([])
    const selectedBulkAction = ref(null)
    const search = ref('')

    const bulkActions = [
      { title: 'Move to BRE-PENDING', value: 'BRE-PENDING' },
      { title: 'Move to PT-MODIFICATION QUEUE', value: 'PT-MODIFICATION QUEUE' },
      { title: 'Move to RETENTION-APPROVAL-QUEUE', value: 'RETENTION-APPROVAL-QUEUE' },
      { title: 'Move to COMMUNICATION-QUEUE', value: 'COMMUNICATION-QUEUE' }
    ]

    const filteredPolicyData = computed(() => {
      if (!search.value) return policyData.value
      
      const searchTerm = search.value.toLowerCase()
      return policyData.value.filter(item => 
        item.policyNumber.toLowerCase().includes(searchTerm) ||
        item.customerName.toLowerCase().includes(searchTerm)
      )
    })

    const getStatusColor = (status) => {
      const statusKey = Object.keys(POLICY_STATUSES).find(
        key => POLICY_STATUSES[key].label === status
      )
      return statusKey ? POLICY_STATUSES[statusKey].color : 'primary'
    }

    const generateTableData = () => {
      if (!props.lobName) return
      
      const count = props.status === POLICY_STATUSES.ALL.label ? 50 : 20
      const data = []

      for (let i = 0; i < count; i++) {
        const startDate = generateDate()
        const endDate = generateDate(new Date(startDate))
        
        data.push({
          batchId: generateBatchId(),
          policyNumber: generatePolicyNumber(),
          expirationDate: endDate,
          productName: props.lobName,
          customerName: generateCustomerName(),
          startDate: startDate,
          endDate: endDate,
          workflowStatus: props.status === POLICY_STATUSES.ALL.label 
            ? Object.values(POLICY_STATUSES)[Math.floor(Math.random() * (Object.values(POLICY_STATUSES).length - 1)) + 1].label 
            : props.status,
          status: props.status === POLICY_STATUSES.ALL.label
            ? Object.values(POLICY_STATUSES)[Math.floor(Math.random() * (Object.values(POLICY_STATUSES).length - 1)) + 1].label
            : props.status,
          remarks: generateRemarks(props.status),
          registrationNumber: generateRegistrationNumber(props.lobName),
          failedResponse: props.status.includes('FAILED') ? generateFailedResponse() : '',
          eaqCaq: props.status === 'RENEWED' || props.status === 'RN-GENERATED'
        })
      }

      policyData.value = data
      selectedItems.value = []
      selectedBulkAction.value = null
    }

    const applyBulkAction = () => {
      if (!selectedBulkAction.value || !selectedItems.value.length) return
      
      // Update the status of selected items
      selectedItems.value.forEach(item => {
        const index = policyData.value.findIndex(policy => policy.batchId === item.batchId)
        if (index !== -1) {
          policyData.value[index].status = selectedBulkAction.value
          policyData.value[index].workflowStatus = selectedBulkAction.value
        }
      })

      // Clear selections after applying action
      selectedItems.value = []
      selectedBulkAction.value = null
    }

    const downloadSelected = () => {
      console.log('Downloading selected items:', selectedItems.value)
      // Implement Excel download logic here
    }

    const downloadPDF = (batchId) => {
      console.log(`Downloading PDF for batch ${batchId}`)
      // Implement actual PDF download logic here
    }

    watch(() => props.status, generateTableData)
    watch(() => props.lobName, generateTableData)

    onMounted(generateTableData)

    return {
      headers,
      policyData,
      filteredPolicyData,
      selectedItems,
      selectedBulkAction,
      bulkActions,
      search,
      getStatusColor,
      applyBulkAction,
      downloadSelected,
      downloadPDF
    }
  }
}
</script>

<style scoped>
.v-data-table {
  margin-top: 0;
}

.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
</style>