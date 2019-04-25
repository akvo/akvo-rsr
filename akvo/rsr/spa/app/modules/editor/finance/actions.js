import types from './action-types'

export const addBudget = budgetType => ({ type: types.ADD, budgetType })
export const removeBudget = index => ({ type: types.REMOVE, index })
export const editBudgetField = (index, key, value) => ({ type: types.EDIT_FIELD, index, key, value })
