import { utils, writeFile } from 'xlsx'

export const exportToExcel = (data, filename = 'policies.xlsx') => {
  const formattedData = data.map(item => ({
    'Policy Number': item.TXT_POLICY_NO || '',
    'Customer Type': item.TXT_CUSTOMERTYPE || '',
    'Product Name': item.TXT_PRODUCT_NAME || '',
    'Vehicle Make': item.TXT_VEICHLE_MAKE_NAME || '',
    'Vehicle Model': item.TXT_VEICHLE_MOD_NAME || '',
    'Registration Number': item.TXT_REGISTRATIONNUMBER || '',
    'Registration Date': item.DAT_DATEOFREGISTRATION || '',
    'Renewal Start Date': item.DAT_RENEWAL_INCEPTION_DATE || '',
    'Renewal End Date': item.DAT_RENEWAL_EXPIRY_DATE || '',
    'NCB %': item.NUM_PREVIOUSYEARNCB || '',
    'IDV': item.NUM_USERVEHICLEIDV || '',
    'Status': item.status || '',
    'Workflow Status': item.workflowStatus || ''
  }))

  const worksheet = utils.json_to_sheet(formattedData)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Policies')
  writeFile(workbook, filename)
}