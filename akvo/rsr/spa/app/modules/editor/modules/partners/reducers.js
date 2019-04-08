const initialState = []

const newPartner = {
  name: '',
  role: 1,
  reporter: '',
  secondaryReporter: null,
  iatiID: null,
  fundingAmount: 0
}

export default (state = initialState, action) => {
  switch(action.type){
    case 'PE_ADD_PARTNER':
      return [...state, Object.assign({}, newPartner)]
    case 'PE_REMOVE_PARTNER':
      return [...state.slice(0, action.index), ...state.slice(action.index)]
    default: return state
  }
}
