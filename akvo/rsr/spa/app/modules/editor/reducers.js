import { getValidationSets as infoGetValidationSets } from './info/validations'
import { getValidationSets as contactsGetValidationSets } from './contacts/validations'
import { getValidationSets as partnersGetValidationSets } from './partners/validations'
import { getValidationSets as budgetItemsGetValidationSets } from './finance/budget-items/validations'
import { getValidationSets as disbursementsGetValidationSets } from './finance/disbursements/validations'
import infoActionTypes from './info/action-types'
import contactsActionTypes from './contacts/action-types'
import partnersActionTypes from './partners/action-types'
import descriptionsActionTypes from './descriptions/action-types'
import budgetItemActionTypes from './finance/budget-items/action-types'
import disbursementsActionTypes from './finance/disbursements/action-types'
import { sections } from './editor'

const validationSetGetters = {
  info: infoGetValidationSets,
  contacts: contactsGetValidationSets,
  partners: partnersGetValidationSets,
  budgetItems: budgetItemsGetValidationSets,
  disbursements: disbursementsGetValidationSets
}

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

const validate = (section, action, customDispatch) => {
  const state = action.getState()
  const validationSets = validationSetGetters[section](state.infoRdr.validations, { arrays: true })
  let isCompleted = true
  validationSets.forEach((validationSet) => {
    try{
      validationSet.validateSync(state[`${section}Rdr`])
    } catch(error){
      console.log('validation error', error)
      isCompleted = false
    }
  })
  if(!customDispatch){
    action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: section, value: isCompleted })
  }
  return isCompleted
}

const validateSectionGroup = (section, action) => {
  if(section === 'finance'){
    const isCompleted = validate('budgetItems', action, true) && validate('disbursements', action, true)
    action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'finance', value: isCompleted })
  } else {
    validate(section, action)
  }
}

let autosaveTmId

const objectToArray = object => Object.keys(object).map(it => object[it])

export default (state = initialState, action) => {
  if(action.type.indexOf('PE_') !== -1){
    clearInterval(autosaveTmId)
    autosaveTmId = setTimeout(() => {
      if(action.asyncDispatch) {
        // SECTION 0 - edited validation setting - run all validations
        if(action.type === infoActionTypes.CHECK_VALIDATION){
          sections.map(section => validateSectionGroup(section, action))
        }
        // SECTION 1
        else if(action.type === infoActionTypes.EDIT_FIELD){
          validate('info', action)
        }
        // SECTION 2
        else if(objectToArray(contactsActionTypes).indexOf(action.type) !== -1){
          validate('contacts', action)
        }
        // SECTION 3
        else if(objectToArray(partnersActionTypes).indexOf(action.type) !== -1){
          validate('partners', action)
        }
        // SECTION 4
        else if(action.type === descriptionsActionTypes.EDIT_DESCRIPTION){
          const { descsRdr } = action.getState()
          const isCompleted = descsRdr.filter(it => it.required && it.value.length < 5).length === 0
          action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'descriptions', value: isCompleted })
        }
        // SECTION 6
        else if(objectToArray(budgetItemActionTypes).indexOf(action.type) !== -1 || objectToArray(disbursementsActionTypes).indexOf(action.type) !== -1){
          validateSectionGroup('finance', action)
        }
        // OTHER
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
