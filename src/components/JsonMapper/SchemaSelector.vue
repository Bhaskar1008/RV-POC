<template>
  <v-card class="mb-4">
    <v-card-title>Select Database Table</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <!-- Table Selection -->
          <v-select
            v-model="selectedTableLocal"
            :items="availableTables"
            label="Select Table"
            @update:model-value="handleTableSelection"
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-if="selectedTableLocal">
        <!-- Table Schema Display -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1">
              Table Schema
              <v-spacer></v-spacer>
              <v-text-field
                v-model="schemaSearch"
                append-inner-icon="mdi-magnify"
                label="Search fields"
                single-line
                hide-details
                density="compact"
              ></v-text-field>
            </v-card-title>
            
            <v-card-text>
              <v-list>
                <v-list-group
                  v-for="group in groupedSchema"
                  :key="group.type"
                  :value="group.type"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      :title="group.type"
                      :subtitle="`${group.fields.length} fields`"
                    ></v-list-item>
                  </template>

                  <v-list-item
                    v-for="field in group.fields"
                    :key="field.name"
                    :title="field.name"
                    :subtitle="`${field.type}${field.required ? ' (Required)' : ''}`"
                  >
                    <template v-slot:append>
                      <v-chip
                        v-if="field.isPrimary"
                        color="primary"
                        size="small"
                        class="ms-2"
                      >
                        Primary Key
                      </v-chip>
                      <v-chip
                        v-if="field.required"
                        color="warning"
                        size="small"
                        class="ms-2"
                      >
                        Required
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Arguments Fields Display -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-subtitle-1">
              Arguments Fields
              <v-spacer></v-spacer>
              <v-text-field
                v-model="argumentsSearch"
                append-inner-icon="mdi-magnify"
                label="Search arguments"
                single-line
                hide-details
                density="compact"
              ></v-text-field>
            </v-card-title>
            
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="field in filteredArgumentsFields"
                  :key="field.name"
                  :title="field.name"
                  :subtitle="field.type"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  selectedTable: String,
  tableSchema: Array,
  argumentsFields: Array
})

const emit = defineEmits(['update:selectedTable', 'update:tableSchema'])

// Local state
const selectedTableLocal = ref(props.selectedTable)
const schemaSearch = ref('')
const argumentsSearch = ref('')

// Mock data for available tables
const availableTables = [
  'users',
  'products',
  'orders',
  'customers',
  'transactions'
]

// Mock schema data - In real app, this would come from API
const mockSchemas = {
  users: [
    { name: 'id', type: 'integer', required: true, isPrimary: true },
    { name: 'username', type: 'string', required: true },
    { name: 'email', type: 'string', required: true },
    { name: 'created_at', type: 'timestamp' }
  ],
  products: [
    { name: 'id', type: 'integer', required: true, isPrimary: true },
    { name: 'name', type: 'string', required: true },
    { name: 'price', type: 'decimal', required: true },
    { name: 'description', type: 'text' }
  ]
}

// Computed properties
const groupedSchema = computed(() => {
  if (!selectedTableLocal.value) return []
  
  const schema = mockSchemas[selectedTableLocal.value] || []
  const filtered = schemaSearch.value
    ? schema.filter(field => 
        field.name.toLowerCase().includes(schemaSearch.value.toLowerCase()) ||
        field.type.toLowerCase().includes(schemaSearch.value.toLowerCase())
      )
    : schema

  const groups = {}
  filtered.forEach(field => {
    if (!groups[field.type]) {
      groups[field.type] = []
    }
    groups[field.type].push(field)
  })

  return Object.entries(groups).map(([type, fields]) => ({
    type,
    fields
  }))
})

const filteredArgumentsFields = computed(() => {
  if (!props.argumentsFields) return []
  
  return argumentsSearch.value
    ? props.argumentsFields.filter(field =>
        field.name.toLowerCase().includes(argumentsSearch.value.toLowerCase()) ||
        field.type.toLowerCase().includes(argumentsSearch.value.toLowerCase())
      )
    : props.argumentsFields
})

// Methods
const handleTableSelection = async (table) => {
  emit('update:selectedTable', table)
  // In real app, fetch schema from API
  emit('update:tableSchema', mockSchemas[table])
}

// Watch for prop changes
watch(() => props.selectedTable, (newValue) => {
  selectedTableLocal.value = newValue
})
</script>

<style scoped>
.v-list-group__items {
  background-color: rgb(250, 250, 250);
}
</style>