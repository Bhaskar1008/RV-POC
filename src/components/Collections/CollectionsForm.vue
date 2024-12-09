<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-row dense>
      <!-- LOB Selection -->
      <v-col cols="2">
        <LOBSelection v-model:lob="formData.lob" v-model:productCode="formData.productCode" density="compact" />
      </v-col>

      <!-- Date Range Selection -->
      <v-col cols="4">
        <DateRangeSelection v-model:fromDate="formData.fromDate" v-model:toDate="formData.toDate"
          :error="!isDateRangeValid" density="compact" />
      </v-col>

      <!-- Schedule Job Selection -->
      <v-col cols="3">
        <ScheduleJobSelection v-model:scheduleType="formData.scheduleType"
          v-model:scheduleConfig="formData.scheduleConfig" :error="!isScheduleConfigValid" density="compact" />
      </v-col>

      <!-- Remarks -->
      <v-col cols="3">
        <v-textarea v-model="formData.remarks" label="Remarks" rows="1" variant="outlined" density="compact"
          hide-details></v-textarea>
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row dense class="mt-2">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="grey-darken-1" variant="text" class="me-2" density="compact" @click="$emit('cancel')">
          Cancel
        </v-btn>
        <v-btn color="primary" type="submit" :disabled="!isFormValid" density="compact">
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-form>

  <v-container>
    <v-row>
      <v-col cols="12">
        <h4>Scheduled Job Lists</h4>
        <v-data-table :headers="headers" :items="jobs" item-value="batchId" dense class="elevation-1">
          <template #item.status="{ item }">
            <span :class="getStatusClass(item.selectable.status)">
              {{ item.selectable.status }}
            </span>
          </template>

          <template #item.action="{ item }">
            <v-list-item
                v-if="item.selectable.status === 'Success' || item.selectable.status === 'Failed'">
                <v-menu offset-y>
                  <template #activator="{ props }">
                    <v-btn icon v-bind="props">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-if="item.selectable.status === 'Success' || item.selectable.status === 'Failed'"
                      @click="generateExcelReport(item.value, item.selectable.policyCount)"
                    >
                      <v-list-item-title>Generate Excel Report</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="item.selectable.status === 'Success' || item.selectable.status === 'Failed'"
                      @click="openEmailModal(item.value)"
                    >
                      <v-list-item-title>Send Report to Email</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
              <v-list-item v-else-if="item.selectable.status === 'In Progress'">
                <v-list-item-title>Generating Report...</v-list-item-title>
              </v-list-item>
          </template>

        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modal for Sending Email -->
    <v-dialog v-model="emailModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Send Report to Email</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="emailForm" @submit.prevent="sendEmail">
            <v-text-field v-model="emailDetails.to" label="To" required></v-text-field>
            <v-text-field v-model="emailDetails.cc" label="CC"></v-text-field>
            <v-text-field v-model="emailDetails.bcc" label="BCC"></v-text-field>
            <v-text-field v-model="emailDetails.subject" label="Subject" required></v-text-field>
            <v-textarea v-model="emailDetails.content" label="Content" rows="3" required></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="emailModal = false">Cancel</v-btn>
          <v-btn color="primary" @click="sendEmail">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import LOBSelection from './LOBSelection.vue'
import DateRangeSelection from './DateRangeSelection.vue'
import ScheduleJobSelection from './ScheduleJobSelection.vue'
import { validateScheduleConfig, validateDateRange } from '../../utils/collections/validation'
import { saveAs } from 'file-saver'
const emit = defineEmits(['submit']);
const headers = [
  { title: 'Batch ID', align: 'start', sortable: true, key: 'batchId' },
  { title: 'LOB', align: 'start', sortable: true, key: 'lob' },
  { title: 'Job Scheduled Date/Time', align: 'start', sortable: true, key: 'scheduledDateTime' },
  { title: 'Remarks', align: 'start', sortable: true, key: 'remarks' },
  { title: 'Status', align: 'start', sortable: true, key: 'status' },
  { title: 'Error Count', align: 'end', sortable: true, key: 'errorCount' },
  { title: 'Policy Count', align: 'end', sortable: true, key: 'policyCount' },
  { title: 'Action', align: 'start', sortable: false, key: 'action' }
]

const jobs = ref([{"batchId":"3F2A7D98","lob":"Auto","scheduledDateTime":"2024-12-10 10:00","remarks":"Monthly Policy","status":"Success","errorCount":0,"policyCount":150},{"batchId":"A9B4E7C1","lob":"Health","scheduledDateTime":"2024-12-11 14:00","remarks":"Quarterly Policy","status":"Failed","errorCount":5,"policyCount":120},{"batchId":"4F2D8E9A","lob":"Life","scheduledDateTime":"2024-12-12 16:00","remarks":"Annual Policy","status":"In Progress","errorCount":0,"policyCount":200},{"batchId":"1A2B3C4D","lob":"Auto","scheduledDateTime":"2024-12-14 09:00","remarks":"Monthly Policy","status":"Success","errorCount":0,"policyCount":180},{"batchId":"A2D3F4E5","lob":"Health","scheduledDateTime":"2024-12-15 11:00","remarks":"Quarterly Policy","status":"Failed","errorCount":2,"policyCount":100},{"batchId":"B1C2D3E4","lob":"Life","scheduledDateTime":"2024-12-16 13:30","remarks":"Annual Policy","status":"Success","errorCount":0,"policyCount":250},{"batchId":"C3F4A5B6","lob":"Auto","scheduledDateTime":"2024-12-17 15:00","remarks":"Monthly Policy","status":"Failed","errorCount":4,"policyCount":130},{"batchId":"D4E5F6A7","lob":"Health","scheduledDateTime":"2024-12-18 17:00","remarks":"Quarterly Policy","status":"In Progress","errorCount":0,"policyCount":110},{"batchId":"E5F6A7B8","lob":"Life","scheduledDateTime":"2024-12-19 19:00","remarks":"Annual Policy","status":"Success","errorCount":0,"policyCount":220},{"batchId":"F6A7B8C9","lob":"Auto","scheduledDateTime":"2024-12-20 10:00","remarks":"Monthly Policy","status":"Failed","errorCount":3,"policyCount":140},{"batchId":"G7B8C9D0","lob":"Health","scheduledDateTime":"2024-12-21 12:00","remarks":"Quarterly Policy","status":"Success","errorCount":0,"policyCount":90},{"batchId":"H8C9D0E1","lob":"Life","scheduledDateTime":"2024-12-22 14:00","remarks":"Annual Policy","status":"In Progress","errorCount":1,"policyCount":260},{"batchId":"I9D0E1F2","lob":"Auto","scheduledDateTime":"2024-12-23 16:00","remarks":"Monthly Policy","status":"Success","errorCount":0,"policyCount":200},{"batchId":"J0E1F2G3","lob":"Health","scheduledDateTime":"2024-12-24 18:00","remarks":"Quarterly Policy","status":"Failed","errorCount":6,"policyCount":130},{"batchId":"K1F2G3H4","lob":"Life","scheduledDateTime":"2024-12-25 20:00","remarks":"Annual Policy","status":"Success","errorCount":0,"policyCount":210},{"batchId":"L2G3H4I5","lob":"Auto","scheduledDateTime":"2024-12-26 09:00","remarks":"Monthly Policy","status":"In Progress","errorCount":0,"policyCount":160},{"batchId":"M3H4I5J6","lob":"Health","scheduledDateTime":"2024-12-27 11:00","remarks":"Quarterly Policy","status":"Success","errorCount":0,"policyCount":140},{"batchId":"N4I5J6K7","lob":"Life","scheduledDateTime":"2024-12-28 13:30","remarks":"Annual Policy","status":"Failed","errorCount":3,"policyCount":220},{"batchId":"O5J6K7L8","lob":"Auto","scheduledDateTime":"2024-12-29 15:00","remarks":"Monthly Policy","status":"Success","errorCount":0,"policyCount":180},{"batchId":"P6K7L8M9","lob":"Health","scheduledDateTime":"2024-12-30 17:00","remarks":"Quarterly Policy","status":"In Progress","errorCount":0,"policyCount":150},{"batchId":"Q7L8M9N0","lob":"Life","scheduledDateTime":"2024-12-31 19:00","remarks":"Annual Policy","status":"Success","errorCount":0,"policyCount":230},{"batchId":"R8M9N0O1","lob":"Auto","scheduledDateTime":"2025-01-01 09:00","remarks":"Monthly Policy","status":"Failed","errorCount":2,"policyCount":140},{"batchId":"S9N0O1P2","lob":"Health","scheduledDateTime":"2025-01-02 11:00","remarks":"Quarterly Policy","status":"Success","errorCount":0,"policyCount":100},{"batchId":"T0O1P2Q3","lob":"Life","scheduledDateTime":"2025-01-03 13:00","remarks":"Annual Policy","status":"In Progress","errorCount":0,"policyCount":190},{"batchId":"U1P2Q3R4","lob":"Auto","scheduledDateTime":"2025-01-04 15:00","remarks":"Monthly Policy","status":"Success","errorCount":0,"policyCount":175},{"batchId":"V2Q3R4S5","lob":"Health","scheduledDateTime":"2025-01-05 17:00","remarks":"Quarterly Policy","status":"Failed","errorCount":4,"policyCount":110}]);

const emailModal = ref(false)
const emailDetails = ref({
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  content: ''
})

const getStatusClass = (status) => {
  if (status === 'Success') return 'text-success'
  if (status === 'Failed') return 'text-error'
  return 'text-warning'
}

const generateExcelReport = (batchId, count) => {
  // Helper function to generate random values for each field
  const getRandomValue = (type) => {
    const randomDate = () => {
      const start = new Date(2020, 0, 1);
      const end = new Date(2025, 11, 31);
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    const randomVehicleMake = ['Toyota', 'Honda', 'Ford', 'BMW', 'Nissan'];
    const randomVehicleModel = ['Corolla', 'Civic', 'F-150', 'X5', 'Altima'];
    const randomCustomerType = ['Individual', 'Business'];
    const randomProductName = ['Auto Insurance', 'Health Insurance', 'Life Insurance'];
    const randomPolicyNumber = `P${Math.floor(Math.random() * 100000)}`;
    const randomRegistrationNumber = `MH${Math.floor(Math.random() * 10000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const randomPercentage = `${Math.floor(Math.random() * 30)}%`;
    const randomIDV = Math.floor(Math.random() * 1000000);

    switch (type) {
      case 'Policy Number': return randomPolicyNumber;
      case 'Customer Type': return randomCustomerType[Math.floor(Math.random() * randomCustomerType.length)];
      case 'Product Name': return randomProductName[Math.floor(Math.random() * randomProductName.length)];
      case 'Vehicle Make': return randomVehicleMake[Math.floor(Math.random() * randomVehicleMake.length)];
      case 'Vehicle Model': return randomVehicleModel[Math.floor(Math.random() * randomVehicleModel.length)];
      case 'Registration Number': return randomRegistrationNumber;
      case 'Registration Date': return randomDate().toISOString().split('T')[0];
      case 'Renewal Start Date': return randomDate().toISOString().split('T')[0];
      case 'Renewal End Date': return randomDate().toISOString().split('T')[0];
      case 'NCB %': return randomPercentage;
      case 'IDV': return randomIDV.toString();
      default: return '';
    }
  };

  // Generate the sample data dynamically based on the count
  const sampleData = Array.from({ length: count }, () => [
    batchId,
    getRandomValue('Policy Number'),
    getRandomValue('Customer Type'),
    getRandomValue('Product Name'),
    getRandomValue('Vehicle Make'),
    getRandomValue('Vehicle Model'),
    getRandomValue('Registration Number'),
    getRandomValue('Registration Date'),
    getRandomValue('Renewal Start Date'),
    getRandomValue('Renewal End Date'),
    getRandomValue('NCB %'),
    getRandomValue('IDV')
  ]);

  // Generate CSV content
  const csvContent = [
    'BATCH ID,Policy Number,Customer Type,Product Name,Vehicle Make,Vehicle Model,Registration Number,Registration Date,Renewal Start Date,Renewal End Date,NCB %,IDV',
    ...sampleData.map((row) => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `Batch_${batchId}_Report.csv`)
}

const openEmailModal = (batchId) => {
  emailModal.value = true
  emailDetails.value.subject = `Report for Batch ${batchId}`
}

const sendEmail = () => {
  console.log('Email Details:', emailDetails.value)
  emailModal.value = false
}

const formData = ref({
  lob: '',
  productCode: '',
  fromDate: '',
  toDate: '',
  scheduleType: '',
  scheduleConfig: {},
  remarks: ''
})

const isDateRangeValid = computed(() =>
  validateDateRange(formData.value.fromDate, formData.value.toDate)
)

const isScheduleConfigValid = computed(() =>
  validateScheduleConfig(formData.value.scheduleType, formData.value.scheduleConfig)
)

const isFormValid = computed(() => {
  return formData.value.lob &&
    isDateRangeValid.value &&
    isScheduleConfigValid.value
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...formData.value })
  }
}
</script>

<style scoped>
.text-success {
  color: green;
}

.text-error {
  color: red;
}

.text-warning {
  color: orange;
}
</style>
