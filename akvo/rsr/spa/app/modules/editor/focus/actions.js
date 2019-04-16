import types from './action-types'

export const addSector = vocabulary => ({ type: types.ADD, vocabulary })
export const removeSector = index => ({ type: types.REMOVE, index })
export const editSectorField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
