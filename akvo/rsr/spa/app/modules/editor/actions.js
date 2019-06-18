import { get } from 'lodash'
import actionTypes from './action-types'
import api from '../../utils/api'
import { getEndpoint } from './endpoints'

export const togglePrivacy = checked => ({ type: actionTypes.TOGGLE_PRIVACY, checked })
export const touchSection = sectionIndex => ({ type: actionTypes.TOUCH_SECTION, sectionIndex })
export const checkValidation = (id, checked) => ({ type: actionTypes.CHECK_VALIDATION, id, checked })
export const saveFields = (fields, sectionIndex) => (dispatch, getState) => {
  dispatch({ type: actionTypes.SAVE_FIELDS, fields, sectionIndex })
  const {projectId} = getState().editorRdr
  api.patch(`/project/${projectId}/`, fields)
    .then(() => dispatch({ type: actionTypes.BACKEND_SYNC }))
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
}
export const fetchFields = (sectionIndex, fields) => ({ type: actionTypes.FETCH_SECTION, sectionIndex, fields })
export const fetchSetItems = (sectionIndex, setName, items) => ({ type: actionTypes.FETCH_SET_ITEMS, sectionIndex, setName, items})
export const addSetItem = (sectionIndex, setName, item) => (dispatch) => {
  dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex, setName, item})
  api.post(getEndpoint(sectionIndex, setName), item)
    .then(({ data: {id}}) => { dispatch({ type: actionTypes.ADDED_SET_ITEM, sectionIndex, setName, id }) })
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
}
export const editSetItem = (sectionIndex, setName, itemIndex, itemId, fields) => (dispatch) => {
  dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex, setName, itemIndex, fields })
  api.patch(`${getEndpoint(sectionIndex, setName)}${itemId}/`, fields)
    .then(() => { dispatch({ type: actionTypes.BACKEND_SYNC }) })
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
}
export const removeSetItem = (sectionIndex, setName, itemIndex) => (dispatch, getState) => {
  const item = get(getState().editorRdr[`section${sectionIndex}`].fields, `${setName}[${itemIndex}]`)
  const shouldSync = item && item.id
  dispatch({ type: actionTypes.REMOVE_SET_ITEM, sectionIndex, setName, itemIndex, shouldSync})
  if(shouldSync){
    api.delete(`${getEndpoint(sectionIndex, setName)}${item.id}`)
    .then(() => dispatch({ type: actionTypes.BACKEND_SYNC }))
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
  }
}
export const setProjectId = projectId => ({ type: actionTypes.SET_PROJECT_ID, projectId })
export const setNewProject = projectId => ({ type: actionTypes.SET_NEW_PROJECT, projectId })
export const fetchSection4 = () => ({ type: actionTypes.FETCH_SECTION_4, sectionIndex: 4 })
export const setSectionFetched = sectionIndex => ({ type: actionTypes.SET_SECTION_FETCHED, sectionIndex })
export const resetProject = () => ({ type: actionTypes.RESET_PROJECT })
