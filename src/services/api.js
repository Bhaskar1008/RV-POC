import { delay, handleApiError } from './utils/apiUtils'
import { policyData } from './mockData/policyData'
import { POLICY_STATUSES } from '../constants/policyStatuses'
import { generatePolicyNumbers, getLOBBaseCounts, calculatePolicyDistribution } from './utils/policyUtils'

export const api = {
  async getPolicySummary() {
    try {
      await delay(500)
      return policyData
    } catch (error) {
      handleApiError(error)
    }
  },

  async updatePolicyEndDate(dateFilter) {
    try {
      await delay(300)
      const baseCount = getLOBBaseCounts(policyData.lobList[0].NUM_IL_PRODUCT_CODE)
      const totalCount = generatePolicyNumbers(baseCount, dateFilter)
      const distribution = calculatePolicyDistribution(totalCount)

      const updatedCards = Object.entries(POLICY_STATUSES).map(([key, status]) => ({
        id: status.id,
        count: distribution[key].toString(),
        status: status.label,
        color: status.color
      }))

      return updatedCards
    } catch (error) {
      handleApiError(error)
    }
  },

  async filterByLOB(lobCode) {
    try {
      await delay(300)
      const baseCount = getLOBBaseCounts(lobCode)
      const distribution = calculatePolicyDistribution(baseCount)

      const updatedCards = Object.entries(POLICY_STATUSES).map(([key, status]) => ({
        id: status.id,
        count: distribution[key].toString(),
        status: status.label,
        color: status.color
      }))

      return updatedCards
    } catch (error) {
      handleApiError(error)
    }
  }
}