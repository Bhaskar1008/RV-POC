import { format, addDays } from 'date-fns'

export const generateBatchId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export const generatePolicyNumber = () => {
  return `P${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
}

export const generateDate = (baseDate = new Date()) => {
  const randomDays = Math.floor(Math.random() * 365)
  return format(addDays(baseDate, randomDays), 'yyyy-MM-dd')
}

export const generateCustomerName = () => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

export const generateRegistrationNumber = (productName) => {
  if (!productName) return 'REG000000'
  const prefix = productName.slice(0, 2).toUpperCase()
  return `${prefix}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
}

export const generateFailedResponse = () => {
  const responses = [
    'Invalid policy details',
    'Missing required documents',
    'Verification failed',
    'System error occurred',
    'Data validation error'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

export const generateRemarks = (status) => {
  const remarksByStatus = {
    'BRE-PENDING': ['Awaiting verification', 'In review queue', 'Pending approval'],
    'BRE-SUCCESS': ['Successfully processed', 'All checks passed', 'Ready for next stage'],
    'BRE-FAILED': ['Validation failed!', 'Critical error found!', 'Review required!'],
    'RENEWED': ['Policy renewed successfully', 'New term started', 'Payment confirmed'],
    'LAPSED': ['Payment overdue!', 'No response from customer!', 'Policy expired!'],
    default: ['Standard processing', 'Under review', 'In progress']
  }
  const remarks = remarksByStatus[status] || remarksByStatus.default
  return remarks[Math.floor(Math.random() * remarks.length)]
}