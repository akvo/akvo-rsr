import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import humps from 'humps'
import api from '../../utils/api'

const getKeyData = (url, pageIndex, previousPageData) => {
  // reached the end
  if (previousPageData && !previousPageData.data) return null
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return url
  // add the cursor to the API endpoint
  return `${url}&page=${pageIndex + 1}`
}

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

export const queryBudget = (projectId) =>
  useSWR(`/budget_item/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryIndicators = (projectId) =>
  useSWR(`/indicator/?format=json&limit=100&result__project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryIndicatorPeriod = (projectId) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.next) {
        return null
      }
      return `/indicator_period/?format=json&limit=10&indicator__result__project=${projectId}&page=${pageIndex + 1}`
    },
    (url) => api.get(url).then((res) => res.data)
  )

export const queryIndicatorPeriodData = (projectId) =>
  useSWRInfinite(
    (index) => `/indicator_period_data/?format=json&limit=100&period__indicator__result__project=${projectId}&page=${index + 1}`,
    (url) => api.get(url).then((res) => res.data)
  )

export const queryPeriodDataComments = (projectId) =>
  useSWRInfinite(
    (index) => `/indicator_period_data_comment/?format=json&limit=100&data__period__indicator__result__project=${projectId}&page=${index + 1}`,
    (url) => api.get(url).then((res) => res.data)
  )

export const queryDimensionNames = (projectId) =>
  useSWR(`/dimension_name/?format=json&limit=100&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryDimensionValues = (projectId) =>
  useSWR(`/dimension_value/?format=json&limit=100&name__project=${projectId}`, (url) => api.get(url).then((res) => res.data))
