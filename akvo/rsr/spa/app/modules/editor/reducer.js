import {cloneDeep, set, get} from 'lodash'
import actionTypes from './action-types'
import { validate } from './validation'
import { sectionLength } from './sections'
import fieldSets from './field-sets'
import { RSR as Section4Defs } from './section4/validations'
import { IATI as Section6Defs } from './section6/validations'

const sectionDefs = {
  4: Section4Defs,
  6: Section6Defs
}

export const initialState = {
  saving: false,
  addingItem: false,
  lastSaved: null,
  backendError: null,
  validations: [1],
  isPublic: true,
  projectId: null
}
for(let i = 0; i < sectionLength; i += 1){
  initialState[`section${i + 1}`] = {
    isValid: false,
    isTouched: false,
    isFetched: false,
    fields: {}
  }
}

Object.keys(fieldSets).forEach((section) => {
  fieldSets[section].forEach((fieldSet) => {
    initialState[section].fields[fieldSet] = []
  })
})

initialState.section1.fields.currency = 'EUR'
initialState.section10.fields.keywords = []

const camelToKebab = string => string.replace(/[\w]([A-Z])/g, m => `${m[0]}-${m[1]}`).toLowerCase()

const validateSets = (sectionKey, validations, fields) => {
  return fieldSets[sectionKey].map(fieldSet => validate(`${sectionKey}/${camelToKebab(fieldSet)}`, validations, fields[fieldSet])).reduce((acc, value) => value && acc)
}

const validateSection = (sectionKey, validations, fields) => {
  // validate root fields
  let isValid = validate(sectionKey, validations, fields)
  // check fieldSets
  if(isValid && fieldSets.hasOwnProperty(sectionKey)){
    isValid = validateSets(sectionKey, validations, fields)
  }
  return isValid
}

export default (state = initialState, action) => {
  const sectionKey = `section${action.sectionIndex}`
  const newState = cloneDeep(state)
  switch(action.type){
    case actionTypes.TOGGLE_PRIVACY:
      return {...state, isPublic: action.checked}
    case actionTypes.TOUCH_SECTION:
      if(!newState[sectionKey].isTouched){
        newState[sectionKey].isTouched = true
        newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      }
      return newState
    case actionTypes.CHECK_VALIDATION:
      const validations = [...state.validations]
      if(action.checked && validations.indexOf(action.id) === -1){
        validations.push(action.id)
      } else if(!action.checked && validations.indexOf(action.id) !== -1){
        validations.splice(validations.indexOf(action.id), 1)
      }
      newState.validations = validations
      // validate all sections
      for(let i = 1; i <= sectionLength; i += 1){
        if(i !== 5){
          const _sectionKey = `section${i}`
          newState[_sectionKey].isValid = validateSection(_sectionKey, validations, newState[_sectionKey].fields)
        }
      }
      return newState
    case actionTypes.FETCH_SECTION:
      newState[sectionKey] = {
        ...newState[sectionKey],
        fields: {...newState[sectionKey].fields, ...action.fields}
      }
      if(action.fields.hasOwnProperty('validations')){
        newState.validations = action.fields.validations
      }
      newState[sectionKey].isValid = validate(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.FETCH_SECTION_ROOT:
      Object.keys(sectionDefs[action.sectionIndex].fields).forEach(field => {
        if(state.section1.fields[field] !== undefined){
          newState[sectionKey].fields[field] = state.section1.fields[field]
        }
      })
      newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.FETCH_SET_ITEMS:
      if(action.sectionIndex === 6 && action.setName === 'transactions'){
        action.items = action.items.map(item => ({...item, sectors: []}))
      }
      newState[sectionKey].fields[action.setName] = action.items
      return newState
    case actionTypes.SAVE_FIELDS:
      newState[sectionKey] = {
        ...newState[sectionKey],
        fields: {...newState[sectionKey].fields, ...action.fields},
      }
      newState.saving = true
      newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.ADD_SET_ITEM:
      newState.saving = true
      newState.addingItem = true
      set(
        newState[sectionKey].fields,
        action.setName,
        [...get(newState[sectionKey].fields, action.setName), action.item]
      )
      newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.ADDED_SET_ITEM:
      newState.saving = false
      newState.addingItem = false
      newState.lastSaved = new Date()
      newState.backendError = null
      const itemIndex = get(newState[sectionKey].fields, `${action.setName}`).length - 1
      set(newState[sectionKey].fields, `${action.setName}[${itemIndex}]`, {
        ...get(newState[sectionKey].fields, `${action.setName}[${itemIndex}]`),
        id: action.id
      })
      return newState
    case actionTypes.EDIT_SET_ITEM:
      newState.saving = true
      set(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`, {
        ...get(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`),
        ...action.fields
      })
      newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.REMOVE_SET_ITEM:
      newState.saving = action.shouldSync !== undefined
      set(
        newState[sectionKey].fields,
        action.setName,
        get(newState[sectionKey].fields, action.setName).filter((it, index) => index !== action.itemIndex)
      )
      newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.BACKEND_SYNC:
      return {...state, saving: false, lastSaved: new Date(), backendError: null}
    case actionTypes.BACKEND_ERROR:
      return {...state, saving: false, addingItem: false, backendError: {...action.error, response: action.response} }
    case actionTypes.SET_PROJECT_ID:
      return {...initialState, projectId: action.projectId}
    case actionTypes.SET_NEW_PROJECT:
      for(let i = 1; i <= 11; i += 1){
        newState[`section${i}`].isFetched = true
      }
      newState.projectId = action.projectId
      return newState
    case actionTypes.RESET_PROJECT:
      return initialState
    case actionTypes.SET_SECTION_FETCHED:
      newState[sectionKey].isFetched = true
      return newState
    default: return state
  }
}
