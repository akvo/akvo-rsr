import actionTypes from './action-types'

export const setResultState = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_RESULTS, payload })
}

export const updateItemState = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_ITEM, payload })
}

export const updatePeriod = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_PERIOD, payload })
}
