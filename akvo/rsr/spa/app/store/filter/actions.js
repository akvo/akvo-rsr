import actionTypes from './action-types'

export const setFilterItems = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_FILTER_ITEMS, payload })
}

export const removeFilterItem = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.REMOVE_FILTER_ITEM, payload })
}

export const applyFilter = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.APPLY_FILTER, payload })
}

export const clearFilter = () => (dispatch) => {
  dispatch({ type: actionTypes.CLEAR_FILTER })
}
