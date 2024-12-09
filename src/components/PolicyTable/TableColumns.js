export const tableHeaders = [
  { title: 'Batch ID', key: 'batchId', sortable: true },
  { title: 'Policy Number', key: 'policyNumber', sortable: true },
  { title: 'Expiration Date', key: 'expirationDate', sortable: true },
  { title: 'Product Name', key: 'productName', sortable: true },
  { title: 'Customer Name', key: 'customerName', sortable: true },
  { title: 'Start Date', key: 'startDate', sortable: true },
  { title: 'End Date', key: 'endDate', sortable: true },
  { title: 'Workflow Status', key: 'workflowStatus', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Remarks', key: 'remarks', sortable: true },
  { title: 'Registration Number', key: 'registrationNumber', sortable: true },
  { title: 'Failed Response', key: 'failedResponse', sortable: true },
  { title: 'EAQ/CAQ', key: 'eaqCaq', sortable: false }
]

export const bulkActions = [
  { title: 'Move to BRE-PENDING', value: 'BRE-PENDING' },
  { title: 'Move to PT-MODIFICATION QUEUE', value: 'PT-MODIFICATION QUEUE' },
  { title: 'Move to RETENTION-APPROVAL-QUEUE', value: 'RETENTION-APPROVAL-QUEUE' },
  { title: 'Move to COMMUNICATION-QUEUE', value: 'COMMUNICATION-QUEUE' }
]