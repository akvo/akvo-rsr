import { get } from 'lodash'
import actionTypes from './action-types'
import api from '../../utils/api'
import { getEndpoint, getTransform } from './endpoints'

export const touchSection = sectionIndex => ({ type: actionTypes.TOUCH_SECTION, sectionIndex })
export const checkValidation = (id, checked) => ({ type: actionTypes.CHECK_VALIDATION, id, checked })
export const saveFields = (fields, sectionIndex, preventUpload) => (dispatch, getState) => {
  const { projectId } = getState().editorRdr
  dispatch({ type: actionTypes.SAVE_FIELDS, fields, sectionIndex })
  if (!preventUpload) {
    api.patch(`/project/${projectId}/`, fields, null, null, true)
      .then(() => dispatch({ type: actionTypes.BACKEND_SYNC }))
      .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data, statusCode: error.response.status, sectionIndex: 1 }) })
  } else {
    dispatch({ type: actionTypes.BACKEND_SYNC })
  }
}
export const setStatus = (publishingStatus) => (dispatch, getState) => {
  dispatch({ type: actionTypes.SAVE_FIELDS, fields: { publishingStatus }, sectionIndex: 1 })
  const { publishingStatusId } = getState().editorRdr.section1.fields
  api.patch(`/publishing_status/${publishingStatusId}/`, { status: publishingStatus })
    .then(() => dispatch({ type: actionTypes.BACKEND_SYNC }))
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
}
export const fetchFields = (sectionIndex, fields) => ({ type: actionTypes.FETCH_SECTION, sectionIndex, fields })
export const fetchSetItems = (sectionIndex, setName, items, count) => ({ type: actionTypes.FETCH_SET_ITEMS, sectionIndex, setName, items, count })
export const addSetItem = (sectionIndex, setName, item) => (dispatch, getState) => {
  dispatch({ type: actionTypes.ADD_SET_ITEM, sectionIndex, setName, item })
  const setItems = get(getState().editorRdr[`section${sectionIndex}`].fields, setName)
  const itemIndex = setItems.length - 1
  api.post(getEndpoint(sectionIndex, setName), item, getTransform(sectionIndex, setName, 'request'), null, true)
    .then(({ data: { id, periods } }) => { dispatch({ type: actionTypes.ADDED_SET_ITEM, sectionIndex, setName, id, itemIndex, periods }) })
    .catch((error) => {
      dispatch({ type: actionTypes.BACKEND_ERROR, error, sectionIndex, setName: `${setName}[${setItems.length - 1}]`, response: error.response ? error.response.data : error, statusCode: error.response.status })
      dispatch({ type: actionTypes.REMOVED_SET_ITEM, failedAdd: true, sectionIndex, setName, itemIndex: setItems.length - 1, skipValidation: true })
    })
}
export const editSetItem = (sectionIndex, setName, itemIndex, itemId, fields) => (dispatch) => {
  dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex, setName, itemIndex, fields })
  api.patch(`${getEndpoint(sectionIndex, setName)}${itemId}/`, fields, getTransform(sectionIndex, setName, 'request'), null, true)
    .then(() => { dispatch({ type: actionTypes.BACKEND_SYNC }) })
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, sectionIndex, setName: `${setName}[${itemIndex}]`, response: error.response ? error.response.data : error, statusCode: error.response.status }) })
}
export const removeSetItem = (sectionIndex, setName, itemIndex) => (dispatch, getState) => {
  const item = get(getState().editorRdr[`section${sectionIndex}`].fields, `${setName}[${itemIndex}]`)
  const shouldSync = item && item.id
  if (shouldSync) {
    dispatch({ type: actionTypes.REMOVE_SET_ITEM, sectionIndex, setName, itemIndex, shouldSync })
    api.delete(`${getEndpoint(sectionIndex, setName)}${item.id}`, true)
      .then(() => {
        dispatch({ type: actionTypes.REMOVED_SET_ITEM, sectionIndex, setName, itemIndex, shouldSync })
      })
      .catch((error) => {
        dispatch({ type: actionTypes.REMOVE_SET_ITEM_FAIL, sectionIndex, setName, itemIndex })
        dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data, statusCode: error.response.status })
      })
  } else {
    dispatch({ type: actionTypes.BACKEND_SYNC })
  }
}
export const moveSetItem = (sectionIndex, setName, oldIndex, newIndex) => (dispatch, getState) => {
  dispatch({ type: actionTypes.MOVED_SET_ITEM, sectionIndex, setName, oldIndex, newIndex })
}
export const setProjectId = projectId => ({ type: actionTypes.SET_PROJECT_ID, projectId })
export const setNewProject = projectId => ({ type: actionTypes.SET_NEW_PROJECT, projectId })
export const fetchSectionRoot = sectionIndex => ({ type: actionTypes.FETCH_SECTION_ROOT, sectionIndex })
export const setSectionFetched = sectionIndex => ({ type: actionTypes.SET_SECTION_FETCHED, sectionIndex })
export const resetProject = () => ({ type: actionTypes.RESET_PROJECT })
export const saving = () => ({ type: actionTypes.SAVING })
export const updateLastSaved = () => ({ type: actionTypes.UPDATE_LAST_SAVED })
export const setFieldRequiredError = (sectionIndex, fieldName, hasError) => ({ type: actionTypes.SET_FIELD_REQUIRED_ERROR, sectionIndex, fieldName, hasError })
export const addProgram = (program) => ({ type: 'ADD_PROGRAM', program })
export const setProjectTitle = (title) => (dispatch) => {
  dispatch({ type: actionTypes.SAVE_FIELDS, fields: { title }, sectionIndex: 1, noSync: true })
}
export const setProjectStatus = (publishingStatus, hasHierarchy, needsReportingTimeoutDays, pendingUpdateCount, canEditProject = false) => (dispatch) => {
  dispatch({ type: actionTypes.SAVE_FIELDS, fields: { publishingStatus, hasHierarchy, needsReportingTimeoutDays, pendingUpdateCount, canEditProject }, sectionIndex: 1, noSync: true })
}
export const setUser = (user) => ({ type: 'SET_USER', user })
export const setExternalProjects = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_EXTERNAL_PROJECT, payload })
}
export const addExternalProject = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.ADD_EXTERNAL_PROJECT, payload })
  dispatch({ type: actionTypes.BACKEND_SYNC })
}
export const removeExternalProject = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.REMOVE_EXTERNAL_PROJECT, payload })
  dispatch({ type: actionTypes.BACKEND_SYNC })
}
export const setParentProject = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_PARENT_PROJECT, payload })
}
