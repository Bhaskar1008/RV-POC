<template>
  <v-container fluid>
    <v-stepper v-model="currentStep" class="elevation-0">
      <!-- Stepper Header -->
      <!-- <v-stepper-header>
        <v-stepper-item value="1">Upload JSON Files</v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item value="2">Select Schema</v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item value="3">Map Fields</v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item value="4">Generate Code</v-stepper-item>
      </v-stepper-header> -->

      <!-- Stepper Content -->
      <v-stepper-items>
        <!-- Step 1: Upload JSON Files -->
        <v-stepper-content step="1">
          <JsonUploader
            v-model:request-json="requestJson"
            v-model:arguments-json="argumentsJson"
            @validation="handleValidation"
          />
          <div class="d-flex justify-end mt-4">
            <v-btn
              color="primary"
              @click="nextStep"
              :disabled="!isStep1Valid"
            >
              Continue
            </v-btn>
          </div>
        </v-stepper-content>

        <!-- Step 2: Select Schema -->
        <v-stepper-content step="2">
          <SchemaSelector
            v-model:selected-table="selectedTable"
            v-model:table-schema="tableSchema"
            :arguments-fields="argumentFields"
          />
          <div class="d-flex justify-end mt-4">
            <v-btn
              variant="text"
              class="me-4"
              @click="prevStep"
            >
              Back
            </v-btn>
            <v-btn
              color="primary"
              @click="nextStep"
              :disabled="!isStep2Valid"
            >
              Continue
            </v-btn>
          </div>
        </v-stepper-content>

        <!-- Step 3: Map Fields -->
        <v-stepper-content step="3">
          <FieldMapper
            v-model:mappings="fieldMappings"
            :request-fields="requestFields"
            :table-schema="tableSchema"
            :arguments-fields="argumentFields"
          />
          <div class="d-flex justify-end mt-4">
            <v-btn
              variant="text"
              class="me-4"
              @click="prevStep"
            >
              Back
            </v-btn>
            <v-btn
              color="primary"
              @click="nextStep"
              :disabled="!isStep3Valid"
            >
              Continue
            </v-btn>
          </div>
        </v-stepper-content>

        <!-- Step 4: Generate Code -->
        <v-stepper-content step="4">
          <CodeGenerator
            :mappings="fieldMappings"
            :table-schema="tableSchema"
            :request-json="requestJson"
            :arguments-json="argumentsJson"
          />
          <div class="d-flex justify-end mt-4">
            <v-btn
              variant="text"
              class="me-4"
              @click="prevStep"
            >
              Back
            </v-btn>
            <v-btn
              color="success"
              @click="finishMapping"
            >
              Finish
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import JsonUploader from '../components/JsonMapper/JsonUploader.vue'
import SchemaSelector from '../components/JsonMapper/SchemaSelector.vue'
import FieldMapper from '../components/JsonMapper/FieldMapper.vue'
import CodeGenerator from '../components/JsonMapper/CodeGenerator.vue'

// State
const currentStep = ref(1)
const requestJson = ref(null)
const argumentsJson = ref(null)
const selectedTable = ref(null)
const tableSchema = ref(null)
const fieldMappings = ref([])

// Computed properties for validation
const isStep1Valid = computed(() => requestJson.value && argumentsJson.value)
const isStep2Valid = computed(() => selectedTable.value && tableSchema.value)
const isStep3Valid = computed(() => fieldMappings.value.length > 0)

// Computed properties for derived data
const requestFields = computed(() => {
  if (!requestJson.value) return []
  return extractFields(requestJson.value)
})

const argumentFields = computed(() => {
  if (!argumentsJson.value) return []
  return extractFields(argumentsJson.value)
})

// Methods
const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const handleValidation = (isValid) => {
  // Handle JSON validation results
  console.log('JSON validation:', isValid)
}

const finishMapping = () => {
  // Handle completion of mapping process
  console.log('Mapping completed')
}

const extractFields = (json) => {
  // Utility function to extract fields from JSON
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json
    return Object.keys(parsed).map(key => ({
      name: key,
      type: typeof parsed[key]
    }))
  } catch (error) {
    console.error('Error extracting fields:', error)
    return []
  }
}
</script>

<style scoped>
.v-stepper {
  background: transparent;
}
</style>