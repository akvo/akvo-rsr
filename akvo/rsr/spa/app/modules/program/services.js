import api from '../../utils/api'

export const getAggregationJobsApi = async (id, page = 1) => {
  /**
   * Choices are: attempts, id, period, period_id, pid, program, program_id, status, updated_at
   * ?format=json&filter={'program_id':9062}
   */
  const response = await api.get(`/jobs/indicator_period_aggregation/?page=${page}&program_id=${id}&format=json`)
  const { results, next } = response.data
  if (next) {
    return results?.concat(await getAggregationJobsApi(id, page + 1))
  }
  return results
}

export const getJobStatusByPeriod = async (period) => {
  const response = await api.get(`/jobs/indicator_period_aggregation/?format=json&filter={'period': ${period}}`)
  const { results } = response.data
  return results
}
