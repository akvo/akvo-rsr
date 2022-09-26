import actionTypes from './action-types'

export const appendResults = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.APPEND_RESULTS, payload })
}

export const setContributors = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_CONTRIBUTORS, payload })
}

export const applyFilter = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.APPLY_FILTER, payload })
}
