import {cloneDeep} from 'lodash'
import actionTypes from './action-types'

const sectionLength = 11
export const initialState = {
  saving: false,
  lastSaved: null
}
for(let i = 0; i <= sectionLength; i += 1){
  initialState[`section${i + 1}`] = {
    isValid: false,
    isTouched: false,
    fields: {}
  }
}
const fieldSets = {
  section2: ['contacts'],
  section3: ['partners'],
  section6: ['budgetItems', 'countryBudgetItems', 'transactions', 'plannedDisbursements'],
  section7: ['locationItems', 'recipientCountries', 'recipientRegions'],
  section8: ['sectors', 'policyMarkers', 'humanitarianScopes'],
  section9: ['links', 'docs'],
  section10: ['keywords']
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
    case actionTypes.SAVE_FIELDS:
      newState[sectionKey] = {
        ...section,
        fields: {...section.fields, ...action.fields}
      }
      return newState
    case actionTypes.ADD_SET_ITEM:
      newState[sectionKey].fields[action.setName] = [...newState[sectionKey].fields[action.setName], action.item]
      return newState
    case actionTypes.EDIT_SET_ITEM:
      newState[sectionKey].fields[action.setName][action.itemIndex] = {
        ...newState[sectionKey].fields[action.setName][action.itemIndex],
        ...action.fields
      }
      return newState
    case actionTypes.REMOVE_SET_ITEM:
      newState[sectionKey].fields[action.setName] = newState[sectionKey].fields[action.setName].filter((it, index) => index !== action.itemIndex)
      return newState
    default: return state
  }
}
