import uniq from 'lodash/uniq'
import orderBy from 'lodash/orderBy'

import actionTypes from './action-types'
import { getSummaryStatus } from '../services'
import { handleOnSetPartners } from '../utils/query'

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.APPEND_RESULTS:
      return action.payload
    case actionTypes.UPDATE_RESULT:
      const { resultIndex, data } = action.payload
      const rs = state[resultIndex]
      return [
        ...state.slice(0, resultIndex),
        {
          ...rs,
          ...{
            ...data,
            indicators: data?.indicators?.map((i) => handleOnSetPartners(rs, i))
          }
        },
        ...state.slice(resultIndex + 1)
      ]
    case actionTypes.SET_JOB_STATUS:
      const { rootPeriod, results } = action.payload
      return state?.map((s) => ({
        ...s,
        indicators: s?.indicators?.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => {
            if (p?.periodId === rootPeriod) {
              const jobs = orderBy(results?.filter((r) => (r?.status)), ['id'], ['desc'])
              const _contributors = p?.contributors?.map((cb) => {
                // parent contributor
                const parentJobs = jobs?.filter((j) => j?.period === cb?.periodId)
                const _subContributors = cb?.contributors?.map((subCb) => {
                  // child contributor
                  const _jobs = jobs?.filter((j) => j?.period === subCb?.periodId)
                  const latestJob = _jobs?.shift() || {}
                  return ({
                    ...subCb,
                    job: latestJob
                  })
                })
                const allStatus = uniq(_subContributors?.map((subC) => subC?.job?.status))?.filter((status) => status)
                const job = parentJobs?.length
                  ? parentJobs.shift()
                  : getSummaryStatus(allStatus)
                return ({
                  ...cb,
                  job,
                  contributors: _subContributors
                })
              })
              return ({
                ...p,
                jobs,
                contributors: _contributors
              })
            }
            return p
          })
        }))
      }))
    case actionTypes.UPDATE_JOB_STATUS:
      const { jobID, data: theJob } = action.payload
      return state?.map((s) => ({
        ...s,
        indicators: s?.indicators?.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => ({
            ...p,
            jobs: p?.jobs ? [theJob, ...p.jobs] : undefined,
            contributors: p?.contributors?.map((cb) => {
              const _subContributors = cb?.contributors?.map((subC) => {
                if (subC?.job?.id === jobID) {
                  return ({
                    ...subC,
                    job: theJob
                  })
                }
                return subC
              })
              const allStatus = uniq(_subContributors?.map((subC) => subC?.job?.status))?.filter((status) => status)
              const job = (cb?.job?.id === jobID) ? theJob : getSummaryStatus(allStatus)
              return ({
                ...cb,
                job,
                contributors: _subContributors
              })
            })
          }))
        }))
      }))
    case actionTypes.UPDATE_CONTRIBUTORS:
      return state?.map((s) => {
        const fs = action?.payload?.find((p) => p?.id === s?.id) || {}
        return s.fetched === false
        ? ({
            ...s,
            ...{
              ...fs,
              indicators: fs?.indicators?.map((it) => ({
                ...it,
                periodCount: it?.periods?.length,
              }))
            }
          })
        : ({
          ...s,
          indicators: s?.indicators?.map((i) => handleOnSetPartners(fs, i))
        })
      })
    default:
      return state
  }
}
