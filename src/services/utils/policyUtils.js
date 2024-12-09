export const generatePolicyNumbers = (baseNumber, dateFilter) => {
  const multipliers = {
    'CM': 0.7,  // Current Month - 70% of base
    'N2M': 1,   // Next 2 Months - 100% (base)
    'N3M': 1.3, // Next 3 Months - 130% of base
    'DR': 1     // Custom Date Range - 100% (base)
  }

  const randomFactor = 0.8 + Math.random() * 0.4 // Random factor between 0.8 and 1.2
  return Math.floor(baseNumber * (multipliers[dateFilter] || 1) * randomFactor)
}

export const getLOBBaseCounts = (lobCode) => {
  const lobMultipliers = {
    'TRAVEL': 0.8,
    'BGR': 0.9,
    'MOTOR': 1.5,
    'PA': 0.7,
    'GCV': 1.2,
    'PCV': 1.0
  }

  const baseCount = 125000
  return Math.floor(baseCount * (lobMultipliers[lobCode] || 1))
}

export const calculatePolicyDistribution = (totalCount) => {
  const randomize = (percentage) => {
    const base = percentage * totalCount
    const variance = base * 0.1 // 10% variance
    return Math.floor(base + (Math.random() * variance * 2 - variance))
  }

  return {
    ALL: totalCount,
    BRE_PENDING: randomize(0.28),
    BRE_SUCCESS: randomize(0.224),
    BRE_FAILED: randomize(0.096),
    PT_MODIFICATION_QUEUE: randomize(0.12),
    RETENTION_APPROVAL_QUEUE: randomize(0.064),
    COMMUNICATION_QUEUE: randomize(0.056),
    RN_GENERATED: randomize(0.048),
    RENEWED: randomize(0.04),
    LAPSED: randomize(0.044),
    DECLINED: randomize(0.028)
  }
}