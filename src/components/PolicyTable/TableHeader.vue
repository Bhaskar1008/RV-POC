<template>
  <v-row class="px-4 py-2" align="center">
    <v-col cols="3">
      <v-select
        v-model="modelValue.bulkAction"
        :items="bulkActions"
        label="Bulk Actions"
        :disabled="!hasSelectedItems"
        density="comfortable"
        @update:model-value="$emit('update:modelValue', { ...modelValue, bulkAction: $event })"
      ></v-select>
    </v-col>
    
    <v-col cols="2">
      <v-btn
        color="primary"
        :disabled="!hasSelectedItems || !modelValue.bulkAction"
        @click="$emit('apply')"
        size="small"
      >
        Apply
      </v-btn>
    </v-col>

    <v-col cols="4">
      <v-text-field
        v-model="modelValue.search"
        label="Search by Policy Number or Customer Name"
        density="comfortable"
        hide-details
        append-inner-icon="mdi-magnify"
        @update:model-value="$emit('update:modelValue', { ...modelValue, search: $event })"
      ></v-text-field>
    </v-col>

    <v-col cols="3" class="text-right">
      <v-btn
        color="success"
        :disabled="!hasSelectedItems"
        @click="$emit('download')"
        size="small"
        prepend-icon="mdi-download"
      >
        Download Selected
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    hasSelectedItems: {
      type: Boolean,
      required: true
    },
    bulkActions: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue', 'apply', 'download']
}
</script>