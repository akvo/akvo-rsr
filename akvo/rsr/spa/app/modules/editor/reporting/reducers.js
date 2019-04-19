import types from './action-types'

const newItem = {
  flags: {
    code: '',
    significance: ''
  },
  forecasts: {
    currency: 'EUR',
    value: '',
    year: '',
    date: null
  },
  legacyDatas: {
    name: '',
    value: '',
    iatiEquivalent: ''
  }
}
const initialState = {
  repaymentType: '',
  repaymentPlan: '',
  commitmentDate: null,
  firstRepaymentDate: null,
  lastRepaymentDate: null,
  rate1: '',
  rate2: '',
  year: '',
  currency: '',
  valueDate: null,
  interestReceived: '',
  principalOutstanding: '',
  principalArrears: '',
  interestArreas: '',
  channelCode: '',
  flags: [{...newItem.flags}],
  extractionDate: null,
  phaseoutYear: null,
  priority: null,
  forecasts: [{...newItem.forecasts}],
  legacyDatas: [{...newItem.legacyDatas}]
}

export default (state = initialState, action) => {
  let newState
  switch(action.type){
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      return {...state, ...field}
    case types.ADD_ARRAY_ITEM:
      newState = {...state}
      newState[action.array] = [...state[action.array], {...newItem[action.array]}]
      return newState
    case types.REMOVE_ARRAY_ITEM:
      newState = {...state}
      newState[action.array] = state[action.array].filter((it, index) => index !== action.index)
      return newState
    case types.EDIT_ARRAY_ITEM_FIELD:
      const updated = {...state[action.array][action.index]}
      updated[action.key] = action.value
      newState = {...state}
      newState[action.array] = [...state[action.array].slice(0, action.index), updated, ...state[action.array].slice(action.index + 1)]
      return newState
    default: return state
  }
}
