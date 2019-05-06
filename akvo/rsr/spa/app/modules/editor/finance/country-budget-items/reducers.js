import types from './action-types'
import {yupModel} from '../../../../utils/misc'
import { IATI } from './validations'

const initialState = []

const newBudgetItem = yupModel(IATI)

export default (state = initialState, action) => {
  switch(action.type){
    case types.ADD:
      return [...state, Object.assign({}, newBudgetItem)]
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
