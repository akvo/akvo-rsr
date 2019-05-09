import types from './action-types'

export const add = () => ({ type: types.ADD })
export const edit = (item, index) => ({ type: types.EDIT, index, item })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
export const remove = index => ({ type: types.REMOVE, index })
