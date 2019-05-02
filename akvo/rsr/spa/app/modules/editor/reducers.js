import { getValidationSets as infoGetValidationSets } from './info/validations'
import { getValidationSets as contactsGetValidationSets } from './contacts/validations'
import infoActionTypes from './info/action-types'
import contactActionTypes from './contacts/action-types'

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
        // SECTION 1
        if(action.type === infoActionTypes.EDIT_FIELD || action.type === infoActionTypes.CHECK_VALIDATION){
          const { infoRdr } = action.getState()
          const validationSets = infoGetValidationSets(infoRdr.validations)
          let isCompleted = true
          validationSets.forEach((validationSet) => {
            try{
              validationSet.validateSync(infoRdr)
            } catch(error){
              console.log('validation error', error)
              isCompleted = false
            }
          })
          action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'info', value: isCompleted })
        }
        // SECTION 2
        else if(action.type === contactActionTypes.EDIT_FIELD || action.type === contactActionTypes.REMOVE){
          const { infoRdr, contactsRdr } = action.getState()
          const validationSets = contactsGetValidationSets(infoRdr.validations, { arrays: true })
          let isCompleted = true
          validationSets.forEach((validationSet) => {
            try{
              validationSet.validateSync(contactsRdr)
            } catch(error){
              console.log('validation error', error)
              isCompleted = false
            }
          })
          action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'contacts', value: isCompleted })
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
