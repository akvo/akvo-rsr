import actionTypes from './action-types'
import api from '../../utils/api'


const getEndpoint = (sectionIndex, setName) => {
  const endpoints = {
    section1: {
      root: '/project/',
      relatedProjects: '/related_project/'
    }
  }
  return endpoints[`section${sectionIndex}`][setName ? setName : 'root']
}

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
  api.post(getEndpoint(1, setName), item)
    .then(() => { dispatch({ type: actionTypes.BACKEND_SYNC }) })
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
}
export const editSetItem = (sectionIndex, setName, itemIndex, itemId, fields) => (dispatch) => {
  dispatch({ type: actionTypes.EDIT_SET_ITEM, sectionIndex, setName, itemIndex, fields })
  api.patch(`${getEndpoint(1, setName)}${itemId}/`, fields)
    .then(() => { dispatch({ type: actionTypes.BACKEND_SYNC }) })
    .catch((error) => { dispatch({ type: actionTypes.BACKEND_ERROR, error, response: error.response.data }) })
}
export const removeSetItem = (sectionIndex, setName, itemIndex) => (dispatch) => {
  dispatch({ type: actionTypes.REMOVE_SET_ITEM, sectionIndex, setName, itemIndex})
  // TODO: api.delete()
  setTimeout(() => dispatch({ type: actionTypes.BACKEND_SYNC }), 1000)
}
export const setProjectId = projectId => ({ type: actionTypes.SET_PROJECT_ID, projectId })
