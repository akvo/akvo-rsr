import types from './action-types'

const initialState = {
  isPublic: true,
  publishingStatus: 'unpublished',
  validations: [1],
  title: '',
  subtitle: '',
  parent: null, // missing in API
  iatiStatus: '',
  iatiActivityId: '',
  parentId: '',
  isParentExternal: false,
  plannedStartDate: '',
  plannedEndDate: '',
  actualStartDate: '',
  actualEndDate: '',
  currency: 'EUR',
  language: 'en',
  currentImage: '',
  currentImageCaption: '',
  currentImageCredit: '',
  defaultAidTypeVocabulary: '',
  defaultAidType: '',
  defaultFlowType: '',
  defaultTiedStatus: '',
  collaborationType: '',
  defaultFinanceType: '',
}

export default (state = initialState, action) => {
  switch(action.type){
    case types.CHECK_VALIDATION:
      const validations = [...state.validations]
      if(action.checked && validations.indexOf(action.id) === -1){
        validations.push(action.id)
      } else if(!action.checked && validations.indexOf(action.id) !== -1){
        validations.splice(validations.indexOf(action.id))
      }
      return {...state, validations}
    case types.EDIT_FIELD:
      const field = {}
      field[action.key] = action.value
      return {...state, ...field}
    default: return state
  }
}
