import actionTypes from './action-types'

export const appendResults = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.APPEND_RESULTS, payload })
}

export const setContributors = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_CONTRIBUTORS, payload })
}

export const updateReportingPeriod = (period, contributors) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_PERIOD_N_CONTRIBUTORS, payload: { period, contributors } })
}
