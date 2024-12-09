import { ref, watch } from 'vue'
import { userTableHeaders, roleTableHeaders, moduleAccessHeaders } from '../constants/userManagement'

export function useUserManagement() {
  const selectedLOB = ref('')
  const selectedRole = ref(null)
  const assignedUserId = ref('')
  const newRoleDetails = ref({ name: '', description: '' })

  // Sample data - In a real application, this would come from an API
  const users = [
    { id: 'U001', name: 'Alice', mobile: '1234567890', email: 'alice@example.com', lob: 'TRAVEL', assignedBy: 'Admin' },
    { id: 'U002', name: 'Bob', mobile: '9876543210', email: 'bob@example.com', lob: 'MOTOR', assignedBy: 'Manager' }
  ]

  const roles = [
    { id: 'R001', name: 'Admin', description: 'Administrator role', lob: 'TRAVEL', usersAssigned: ['Alice'] },
    { id: 'R002', name: 'Manager', description: 'Manager role', lob: 'MOTOR', usersAssigned: ['Bob'] }
  ]

  const moduleAccess = [
    { id: 'M001', name: 'BRE-PENDING', enabled: true },
    { id: 'M002', name: 'BRE-SUCCESS', enabled: false }
  ]

  const manualModules = [
    { id: 'MM001', name: 'Collection & Processing', enabled: true },
    { id: 'MM002', name: 'Renewal Notice Generation', enabled: false }
  ]

  const filteredUsers = ref([])
  const filteredRoles = ref([])

  const roleOptions = roles.map(role => ({
    text: role.name,
    value: role.id
  }))

  watch(() => selectedLOB.value, (newLOB) => {
    filteredUsers.value = users.filter(user => user.lob === newLOB)
    filteredRoles.value = roles.filter(role => role.lob === newLOB)
  })

  return {
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
  }
}