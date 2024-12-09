<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    location="right"
    width="600"
    temporary
  >
    <v-card flat>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Policy Modification - {{ policyData.policyNumber }}</v-toolbar-title>
        <template v-slot:append>
          <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)"></v-btn>
        </template>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-table>
          <thead>
            <tr>
              <th>DB Column Name</th>
              <th>Current Value</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in modifiableFields" :key="field.column">
              <td>{{ field.column }}</td>
              <td>{{ policyData[field.key] }}</td>
              <td>
                <v-text-field
                  v-model="modifications[field.key]"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="ma-1"
                  :placeholder="policyData[field.key]"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="handleConfirm"
        >
          Confirm Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'ModificationPanel',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    policyData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'confirm'],
  data() {
    return {
      modifications: {},
      modifiableFields: [
        { column: 'POLICY_NUMBER', key: 'policyNumber' },
        { column: 'CUSTOMER_NAME', key: 'customerName' },
        { column: 'START_DATE', key: 'startDate' },
        { column: 'END_DATE', key: 'endDate' },
        { column: 'REGISTRATION_NUMBER', key: 'registrationNumber' }
      ]
    }
  },
  watch: {
    modelValue(newVal) {
      if (!newVal) {
        this.modifications = {}
      }
    }
  },
  methods: {
    handleConfirm() {
      const changes = Object.entries(this.modifications)
        .filter(([_, value]) => value !== '' && value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      
      this.$emit('confirm', changes)
      this.$emit('update:modelValue', false)
      this.modifications = {}
    }
  }
}
</script>