<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4">
      Role Management
    </v-card-title>
    <v-card-text class="pt-4">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-select
            :model-value="selectedRole"
            @update:model-value="$emit('update:selectedRole', $event)"
            :items="roleOptions"
            item-title="text"
            item-value="value"
            label="Select Role"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="assignedUserId"
            @update:model-value="$emit('update:assignedUserId', $event)"
            label="Assign User ID"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            :model-value="roleDetails.name"
            @update:model-value="updateRoleDetails('name', $event)"
            label="Role Name"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-3"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            :model-value="roleDetails.description"
            @update:model-value="updateRoleDetails('description', $event)"
            label="Role Description"
            variant="outlined"
            density="compact"
            hide-details
            rows="3"
            class="mb-3"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  selectedRole: String,
  assignedUserId: String,
  roleDetails: {
    type: Object,
    required: true
  },
  roleOptions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:selectedRole', 'update:assignedUserId', 'update:roleDetails'])

const updateRoleDetails = (field, value) => {
  emit('update:roleDetails', {
    ...props.roleDetails,
    [field]: value
  })
}
</script>