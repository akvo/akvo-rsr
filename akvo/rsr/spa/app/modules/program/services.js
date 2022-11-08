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

export const getAllJobByRootPeriod = async (rootPeriod, page = 1) => {
  const response = await api.get(`/jobs/indicator_period_aggregation/?format=json&filter={'root_period':${rootPeriod}}&page=${page}`)
  const { results, next } = response.data
  if (next) {
    return results?.concat(await getAllJobByRootPeriod(rootPeriod, page + 1))
  }
  return results
}

export const getAllResponse = async (responses, callback) => {
  let data = await Promise.all(responses)
  data = data?.flatMap((d) => d)
  if (callback) callback(data)
}
