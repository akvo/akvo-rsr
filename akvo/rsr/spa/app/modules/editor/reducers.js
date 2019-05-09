
import infoActionTypes from './info/action-types'
import contactsActionTypes from './contacts/action-types'
import partnersActionTypes from './partners/action-types'
import descriptionsActionTypes from './descriptions/action-types'
import budgetItemActionTypes from './finance/budget-items/action-types'
import disbursementsActionTypes from './finance/disbursements/action-types'
import { sections } from './editor'

const validationKeys = ['info', 'contacts', 'partners', 'finance/budget-items', 'finance/disbursements']

const validationSetGetters = validationKeys.reduce((acc, key) => ({
  ...acc,
  [key]: require(`./${key}/validations`).getValidationSets // eslint-disable-line
}), {})


const initialState = {
  isCompleted: {},
  isTouched: {}
}
sections.forEach((section) => {
  initialState.isCompleted[section.key] = false
  initialState.isTouched[section.key] = false
})


const validate = (section, action, customDispatch) => {
  const state = action.getState()
  const validationSetGetter = validationSetGetters[section]
  if(!validationSetGetter){
    return false
  }
  const validationSets = validationSetGetters[section](state.infoRdr.validations, { arrays: true })
  let isCompleted = true
  validationSets.forEach((validationSet) => {
    try{
      validationSet.validateSync(state[`${section}Rdr`])
    } catch(error){
      console.log(section, 'validation error', error)
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
    const isCompleted = validate('finance/budget-items', action, true) && validate('finance/disbursements', action, true)
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
          sections.filter(it => it.validation).map(section => validateSectionGroup(section.key, action))
          const { infoRdr } = action.getState()
          const { validations } = infoRdr
          const showSection11 = validations.indexOf(2) !== -1 || validations.indexOf(3) !== -1
          action.asyncDispatch({ type: 'PER_SHOW_SECTION_11', value: showSection11 })
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
        else if(action.type === 'PE_TOUCH_SECTION'){
          validateSectionGroup(action.key, action)
        }
      }
    }, 500)
  }
  let newState
  switch(action.type){
    case 'PER_CHECK_SECTION':
      newState = {...state}
      if(action.value && state.isTouched[action.key]){
        newState.isCompleted[action.key] = true
      }
      else {
        newState.isCompleted[action.key] = false
      }
      return newState
    case 'PE_TOUCH_SECTION':
      newState = {...state}
      state.isTouched[action.key] = true
      return newState
    case 'PER_SHOW_SECTION_11':
      return {...state, showSection11: action.value }
    default: return state
  }
}
