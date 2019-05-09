import types from './action-types'

export const editField = (key, value) => ({ type: types.EDIT_FIELD, key, value })
