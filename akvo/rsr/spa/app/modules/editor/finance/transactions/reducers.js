import actionTypes from './action-types'
import genericReducer from '../../../../utils/generic-reducer'
import {yupModel} from '../../../../utils/misc'
import { IATI, sector } from './validations'

const initialState = []

const model = yupModel(IATI)

const updateArrayItem = (item, array, index) => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)]
}

export default (state = initialState, action) => {
  let item
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

    case actionTypes.ADD_SECTOR:
      return updateArrayItem(
        {...state[action.index], sectors: [...state[action.index].sectors, Object.assign({}, yupModel(sector))]},
        state,
        action.index
      )
    case actionTypes.REMOVE_SECTOR:
      return updateArrayItem(
        {...state[action.index], sectors: [...state[action.index].sectors.slice(0, action.sectorIndex), ...state[action.index].sectors.slice(action.sectorIndex + 1)]},
        state,
        action.index
      )
    case actionTypes.EDIT_FIELD_SECTOR:
      const sfield = {}
      sfield[action.key] = action.value
      const supdated = Object.assign({}, state[action.index].sectors[action.sectorIndex], sfield)
      return updateArrayItem(
        {
          ...state[action.index],
          sectors: [
            ...state[action.index].sectors.slice(0, action.sectorIndex),
            supdated,
            ...state[action.index].sectors.slice(action.sectorIndex + 1)
          ]
        },
        state,
        action.index
      )
    default: return state
  }
}
