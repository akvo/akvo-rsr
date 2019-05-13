import types from './action-types'

export const add = vocabulary => ({ type: types.ADD, additionalKey: 'vocabulary', additionalValue: vocabulary })
export const remove = index => ({ type: types.REMOVE, index })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
