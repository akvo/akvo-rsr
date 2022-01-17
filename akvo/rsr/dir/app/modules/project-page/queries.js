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
    `/project_update/?project=${projectId}&image_thumb_name=big&limit=9&page=${page}&format=json`,
    (url) => api.get(url).then((res) => res.data)
  )

export const queryResultOverview = (projectId) =>
  useSWR(`/result/?format=json&project=${projectId}`, (url) => api.getV2(url).then((res) => res.data))

export const queryProjectSectors = (projectId) =>
  useSWR(`/sector/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryPartnershipLinks = (projectId) =>
  useSWR(`/partnership_more_link/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryPartnershipFunds = (projectId) =>
  useSWR(`/partnership/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryIndicators = (projectId) =>
  useSWR(`/indicator/?format=json&limit=100&result__project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryBudget = (projectId) =>
  useSWR(`/budget_item/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))
