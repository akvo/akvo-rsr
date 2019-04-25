import types from './action-types'
import { budgetItemTypes } from '../../../utils/constants'

const initialState = []

const newPartner = {
  label: '',
  type: budgetItemTypes[0].value,
  amount: '',
}

export default (state = initialState, action) => {
  switch(action.type){
    case types.ADD:
      const additional = action.budgetType ? { type: action.budgetType } : {}
      return [...state, Object.assign({}, newPartner, additional)]
    case types.REMOVE:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      const updated = Object.assign({}, state[action.index], field)
      return [...state.slice(0, action.index), updated, ...state.slice(action.index + 1)]
    default: return state
  }
}
