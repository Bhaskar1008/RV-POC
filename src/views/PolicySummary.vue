<template>
  <v-container fluid class="pa-0">
    <v-row style="margin-top: 5px">
      <v-col cols="7">
        <div class="d-flex pa-2">
          <span class="body-2 font-weight-bold mt-4" style="color: #1e83c2; margin-left: 20px">
            Policy Summary -
          </span>
          <span class="body-2 font-weight-bold mt-4" style="color: #e46a25; margin-left: 8px">
            {{ dateRange.from }} To {{ dateRange.to }}
          </span>
        </div>
      </v-col>
      <v-col>
        <p class="font-weight-bold mb-1 caption" style="color: #646666">Select Line of Business *</p>
        <v-select
          label=""
          class="main_dropdown"
          :items="lobList"
          v-model="selectedLob"
          item-title="name"
          item-value="code"
          variant="solo"
          style="width: 250px"
          @update:model-value="handleLOBChange"
        ></v-select>
      </v-col>

      <v-col>
        <p class="font-weight-bold mb-1 caption" style="color: #646666">Select Policy End Date *</p>
        <v-select
          label=""
          class="main_dropdown"
          :items="dateRangeFilterOpn"
          v-model="selectedDate"
          item-title="text"
          item-value="value"
          variant="solo"
          style="width: 200px"
          @update:model-value="handleDateSelection"
        ></v-select>
      </v-col>
    </v-row>

    <v-row style="margin: 5px">
      <v-col v-for="card in policyCards" :key="card.id" cols="auto" class="pa-2">
        <v-hover v-slot="{ isHovering, props }" close-delay="200">
          <v-card
            :elevation="isHovering ? 16 : 2"
            :class="{ 'on-hover': isHovering, 'selected-card': selectedStatus === card.status }"
            v-bind="props"
            width="150px"
            height="80px"
            :style="{ cursor: 'pointer' }"
            @click="handleCardClick(card.status)"
          >
            <v-card-item>
              <v-card-title :style="{ color: card.color }">{{ card.count }}</v-card-title>
              <v-card-text>{{ card.status }}</v-card-text>
            </v-card-item>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row style="margin: 5px">
      <v-col cols="12">
        <PolicyTable
          :status="selectedStatus"
          :lob-name="selectedLob?.name"
        />
      </v-col>
    </v-row>
  </v-container>

  <!-- Date Range Dialog -->
  <v-dialog v-model="showDateDialog" max-width="400">
    <v-card>
      <v-card-title>Select Date Range</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="customDateRange.from"
              label="From Date"
              type="date"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="customDateRange.to"
              label="To Date"
              type="date"
              variant="outlined"
              density="comfortable"
              :min="customDateRange.from"
              :rules="[v => !v || v >= customDateRange.from || 'End date must be after start date']"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="cancelDateSelection">Cancel</v-btn>
        <v-btn 
          color="primary" 
          @click="applyDateRange"
          :disabled="!customDateRange.from || !customDateRange.to || customDateRange.to < customDateRange.from"
        >
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-overlay v-model="loading" class="align-center justify-center">
    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import PolicyTable from '../components/PolicyTable/PolicyTable.vue'
import { POLICY_STATUSES } from '../constants/policyStatuses'
import { format, addMonths, parseISO } from 'date-fns'

export default {
  components: {
    PolicyTable
  },
  setup() {
    const lobList = [
      { name: 'Travel', code: 'TRAVEL' },
      { name: 'Bharat Griha Raksha', code: 'BGR' },
      { name: 'Motor', code: 'MOTOR' },
      { name: 'Personal Accident', code: 'PA' },
      { name: 'GCV', code: 'GCV' },
      { name: 'PCV', code: 'PCV' }
    ]
    const selectedLob = ref(lobList[0])
    const dateRangeFilterOpn = [
      { text: 'Current Month', value: 'CM' },
      { text: 'Next 2 Months', value: 'N2M' },
      { text: 'Next 3 Months', value: 'N3M' },
      { text: 'Custom', value: 'DR' }
    ]
    const selectedDate = ref({
      text: 'Next 2 Months',
      value: 'N2M'
    })
    const policyCards = ref([])
    const selectedStatus = ref(POLICY_STATUSES.ALL.label)
    const dateRange = ref({
      from: format(new Date(), 'yyyy-MMM-dd'),
      to: format(addMonths(new Date(), 2), 'yyyy-MMM-dd')
    })
    const loading = ref(false)
    const showDateDialog = ref(false)
    const customDateRange = ref({
      from: format(new Date(), 'yyyy-MM-dd'),
      to: format(addMonths(new Date(), 2), 'yyyy-MM-dd')
    })

    const updateDateRange = (fromDate, toDate) => {
      const from = typeof fromDate === 'string' ? parseISO(fromDate) : fromDate
      const to = typeof toDate === 'string' ? parseISO(toDate) : toDate
      
      dateRange.value = {
        from: format(from, 'yyyy-MMM-dd'),
        to: format(to, 'yyyy-MMM-dd')
      }
    }

    const handleDateSelection = async (selection) => {
      if (selection === 'DR') {
        showDateDialog.value = true
        return
      }

      const today = new Date()
      let toDate

      switch (selection) {
        case 'CM':
          toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          break
        case 'N2M':
          toDate = addMonths(today, 2)
          break
        case 'N3M':
          toDate = addMonths(today, 3)
          break
        default:
          toDate = addMonths(today, 2)
      }

      updateDateRange(today, toDate)
      await handleDateChange(selection)
    }

    const cancelDateSelection = () => {
      showDateDialog.value = false
      selectedDate.value = 'N2M'
      customDateRange.value = {
        from: format(new Date(), 'yyyy-MM-dd'),
        to: format(addMonths(new Date(), 2), 'yyyy-MM-dd')
      }
    }

    const applyDateRange = async () => {
      if (customDateRange.value.from && customDateRange.value.to) {
        updateDateRange(customDateRange.value.from, customDateRange.value.to)
        showDateDialog.value = false
        await handleDateChange('DR')
      }
    }

    const fetchPolicySummary = async () => {
      loading.value = true
      try {
        const data = await api.getPolicySummary()
        policyCards.value = data.policyCards
        selectedLob.value = lobList[0]
        updateDateRange(new Date(), addMonths(new Date(), 2))
      } catch (error) {
        console.error('Error fetching policy summary:', error)
      } finally {
        loading.value = false
      }
    }

    const handleLOBChange = async () => {
      if (!selectedLob.value) return
      loading.value = true
      try {
        const updatedCards = await api.filterByLOB(selectedLob.value.code)
        policyCards.value = updatedCards
      } catch (error) {
        console.error('Error updating LOB:', error)
      } finally {
        loading.value = false
      }
    }

    const handleDateChange = async (dateFilter) => {
      loading.value = true
      try {
        const updatedCards = await api.updatePolicyEndDate(dateFilter)
        policyCards.value = updatedCards
      } catch (error) {
        console.error('Error updating date range:', error)
      } finally {
        loading.value = false
      }
    }

    const handleCardClick = (status) => {
      selectedStatus.value = status
    }

    onMounted(fetchPolicySummary)

    return {
      lobList,
      selectedLob,
      dateRangeFilterOpn,
      selectedDate,
      policyCards,
      selectedStatus,
      dateRange,
      loading,
      showDateDialog,
      customDateRange,
      handleCardClick,
      handleDateSelection,
      cancelDateSelection,
      applyDateRange,
      handleLOBChange
    }
  }
}
</script>

<style>
*.main_dropdown .v-text-field.v-text-field--solo .v-input__control {
  min-height: 30px !important;
  max-height: 5px;
  border-radius: 5px;
}

.main_dropdown
  .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  border-radius: 5px;
  outline: solid 1px rgb(201, 201, 201);
}

.v-card-item .v-card-title {
  padding: 0;
  font-weight: bold;
  font-size: 16px;
}

.v-card-item .v-card-text {
  font-size: 12px;
}

.selected-card {
  border: 2px solid #1e83c2;
}
</style>