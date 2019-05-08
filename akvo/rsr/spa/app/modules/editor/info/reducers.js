import types from './action-types'
import Validations from './validations'
import { yupModel } from '../../../utils/misc'

const initialState = yupModel(Validations.IATI)

export default (state = initialState, action) => {
  switch(action.type){
    case types.CHECK_VALIDATION:
      const validations = [...state.validations]
      if(action.checked && validations.indexOf(action.id) === -1){
        validations.push(action.id)
      } else if(!action.checked && validations.indexOf(action.id) !== -1){
        validations.splice(validations.indexOf(action.id), 1)
      }
      return {...state, validations}
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      return {...state, ...field}
    default: return state
  }
}
