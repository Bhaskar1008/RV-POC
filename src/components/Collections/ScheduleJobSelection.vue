<template>
  <div>
    <v-select
      :model-value="scheduleType"
      @update:model-value="$emit('update:scheduleType', $event)"
      :items="SCHEDULE_OPTIONS"
      label="Schedule Job"
      variant="outlined"
      :error="error"
      :error-messages="error ? 'Please complete schedule configuration' : ''"
      class="mb-4"
    ></v-select>

    <component
      :is="scheduleConfigComponent"
      v-if="scheduleConfigComponent"
      :model-value="scheduleConfig"
      @update:model-value="$emit('update:scheduleConfig', $event)"
      :error="error"
    ></component>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SCHEDULE_OPTIONS } from '../../utils/collections/constants'
import ScheduleNow from './ScheduleConfigs/ScheduleNow.vue'
import ScheduleDaily from './ScheduleConfigs/ScheduleDaily.vue'
import ScheduleWeekly from './ScheduleConfigs/ScheduleWeekly.vue'
import ScheduleMonthly from './ScheduleConfigs/ScheduleMonthly.vue'

const props = defineProps({
  scheduleType: String,
  scheduleConfig: {
    type: Object,
    default: () => ({})
  },
  error: Boolean
})

const emit = defineEmits(['update:scheduleType', 'update:scheduleConfig'])

const scheduleConfigComponent = computed(() => {
  switch (props.scheduleType) {
    case 'NOW':
      return ScheduleNow
    case 'DAILY':
      return ScheduleDaily
    case 'WEEKLY':
      return ScheduleWeekly
    case 'MONTHLY':
      return ScheduleMonthly
    default:
      return null
  }
})
</script>