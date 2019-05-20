import types from './action-types'

const initialState = {
  donateUrl: '',
  capitalSpendPercentage: '',
  countryBudgetVocabulary: ''
}

export default (state = initialState, action) => {
  switch(action.type){
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      return {...state, ...field}
    default: return state
  }
}
