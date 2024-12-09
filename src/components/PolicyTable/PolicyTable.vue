<template>
  <v-card>
    <v-card-title class="text-subtitle-1 py-2">
      {{ status === 'Total Policies' ? 'All Policies' : status }} Details
    </v-card-title>
    
    <v-row class="px-4 py-2" align="center">
      <v-col cols="4">
        <v-text-field
          v-model="search"
          label="Search by Policy Number, Customer Name, Registration Number"
          density="comfortable"
          hide-details
          append-inner-icon="mdi-magnify"
          variant="outlined"
          class="mb-2"
        ></v-text-field>
      </v-col>

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
      :search="search"
      show-select
      class="elevation-0"
      item-value="TXT_POLICY_NO"
    >
      <template v-slot:item.TXT_POLICY_NO="{ item }">
        <template v-if="isModifiableStatus(item.raw.status)">
          <a 
            href="#" 
            @click.prevent="openPanel(item.raw)"
            class="text-decoration-none text-primary"
          >
            {{ item.raw.TXT_POLICY_NO }}
          </a>
        </template>
        <template v-else>
          {{ item.raw.TXT_POLICY_NO }}
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
          @click="downloadPDF(item.raw.TXT_POLICY_NO)"
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
import ModificationPanel from './ModificationPanel.vue'
import ApprovalPanel from './ApprovalPanel.vue'
import { tableHeaders, bulkActions } from './TableColumns'
import { exportToExcel } from '../../utils/excelExport'
import { generatePolicyData } from '../../utils/dataGenerators'
import { POLICY_STATUSES } from '../../constants/policyStatuses'
import { generatePDF } from '../../utils/pdfGenerator'

export default {
  name: 'PolicyTable',
  components: {
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
      default: 'Motor'
    }
  },
  setup(props) {
    const headers = tableHeaders
    const policyData = ref([])
    const selectedItems = ref([])
    const search = ref('')
    const selectedBulkAction = ref(null)
    const showModificationPanel = ref(false)
    const showApprovalPanel = ref(false)
    const selectedPolicy = ref({})

    const filteredPolicyData = computed(() => {
      if (!search.value) return policyData.value
      
      const searchTerm = search.value.toLowerCase()
      return policyData.value.filter(item => 
        item.TXT_POLICY_NO.toLowerCase().includes(searchTerm) ||
        item.TXT_REGISTRATIONNUMBER.toLowerCase().includes(searchTerm)
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
        const policyDetails = generatePolicyData()
        data.push({
          ...policyDetails,
          status: props.status === POLICY_STATUSES.ALL.label 
            ? Object.values(POLICY_STATUSES)[Math.floor(Math.random() * (Object.values(POLICY_STATUSES).length - 1)) + 1].label 
            : props.status,
          workflowStatus: props.status,
          eaqCaq: props.status === 'RENEWED' || props.status === 'RN-GENERATED'
        })
      }

      policyData.value = data
      selectedItems.value = []
      selectedBulkAction.value = null
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
        policy => policy.TXT_POLICY_NO === selectedPolicy.value.TXT_POLICY_NO
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
        policy => policy.TXT_POLICY_NO === policyNumber
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
      if (!selectedBulkAction.value || !selectedItems.value.length) return
      
      selectedItems.value.forEach(item => {
        const index = policyData.value.findIndex(policy => policy.TXT_POLICY_NO === item)
        if (index !== -1) {
          policyData.value[index].status = selectedBulkAction.value
          policyData.value[index].workflowStatus = selectedBulkAction.value
        }
      })

      selectedItems.value = []
      selectedBulkAction.value = null
    }

    const downloadSelected = () => {
      if (!selectedItems.value.length) return
      const selectedPolicies = selectedItems.value.map(policyNo => {
        return policyData.value.find(p => p.TXT_POLICY_NO === policyNo)
      }).filter(Boolean)
      
      const filename = `policies_${new Date().toISOString().split('T')[0]}.xlsx`
      exportToExcel(selectedPolicies, filename)
    }

    const downloadPDF = (policyNo) => {
      const policy = policyData.value.find(p => p.TXT_POLICY_NO === policyNo)
      if (!policy) return
      
      const doc = generatePDF(policy)
      doc.save(`policy_${policyNo}_${new Date().getTime()}.pdf`)
    }

    watch(() => props.status, generateTableData)
    watch(() => props.lobName, generateTableData)

    onMounted(generateTableData)

    return {
      headers,
      policyData,
      filteredPolicyData,
      selectedItems,
      search,
      selectedBulkAction,
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