import actionTypes from './action-types'
import {yupModel} from '../../../../utils/validation-utils'
import { IATI } from './validations'

const initialState = []

const model = yupModel(IATI)
model.categories = [{}]

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

    case actionTypes.ADD_CATEGORY:
      return updateArrayItem(
        {...state[action.index], categories: [...state[action.index].categories, Object.assign({}, null)]},
        state,
        action.index
      )
    case actionTypes.REMOVE_CATEGORY:
      return updateArrayItem(
        {...state[action.index], categories: [...state[action.index].categories.slice(0, action.categoryIndex), ...state[action.index].categories.slice(action.categoryIndex + 1)]},
        state,
        action.index
      )
    case actionTypes.EDIT_FIELD_CATEGORY:
      const sfield = {}
      sfield[action.key] = action.value
      const supdated = Object.assign({}, state[action.index].categories[action.categoryIndex], sfield)
      return updateArrayItem(
        {
          ...state[action.index],
          categories: [
            ...state[action.index].categories.slice(0, action.categoryIndex),
            supdated,
            ...state[action.index].categories.slice(action.categoryIndex + 1)
          ]
        },
        state,
        action.index
      )
    default: return state
  }
}
