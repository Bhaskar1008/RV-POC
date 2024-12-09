import { utils, writeFile } from 'xlsx'

export const exportToExcel = (data, filename) => {
  // Convert data to worksheet format
  const ws = utils.json_to_sheet(data)
  
  // Create workbook and append worksheet
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Report')
  
  // Generate Excel file
  writeFile(wb, filename)
}

export const prepareLOBDataForExport = (chartData) => {
  return chartData.labels.map((label, index) => ({
    'LOB Name': label,
    'Renewals Count': chartData.datasets[0].data[index],
    'Percentage': ((chartData.datasets[0].data[index] / 
      chartData.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + '%'
  }))
}

export const prepareBatchDataForExport = (batch) => {
  return {
    'Batch ID': batch.id,
    'Scheduled Date/Time': batch.scheduled,
    'Status': batch.status,
    'Policies': Array.from({ length: 20 }, (_, i) => ({
      'Policy Number': `POL${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      'Customer Name': `Customer ${i + 1}`,
      'Product': ['Motor', 'Travel', 'Health'][Math.floor(Math.random() * 3)],
      'Premium': Math.floor(Math.random() * 50000 + 10000),
      'Status': batch.status
    }))
  }
}