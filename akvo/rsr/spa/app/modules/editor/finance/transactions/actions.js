import types from './action-types'

export const add = () => ({ type: types.ADD })
export const remove = index => ({ type: types.REMOVE, index })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
