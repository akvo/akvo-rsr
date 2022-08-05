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

export const deleteItemState = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.DELETE_ITEM, payload })
}

export const toggleLockPeriod = (payload, locked) => (dispatch) => {
  dispatch({ type: actionTypes.TOGGLE_LOCK_PERIOD, payload, locked })
}

export const bulkUpadeStatus = (payload, status) => (dispatch) => {
  dispatch({ type: actionTypes.BULK_UPDATE_STATUS, payload, status })
}
