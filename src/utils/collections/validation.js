export const validateScheduleConfig = (type, config) => {
  if (!type) return false
  
  switch (type) {
    case 'NOW':
      return config.date && config.time
    case 'DAILY':
      return config.time
    case 'WEEKLY':
      return config.day !== undefined && config.time
    case 'MONTHLY':
      return config.date && config.time
    default:
      return false
  }
}

export const validateDateRange = (fromDate, toDate) => {
  if (!fromDate || !toDate) return false
  return new Date(fromDate) <= new Date(toDate)
}