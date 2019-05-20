import types from './action-types'

export const editField = (key, value) => ({ type: types.EDIT_FIELD, key, value })
export const checkValidation = (id, checked) => ({ type: types.CHECK_VALIDATION, id, checked })
