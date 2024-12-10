<template>
  <v-card class="mb-4">
    <v-card-title
      class="text-subtitle-1 py-2 px-4 bg-grey-lighten-4 d-flex justify-space-between align-center"
    >
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
        <template #item.actions="{ item }">
          <v-btn color="primary" size="small" outlined @click="openAccessModal(item)" class="ma-1" 
          style="min-width: 80px; height: 30px; font-size: 12px; padding: 0 8px;">
            Module Access
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="isModalOpen" max-width="800">
      <v-card>
        <v-card-title class="text-h6">
          Module Access for {{ selectedRole.name }}
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="activeTab" align-with-title>
            <v-tab>Automation</v-tab>
            <v-tab>Manual</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <!-- Automation Tab -->
            <v-tab-item v-if="activeTab === 0">
              <div class="mb-4">
                <!-- Select Buckets in Automation Tab -->
                <v-select
                  v-model="automationBucket"
                  :items="buckets"
                  label="Select Buckets"
                  dense
                  chips
                  multiple
                ></v-select>
              </div>
              <div v-if="automationBucket.length" class="options-grid">
                <v-simple-table class="styled-table">
                  <thead>
                    <tr>
                      <th>Bucket</th>
                      <th>Hide</th>
                      <th>Show</th>
                      <th>Enable</th>
                      <th>Disable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="bucket in automationBucket" :key="bucket" class="table-row">
                      <td>{{ bucket }}</td>
                      <td>
                        <v-checkbox
                          v-model="automationOptions[bucket].hide"
                          class="styled-checkbox"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          v-model="automationOptions[bucket].show"
                          class="styled-checkbox"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          v-model="automationOptions[bucket].enable"
                          class="styled-checkbox"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-checkbox
                          v-model="automationOptions[bucket].disable"
                          class="styled-checkbox"
                        ></v-checkbox>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-tab-item>

            <!-- Manual Tab -->
            <v-tab-item v-if="activeTab === 1">
              <div class="mb-4">
                <!-- Select Modules in Manual Tab -->
                <v-select
                  v-model="manualModule"
                  :items="modules"
                  label="Select Modules"
                  dense
                  chips
                  multiple
                ></v-select>
              </div>
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
import { ref, watch } from 'vue';

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

// State
const isRolesCollapsed = ref(true);
const isModalOpen = ref(false);
const activeTab = ref(0);
const selectedRole = ref(null);
const automationBucket = ref([]);
const manualModule = ref([]);

// Options for automation
const automationOptions = ref({});

const roles = [{"id":"R001","name":"Administrator","description":"Full access to all settings and configurations","lob":"Finance","usersAssigned":10},{"id":"R002","name":"HR Manager","description":"Manages employee records and payroll","lob":"HR","usersAssigned":5},{"id":"R003","name":"IT Support","description":"Handles IT-related issues and user accounts","lob":"IT","usersAssigned":8},{"id":"R004","name":"Marketing Lead","description":"Oversees all marketing campaigns and strategies","lob":"Marketing","usersAssigned":6},{"id":"R005","name":"Operations Manager","description":"Ensures daily operational workflow is maintained","lob":"Operations","usersAssigned":4}]
// Data
const buckets = ['BRE-PENDING', 'BRE-SUCCESS', 'BRE-FAILED', 'PT-MODIFICATION QUEUE', 'RETENTION-APPROVAL-QUEUE', 'COMMUNICATION-QUEUE','RN-GENERATED', 'RENEWED', 'LAPSED', 'DECLINED'];
const modules = [
  'Collection & Processing',
  'Renewal Notice Generation',
  'Renewal Vault Dashboard',
];

// Methods
const openAccessModal = (role) => {
  selectedRole.value = role;
  isModalOpen.value = true;

  // Initialize automation options for selected buckets
  automationBucket.value.forEach((bucket) => {
    if (!automationOptions.value[bucket]) {
      automationOptions.value[bucket] = {
        hide: false,
        show: true,
        enable: true,
        disable: false,
      };
    }
  });
};

// Watcher to ensure that automationOptions is initialized every time automationBucket is updated
watch(automationBucket, () => {
  automationBucket.value.forEach((bucket) => {
    if (!automationOptions.value[bucket]) {
      automationOptions.value[bucket] = {
        hide: false,
        show: true,
        enable: true,
        disable: false,
      };
    }
  });
}, { immediate: true });

const saveModuleAccess = () => {
  console.log('Automation Options:', automationOptions.value);
  console.log('Manual Modules:', manualModule.value);
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

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 1rem; */
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.styled-table thead {
  background-color: #f5f5f5;
  color: #333;
}

.styled-table th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
}

.styled-table td {
  padding: 12px 15px;
  text-align: left;
  vertical-align: middle;
}

.styled-table tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.table-row {
  transition: background-color 0.3s ease-in-out;
}

.styled-checkbox {
  margin-left: 10px;
}

.styled-table td v-checkbox {
  margin: 0;
}

.styled-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.styled-table thead th {
  background-color: #2196f3;
  color: white;
}
</style>
