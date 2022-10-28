import api from '../../utils/api'
import {
  getFlatten,
  getProjectUuids,
  makeATree
} from '../../utils/misc'

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
      successCallback([{ ...data, children: [] }])
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

export const handleOnCreatingHierarchy = (selected, colIndex, item, children = []) => [
  ...(selected[colIndex] ? selected.slice(0, colIndex + 1) : selected),
  {
    ...item,
    fetched: true,
    children
  }
]
  ?.map((s, sx) => {
    if (sx === 0) {
      let _flatten = getFlatten([...s?.children, ...children])
      _flatten = _flatten?.map((f) => ({ ...f, fetched: f?.fetched ? f?.fetched : (f?.id === item?.id) }))
      const aProgram = makeATree([s, ..._flatten])?.pop()
      return aProgram
    }
    return s
  })

export const handleOnCreatingProgram = (data) => {
  const items = data?.map((d) => ({ ...d, fetched: false, children: [] }))
  const programTree = makeATree(items)
  return getFlatten(programTree)?.map((s) => ({ ...s, fetched: (s?.children?.length) }))
}
