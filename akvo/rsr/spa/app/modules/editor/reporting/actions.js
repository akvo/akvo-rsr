import types from './action-types'

export const editField = (key, value) => ({ type: types.EDIT_FIELD, key, value })

export const addArrayItem = array => ({ type: types.ADD_ARRAY_ITEM, array })
export const removeArrayItem = (array, index) => ({ type: types.REMOVE_ARRAY_ITEM, array, index })
export const editArrayField = (array, index, key, value) => ({ type: types.EDIT_ARRAY_ITEM_FIELD, array, index, key, value })

// export const addForecast = () => ({ type: types.ADD_FORECAST })
// export const removeForecast = index => ({ type: types.REMOVE_FORECAST, index })
// export const editForecastField = (index, key, value) => ({ type: types.EDIT_FORECAST_FIELD, index, key, value })
