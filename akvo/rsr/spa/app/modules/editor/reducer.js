import {cloneDeep, set, get} from 'lodash'
import actionTypes from './action-types'
import { validate } from './validation'
import { sectionLength } from './sections'
import fieldSets from './field-sets'

export const initialState = {
  saving: false,
  lastSaved: null,
  validations: [1],
  isPublic: true
}
for(let i = 0; i < sectionLength; i += 1){
  initialState[`section${i + 1}`] = {
    isValid: false,
    isTouched: false,
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

const isValid = (sectionKey, validations, newState) => {
  return fieldSets[sectionKey].map(fieldSet => validate(`${sectionKey}/${camelToKebab(fieldSet)}`, validations, newState[sectionKey].fields[fieldSet])).reduce((acc, value) => value && acc)
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
        // validate root fields
        let _isValid = validate(sectionKey, state.validations, newState[sectionKey].fields)
        // check fieldSets
        if(_isValid && fieldSets.hasOwnProperty(sectionKey)){
          newState[sectionKey].isValid = isValid(sectionKey, state.validations, newState, action.setName)
          _isValid = fieldSets[sectionKey].map(fieldSetName => isValid(sectionKey, state.validations, newState, fieldSetName)).reduce((acc, value) => value && acc)
        }
        newState[sectionKey].isValid = _isValid
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
          if(Object.keys(fieldSets).indexOf(_sectionKey) !== -1){
            newState[_sectionKey].isValid = isValid(_sectionKey, validations, newState, action.setName)
          } else {
            newState[_sectionKey].isValid = validate(_sectionKey, validations, newState[_sectionKey].fields)
          }
        }
      }
      return newState
    case actionTypes.SAVE_FIELDS:
      newState[sectionKey] = {
        ...newState[sectionKey],
        fields: {...newState[sectionKey].fields, ...action.fields},
      }
      newState.saving = true
      newState[sectionKey].isValid = validate(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.ADD_SET_ITEM:
      newState.saving = true
      set(
        newState[sectionKey].fields,
        action.setName,
        [...get(newState[sectionKey].fields, action.setName), action.item]
      )
      newState[sectionKey].isValid = isValid(sectionKey, state.validations, newState, action.setName)
      return newState
    case actionTypes.EDIT_SET_ITEM:
      newState.saving = true
      set(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`, {
        ...get(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`),
        ...action.fields
      })
      newState[sectionKey].isValid = isValid(sectionKey, state.validations, newState, action.setName)
      return newState
    case actionTypes.REMOVE_SET_ITEM:
      newState.saving = true
      set(
        newState[sectionKey].fields,
        action.setName,
        get(newState[sectionKey].fields, action.setName).filter((it, index) => index !== action.itemIndex)
      )
      newState[sectionKey].isValid = isValid(sectionKey, state.validations, newState, action.setName)
      return newState
    case actionTypes.BACKEND_SYNC:
      return {...state, saving: false, lastSaved: new Date()}
    default: return state
  }
}
