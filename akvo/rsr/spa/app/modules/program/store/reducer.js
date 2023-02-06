import uniq from 'lodash/uniq'
import orderBy from 'lodash/orderBy'

import actionTypes from './action-types'
import { getSummaryStatus } from '../services'

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.APPEND_RESULTS:
      return action.payload
    case actionTypes.UPDATE_RESULT:
      const { resultIndex, data } = action.payload
      return [
        ...state.slice(0, resultIndex),
        { ...state[resultIndex], ...data },
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
    case actionTypes.UPDATE_PERIOD_N_CONTRIBUTORS:
      const { period, contributors } = action.payload
      return state?.map((s) => ({
        ...s,
        indicators: s?.indicators?.map((i) => ({
          ...i,
          periods: i?.periods?.map((p) => (p?.id === period?.id)
            ? ({ ...p, ...period, contributors, fetched: true })
            : p
          )
        }))
      }))
    default:
      return state
  }
}
