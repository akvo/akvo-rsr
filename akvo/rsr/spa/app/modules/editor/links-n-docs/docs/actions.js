import types from './action-types'

export const add = () => ({ type: types.ADD })
export const remove = index => ({ type: types.REMOVE, index })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })

export const addCategory = index => ({ type: types.ADD_CATEGORY, index })
export const removeCategory = (index, categoryIndex) => ({ type: types.REMOVE_CATEGORY, index, categoryIndex })
export const editFieldCategory = (index, categoryIndex, key, value) => ({ type: types.EDIT_FIELD_CATEGORY, index, key, value, categoryIndex })
