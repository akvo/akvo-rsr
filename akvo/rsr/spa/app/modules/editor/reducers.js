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
  isSaving: false,
  showSection11: false
}

let autosaveTmId

export default (state = initialState, action) => {
  if(action.type.indexOf('PE_') !== -1){
    clearInterval(autosaveTmId)
    autosaveTmId = setTimeout(() => {
      if(action.asyncDispatch) {
        if(action.type === 'PE_INFO_EDIT_FIELD'){
          const { infoRdr } = action.getState()
          const isCompleted = infoRdr.title.length > 5 && infoRdr.plannedDuration.length === 2 && infoRdr.actualDuration.length === 2
          action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'info', value: isCompleted })
        }
        if(action.type.indexOf('PE_DESCRIPTION') !== -1){
          const { descsRdr } = action.getState()
          const isCompleted = descsRdr.filter(it => it.required && it.value.length < 5).length === 0
          action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'descriptions', value: isCompleted })
        }
        else if(action.type === 'PE_INFO_CHECK_VALIDATION'){
          const { infoRdr } = action.getState()
          const { validations } = infoRdr
          const showSection11 = validations.indexOf(2) !== -1 || validations.indexOf(3) !== -1
          action.asyncDispatch({ type: 'PER_SHOW_SECTION_11', value: showSection11 })
        }
      }
    }, 500)
  }
  switch(action.type){
    case 'PER_CHECK_SECTION':
      const newState = {...state}
      state.isCompleted[action.key] = action.value
      return newState
    case 'PER_SHOW_SECTION_11':
      return {...state, showSection11: action.value }
    default: return state
  }
}
