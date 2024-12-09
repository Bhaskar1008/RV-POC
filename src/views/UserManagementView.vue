<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h5 font-weight-bold mb-0">User Management</h1>
          <v-spacer />
          <LOBSelector
            v-model="selectedLOB"
            :options="lobOptions"
          />
        </div>
        
        <UserTable
          :headers="userTableHeaders"
          :users="filteredUsers"
        />

        <RoleTable
          :headers="roleTableHeaders"
          :roles="filteredRoles"
        />

        <RoleManagement
          v-model:selected-role="selectedRole"
          v-model:assigned-user-id="assignedUserId"
          v-model:role-details="newRoleDetails"
          :role-options="roleOptions"
        />

        <ModuleAccess
          :headers="moduleAccessHeaders"
          :automation-modules="moduleAccess"
          :manual-modules="manualModules"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { lobOptions } from '../constants/userManagement'
import { useUserManagement } from '../composables/useUserManagement'
import LOBSelector from '../components/UserManagement/LOBSelector.vue'
import UserTable from '../components/UserManagement/UserTable.vue'
import RoleTable from '../components/UserManagement/RoleTable.vue'
import RoleManagement from '../components/UserManagement/RoleManagement.vue'
import ModuleAccess from '../components/UserManagement/ModuleAccess.vue'

const {
  selectedLOB,
  filteredUsers,
  filteredRoles,
  selectedRole,
  assignedUserId,
  newRoleDetails,
  userTableHeaders,
  roleTableHeaders,
  moduleAccessHeaders,
  moduleAccess,
  manualModules,
  roleOptions
} = useUserManagement()
</script>