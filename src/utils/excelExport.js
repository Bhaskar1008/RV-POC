import { utils, writeFile } from 'xlsx'

export const exportToExcel = (data, filename = 'policies.xlsx') => {
  const worksheet = utils.json_to_sheet(data.map(item => ({
    'Batch ID': item.batchId,
    'Policy Number': item.policyNumber,
    'Expiration Date': item.expirationDate,
    'Product Name': item.productName,
    'Customer Name': item.customerName,
    'Start Date': item.startDate,
    'End Date': item.endDate,
    'Workflow Status': item.workflowStatus,
    'Status': item.status,
    'Remarks': item.remarks,
    'Registration Number': item.registrationNumber,
    'Failed Response': item.failedResponse || ''
  })))

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Policies')
  writeFile(workbook, filename)
}