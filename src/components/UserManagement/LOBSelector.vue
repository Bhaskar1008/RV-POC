<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :items="options"
    item-title="text"
    item-value="value"
    label="Select Line of Business"
    variant="outlined"
    density="compact"
    hide-details
    class="lob-selector"
  />
</template>

<script setup>
defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.lob-selector {
  max-width: 300px;
}
</style>