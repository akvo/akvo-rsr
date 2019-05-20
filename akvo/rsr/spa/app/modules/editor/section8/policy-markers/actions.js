import types from './action-types'

export const add = policyMarker => ({ type: types.ADD, additionalKey: 'policyMarker', additionalValue: policyMarker })
export const remove = index => ({ type: types.REMOVE, index })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
