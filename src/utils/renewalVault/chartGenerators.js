import { addMonths, format, subMonths } from 'date-fns'

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getMonthLabels = (months) => {
  const labels = []
  const today = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    labels.push(format(subMonths(today, i), 'MMM yyyy'))
  }
  
  return labels
}

export const generateDetailedChartData = async (
  productName,
  dateRange,
  insuranceType,
  region
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const months = dateRange === 'Last Month' ? 1 :
                dateRange === 'Last 3 Months' ? 3 :
                dateRange === 'Last 6 Months' ? 6 : 12

  const labels = getMonthLabels(months)

  // Bar Chart Data
  const barChart = {
    labels,
    datasets: [
      {
        label: 'Renewals',
        data: labels.map(() => generateRandomNumber(50, 200)),
        backgroundColor: '#4CAF50'
      },
      {
        label: 'Endorsements',
        data: labels.map(() => generateRandomNumber(30, 150)),
        backgroundColor: '#2196F3'
      },
      {
        label: 'Failed',
        data: labels.map(() => generateRandomNumber(10, 50)),
        backgroundColor: '#F44336'
      }
    ]
  }

  // Line Chart Data
  const lineChart = {
    labels,
    datasets: [
      {
        label: 'Trend',
        data: labels.map(() => generateRandomNumber(50, 200)),
        borderColor: '#2196F3',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.1)'
      }
    ]
  }

  // Pie Chart Data
  const pieChart = {
    labels: ['Successful', 'Pending', 'Failed', 'In Progress'],
    datasets: [{
      data: [
        generateRandomNumber(40, 60),
        generateRandomNumber(20, 30),
        generateRandomNumber(5, 15),
        generateRandomNumber(10, 20)
      ],
      backgroundColor: [
        '#4CAF50',
        '#FFC107',
        '#F44336',
        '#2196F3'
      ]
    }]
  }

  // Radar Chart Data
  const radarChart = {
    labels: ['Renewal Rate', 'Customer Satisfaction', 'Processing Speed', 'Success Rate', 'Response Time'],
    datasets: [{
      label: 'Performance Metrics',
      data: [
        generateRandomNumber(60, 100),
        generateRandomNumber(70, 95),
        generateRandomNumber(75, 90),
        generateRandomNumber(80, 95),
        generateRandomNumber(70, 90)
      ],
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      borderColor: '#2196F3',
      pointBackgroundColor: '#2196F3'
    }]
  }

  return {
    barChart,
    lineChart,
    pieChart,
    radarChart
  }
}