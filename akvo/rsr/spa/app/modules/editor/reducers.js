const initialState = {
  isCompleted: {
    info: false,
    contacts: false,
    partners: false,
    descriptions: false,
    finance: false,
    'results-indicators': false,
    locations: false,
    focus: false,
    links: false,
    'comments-n-keywords': false,
    reporting: false
  },
  isSaving: false
}

let autosaveTmId

export default (state = initialState, action) => {
  if(action.type.indexOf('PE_') !== -1){
    clearInterval(autosaveTmId)
    autosaveTmId = setTimeout(() => {
      if(action.asyncDispatch) {
        if(action.type.indexOf('PE_DESCRIPTION') !== -1){
          const { descsRdr } = action.getState()
          const isCompleted = descsRdr.filter(it => it.required && it.value.length < 5).length === 0
          action.asyncDispatch({ type: 'CHECK_SECTION_OF_PE', key: 'descriptions', value: isCompleted })
        }
      }
    }, 3000)
  }
  switch(action.type){
    case 'CHECK_SECTION_OF_PE':
      const newState = {...state}
      state.isCompleted[action.key] = action.value
      return newState
    default: return state
  }
}
