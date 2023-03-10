import api from '../../utils/api'
import { getProjectUuids } from '../../utils/misc'

export const getChildrenApi = async (id) => {
  const response = await api.get(`/project/${id}/children/?format=json`)
  return response.data
}

export const getProgramApi = (id, successCallback, errorCallback) => {
  api.get(`/program/${id}?format=json`)
    .then(({ data }) => {
      successCallback([{ ...data, children: [], parent: null }])
    })
    .catch((err) => {
      errorCallback(err)
    })
}

export const getProjectsApi = (id, successCallback, errorCallback) => {
  api
    .get(`/project/${id}?format=json`)
    .then(({ data }) => {
      let _uuid = getProjectUuids(data?.path)
      _uuid = _uuid.slice(0, _uuid.length - 1)
      const endpoints = _uuid?.map((uuid) => api.get(`/project/?uuid=${uuid}&format=json`))
      Promise
        .all(endpoints)
        .then((res) => {
          const _projects = res?.flatMap(({ data: { results } }) => results || [])
          successCallback(_projects)
        })
        .catch((err) => {
          errorCallback(err)
        })
    })
    .catch((err) => {
      errorCallback(err)
    })
}
