import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import humps from 'humps'
import api from '../../utils/api'
import { getKeyData } from '../../utils/misc'

export const queryUser = () => useSWR(
  '/me/',
  (url) => api.get(url).then((res) => res.data),
  {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return
      // Never retry for a specific key.
      if (key === '/me/') return
      // Only retry up to 10 times.
      if (retryCount >= 10) return
      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  }
)
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
export const queryStories = (projectId, page = 1, limit = 9) =>
  useSWR(
    `/project_update/?project=${projectId}&image_thumb_name=big&limit=${limit}&page=${page}&format=json`,
    (url) => api.get(url).then((res) => res.data),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return
        // Never retry for a specific key.
        if (key === `/project_update/?project=${projectId}&image_thumb_name=big&limit=${limit}&page=${page}&format=json`) return
        // Only retry up to 10 times.
        if (retryCount >= 10) return
        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000)
      }
    }
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

export const queryDimensionNames = (projectId) =>
  useSWR(`/dimension_name/?format=json&limit=100&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryDimensionValues = (projectId) =>
  useSWR(`/dimension_value/?format=json&limit=100&name__project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryDisaggregation = (projectId) =>
  useSWR(`/disaggregation/?format=json&limit=100&update__period__indicator__result__project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryProjectDocuments = (projectId) =>
  useSWR(`/project_document/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryProjectLinks = (projectId) =>
  useSWR(`/link/?format=json&project=${projectId}`, (url) => api.get(url).then((res) => res.data))

export const queryStory = (updateId) => useSWR(
  `/project_update/${updateId}/?format=json&image_thumb_name=big`,
  (url) => api.get(url).then((res) => res.data),
  {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (key === `/project_update/${updateId}/`) return
      if (retryCount >= 10) return
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  }
)

export const queryOtherStories = (projectId, updateId) => useSWR(
  `/project_update/?project=${projectId}&exclude=%7B%27id%27:${updateId}%7D&limit=3&format=json&image_thumb_name=big`,
  (url) => api.get(url).then((res) => res.data),
  {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.status === 404) return
      if (key === `/project_update/?project=${projectId}`) return
      if (retryCount >= 10) return
      setTimeout(() => revalidate({ retryCount }), 5000)
    }
  }
)

export const queryIndicators = (projectId) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator/?format=json&limit=100&result__project=${projectId}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const queryIndicatorPeriod = (projectId) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator_period/?format=json&limit=100&indicator__result__project=${projectId}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const queryIndicatorPeriodData = (projectId) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator_period_data/?format=json&limit=100&period__indicator__result__project=${projectId}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const queryPeriodDataComments = (projectId) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator_period_data_comment/?format=json&limit=100&data__period__indicator__result__project=${projectId}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const queryAllUpdates = (projectId, page = 1, limit = 9) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/project_update/?project=${projectId}&image_thumb_name=big&limit=${limit}&page=${page}&format=json`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const getIndicatorsByID = (resultID) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator/?format=json&limit=100&result=${resultID}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const getPeriodsByID = (indicatorID) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator_period/?format=json&limit=100&indicator=${indicatorID}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const getUpdatesByID = (periodID) =>
  useSWRInfinite(
    (pageIndex, previousPageData) => getKeyData(`/indicator_period_data/?format=json&limit=100&period=${periodID}`, pageIndex, previousPageData),
    (url) => api.get(url).then((res) => res.data)
  )

export const getFullUpdateByID = (updateID) =>
  useSWR(`/indicator_period_data_framework/${updateID}/?format=json`, (url) => api.get(url).then((res) => res.data))
