import { cloneDeep, set, get } from 'lodash'
import { notification } from 'antd'
import actionTypes from './action-types'
import { validate } from './validation'
import { sectionLength } from './sections'
import fieldSets from './field-sets'
import { RSR as Section4Defs } from './section4/validations'
import { IATI as Section6Defs } from './section6/validations'
import { IATI as Section7Defs} from './section7/validations'
import { IATI as Section8Defs} from './section8/validations'
import { RSR as Section10Defs} from './section10/validations'

const sectionDefs = {
  4: Section4Defs,
  6: Section6Defs,
  7: Section7Defs,
  8: Section8Defs,
  10: Section10Defs
}

export const initialState = {
  saving: false,
  addingItem: false,
  lastSaved: null,
  backendError: null,
  validations: [1],
  showRequired: true,
  projectId: null,
  externalProjects: [],
  parentProject: null
}
for(let i = 0; i < sectionLength; i += 1){
  initialState[`section${i + 1}`] = {
    errors: [true],
    isTouched: false,
    isFetched: false,
    isExplicitlyEnabled: false,
    fields: {},
    pagination: {}
  }
}

Object.keys(fieldSets).forEach((section) => {
  fieldSets[section].forEach((fieldSet) => {
    initialState[section].fields[fieldSet] = []
  })
})

initialState.section1.fields.currency = 'EUR'
initialState.section1.fields.isPublic = true
initialState.section1.fields.descriptionsOrder = ['project_plan_summary', 'goals_overview', 'background', 'current_status', 'target_group', 'project_plan', 'sustainability']
initialState.section10.fields.keywords = []
initialState.section11.fields = {
  crs: [],
  fss: []
}

const camelToKebab = string => string.replace(/[\w]([A-Z])/g, m => `${m[0]}-${m[1]}`).toLowerCase()

const validateSets = (sectionKey, validations, fields) => {
  return fieldSets[sectionKey].map(fieldSet => validate(`${sectionKey}/${camelToKebab(fieldSet)}`, validations, fields[fieldSet])).reduce((acc, value) => [...acc, ...value])
}

const validateSection = (sectionKey, validations, fields) => {
  // validate root fields
  let errors = validate(sectionKey, validations, fields)
  // check fieldSets
  if(fieldSets.hasOwnProperty(sectionKey)){
    errors = [...errors, ...validateSets(sectionKey, validations, fields)]
  }
  return errors
}

export default (state = initialState, action) => {
  const sectionKey = `section${action.sectionIndex}`
  const newState = cloneDeep(state)
  switch(action.type){
    case actionTypes.TOUCH_SECTION:
      if(!newState[sectionKey].isTouched){
        newState[sectionKey].isTouched = true
        newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
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
      if(state.projectId){
        for(let i = 1; i <= sectionLength; i += 1){
            const _sectionKey = `section${i}`
            newState[_sectionKey].errors = validateSection(_sectionKey, validations, newState[_sectionKey].fields)
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
      newState[sectionKey].errors = validate(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.FETCH_SECTION_ROOT:
      // fields are taken from section1 because in the backend they are part of the /project/ (section1) endpoint
      Object.keys(sectionDefs[action.sectionIndex].fields).forEach(field => {
        if(state.section1.fields[field] !== undefined){
          newState[sectionKey].fields[field] = state.section1.fields[field]
        }
      })
      // newState[sectionKey].isValid = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.FETCH_SET_ITEMS:
      newState[sectionKey].fields[action.setName] = action.items
      newState[sectionKey].pagination[action.setName] = action.count
      return newState
    case actionTypes.SAVE_FIELDS:
      newState[sectionKey] = {
        ...newState[sectionKey],
        fields: {...newState[sectionKey].fields, ...action.fields},
      }
      if(!action.noSync){
        newState.saving = true
        newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      }
      return newState
    case actionTypes.ADD_SET_ITEM:
      newState.saving = true
      newState.addingItem = true
      let fields = get(newState[sectionKey].fields, action.setName)
      fields = fields ? [...fields, action.item] : [action.item]
      set(
        newState[sectionKey].fields,
        action.setName,
        fields
      )
      newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.ADDED_SET_ITEM:
      newState.saving = false
      newState.addingItem = false
      newState.lastSaved = new Date()
      newState.backendError = null
      const { setName } = action
      const itemIndex = action?.itemIndex || get(newState[sectionKey]?.fields, `${action.setName}`).length - 1
      const updatedItem = {
        ...get(newState[sectionKey]?.fields, `${setName}[${itemIndex}]`)
      }
      if(action.id){
        updatedItem.id = action.id
        if(action.periods){
          // special case when bulk of periods with newly assigned ids come from the backend
          updatedItem.periods = action.periods
        }
      } else if(action.item) {
        Object.keys(action.item).forEach(prop => { updatedItem[prop] = action.item[prop] })
      }
      set(newState[sectionKey].fields, `${setName}[${itemIndex}]`, updatedItem)
      if(action.validate){
        newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      }
      return {
        ...newState,
        section1: {
          ...newState?.section1,
          fields: {
            ...newState?.section1?.fields
          }
        }
      }
    case actionTypes.EDIT_SET_ITEM:
      newState.saving = true
      set(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`, {
        ...get(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`),
        ...action.fields
      })
      newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.MOVED_SET_ITEM:
      const items = get(newState[sectionKey].fields, action.setName)
      const {oldIndex, newIndex} = action
      const index = Math.min(oldIndex, newIndex)
      const [item, otherItem] = items.slice(index, index + 2)
      set(
        newState[sectionKey].fields,
        action.setName,
        [...items.slice(0, index), otherItem, item, ...items.slice(index + 2)]
      )
      return newState
    case actionTypes.REMOVE_SET_ITEM:
      newState.saving = action.shouldSync
      set(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`, {
        ...get(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`),
        ...{removing: true}
      })
      return newState
    case actionTypes.REMOVE_SET_ITEM_FAIL:
      newState.saving = false
      set(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`, {
        ...get(newState[sectionKey].fields, `${action.setName}[${action.itemIndex}]`),
        ...{ removing: false }
      })
      return newState
    case actionTypes.REMOVED_SET_ITEM:
      newState.saving = false
      if(!action.failedAdd){
        newState.lastSaved = new Date()
        newState.backendError = null
      }
      set(
        newState[sectionKey].fields,
        action.setName,
        get(newState[sectionKey].fields, action.setName).filter((it, idx) => idx !== action.itemIndex)
      )
      if (!action.skipValidation) newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.BACKEND_SYNC:
      return {...state, saving: false, addingItem: false, lastSaved: action?.lastSaved || new Date(), backendError: null}
    case actionTypes.BACKEND_ERROR:
      if(action.statusCode === 405){
        notification.error({ message: action.response, duration: 0 })
      }
      return {...state, saving: false, addingItem: false, backendError: {...action.error, response: action.response, setName: action.setName, sectionIndex: action.sectionIndex} }
    case actionTypes.SET_PROJECT_ID:
      return {
        ...state,
        section4: {
          ...state.section4,
          isFetched: false
        },
        externalProjects: [],
        projectId: action.projectId
      }
    case actionTypes.SET_NEW_PROJECT:
      for(let i = 1; i <= 11; i += 1){
        newState[`section${i}`].isExplicitlyEnabled = true
      }
      newState.projectId = action.projectId
      return newState
    case actionTypes.RESET_PROJECT:
      return initialState
    case actionTypes.SET_SECTION_FETCHED:
      newState[sectionKey].isFetched = true
      newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.SHOW_REQUIRED:
      const showRequired = action.hasOwnProperty('checked') ? action.checked : !state.showRequired
      return {...state, showRequired}
    case actionTypes.SAVING:
      return {...state, saving: true}
    case actionTypes.UPDATE_LAST_SAVED:
      return {...state, lastSaved: new Date(), saving: false }
    case actionTypes.SET_FIELD_REQUIRED_ERROR:
      const {errors} = newState[sectionKey]
      const errorIndex = errors.findIndex(it => it.path === action.fieldName && it.type === 'required')
      if (!action.hasError && errorIndex > -1){
        newState[sectionKey].errors = errors.filter(it => it.path !== action.fieldName)
      }
      if (action.hasError && errorIndex === -1){
        newState[sectionKey].errors = [...errors, { path: action.fieldName, type: 'required'}]
      }
      return newState
    case actionTypes.UPDATE_PAGINATION:
      newState[sectionKey] = {
        ...newState[sectionKey],
        pagination: action.pagination
      }
      return newState
    case actionTypes.VALIDATION_SYNC:
      newState[sectionKey].errors = validateSection(sectionKey, state.validations, newState[sectionKey].fields)
      return newState
    case actionTypes.SET_FIRST_SECTION_ID:
      return {
        ...state,
        section1: {
          ...state.section1,
          fields: {
            ...state.section1.fields,
            id: action.projectId
          }
        },
      }
    case actionTypes.SET_EXTERNAL_PROJECT:
      return { ...state, externalProjects: action.payload }
    case actionTypes.ADD_EXTERNAL_PROJECT:
      return { ...state, saving: true, externalProjects: [...state.externalProjects, action.payload] }
    case actionTypes.REMOVE_EXTERNAL_PROJECT:
      return { ...state, saving: true, externalProjects: state.externalProjects.filter((p) => p?.id !== action?.payload?.id) }
    case actionTypes.SET_PARENT_PROJECT:
      if (action.payload) {
        const hasParent = ((state?.section1?.fields?.uuid) && (action.payload.uuid !== state.section1.fields.uuid))
        const contributesToProject = (!state?.section1?.fields?.contributesToProject && hasParent)
          ? action.payload.id
          : state?.section1?.fields?.contributesToProject
        return {
          ...state,
          section1: {
            ...state?.section1,
            fields: {
              ...state?.section1?.fields,
              contributesToProject
            }
          },
          parentProject: action.payload
        }
      }
      return state
    case actionTypes.ADD_CONTRIB_COUNT:
      const { id: indicatorID, count } = action.payload
      return {
        ...state,
        section5: {
          ...state?.section5,
          fields: {
            ...state?.section5?.fields,
            results: state?.section5?.fields?.results?.map((r) => ({
              ...r,
              indicators: r?.indicators?.map((i) => {
                if (i?.id === indicatorID) {
                  return ({ ...i, contributionCount: count })
                }
                return i
              })
            }))
          }
        }
      }
    default:
      return state
  }
}
