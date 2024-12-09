export const generatePolicyNumbers = (baseNumber, dateFilter) => {
  const multipliers = {
    'CM': 0.7,  // Current Month - 70% of base
    'N2M': 1,   // Next 2 Months - 100% (base)
    'N3M': 1.3, // Next 3 Months - 130% of base
    'DR': 1     // Custom Date Range - 100% (base)
  }

  return Math.floor(baseNumber * (multipliers[dateFilter] || 1))
}

export const getLOBBaseCounts = (lobCode) => {
  const lobMultipliers = {
    105871: 1.2,    // CommercialVehicleGCV - 120% of base
    105872: 1,      // PrivateVehicle - 100% (base)
    105873: 1.5     // TwoWheeler - 150% of base
  }

  const baseCount = 125000
  return Math.floor(baseCount * (lobMultipliers[lobCode] || 1))
}

export const calculatePolicyDistribution = (totalCount) => {
  return {
    ALL: totalCount,
    BRE_PENDING: Math.floor(totalCount * 0.28),
    BRE_SUCCESS: Math.floor(totalCount * 0.224),
    BRE_FAILED: Math.floor(totalCount * 0.096),
    PT_MODIFICATION_QUEUE: Math.floor(totalCount * 0.12),
    RETENTION_APPROVAL_QUEUE: Math.floor(totalCount * 0.064),
    COMMUNICATION_QUEUE: Math.floor(totalCount * 0.056),
    RN_GENERATED: Math.floor(totalCount * 0.048),
    RENEWED: Math.floor(totalCount * 0.04),
    LAPSED: Math.floor(totalCount * 0.044),
    DECLINED: Math.floor(totalCount * 0.028)
  }
}