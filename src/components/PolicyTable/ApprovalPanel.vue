<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    location="right"
    width="800"
    temporary
  >
    <v-card flat>
      <v-toolbar :color="getStatusColor" dark>
        <v-toolbar-title>Policy Review - {{ policyData.TXT_POLICY_NO }}</v-toolbar-title>
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
        { column: 'TXT_POLICY_NO', key: 'TXT_POLICY_NO' },
        { column: 'DAT_RENEWAL_INCEPTION_DATE', key: 'DAT_RENEWAL_INCEPTION_DATE' },
        { column: 'DAT_RENEWAL_EXPIRY_DATE', key: 'DAT_RENEWAL_EXPIRY_DATE' },
        { column: 'TXT_CUSTOMERTYPE', key: 'TXT_CUSTOMERTYPE' },
        { column: 'TXT_PRODUCT_NAME', key: 'TXT_PRODUCT_NAME' },
        { column: 'TXT_POLICY_VARIANT', key: 'TXT_POLICY_VARIANT' },
        { column: 'TXT_VEICHLE_MAKE_NAME', key: 'TXT_VEICHLE_MAKE_NAME' },
        { column: 'TXT_VEICHLE_MOD_NAME', key: 'TXT_VEICHLE_MOD_NAME' },
        { column: 'TXT_VARIANT', key: 'TXT_VARIANT' },
        { column: 'NUM_VEICHLE_MAKE_YR', key: 'NUM_VEICHLE_MAKE_YR' },
        { column: 'TXT_FUEL_TYPE', key: 'TXT_FUEL_TYPE' },
        { column: 'TXT_RTO_LOC', key: 'TXT_RTO_LOC' },
        { column: 'DAT_DATEOFREGISTRATION', key: 'DAT_DATEOFREGISTRATION' },
        { column: 'TXT_REGISTRATIONNUMBER', key: 'TXT_REGISTRATIONNUMBER' },
        { column: 'TXT_ENGINE_NO', key: 'TXT_ENGINE_NO' },
        { column: 'TXT_CHAIS_NO', key: 'TXT_CHAIS_NO' },
        { column: 'NUM_CUBIC_CAPACITY', key: 'NUM_CUBIC_CAPACITY' },
        { column: 'NUM_SEATINGCAPACITY', key: 'NUM_SEATINGCAPACITY' },
        { column: 'NUM_PREVIOUSYEARNCB', key: 'NUM_PREVIOUSYEARNCB' },
        { column: 'NUM_BODY_PRICE', key: 'NUM_BODY_PRICE' },
        { column: 'NUM_EXSHOWROOMPRICE', key: 'NUM_EXSHOWROOMPRICE' },
        { column: 'NUM_USERVEHICLEIDV', key: 'NUM_USERVEHICLEIDV' },
        { column: 'TXT_ADDONBUNDLE', key: 'TXT_ADDONBUNDLE' },
        { column: 'NUM_UNDERWRITINGLOADING', key: 'NUM_UNDERWRITINGLOADING' },
        { column: 'NUM_UNDERWRITINGDISCOUNT', key: 'NUM_UNDERWRITINGDISCOUNT' }
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
        policyNumber: this.policyData.TXT_POLICY_NO,
        decision
      })
      this.$emit('update:modelValue', false)
    }
  }
}
</script>