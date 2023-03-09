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

export const setContributors = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_CONTRIBUTORS, payload })
}

export const updateReportingPeriod = (period, contributors) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_CONTRIB_PERIOD, payload: { period, contributors } })
}

export const setContributorUpdates = (updates, ids) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_CONTRIB_UPDATES, payload: { updates, ids } })
}
