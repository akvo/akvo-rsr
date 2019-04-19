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
  legacies: {
    name: '',
    value: '',
    iatiEquivalent: ''
  }
}
const initialState = {
  fields: {
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
    extractionDate: null,
    phaseoutYear: null,
    priority: null,
  },
  flags: [{...newItem.flags}],
  forecasts: [{...newItem.forecasts}],
  legacies: [{...newItem.legacyDatas}]
}

const itemReducer = (state, action, actionTypes, $newItem) => {
  switch(action.type){
    case actionTypes.ADD:
      return [...state, {...$newItem}]
    case actionTypes.REMOVE:
      return [...state.slice(0, action.index), ...state.slice(action.index + 1)]
    case actionTypes.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      const updated = Object.assign({}, state[action.index], field)
      return [...state.slice(0, action.index), updated, ...state.slice(action.index + 1)]
    default: return state
  }
}

export const reportingRdr = (state = initialState.fields, action) => {
  switch(action.type){
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      return {...state, ...field}
    default: return state
  }
}

export const crsAddOtherFlagRdr = (state = initialState.flags, action) => itemReducer(state, action, types.FLAGS, newItem.flags)
export const forecastsRdr = (state = initialState.forecasts, action) => itemReducer(state, action, types.FORECASTS, newItem.forecasts)
export const legaciesRdr = (state = initialState.legacies, action) => itemReducer(state, action, types.LEGACIES, newItem.legacies)
