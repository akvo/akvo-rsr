import actionTypes from './action-types'

export const setProgrammeResults = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.APPEND_RESULTS, payload })
}

export const updateProgrammePerResult = (resultIndex, data) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_RESULT, payload: { resultIndex, data } })
}

export const setRootPeriodJobStatus = (rootPeriod, results) => (dispatch) => {
  dispatch({ type: actionTypes.SET_JOB_STATUS, payload: { rootPeriod, results } })
}

export const updateJobStatus = (jobID, data) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_JOB_STATUS, payload: { jobID, data } })
}

export const setContributors = (id, data) => (dispatch) => {
  dispatch({ type: actionTypes.SET_CONTRIBUTORS, payload: { id, data } })
}

export const updateReportingPeriod = (id, data) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_PERIOD, payload: { id, data } })
}
