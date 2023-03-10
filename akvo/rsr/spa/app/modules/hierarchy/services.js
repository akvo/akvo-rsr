import api from '../../utils/api'
import { getProjectUuids } from '../../utils/misc'

export const getChildrenApi = async (id, page = 1) => {
  const response = await api.get(`/project/${id}/children/?format=json&page=${page}`)
  const { results, next } = response.data
  if (next) {
    return results?.concat(await getChildrenApi(id, page + 1))
  }
  return results
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
      if (_uuid?.length) {
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
      } else {
        successCallback([data])
      }
    })
    .catch((err) => {
      errorCallback(err)
    })
}
