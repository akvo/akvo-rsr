import types from './action-types'

export const add = () => ({ type: types.ADD })
export const remove = index => ({ type: types.REMOVE, index })
export const editField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })

export const addSector = index => ({ type: types.ADD_SECTOR, index })
export const removeSector = (index, sectorIndex) => ({ type: types.REMOVE_SECTOR, sectorIndex, index })
export const editFieldSector = (index, sectorIndex, key, value) => ({ type: types.EDIT_FIELD_SECTOR, index, sectorIndex, key, value })
