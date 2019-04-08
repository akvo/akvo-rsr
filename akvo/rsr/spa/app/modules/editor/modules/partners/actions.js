import types from './action-types'

export const addPartner = () => ({ type: types.ADD })
export const removePartner = index => ({ type: types.REMOVE, index })
export const editPartnerField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
