import types from './action-types'

export const addContact = () => ({ type: types.ADD })
export const removeContact = index => ({ type: types.REMOVE, index })
export const editContactField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
