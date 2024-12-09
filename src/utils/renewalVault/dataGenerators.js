import { addMonths, subMonths } from 'date-fns'

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateMetricsData = (product) => {
  const baseValues = {
    MOTOR: { min: 80000, max: 120000 },
    TRAVEL: { min: 40000, max: 60000 },
    BGR: { min: 20000, max: 40000 },
    PA: { min: 30000, max: 50000 },
    GCV: { min: 50000, max: 70000 },
    PCV: { min: 45000, max: 65000 }
  }

  const base = baseValues[product] || baseValues.MOTOR
  const totalPolicies = generateRandomNumber(base.min, base.max)
  
  return [
    {
      label: 'Total Policies to be Renewed',
      value: totalPolicies,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      percentage: generateRandomNumber(5, 20)
    },
    {
      label: 'Endorsement Requests',
      value: Math.floor(totalPolicies * 0.4),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      percentage: generateRandomNumber(2, 15)
    },
    {
      label: 'Successfully Renewed',
      value: Math.floor(totalPolicies * 0.9),
      trend: 'up',
      percentage: generateRandomNumber(10, 25)
    },
    {
      label: 'Renewals Rejected',
      value: Math.floor(totalPolicies * 0.015),
      trend: 'down',
      percentage: generateRandomNumber(1, 8)
    }
  ]
}

const generateCoverageData = (product) => {
  const coverageTypes = {
    MOTOR: [
      'Personal Accident',
      'Third Party',
      'Accidental Coverage',
      'Theft',
      'Fire'
    ],
    TRAVEL: [
      'Medical Coverage',
      'Trip Cancellation',
      'Lost Baggage',
      'Flight Delay',
      'Emergency Assistance'
    ],
    BGR: [
      'Structure Coverage',
      'Contents Coverage',
      'Natural Disasters',
      'Theft Protection',
      'Liability Coverage'
    ]
  }

  const types = coverageTypes[product] || coverageTypes.MOTOR
  return types.map(name => ({
    name,
    value: generateRandomNumber(35000, 85000)
  }))
}

const generateBatchData = (dateRange) => {
  const statuses = ['Completed', 'Processing', 'Scheduled', 'Failed']
  const batches = []
  const startDate = subMonths(new Date(), 3)

  for (let i = 0; i < 10; i++) {
    const date = addMonths(startDate, Math.random())
    batches.push({
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      scheduled: date.toISOString().slice(0, 16).replace('T', ' '),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }

  return batches
}

const generateLOBData = (dateRange) => {
  const labels = ['Motor GCV', 'Motor MCV', 'Motor PCV', 'Medicare', 'Travel Guard']
  return {
    labels,
    datasets: [
      {
        label: 'Renewals',
        data: labels.map(() => generateRandomNumber(40, 100)),
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722']
      },
      {
        label: 'Endorsement',
        data: labels.map(() => generateRandomNumber(40, 100)),
        backgroundColor: ['#00BCD4', '#8BC34A', '#FF9800', '#FF5722', '#607D8B']
      },
      {
        label: 'Renewed-Failed',
        data: labels.map(() => generateRandomNumber(40, 100)),
        backgroundColor: ['#FF6347', '#8B0000', '#FFD700', '#A52A2A', '#800080']
      }
    ]    
  }
}

export {
  generateMetricsData,
  generateCoverageData,
  generateBatchData,
  generateLOBData
}