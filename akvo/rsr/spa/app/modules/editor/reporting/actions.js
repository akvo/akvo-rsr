import types from './action-types'

export const editField = (key, value) => ({ type: types.EDIT_FIELD, key, value })

export const addFlag = () => ({ type: types.FLAGS.ADD })
export const removeFlag = index => ({ type: types.FLAGS.REMOVE, index })
export const editFlagField = (index, key, value) => ({ type: types.FLAGS.EDIT_FIELD, index, key, value })

export const addForecast = () => ({ type: types.FORECASTS.ADD })
export const removeForecast = index => ({ type: types.FORECASTS.REMOVE, index })
export const editForecastField = (index, key, value) => ({ type: types.FORECASTS.EDIT_FIELD, index, key, value })

export const addLegacy = () => ({ type: types.LEGACIES.ADD })
export const removeLegacy = index => ({ type: types.LEGACIES.REMOVE, index })
export const editLegacyField = (index, key, value) => ({ type: types.LEGACIES.EDIT_FIELD, index, key, value })
