
import descriptionsActionTypes from './descriptions/action-types'
import { sections } from './editor'

const modules = [
  'info',
  'contacts',
  'partners',
  'finance/budget-items',
  'finance/disbursements',
  'locations/location-items',
  'locations/recipient-countries'
]

const kebabToCamel = s => s.replace(/(-\w)/g, m => m[1].toUpperCase())

const validationSetGetters = modules.reduce((acc, key) => ({
  ...acc,
  [key]: require(`./${key}/validations`).getValidationSets // eslint-disable-line
}), {})
const actionTypes = modules.reduce((acc, key) => ({
  ...acc,
  [key]: require(`./${key}/action-types`).default // eslint-disable-line
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
      // convert path/to/reducer-name to reducerName
      const reducerName = kebabToCamel(section.split('/').reduce((acc, cur, index, arr) => { if(index === arr.length - 1){ return cur } return null }))
      console.log('validating', reducerName, validationSet.validateSync(state[`${reducerName}Rdr`]))
      validationSet.validateSync(state[`${reducerName}Rdr`])
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
  }
  else if(section === 'locations'){
    const isCompleted = validate('locations/location-items', action, true) && validate('locations/recipient-countries', action, true)
    action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'locations', value: isCompleted })
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
        if(action.type === actionTypes.info.CHECK_VALIDATION){
          sections.filter(it => it.validation).map(section => validateSectionGroup(section.key, action))
          const { infoRdr } = action.getState()
          const { validations } = infoRdr
          const showSection11 = validations.indexOf(2) !== -1 || validations.indexOf(3) !== -1
          action.asyncDispatch({ type: 'PER_SHOW_SECTION_11', value: showSection11 })
        }
        // SECTION 1
        else if(action.type === actionTypes.info.EDIT_FIELD){
          validate('info', action)
        }
        // SECTION 2
        else if(objectToArray(actionTypes.contacts).indexOf(action.type) !== -1){
          validate('contacts', action)
        }
        // SECTION 3
        else if(objectToArray(actionTypes.partners).indexOf(action.type) !== -1){
          validate('partners', action)
        }
        // SECTION 4
        else if(action.type === descriptionsActionTypes.EDIT_DESCRIPTION){
          const { descsRdr } = action.getState()
          const isCompleted = descsRdr.filter(it => it.required && it.value.length < 5).length === 0
          action.asyncDispatch({ type: 'PER_CHECK_SECTION', key: 'descriptions', value: isCompleted })
        }
        // SECTION 6
        else if(objectToArray(actionTypes['finance/budget-items']).indexOf(action.type) !== -1 || objectToArray(actionTypes['finance/disbursements']).indexOf(action.type) !== -1){
          validateSectionGroup('finance', action)
        }
        // SECTION 7
        else if(objectToArray(actionTypes['locations/location-items']).indexOf(action.type) !== -1 || objectToArray(actionTypes['locations/recipient-countries']).indexOf(action.type) !== -1){
          validateSectionGroup('locations', action)
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
