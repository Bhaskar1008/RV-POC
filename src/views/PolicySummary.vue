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
          v-model="selectLob"
          return-object
          item-title="NUM_IL_PRODUCT_NAME"
          item-value="NUM_IL_PRODUCT_CODE"
          variant="solo"
          style="width: 250px"
        ></v-select>
      </v-col>

      <v-col>
        <p class="font-weight-bold mb-1 caption" style="color: #646666">Select Policy End Date *</p>
        <v-select
          label=""
          class="main_dropdown"
          :items="dateRangeFilterOpn"
          v-model="selectDate"
          return-object
          item-title="text"
          item-value="value"
          variant="solo"
          style="width: 200px"
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
          :lob-name="selectLob?.NUM_IL_PRODUCT_NAME"
        />
      </v-col>
    </v-row>
  </v-container>

  <v-overlay v-model="loading" class="align-center justify-center">
    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { api } from '../services/api'
import PolicyTable from '../components/PolicyTable/PolicyTable.vue'
import { POLICY_STATUSES } from '../constants/policyStatuses'

export default {
  components: {
    PolicyTable
  },
  setup() {
    const lobList = ref([])
    const selectLob = ref(null)
    const dateRangeFilterOpn = [
      { text: 'Current Month', value: 'CM' },
      { text: 'Next 2 Months', value: 'N2M' },
      { text: 'Next 3 Months', value: 'N3M' },
      { text: 'Custom', value: 'DR' }
    ]
    const selectDate = ref({
      text: 'Next 2 Months',
      value: 'N2M'
    })
    const policyCards = ref([])
    const selectedStatus = ref(POLICY_STATUSES.ALL.label)
    const dateRange = ref({
      from: '',
      to: ''
    })
    const loading = ref(false)

    const fetchPolicySummary = async () => {
      loading.value = true
      try {
        const data = await api.getPolicySummary()
        policyCards.value = data.policyCards
        lobList.value = data.lobList
        selectLob.value = data.lobList[0]
        dateRange.value = data.dateRange
      } catch (error) {
        console.error('Error fetching policy summary:', error)
      } finally {
        loading.value = false
      }
    }

    const handleLOBChange = async () => {
      if (!selectLob.value) return
      loading.value = true
      try {
        const updatedCards = await api.filterByLOB(selectLob.value.NUM_IL_PRODUCT_CODE)
        policyCards.value = updatedCards
      } catch (error) {
        console.error('Error updating LOB:', error)
      } finally {
        loading.value = false
      }
    }

    const handleDateChange = async () => {
      if (!selectDate.value) return
      loading.value = true
      try {
        const updatedCards = await api.updatePolicyEndDate(selectDate.value.value)
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

    watch(selectLob, handleLOBChange)
    watch(selectDate, handleDateChange)

    onMounted(fetchPolicySummary)

    return {
      lobList,
      selectLob,
      dateRangeFilterOpn,
      selectDate,
      policyCards,
      selectedStatus,
      dateRange,
      loading,
      handleCardClick
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