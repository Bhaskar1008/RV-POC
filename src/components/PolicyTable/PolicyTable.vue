<template>
  <v-card>
    <v-card-title class="text-subtitle-1 py-2">
      {{ status === 'Total Policies' ? 'All Policies' : status }} Details
    </v-card-title>
    
    <TableHeader
      v-model="tableState"
      :has-selected-items="selectedItems.length > 0"
      :bulk-actions="bulkActions"
      @apply="applyBulkAction"
      @download="downloadSelected"
    />

    <v-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="filteredPolicyData"
      :items-per-page="10"
      show-select
      class="elevation-0"
    >
      <template v-slot:item.policyNumber="{ item }">
        <template v-if="isModifiableStatus(item.raw.status)">
          <a 
            href="#" 
            @click.prevent="openPanel(item.raw)"
            class="text-decoration-none text-primary"
          >
            {{ item.raw.policyNumber }}
          </a>
        </template>
        <template v-else>
          {{ item.raw.policyNumber }}
        </template>
      </template>

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

    <ModificationPanel
      v-model="showModificationPanel"
      :policy-data="selectedPolicy"
      @confirm="handleModificationConfirm"
    />

    <ApprovalPanel
      v-model="showApprovalPanel"
      :policy-data="selectedPolicy"
      @decision="handleApprovalDecision"
    />
  </v-card>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import TableHeader from './TableHeader.vue'
import ModificationPanel from './ModificationPanel.vue'
import ApprovalPanel from './ApprovalPanel.vue'
import { tableHeaders, bulkActions } from './TableColumns'
import { exportToExcel } from '../../utils/excelExport'
import {
  generateBatchId,
  generatePolicyNumber,
  generateDate,
  generateCustomerName,
  generateRegistrationNumber,
  generateFailedResponse,
  generateRemarks
} from '../../utils/dataGenerators'
import { POLICY_STATUSES } from '../../constants/policyStatuses'
import { saveAs } from 'file-saver'

export default {
  name: 'PolicyTable',
  components: {
    TableHeader,
    ModificationPanel,
    ApprovalPanel
  },
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
    const headers = tableHeaders
    const policyData = ref([])
    const selectedItems = ref([])
    const tableState = ref({
      bulkAction: null,
      search: ''
    })
    const showModificationPanel = ref(false)
    const showApprovalPanel = ref(false)
    const selectedPolicy = ref({})

    const filteredPolicyData = computed(() => {
      if (!tableState.value.search) return policyData.value
      
      const searchTerm = tableState.value.search.toLowerCase()
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
      tableState.value.bulkAction = null
    }

    const isModifiableStatus = (status) => {
      return status === POLICY_STATUSES.PT_MODIFICATION_QUEUE.label ||
             status === POLICY_STATUSES.RETENTION_APPROVAL_QUEUE.label
    }

    const openPanel = (policy) => {
      selectedPolicy.value = { ...policy }
      if (policy.status === POLICY_STATUSES.PT_MODIFICATION_QUEUE.label) {
        showModificationPanel.value = true
      } else if (policy.status === POLICY_STATUSES.RETENTION_APPROVAL_QUEUE.label) {
        showApprovalPanel.value = true
      }
    }

    const handleModificationConfirm = (changes) => {
      const index = policyData.value.findIndex(
        policy => policy.policyNumber === selectedPolicy.value.policyNumber
      )
      if (index !== -1) {
        policyData.value[index] = {
          ...policyData.value[index],
          ...changes,
          status: POLICY_STATUSES.RETENTION_APPROVAL_QUEUE.label,
          workflowStatus: POLICY_STATUSES.RETENTION_APPROVAL_QUEUE.label
        }
      }
    }

    const handleApprovalDecision = ({ policyNumber, decision }) => {
      const index = policyData.value.findIndex(
        policy => policy.policyNumber === policyNumber
      )
      if (index !== -1) {
        const newStatus = decision === 'approved' 
          ? POLICY_STATUSES.COMMUNICATION_QUEUE.label 
          : POLICY_STATUSES.PT_MODIFICATION_QUEUE.label
        
        policyData.value[index] = {
          ...policyData.value[index],
          status: newStatus,
          workflowStatus: newStatus
        }
      }
    }

    const applyBulkAction = () => {
      if (!tableState.value.bulkAction || !selectedItems.value.length) return
      
      selectedItems.value.forEach(item => {
        const index = policyData.value.findIndex(policy => policy.batchId === item.batchId)
        if (index !== -1) {
          policyData.value[index].status = tableState.value.bulkAction
          policyData.value[index].workflowStatus = tableState.value.bulkAction
        }
      })

      selectedItems.value = []
      tableState.value.bulkAction = null
    }

    const downloadSelected = () => {
      if (!selectedItems.value.length) return
      
      const selectedPolicies = selectedItems.value.map(item => {
        const policy = policyData.value.find(p => p.batchId === item.batchId)
        return policy
      })

      const filename = `policies_${new Date().toISOString().split('T')[0]}.xlsx`
      exportToExcel(selectedPolicies, filename)
    }

    const downloadPDF = (batchId) => {
      // Simulated PDF download
      const blob = new Blob(['Sample PDF content'], { type: 'application/pdf' })
      saveAs(blob, `policy_${batchId}.pdf`)
    }

    watch(() => props.status, generateTableData)
    watch(() => props.lobName, generateTableData)

    onMounted(generateTableData)

    return {
      headers,
      policyData,
      filteredPolicyData,
      selectedItems,
      tableState,
      bulkActions,
      showModificationPanel,
      showApprovalPanel,
      selectedPolicy,
      isModifiableStatus,
      openPanel,
      handleModificationConfirm,
      handleApprovalDecision,
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