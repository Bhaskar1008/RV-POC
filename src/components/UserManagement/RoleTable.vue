<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4 d-flex justify-space-between align-center">
      <span>Roles</span>
      <v-btn
        icon
        variant="text"
        class="collapse-btn"
        @click="isRolesCollapsed = !isRolesCollapsed"
        :aria-label="isRolesCollapsed ? 'Expand Roles' : 'Collapse Roles'"
      >
        <v-icon>{{ isRolesCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="!isRolesCollapsed">
      <v-data-table :headers="headers" :items="roles" density="compact" hover>
        <template #item.value="{ item }">
          <v-btn color="primary" @click="openAccessModal(item)">Module Access</v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="isModalOpen" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Module Access for {{ selectedRole.name }}</v-card-title>
        <v-card-text>
          <v-tabs v-model="activeTab" align-with-title>
            <v-tab>Automation</v-tab>
            <v-tab>Manual</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item>
              <v-select
                v-model="automationBucket"
                :items="buckets"
                label="Select Bucket"
                dense
              ></v-select>
            </v-tab-item>

            <v-tab-item>
              <v-select
                v-model="manualModule"
                :items="modules"
                label="Select Module"
                dense
              ></v-select>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="isModalOpen = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveModuleAccess">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

// Props
defineProps({
  headers: {
    type: Array,
    required: true,
  },
  roles: {
    type: Array,
    required: true,
  },
});
const roles = [
  {
    id: 'R001',
    name: 'Administrator',
    description: 'Full access to all settings and configurations',
    lob: 'Finance',
    usersAssigned: 10
  },
  {
    id: 'R002',
    name: 'HR Manager',
    description: 'Manages employee records and payroll',
    lob: 'HR',
    usersAssigned: 5
  },
  {
    id: 'R003',
    name: 'IT Support',
    description: 'Handles IT-related issues and user accounts',
    lob: 'IT',
    usersAssigned: 8
  },
  {
    id: 'R004',
    name: 'Marketing Lead',
    description: 'Oversees all marketing campaigns and strategies',
    lob: 'Marketing',
    usersAssigned: 6
  },
  {
    id: 'R005',
    name: 'Operations Manager',
    description: 'Ensures daily operational workflow is maintained',
    lob: 'Operations',
    usersAssigned: 4
  }
]
// State
const isRolesCollapsed = ref(true);
const isModalOpen = ref(false);
const activeTab = ref(0);
const selectedRole = ref(null);
const automationBucket = ref(null);
const manualModule = ref(null);

// Data
const buckets = ['Bucket A', 'Bucket B', 'Bucket C'];
const modules = ['Module X', 'Module Y', 'Module Z'];

// Methods
const openAccessModal = (role) => {
  selectedRole.value = role;
  isModalOpen.value = true;
};

const saveModuleAccess = () => {
  console.log('Automation Bucket:', automationBucket.value);
  console.log('Manual Module:', manualModule.value);
  console.log('Role:', selectedRole.value);
  isModalOpen.value = false;
};
</script>

<style scoped>
.collapse-btn {
  color: black;
  transition: background-color 0.2s ease-in-out;
}

.collapse-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>