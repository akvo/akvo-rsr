import types from './action-types'

export const addLocation = () => ({ type: types.ADD_LOCATION })
export const editLocation = (location, index) => ({ type: types.EDIT_LOCATION, index, location })
export const removeLocation = index => ({ type: types.REMOVE_LOCATION, index })

export const addCountry = () => ({ type: types.ADD_COUNTRY })
export const editCountry = (country, index) => ({ type: types.EDIT_COUNTRY, index, country })
export const removeCountry = index => ({ type: types.REMOVE_COUNTRY, index })
