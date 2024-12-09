<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    location="right"
    width="600"
    temporary
  >
    <v-card flat>
      <v-toolbar :color="getStatusColor" dark>
        <v-toolbar-title>Policy Review - {{ policyData.policyNumber }}</v-toolbar-title>
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
              <th>Modified Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in reviewFields" :key="field.column">
              <td>{{ field.column }}</td>
              <td>{{ policyData[field.key] }}</td>
              <td>
                <v-text-field
                  :model-value="policyData[field.key]"
                  density="compact"
                  variant="outlined"
                  hide-details
                  readonly
                  class="ma-1"
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
          color="error"
          variant="outlined"
          @click="handleDecision('rejected')"
          class="me-2"
        >
          Reject
        </v-btn>
        <v-btn
          color="success"
          @click="handleDecision('approved')"
        >
          Approve
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'ApprovalPanel',
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
  emits: ['update:modelValue', 'decision'],
  data() {
    return {
      reviewFields: [
        { column: 'POLICY_NUMBER', key: 'policyNumber' },
        { column: 'CUSTOMER_NAME', key: 'customerName' },
        { column: 'START_DATE', key: 'startDate' },
        { column: 'END_DATE', key: 'endDate' },
        { column: 'REGISTRATION_NUMBER', key: 'registrationNumber' }
      ]
    }
  },
  computed: {
    getStatusColor() {
      return 'primary'
    }
  },
  methods: {
    handleDecision(decision) {
      this.$emit('decision', {
        policyNumber: this.policyData.policyNumber,
        decision
      })
      this.$emit('update:modelValue', false)
    }
  }
}
</script>