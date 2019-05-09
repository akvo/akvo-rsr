import actionTypes from './action-types'
import {yupModel} from '../../../../utils/misc'
import { IATI, administrative } from './validations'

const initialState = []

const model = yupModel(IATI)
model.administratives = [yupModel(administrative)]

const updateArrayItem = (item, array, index) => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)]
}

export default (state = initialState, action) => {
  switch(action.type){
    case actionTypes.ADD:
      return [...state, Object.assign({}, model)]
    case actionTypes.REMOVE:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
    case actionTypes.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      const updated = Object.assign({}, state[action.index], field)
      return [...state.slice(0, action.index), updated, ...state.slice(action.index + 1)]

    case actionTypes.ADD_ADMINISTRATIVE:
      return updateArrayItem(
        {...state[action.index], administratives: [...state[action.index].administratives, Object.assign({}, yupModel(administrative))]},
        state,
        action.index
      )
    case actionTypes.REMOVE_ADMINISTRATIVE:
      return updateArrayItem(
        {...state[action.index], administratives: [...state[action.index].administratives.slice(0, action.administrativeIndex), ...state[action.index].administratives.slice(action.administrativeIndex + 1)]},
        state,
        action.index
      )
    case actionTypes.EDIT_FIELD_ADMINISTRATIVE:
      const sfield = {}
      sfield[action.key] = action.value
      const supdated = Object.assign({}, state[action.index].administratives[action.administrativeIndex], sfield)
      return updateArrayItem(
        {
          ...state[action.index],
          administratives: [
            ...state[action.index].administratives.slice(0, action.administrativeIndex),
            supdated,
            ...state[action.index].administratives.slice(action.administrativeIndex + 1)
          ]
        },
        state,
        action.index
      )
    default: return state
  }
}
