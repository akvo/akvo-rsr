import types from './action-types'

export const editDescription = (key, value) => ({ type: types.EDIT_DESCRIPTION, key, value })
