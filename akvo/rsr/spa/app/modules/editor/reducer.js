import {cloneDeep} from 'lodash'
import actionTypes from './action-types'
import { validate } from './validation'
import { fieldSets, sectionLength } from './sections'

export const initialState = {
  saving: false,
  lastSaved: null,
  validations: [1]
}
for(let i = 0; i < sectionLength; i += 1){
  initialState[`section${i + 1}`] = {
    isValid: false,
    isTouched: false,
    fields: {}
  }
}

Object.keys(fieldSets).forEach((section) => {
  fieldSets[section].forEach((set) => {
    initialState[section].fields[set] = []
  })
})

export default (state = initialState, action) => {
  const sectionKey = `section${action.sectionIndex}`
  const section = state[sectionKey]
  const newState = cloneDeep(state)
  switch(action.type){
    case actionTypes.TOUCH_SECTION:
      newState[sectionKey].isTouched = true
      return newState
    case actionTypes.CHECK_VALIDATION:
      const validations = [...state.validations]
      if(action.checked && validations.indexOf(action.id) === -1){
        validations.push(action.id)
      } else if(!action.checked && validations.indexOf(action.id) !== -1){
        validations.splice(validations.indexOf(action.id), 1)
      }
      return {...state, validations}
    case actionTypes.SAVE_FIELDS:
      newState[sectionKey] = {
        ...section,
        fields: {...section.fields, ...action.fields},
      }
      newState.saving = true
      newState.isValid = validate(sectionKey, state.validations, newState[sectionKey])
      return newState
    case actionTypes.ADD_SET_ITEM:
      newState.saving = true
      newState[sectionKey].fields[action.setName] = [...newState[sectionKey].fields[action.setName], action.item]
      newState[sectionKey].isValid = fieldSets[sectionKey].map(fieldSet => validate(`${sectionKey}/${fieldSet}`, state.validations, newState[sectionKey].fields[action.setName])).reduce((acc, value) => value && acc)
      return newState
    case actionTypes.EDIT_SET_ITEM:
      newState.saving = true
      newState[sectionKey].fields[action.setName][action.itemIndex] = {
        ...newState[sectionKey].fields[action.setName][action.itemIndex],
        ...action.fields
      }
      newState[sectionKey].isValid = fieldSets[sectionKey].map(fieldSet => validate(`${sectionKey}/${fieldSet}`, state.validations, newState[sectionKey].fields[action.setName])).reduce((acc, value) => value && acc)
      return newState
    case actionTypes.REMOVE_SET_ITEM:
      newState.saving = true
      newState[sectionKey].fields[action.setName] = newState[sectionKey].fields[action.setName].filter((it, index) => index !== action.itemIndex)
      newState[sectionKey].isValid = fieldSets[sectionKey].map(fieldSet => validate(`${sectionKey}/${fieldSet}`, state.validations, newState[sectionKey].fields[action.setName])).reduce((acc, value) => value && acc)
      return newState
    case actionTypes.BACKEND_SYNC:
      return {...state, saving: false, lastSaved: new Date()}
    default: return state
  }
}
