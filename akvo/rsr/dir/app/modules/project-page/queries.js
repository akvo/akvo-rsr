import useSWR from 'swr'
import humps from 'humps'
import api from '../../utils/api'

export const queryUser = () => useSWR('/me/', (url) => api.get(url).then((res) => res.data))
export const queryProject = (projectId) =>
    useSWR(`/project/${projectId}/?format=json`, (url) =>
        api.get(url).then((res) => humps.camelizeKeys(res.data))
    )
export const queryFramework = (projectId) =>
    useSWR(`/project/${projectId}/results_framework/?format=json`, (url) =>
        api.get(url).then((res) => res.data.results)
    )
export const queryResults = (projectId) =>
    useSWR(`/project/${projectId}/results/?format=json`, (url) =>
        api.get(url).then((res) => res.data.results)
    )
export const queryStories = (projectId, page = 1) =>
    useSWR(
        `/project_update/?project=${projectId}?format=json&image_thumb_name=big&limit=9&page=${page}&format=json`,
        (url) => api.get(url).then((res) => res.data)
    )
