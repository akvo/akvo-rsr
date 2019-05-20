import types from './action-types'

export const add = () => ({ type: types.ADD })
export const edit = (item, index) => ({ type: types.EDIT, index, item })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
export const remove = index => ({ type: types.REMOVE, index })

export const addAdministrative = index => ({ type: types.ADD_ADMINISTRATIVE, index })
export const removeAdministrative = (index, administrativeIndex) => ({ type: types.REMOVE_ADMINISTRATIVE, administrativeIndex, index })
export const editFieldAdministrative = (index, administrativeIndex, key, value) => ({ type: types.EDIT_FIELD_ADMINISTRATIVE, index, administrativeIndex, key, value })
