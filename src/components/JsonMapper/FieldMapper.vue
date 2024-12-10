<template>
  <v-card class="mb-4">
    <v-card-title>Map Fields</v-card-title>
    <v-card-text>
      <v-row>
        <!-- Mapping Interface -->
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="mappingRows"
            item-value="id"
            class="elevation-1"
          >
            <!-- Source Field -->
            <template v-slot:item.sourceField="{ item }">
              <v-select
                v-model="item.raw.sourceField"
                :items="requestFields"
                item-title="name"
                item-value="name"
                label="Select source field"
                density="compact"
                @update:model-value="updateMapping(item.raw)"
              ></v-select>
            </template>

            <!-- Target Field -->
            <template v-slot:item.targetField="{ item }">
              <v-select
                v-model="item.raw.targetField"
                :items="availableTargetFields"
                item-title="name"
                item-value="name"
                label="Select target field"
                density="compact"
                @update:model-value="updateMapping(item.raw)"
              ></v-select>
            </template>

            <!-- Transformation -->
            <template v-slot:item.transformation="{ item }">
              <v-select
                v-model="item.raw.transformation"
                :items="transformations"
                label="Select transformation"
                density="compact"
                @update:model-value="updateMapping(item.raw)"
              ></v-select>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                density="compact"
                @click="removeMapping(item.raw)"
              ></v-btn>
            </template>
          </v-data-table>

          <!-- Add Mapping Button -->
          <v-btn
            color="primary"
            class="mt-4"
            @click="addMapping"
          >
            Add Mapping
          </v-btn>
        </v-col>

        <!-- Mapping Summary -->
        <v-col cols="12" class="mt-4">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                Mapping Summary
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item
                    v-for="mapping in validMappings"
                    :key="mapping.id"
                    :title="`${mapping.sourceField} → ${mapping.targetField}`"
                    :subtitle="mapping.transformation || 'Direct mapping'"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        :color="mapping.isValid ? 'success' : 'error'"
                        :icon="mapping.isValid ? 'mdi-check-circle' : 'mdi-alert-circle'"
                      ></v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  requestFields: {
    type: Array,
    required: true
  },
  tableSchema: {
    type: Array,
    required: true
  },
  argumentsFields: {
    type: Array,
    required: true
  },
  mappings: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:mappings'])

// Table headers
const headers = [
  { title: 'Source Field', key: 'sourceField', sortable: false },
  { title: 'Target Field', key: 'targetField', sortable: false },
  { title: 'Transformation', key: 'transformation', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

// Available transformations
const transformations = [
  'Direct',
  'ToString',
  'ToNumber',
  'ToBoolean',
  'ToDate',
  'Custom'
]

// Local state
const mappingRows = ref(props.mappings.length > 0 ? props.mappings : [])

// Computed properties
const availableTargetFields = computed(() => {
  return [...props.tableSchema, ...props.argumentsFields]
})

const validMappings = computed(() => {
  return mappingRows.value.map(mapping => ({
    ...mapping,
    isValid: mapping.sourceField && mapping.targetField
  }))
})

// Methods
const addMapping = () => {
  mappingRows.value.push({
    id: uuidv4(),
    sourceField: '',
    targetField: '',
    transformation: 'Direct'
  })
}

const removeMapping = (mapping) => {
  const index = mappingRows.value.findIndex(m => m.id === mapping.id)
  if (index !== -1) {
    mappingRows.value.splice(index, 1)
    updateMappings()
  }
}

const updateMapping = (mapping) => {
  const index = mappingRows.value.findIndex(m => m.id === mapping.id)
  if (index !== -1) {
    mappingRows.value[index] = { ...mapping }
    updateMappings()
  }
}

const updateMappings = () => {
  emit('update:mappings', mappingRows.value)
}
</script>