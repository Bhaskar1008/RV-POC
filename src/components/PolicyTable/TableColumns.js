export const tableHeaders = [
  { title: 'Policy Number', key: 'TXT_POLICY_NO', sortable: true },
  { title: 'Renewal Start Date', key: 'DAT_RENEWAL_INCEPTION_DATE', sortable: true },
  { title: 'Renewal End Date', key: 'DAT_RENEWAL_EXPIRY_DATE', sortable: true },
  { title: 'Customer Type', key: 'TXT_CUSTOMERTYPE', sortable: true },
  { title: 'Product Name', key: 'TXT_PRODUCT_NAME', sortable: true },
  { title: 'Vehicle Make', key: 'TXT_VEICHLE_MAKE_NAME', sortable: true },
  { title: 'Vehicle Model', key: 'TXT_VEICHLE_MOD_NAME', sortable: true },
  { title: 'Registration Date', key: 'DAT_DATEOFREGISTRATION', sortable: true },
  { title: 'Registration Number', key: 'TXT_REGISTRATIONNUMBER', sortable: true },
  { title: 'Workflow Status', key: 'workflowStatus', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'NCB %', key: 'NUM_PREVIOUSYEARNCB', sortable: true },
  { title: 'IDV', key: 'NUM_USERVEHICLEIDV', sortable: true },
  { title: 'EAQ/CAQ', key: 'eaqCaq', sortable: false }
]

export const bulkActions = [
  { title: 'Move to BRE-PENDING', value: 'BRE-PENDING' },
  { title: 'Move to PT-MODIFICATION QUEUE', value: 'PT-MODIFICATION QUEUE' },
  { title: 'Move to RETENTION-APPROVAL-QUEUE', value: 'RETENTION-APPROVAL-QUEUE' },
  { title: 'Move to COMMUNICATION-QUEUE', value: 'COMMUNICATION-QUEUE' }
]