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
              const _contributors = p?.contributors?.map((cb) => {
                // parent contributor
                const parentJobs = results?.filter((rs) => rs?.period === cb?.periodId)
                const _subContributors = cb?.contributors?.map((subCb) => {
                  // child contributor
                  const jobs = results?.filter((rs) => rs?.period === subCb?.periodId)
                  const latestJob = jobs?.pop() || {}
                  return ({
                    ...subCb,
                    job: latestJob
                  })
                })
                const allStatus = uniq(_subContributors?.map((subC) => subC?.job?.status))?.filter((status) => status)
                const job = parentJobs?.length
                  ? parentJobs.pop()
                  : getSummaryStatus(allStatus)
                return ({
                  ...cb,
                  job,
                  contributors: _subContributors
                })
              })
              const jobs = orderBy(results?.filter((r) => (r?.status)), ['updatedAt'], ['desc'])
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
    default:
      return state
  }
}