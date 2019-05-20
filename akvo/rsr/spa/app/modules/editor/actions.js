import actionTypes from './action-types'

export const touchSection = sectionIndex => ({ type: actionTypes.TOUCH_SECTION, sectionIndex })
export const checkValidation = (id, checked) => ({ type: actionTypes.CHECK_VALIDATION, id, checked })
export const saveFields = (fields, sectionIndex) => ({ type: actionTypes.SAVE_FIELDS, fields, sectionIndex })
export const addSetItem = (sectionIndex, setName, item) => (dispatch) => {
  dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex, setName, item})
  setTimeout(() => dispatch({ type: actionTypes.BACKEND_SYNC }), 1000)
}
export const editSetItem = (sectionIndex, setName, itemIndex, fields) => (dispatch) => {
  dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex, setName, itemIndex, fields })
  setTimeout(() => dispatch({ type: actionTypes.BACKEND_SYNC }), 1000)
}
export const removeSetItem = (sectionIndex, setName, itemIndex) => (dispatch) => {
  dispatch({ type: actionTypes.REMOVE_SET_ITEM, sectionIndex, setName, itemIndex})
  setTimeout(() => dispatch({ type: actionTypes.BACKEND_SYNC }), 1000)
}
