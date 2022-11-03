import api from '../../utils/api'
import { jobStatus } from './config'

/**
 * Choices are:
 * attempts, id, period, period_id, pid, root_period, root_period_id, status, updated_at
 * */

export const getJobStatusByPeriod = async (period) => {
  const response = await api.get(`/jobs/indicator_period_aggregation/?format=json&filter={'period': ${period}}`)
  const { results } = response.data
  return results
}

export const getJobStatusByRootPeriod = async (rootPeriod) => {
  const response = await api.get(`/jobs/indicator_period_aggregation/?format=json&filter={'root_period':${rootPeriod}}`)
  const { results } = response?.data
  return results
}

export const getSummaryStatus = allStatus => {
  const isJobFailed = allStatus?.filter((a) => [jobStatus.failed, jobStatus.maxxed]?.includes(a))
  const highlighted = allStatus?.length > 1 ? allStatus?.filter((a) => a !== jobStatus.finished) : allStatus
  const _status = isJobFailed.length ? isJobFailed.pop() : highlighted.pop() || null
  return ({ status: _status })
}
