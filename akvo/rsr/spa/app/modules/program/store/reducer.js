import { groupBy, orderBy } from 'lodash'
import actionTypes from './action-types'
import { createContribWithJob } from '../services'
import { getAllContributors, getShrinkContributors, setValueAsFloat } from '../../../utils/misc'

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
          const periodID = p?.id || p?.periodId
          if (periodID === rootPeriod) {
            const jobs = orderBy(results?.filter((r) => (r?.status)), ['id'], ['desc'])
            const allContributors = getAllContributors(p?.contributors).map((cb) => ({
              ...cb,
              job: jobs?.find((j) => j?.period === cb?.id || cb?.periodId)
            }))
            const _contributors = createContribWithJob(allContributors)
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
        periods: i?.periods?.map((p) => {
          const allContributors = getAllContributors(p?.contributors).map((cb) => {
            if (jobID === cb?.job?.id) {
              return ({
                ...cb,
                job: theJob
              })
            }
            return cb
          })
          const _contributors = createContribWithJob(allContributors)
          return ({
            ...p,
            jobs: p?.jobs ? [theJob, ...p.jobs] : undefined,
            contributors: _contributors
          })
        })
      }))
    }))
  case actionTypes.UPDATE_CONTRIB_PERIOD:
    const { period, contributors } = action.payload
    return state?.map((s) => ({
      ...s,
      indicators: s?.indicators?.map((i) => ({
        ...i,
        periods: i?.periods?.map((p) => {
          if (p?.id === period?.id) {
            const allContributors = getAllContributors(p?.contributors)
              ?.map(cb => {
                const fc = contributors?.find((it) => it?.id === cb?.id)
                if (fc) {
                  const actualValue = setValueAsFloat(fc?.actualValue)
                  return ({
                    ...cb,
                    ...fc,
                    actualValue
                  })
                }
                return cb
              })
            const _contributors = getShrinkContributors(allContributors)
            const _actualValue = setValueAsFloat(period?.actualValue)
            return ({
              ...p,
              ...period,
              contributors: _contributors,
              actualValue: _actualValue,
              fetched: true
            })
          }
          return p
        })
      }))
    }))
  case actionTypes.UPDATE_CONTRIB_UPDATES:
    const { updates, ids: contribIds } = action.payload
    return state?.map((s) => ({
      ...s,
      indicators: s?.indicators?.map((i) => ({
        ...i,
        periods: i?.periods?.map((p) => {
          const allContributors = getAllContributors(p?.contributors)
            ?.map(cb => {
              if (contribIds?.includes(cb?.id)) {
                const fu = updates?.filter((it) => it?.period === cb?.id)
                return ({
                  ...cb,
                  updates: fu
                })
              }
              return cb
            })
          const _contributors = getShrinkContributors(allContributors)
          return ({
            ...p,
            contributors: _contributors,
          })
        })
      }))
    }))
  default:
    return state
  }
}
