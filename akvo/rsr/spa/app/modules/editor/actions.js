import actionTypes from './action-types'

export const touchSection = key => ({ type: actionTypes.TOUCH_SECTION, key })
export const saveFields = (fields, sectionIndex) => ({ type: actionTypes.SAVE_FIELDS, fields, sectionIndex })
export const addSetItem = (sectionIndex, setName) => ({ type: actionTypes.ADD_SET_ITEM, sectionIndex, setName})
export const editSetItem = (sectinIndex, setName, itemIndex, fields) => ({ type: actionTypes.EDIT_SET_ITEM, sectinIndex, setName, itemIndex, fields })
export const removeSetItem = (sectionIndex, setName, itemIndex) => ({ type: actionTypes.REMOVE_SET_ITEM, sectionIndex, setName, itemIndex})
